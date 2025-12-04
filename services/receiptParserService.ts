// services/receiptParserService.ts
import { functions } from "@/config/firebase";
import * as ImageManipulator from "expo-image-manipulator";
import { httpsCallable } from "firebase/functions";

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

const parseReceipt = httpsCallable<{ imageBase64: string }, ParsedReceiptData>(
  functions,
  "parseReceipt"
);

/**
 * Parse receipt image and return optimized JPEG URI for reuse
 * Returns both parsed data and the optimized image URI
 */
export const parseReceiptImage = async (
  imageUri: string,
  preOptimizedUri?: string
): Promise<ParsedReceiptData> => {
  try {
    console.log("--- Converting image to base64...");
    const base64 = await convertImageToBase64(imageUri, preOptimizedUri);

    console.log("--- Calling GPT-4 Vision API...");
    const result = await parseReceipt({ imageBase64: base64 });
    return result.data;
  } catch (error: any) {
    console.error("--- Error parsing receipt:", error);

    if (error.code === "unauthenticated")
      throw new Error("You must be logged in to parse receipts");

    if (error.code === "resource-exhausted")
      throw new Error("OpenAI API quota exceeded. Please contact support.");

    if (error.message?.includes("network"))
      throw new Error("Network error. Please check your internet connection.");

    throw new Error("Failed to parse receipt. Please try again.");
  }
};

/**
 * Convert image to optimized JPEG and return URI
 * This can be reused for both parsing and upload
 */
export const optimizeImageForUpload = async (
  imageUri: string
): Promise<string> => {
  return convertImageToJPEG(imageUri);
};

/**
 * Convert image to JPEG format if needed (handles HEIC/HEIF from iPhone)
 * Also resizes and compresses for faster processing
 * Returns the URI of the converted image
 */
const convertImageToJPEG = async (imageUri: string): Promise<string> => {
  try {
    // First, get image info to check dimensions
    const imageInfo = await ImageManipulator.manipulateAsync(imageUri, [], {
      format: ImageManipulator.SaveFormat.JPEG,
    });

    // Resize if image is too large (max 2048px on longest side for faster processing)
    // This significantly reduces processing time and file size
    let resizeAction: ImageManipulator.Action[] = [];
    if (imageInfo.width > 2048 || imageInfo.height > 2048) {
      if (imageInfo.width > imageInfo.height) {
        resizeAction = [{ resize: { width: 2048 } }];
      } else {
        resizeAction = [{ resize: { height: 2048 } }];
      }
    }

    // Convert image to JPEG format with compression and optional resize
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      resizeAction,
      {
        compress: 0.7, // Increased compression for faster upload/processing
        format: ImageManipulator.SaveFormat.JPEG, // Force JPEG format
      }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error("Error converting image to JPEG:", error);
    // If conversion fails, return original URI as fallback
    return imageUri;
  }
};

/**
 * Convert image URI to base64 string
 * Works with both local URIs and remote URLs
 * Automatically converts HEIC/HEIF to JPEG before conversion
 * Accepts optional pre-converted JPEG URI to avoid double conversion
 */
const convertImageToBase64 = async (
  imageUri: string,
  preConvertedUri?: string
): Promise<string> => {
  try {
    // Use pre-converted URI if available, otherwise convert now
    const jpegUri = preConvertedUri || (await convertImageToJPEG(imageUri));

    // Fetch the converted image
    const response = await fetch(jpegUri);

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    // Convert to blob
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
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
 * Use this to check if the parsing was successful
 */
export const validateParsedReceipt = (
  data: ParsedReceiptData
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.sellerName) errors.push("Seller name is missing");

  if (!data.totalAmount || data.totalAmount <= 0)
    errors.push("Total amount is missing or invalid");

  if (!data.receiptDate) errors.push("Receipt date is missing");

  if (!data.items || data.items.length === 0)
    errors.push("No line items found");

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
