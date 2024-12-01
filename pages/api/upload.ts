"use client";

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

// Disable the default body parser for handling file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parser for large files
  },
};

const saveFile = async (req: NextApiRequest) => {
  return new Promise<string>((resolve, reject) => {
    const filePath = path.join(process.cwd(), "uploads", "uploaded.pdf");
    const fileStream = fs.createWriteStream(filePath);

    req.pipe(fileStream);

    req.on("end", () => resolve(filePath));
    req.on("error", (err) => {
      console.error("Error saving file:", err);
      reject(err); // Log any error during the file save
    });
  });
};

const extractPdfText = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Attempt to save the file and extract text
      console.log("File upload started...");
      const filePath = await saveFile(req); // Save the file
      console.log("File saved at:", filePath);

      const text = await extractPdfText(filePath); // Extract text from PDF
      console.log("Extracted text:", text);

      res.status(200).json({ text });
    } else {
      console.error("Invalid HTTP method:", req.method);
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
