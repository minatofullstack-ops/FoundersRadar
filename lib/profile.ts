import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const maxInputBytes = 5 * 1024 * 1024;

export function maskProfile(value: string) {
  return value
    .replace(/\b(?!(?:[A-Z][a-z]+)\s+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b)(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g, "[name masked]")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/gi, "[email masked]")
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[phone masked]")
    .replace(/\b(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi, "[profile masked]")
    .replace(/\b\d{1,5}\s+[\w.-]+\s+(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln)\b/gi, "[address masked]");
}

export async function parseResume(file: File) {
  if (file.size > maxInputBytes) throw new Error("Resume must be under 5 MB.");
  const extension = file.name.toLowerCase().split(".").pop();
  const buffer = Buffer.from(await file.arrayBuffer());
  let text: string;

  if (extension === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    text = result.text;
    await parser.destroy();
  } else if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (extension === "txt") {
    text = buffer.toString("utf8");
  } else {
    throw new Error("Upload a PDF, DOCX, or TXT resume.");
  }

  const masked = maskProfile(text).trim();
  if (!masked) throw new Error("We could not find readable text in that resume.");
  return masked.slice(0, 20_000);
}
