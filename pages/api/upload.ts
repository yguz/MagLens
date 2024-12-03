import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
// @ts-ignore
import pdf from "pdf-parse";
import { Pool } from "pg";

// Disable the default body parser for handling file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parser for large files
  },
};

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: "postgres", // replace with your PostgreSQL username
  host: "localhost",
  database: "chat_app", // use the database you created
  password: "password", // replace with your password
  port: 5433,
});

// Function to save the uploaded file
const saveFile = async (req: NextApiRequest) => {
  return new Promise<string>((resolve, reject) => {
    const fileName = `uploaded_${Date.now()}.pdf`; // Generate a unique file name
    const filePath = path.join(process.cwd(), "uploads", fileName);
    const fileStream = fs.createWriteStream(filePath);

    req.pipe(fileStream);

    req.on("end", () => resolve(filePath)); // Resolve with the full file path
    req.on("error", (err) => {
      console.error("Error saving file:", err);
      reject(err);
    });
  });
};

// Function to extract text from the PDF
const extractPdfText = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
};

// Function to call the Gemini API for generating a review
const callChatApi = async (text: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY; // Ensure your API key is securely stored in an environment variable
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  // Request body structure
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `You are Fee, a fictional character from SESMag. This is your background : Fee works as an accountant. They just moved to this employer 1 week ago, and their software systems are new to Fee . For Fee, technology is a useful tool that they have control over. Fee likes to make sure they have the latest version of all software with all the new features.
Fee has not taken any computer programming or IT classes. Fee likes Math and knows how to think in terms of numbers. Fee writes and edits spreadsheet formulas for their work.
Fee plays the latest video games, has the newest smart phone and a hybrid car. They download and install the latest software. d Fee is comfortable and confident with technology and they enjoy learning about it and using new technologies. Fee works as an accountant. They just moved to this employer 1 week ago, and their software systems are new to Fee . For Fee, technology is a useful tool that they have control over. Fee likes to make sure they have the latest version of all software with all the new features.
Fee has not taken any computer programming or IT classes. Fee likes Math and knows how to think in terms of numbers. Fee writes and edits spreadsheet formulas for their work.
Fee plays the latest video games, has the newest smart phone and a hybrid car. They download and install the latest software. d Fee is comfortable and confident with technology and they enjoy learning about it and using new technologies. Provide a review of the following content:\n\n${text}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Gemini API request failed: ${responseData.error.message}`);
  }

  return responseData.candidates?.[0]?.content || "No review generated.";
};

// Function to save file metadata to the database
const saveFileMetadata = async (
  fileName: string,
  filePath: string,
  review: string
) => {
  try {
    // Save file metadata and extracted data to the database
    const result = await pool.query(
      "INSERT INTO files (file_name, file_path, review) VALUES ($1, $2, $3) RETURNING id",
      [fileName, filePath, review]
    );
    console.log("File saved with ID:", result.rows[0].id);
  } catch (err) {
    console.error("Error saving file metadata:", err);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Step 1: Save the uploaded file and generate a unique file name
      console.log("File upload started...");
      const filePath = await saveFile(req);
      const fileName = path.basename(filePath); // Extract the file name

      // Step 2: Extract text from the PDF
      const text = await extractPdfText(filePath);

      // Step 3: Call the chat API with the extracted text
      const review = await callChatApi(text);
      console.log("Generated review:", review);

      // Step 4: Save file metadata (name, path, extracted text, review) to the database
      await saveFileMetadata(fileName, filePath, review);

      // Respond with the generated review
      res.status(200).json({ review });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error in API route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
