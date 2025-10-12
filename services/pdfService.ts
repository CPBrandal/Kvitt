import { Receipt } from "@/types/receipts";
import { Directory, File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const generateReceiptPDF = async (receipt: Receipt): Promise<string> => {
  try {
    // --- Format date and time ---
    const receiptDate = receipt.receiptDate
      ? new Date(receipt.receiptDate)
      : new Date();
    const formattedDate = receiptDate.toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = receiptDate.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // --- Convert image to base64 if available ---
    let imageBase64 = "";
    if (receipt.imageUrl) {
      try {
        // Download the image to cache and read as base64
        const tempFile = new File(Paths.cache, "receipt_temp.jpg");
        await File.downloadFileAsync(receipt.imageUrl, tempFile);
        imageBase64 = await tempFile.base64();
      } catch (error) {
        console.warn("Could not load receipt image:", error);
      }
    }

    // --- HTML template for the receipt ---
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; background: white; padding: 20px; max-width: 400px; margin: 0 auto; }
    .receipt { border: 2px solid #000; padding: 20px; background: white; }
    .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
    .store-name { font-size: 20px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
    .store-info { font-size: 11px; line-height: 1.4; margin-bottom: 3px; }
    .org-number { font-size: 10px; margin-top: 5px; }
    .receipt-info { font-size: 11px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #000; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
    .items-section { margin-bottom: 15px; }
    .items-header { font-size: 12px; font-weight: bold; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #000; }
    .item { font-size: 11px; margin-bottom: 8px; }
    .item-name { font-weight: bold; margin-bottom: 2px; }
    .item-details { display: flex; justify-content: space-between; font-size: 10px; }
    .totals { border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
    .total-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px; }
    .total-row.final { font-size: 16px; font-weight: bold; margin-top: 8px; padding-top: 8px; border-top: 2px double #000; }
    .vat-section { margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000; font-size: 10px; }
    .vat-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
    .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #000; font-size: 10px; }
    .thank-you { font-weight: bold; margin-bottom: 10px; }
    .original-image { margin-top: 30px; page-break-before: always; text-align: center; }
    .original-image h3 { font-size: 14px; margin-bottom: 15px; text-transform: uppercase; }
    .original-image img { max-width: 100%; border: 1px solid #000; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="store-name">${receipt.sellerName || "UNKNOWN STORE"}</div>
      ${
        receipt.sellerAddress
          ? `<div class="store-info">${receipt.sellerAddress}</div>`
          : ""
      }
      ${
        receipt.sellerOrgNumber
          ? `<div class="org-number">Org.nr: ${receipt.sellerOrgNumber}</div>`
          : ""
      }
    </div>
    
    <div class="receipt-info">
      <div class="info-row"><span>Dato:</span><span>${formattedDate}</span></div>
      <div class="info-row"><span>Tid:</span><span>${formattedTime}</span></div>
      ${
        receipt.receiptNumber
          ? `<div class="info-row"><span>Kvittering nr:</span><span>${receipt.receiptNumber}</span></div>`
          : ""
      }
    </div>

    ${
      receipt.items?.length
        ? `
      <div class="items-section">
        <div class="items-header">VARER</div>
        ${receipt.items
          .map(
            (item) => `
          <div class="item">
            <div class="item-name">${item.name || "Item"}</div>
            <div class="item-details">
              <span>${item.quantity || 1} x ${
              item.unitPrice?.toFixed(2) || "0.00"
            } ${receipt.currency}</span>
              <span><strong>${item.totalPrice?.toFixed(2) || "0.00"} ${
              receipt.currency
            }</strong></span>
            </div>
          </div>`
          )
          .join("")}
      </div>`
        : ""
    }

    <div class="totals">
      ${
        receipt.subtotal
          ? `<div class="total-row"><span>Subtotal:</span><span>${receipt.subtotal.toFixed(
              2
            )} ${receipt.currency}</span></div>`
          : ""
      }
      ${
        receipt.vatAmount
          ? `<div class="total-row"><span>MVA (${
              receipt.vatRate || 25
            }%):</span><span>${receipt.vatAmount.toFixed(2)} ${
              receipt.currency
            }</span></div>`
          : ""
      }
      <div class="total-row final"><span>TOTALT:</span><span>${receipt.totalAmount.toFixed(
        2
      )} ${receipt.currency}</span></div>
    </div>

    ${
      receipt.hasVAT && receipt.vatAmount
        ? `
      <div class="vat-section">
        <div class="vat-row">
          <span>MVA-grunnlag:</span>
          <span>${(receipt.totalAmount - receipt.vatAmount).toFixed(2)} ${
            receipt.currency
          }</span>
        </div>
        <div class="vat-row">
          <span>MVA ${receipt.vatRate || 25}%:</span>
          <span>${receipt.vatAmount.toFixed(2)} ${receipt.currency}</span>
        </div>
      </div>`
        : ""
    }

    <div class="footer">
      <div class="thank-you">TAKK FOR BESØKET!</div>
      <div>Vennligst ta vare på kvitteringen</div>
      <div style="margin-top: 10px;">Generert: ${new Date().toLocaleDateString(
        "nb-NO"
      )}</div>
    </div>
  </div>

  ${
    imageBase64
      ? `
  <div class="original-image">
    <h3>Original Kvittering</h3>
    <img src="data:image/jpeg;base64,${imageBase64}" alt="Original Receipt" />
  </div>`
      : ""
  }
</body>
</html>
`;

    // --- Generate PDF ---
    const { uri } = await Print.printToFileAsync({ html });

    // --- Move PDF to permanent directory ---
    const fileName = `${
      receipt.sellerName?.replace(/[^a-z0-9]/gi, "_") || "receipt"
    }_${formattedDate.replace(/\//g, "-")}.pdf`;

    // Create a File instance from the temporary PDF
    const tempPdf = new File(uri);

    // Create the destination directory if it doesn't exist
    const pdfDirectory = new Directory(Paths.document, "receipts");
    pdfDirectory.create({ intermediates: true });

    // Move the file to the permanent location
    const destinationFile = new File(pdfDirectory, fileName);
    tempPdf.move(destinationFile);

    // --- Share the PDF or alert path ---
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(destinationFile.uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: "Eksporter kvittering",
      });
    } else {
      Alert.alert("Suksess", `PDF lagret: ${destinationFile.uri}`, [
        { text: "OK" },
      ]);
    }

    return destinationFile.uri;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// --- Public helper for export flow ---
export const exportReceiptAsPDF = async (receipt: Receipt) => {
  try {
    Alert.alert("Eksporterer...", "Genererer PDF av kvittering", [
      { text: "OK" },
    ]);
    await generateReceiptPDF(receipt);
    Alert.alert("Suksess!", "Kvittering eksportert som PDF", [{ text: "OK" }]);
  } catch {
    Alert.alert("Feil", "Kunne ikke eksportere kvittering", [{ text: "OK" }]);
  }
};
