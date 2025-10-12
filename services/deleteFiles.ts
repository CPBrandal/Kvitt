import { Directory, Paths } from "expo-file-system";

export async function deleteLocalFiles() {
  try {
    console.log("Deleting local receipt files...");

    const receiptsDir = new Directory(Paths.document, "receipts");

    if (await receiptsDir.exists) {
      await receiptsDir.delete();
      console.log("Receipts folder deleted");
    } else {
      console.log("Receipts folder doesn't exist");
    }

    const cacheDir = new Directory(Paths.cache);
    const cacheFiles = await cacheDir.list();

    for (const file of cacheFiles) {
      if (file.name.includes("receipt_temp")) {
        await file.delete();
        console.log(`Deleted temp file: ${file.name}`);
      }
    }

    console.log("Local files cleanup complete");
    return true;
  } catch (error) {
    console.error("Error deleting local files:", error);
    return false;
  }
}
