// services/receiptParserService.ts
import { functions } from "@/config/firebase";
import { httpsCallable } from "firebase/functions";
import * as ImageManipulator from "expo-image-manipulator";

export interface ParsedReceiptData {
  sellerName?: string;
  sellerOrgNumber?: string;
  sellerAddress?: string;
  totalAmount?: number;
  subtotal?: number;
  vatAmount?: number;
  currency?: string;
  receiptDate?: string;
  receiptNumber?: string;
  items: Array<{
    name: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
  }>;
  paymentMethod?: string;
  rawText: string;
  confidence: number;
}

export const parseReceiptImage = async (
  imageUri: string
): Promise<ParsedReceiptData> => {
  try {
    console.log("📸 Converting image to base64...");
    const base64 = await convertImageToBase64(imageUri);

    console.log("🚀 Calling GPT-4 Vision API...");

    const parseReceipt = httpsCallable<{ imageBase64: string }>(
      functions,
      "parseReceipt"
    );

    const result = await parseReceipt({ imageBase64: base64 });

    console.log("✅ Receipt parsed successfully!");

    const data = result.data as ParsedReceiptData;

    console.log("Seller:", data.sellerName);
    console.log("Total:", data.totalAmount, data.currency);
    console.log("Items:", data.items.length);

    return data;
  } catch (error: any) {
    console.error("❌ Error parsing receipt:", error);

    if (error.code === "unauthenticated") {
      throw new Error("You must be logged in to parse receipts");
    }

    if (error.code === "resource-exhausted") {
      throw new Error("OpenAI API quota exceeded. Please contact support.");
    }

    if (error.message?.includes("network")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error("Failed to parse receipt. Please try again.");
  }
};

/**
 * Convert image URI to base64 string
 * Works with both local URIs and remote URLs
 * Automatically converts HEIC to JPEG for API compatibility
 */
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    console.log("🔄 Converting image format to JPEG...");

    // @ts-ignore - Using deprecated API until expo-image-manipulator is updated
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 2000 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    console.log("✅ Image converted to JPEG");

    // Fetch the converted image
    const response = await fetch(manipResult.uri);

    if (!response.ok) {
      throw new Error("Failed to fetch converted image");
    }

    // Convert to blob
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];

        if (!base64Data) {
          reject(new Error("Failed to convert image to base64"));
          return;
        }

        resolve(base64Data);
      };

      reader.onerror = () => {
        reject(new Error("FileReader error"));
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Failed to process image. Please try again.");
  }
};

/**
 * Validate parsed receipt data
 */
export const validateParsedReceipt = (
  data: ParsedReceiptData
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.sellerName) {
    errors.push("Seller name is missing");
  }

  if (!data.totalAmount || data.totalAmount <= 0) {
    errors.push("Total amount is missing or invalid");
  }

  if (!data.receiptDate) {
    errors.push("Receipt date is missing");
  }

  if (!data.items || data.items.length === 0) {
    errors.push("No line items found");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format parsed data for display
 */
export const formatParsedReceipt = (data: ParsedReceiptData) => {
  return {
    ...data,
    totalFormatted: data.totalAmount
      ? `${data.totalAmount.toFixed(2)} ${data.currency || "NOK"}`
      : "N/A",
    dateFormatted: data.receiptDate
      ? new Date(data.receiptDate).toLocaleDateString("nb-NO")
      : "N/A",
    subtotal:
      data.subtotal ||
      (data.totalAmount && data.vatAmount
        ? data.totalAmount - data.vatAmount
        : null),
  };
};
