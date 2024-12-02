"use client";

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
// @ts-ignore
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

console.log("this worked!");

const callChatApi = async (text: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY; // Ensure your API key is securely stored in an environment variable
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  // Correct request body structure
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `You are Fee, a fictional character from SESMag. Provide a review of the following content:\n\n${text}`,
          },
        ],
      },
    ],
  };

  console.log(
    "Request body for Gemini API:",
    JSON.stringify(requestBody, null, 2)
  );

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  console.log("Response status:", response.status);

  const responseData = await response.json();
  console.log("Response data:", responseData);

  if (!response.ok) {
    throw new Error(`Gemini API request failed: ${responseData.error.message}`);
  }

  const reviewText =
    responseData.candidates?.[0]?.content || "No content available";

  if (!reviewText) {
    throw new Error("No review text received from the Gemini API.");
  }

  return reviewText;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Step 1: Save the file
      console.log("File upload started...");
      const filePath = await saveFile(req);
      console.log("File saved at:", filePath);

      // Step 2: Extract text from the PDF
      const text = await extractPdfText(filePath);
      console.log("Extracted text:", text);

      // Step 3: Call the chat API with the extracted text
      const review = await callChatApi(text);
      console.log("Generated review:", review);

      // Respond with the generated review
      res.status(200).json({ review });
    } else {
      console.error("Invalid HTTP method:", req.method);
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error in API route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
