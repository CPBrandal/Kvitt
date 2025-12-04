// services/receiptService.ts
import { db, storage } from "@/config/firebase";
import { Receipt } from "@/types/receipts";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const RECEIPTS_COLLECTION = "receipts";

/**
 * Create a new receipt
 * Accepts optional optimizedImageUri to avoid re-processing the image
 */
export const createReceipt = async (
  userId: string,
  userEmail: string,
  receiptData: Partial<Receipt>,
  imageUri: string,
  optimizedImageUri?: string
): Promise<string> => {
  try {
    // Upload image to Firebase Storage (use optimized image if available)
    const { imageUrl, imagePath } = await uploadReceiptImage(
      userId,
      imageUri,
      optimizedImageUri
    );

    // Create receipt document
    const receiptRef = await addDoc(collection(db, RECEIPTS_COLLECTION), {
      userId,
      userEmail,
      ...receiptData,
      imageUrl,
      imagePath,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "pending",
      isVerified: false,
    });

    return receiptRef.id;
  } catch (error) {
    console.error("Error creating receipt:", error);
    throw error;
  }
};

/**
 * Upload receipt image to Firebase Storage
 * Accepts optional optimizedImageUri to avoid re-processing
 */
const uploadReceiptImage = async (
  userId: string,
  imageUri: string,
  optimizedImageUri?: string
): Promise<{ imageUrl: string; imagePath: string }> => {
  try {
    // Use optimized image if provided, otherwise use original
    const imageToUpload = optimizedImageUri || imageUri;

    // Convert image URI to blob
    const response = await fetch(imageToUpload);
    const blob = await response.blob();

    // Create unique filename
    const timestamp = Date.now();
    const filename = `receipt_${timestamp}.jpg`;
    const imagePath = `receipts/${userId}/${filename}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, blob);

    // Get download URL
    const imageUrl = await getDownloadURL(storageRef);

    return { imageUrl, imagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Get all receipts for a user
 */
export const getUserReceipts = async (userId: string): Promise<Receipt[]> => {
  try {
    const q = query(
      collection(db, RECEIPTS_COLLECTION),
      where("userId", "==", userId)
      //orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const receipts: Receipt[] = [];

    querySnapshot.forEach((doc) => {
      receipts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        receiptDate: doc.data().receiptDate?.toDate(),
      } as Receipt);
    });

    return receipts;
  } catch (error) {
    console.error("Error getting receipts:", error);
    throw error;
  }
};

/**
 * Get a single receipt by ID
 */
export const getReceiptById = async (
  receiptId: string
): Promise<Receipt | null> => {
  try {
    const receiptDoc = await getDoc(doc(db, RECEIPTS_COLLECTION, receiptId));

    if (!receiptDoc.exists()) {
      return null;
    }

    return {
      id: receiptDoc.id,
      ...receiptDoc.data(),
      createdAt: receiptDoc.data().createdAt?.toDate(),
      updatedAt: receiptDoc.data().updatedAt?.toDate(),
      receiptDate: receiptDoc.data().receiptDate?.toDate(),
    } as Receipt;
  } catch (error) {
    console.error("Error getting receipt:", error);
    throw error;
  }
};

/**
 * Update receipt data
 */
export const updateReceipt = async (
  receiptId: string,
  updates: Partial<Receipt>
): Promise<void> => {
  try {
    const receiptRef = doc(db, RECEIPTS_COLLECTION, receiptId);
    await updateDoc(receiptRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating receipt:", error);
    throw error;
  }
};

/**
 * Delete receipt and associated image
 */
export const deleteReceipt = async (receiptId: string): Promise<void> => {
  try {
    // Get receipt data first to get image path
    const receipt = await getReceiptById(receiptId);

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Delete image from storage
    if (receipt.imagePath) {
      const imageRef = ref(storage, receipt.imagePath);
      await deleteObject(imageRef);
    }

    // Delete receipt document
    await deleteDoc(doc(db, RECEIPTS_COLLECTION, receiptId));
  } catch (error) {
    console.error("Error deleting receipt:", error);
    throw error;
  }
};

/**
 * Search receipts by seller name
 */
export const searchReceiptsBySeller = async (
  userId: string,
  sellerName: string
): Promise<Receipt[]> => {
  try {
    const q = query(
      collection(db, RECEIPTS_COLLECTION),
      where("userId", "==", userId),
      where("sellerName", ">=", sellerName),
      where("sellerName", "<=", sellerName + "\uf8ff")
      //orderBy("sellerName"),
      //orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const receipts: Receipt[] = [];

    querySnapshot.forEach((doc) => {
      receipts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        receiptDate: doc.data().receiptDate?.toDate(),
      } as Receipt);
    });

    return receipts;
  } catch (error) {
    console.error("Error searching receipts:", error);
    throw error;
  }
};

/**
 * Get receipts by category
 */
export const getReceiptsByCategory = async (
  userId: string,
  category: string
): Promise<Receipt[]> => {
  try {
    const q = query(
      collection(db, RECEIPTS_COLLECTION),
      where("userId", "==", userId),
      where("category", "==", category)
      //orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const receipts: Receipt[] = [];

    querySnapshot.forEach((doc) => {
      receipts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        receiptDate: doc.data().receiptDate?.toDate(),
      } as Receipt);
    });

    return receipts;
  } catch (error) {
    console.error("Error getting receipts by category:", error);
    throw error;
  }
};

/**
 * Get receipt statistics for a user
 */
export const getReceiptStats = async (userId: string) => {
  try {
    const receipts = await getUserReceipts(userId);

    const totalAmount = receipts.reduce(
      (sum, r) => sum + (r.totalAmount || 0),
      0
    );
    const totalVAT = receipts.reduce((sum, r) => sum + (r.vatAmount || 0), 0);
    const receiptCount = receipts.length;

    // Group by category
    const byCategory: { [key: string]: number } = {};
    receipts.forEach((r) => {
      if (r.category) {
        byCategory[r.category] = (byCategory[r.category] || 0) + r.totalAmount;
      }
    });

    return {
      totalAmount,
      totalVAT,
      receiptCount,
      byCategory,
    };
  } catch (error) {
    console.error("Error getting receipt stats:", error);
    throw error;
  }
};
