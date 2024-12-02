import { NextApiRequest, NextApiResponse } from "next";

// Function to call the Gemini API for generating a review
const callChatApi = async (text: string): Promise<string> => {
  console.log("callChatApi: Starting API call with text:", text);

  const apiKey = process.env.GEMINI_API_KEY;
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

  console.log("callChatApi: Request body:", requestBody);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();
  console.log("callChatApi: Response data:", responseData);

  if (!response.ok) {
    throw new Error(
      `Gemini API request failed: ${
        responseData.error?.message || "Unknown error"
      }`
    );
  }

  // Safely access the nested structure
  const reviewText =
    responseData.candidates?.[0]?.content?.parts
      ?.map((part: any) => part.text)
      .join("\n") || "No content available";

  console.log("callChatApi: Generated review text:", reviewText);

  return reviewText;
};

// API handler for the chat request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Body is already parsed, so directly access `req.body`
      const { message } = req.body;

      // Call the chat API with the message
      const review = await callChatApi(message);

      res.status(200).json({ review });
    } catch (error: any) {
      console.error("API Handler: Error occurred:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    console.error("API Handler: Invalid HTTP method:", req.method);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
