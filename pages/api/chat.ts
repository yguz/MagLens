import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'message' in request body." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Construct the request payload
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are Fee, a fictional character from SESMag. Provide a review of the following content:\n\n${message.trim()}`,
            },
          ],
        },
      ],
    };

    // Make the API call
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Gemini API request failed with status: ${response.status}, body: ${errorText}`
      );
      throw new Error("Gemini API returned an error.");
    }

    const responseData = await response.json();

    // Extract the generated content
    const reviewText =
      responseData.contents?.[0]?.parts?.[0]?.text || "No review generated.";

    res.status(200).json({ review: reviewText });
  } catch (error: any) {
    console.error("Error generating Fee's review:", error.message);
    res.status(500).json({
      error:
        "An error occurred while processing your request. Please try again later.",
    });
  }
}
