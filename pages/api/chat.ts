import { NextApiRequest, NextApiResponse } from "next";

// Function to call the Gemini API for generating a review
const callChatApi = async (text: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY; // Ensure your API key is securely stored in an environment variable
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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

  const reviewText =
    responseData.candidates?.[0]?.text || "No content available";

  console.log("Generated Review: ", reviewText);

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
      // Read the body as a string and parse the message
      const body = await new Promise<string>((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => resolve(data));
        req.on("error", (err) => reject(err));
      });

      // Parse the body content and extract the message
      const parsedBody = JSON.parse(body);
      const text = parsedBody.message || "";

      // Call the chat API with the text
      const review = await callChatApi(text);

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
