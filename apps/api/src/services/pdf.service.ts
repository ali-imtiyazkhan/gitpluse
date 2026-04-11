import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");

// Robust CJS/ESM/Default/Named interop
let pdf: any;
if (typeof pdfModule === "function") {
  pdf = pdfModule;
} else if (pdfModule && typeof pdfModule.default === "function") {
  pdf = pdfModule.default;
} else if (pdfModule && typeof pdfModule.PDFParse === "function") {
  pdf = pdfModule.PDFParse;
} else if (pdfModule && typeof pdfModule === "object") {
  // Last resort: check if any key is a function that might be it
  const firstFunc = Object.values(pdfModule).find(v => typeof v === "function");
  if (firstFunc) pdf = firstFunc;
}

export const pdfService = {
  async extractText(nodeBuffer: Buffer): Promise<string> {
    const buffer = new Uint8Array(nodeBuffer);
    try {
      if (typeof pdf !== "function") {
        throw new Error("PDF parsing library failed to load correctly");
      }
      
      let extractedText = "";
      try {
        // Try the PDFParse class pattern (new -> load -> getText)
        const instance = new (pdf as any)(buffer);
        if (typeof instance.load === "function" && typeof instance.getText === "function") {
          await instance.load();
          extractedText = await instance.getText();
        } else {
          // Fallback to standard function call
          const result = await pdf(buffer);
          extractedText = result?.text || result?.info?.text || "";
        }
      } catch (err: any) {
        // Handle constructor requirement specifically
        if (err.message?.includes("Class constructor")) {
          const instance = new (pdf as any)(buffer);
          if (instance.load) {
            await instance.load();
            extractedText = await instance.getText();
          } else {
            extractedText = (await instance).text || "";
          }
        } else {
          throw err;
        }
      }

      // Robust string extraction
      if (typeof extractedText === "object" && extractedText !== null) {
        extractedText = (extractedText as any).text || (extractedText as any).info?.text || JSON.stringify(extractedText);
      }
      
      return String(extractedText || "");
    } catch (error: any) {
      console.error("❌ PDF extraction error:", error.message || error);
      throw new Error(`Failed to extract text from PDF: ${error.message || "Unknown error"}`);
    }
  }
};
