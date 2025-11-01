// functions/src/index.ts
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import OpenAI from "openai";
import { ParsedReceiptData } from "../../services/receiptParserService";

// Define the secret
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Global function settings
setGlobalOptions({ region: "europe-west3", maxInstances: 10 });

export const parseReceipt = onCall(
  {
    timeoutSeconds: 60,
    memory: "256MiB",
    secrets: [openaiApiKey],
  },
  async (request) => {
    const openai = new OpenAI({
      apiKey: openaiApiKey.value(),
    });

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated to parse receipts."
      );
    }

    const { imageBase64 } = request.data;

    if (!imageBase64) {
      throw new HttpsError(
        "invalid-argument",
        "Missing imageBase64 parameter."
      );
    }

    try {
      logger.log(`Parsing receipt for user: ${request.auth.uid}`);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at parsing Norwegian receipts. Extract structured data from receipt images.

Return ONLY valid JSON with NO markdown formatting, NO code blocks, NO explanations - just pure JSON:
{
  "sellerName": "string or null",
  "sellerOrgNumber": "string or null",
  "sellerAddress": "string or null",
  "totalAmount": number or null,
  "subtotal": number or null,
  "vatAmount": number or null,
  "currency": "string",
  "receiptDate": "YYYY-MM-DD or null",
  "receiptNumber": "string or null",
  "items": [
    {
      "name": "string",
      "quantity": number or null,
      "unitPrice": number or null,
      "totalPrice": number or null
    }
  ],
  "paymentMethod": "string or null"
}

Important:
- Extract ALL line items
- MVA = VAT/moms
- Org numbers are 9 digits
- Currency is usually NOK
- Return valid JSON only`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Parse this Norwegian receipt and extract all information into structured JSON format.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;

      if (!content) {
        throw new Error("No response content from GPT-4");
      }

      let jsonContent = content.trim();
      if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
      }

      try {
        const parsed = JSON.parse(jsonContent) as ParsedReceiptData;
        const result: ParsedReceiptData = {
          ...parsed,
          rawText: content,
          confidence: 0.9,
        };

        logger.log("Successfully parsed receipt:", result);
        return result;
      } catch (_parseError) {
        logger.error("Failed to parse JSON from GPT response:", jsonContent);
        throw new HttpsError(
          "internal",
          "Received invalid JSON format from GPT."
        );
      }
    } catch (error: any) {
      logger.error("Error parsing receipt:", error);

      if (error.message?.includes("API key")) {
        throw new HttpsError(
          "failed-precondition",
          "OpenAI API key not configured."
        );
      }

      if (error.message?.includes("quota")) {
        throw new HttpsError(
          "resource-exhausted",
          "OpenAI API quota exceeded."
        );
      }

      throw new HttpsError(
        "internal",
        `Failed to parse receipt: ${error.message}`
      );
    }
  }
);
