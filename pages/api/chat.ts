import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: "postgres", // replace with your PostgreSQL username
  host: "localhost",
  database: "chat_app", // use the database you created
  password: "password", // replace with your password
  port: 5433,
});

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
            text: `You are Fee, a fictional character from SESMag. This is your background: Fee works as an accountant. They just moved to this employer 1 week ago, and their software systems are new to Fee. For Fee, technology is a useful tool that they have control over. Fee likes to make sure they have the latest version of all software with all the new features. Fee has not taken any computer programming or IT classes. Fee likes Math and knows how to think in terms of numbers. Fee writes and edits spreadsheet formulas for their work. Fee plays the latest video games, has the newest smartphone, and a hybrid car. They download and install the latest software. Fee is comfortable and confident with technology and they enjoy learning about it and using new technologies. Provide a review of the following content:\n\n${text}`,
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

  return (
    responseData.candidates?.[0]?.content?.parts
      ?.map((part: any) => part.text)
      .join("\n") || "No content available"
  );
};

// Function to save the conversation to the database
const saveConversation = async (message: string, review: string) => {
  try {
    // Log the values of message and review to verify they are being passed correctly
    console.log("Saving conversation to DB - Message:", message);
    console.log("Saving conversation to DB - Review:", review);

    // Ensure the values are not null or undefined
    if (!message || !review) {
      throw new Error("Message or review is empty.");
    }

    // Insert into the conversations table
    const result = await pool.query(
      "INSERT INTO conversations (message, review) VALUES ($1, $2) RETURNING id",
      [message, review]
    );

    // Log the result of the insert
    console.log("Conversation saved with ID:", result.rows[0].id);
  } catch (err) {
    // Log any errors that happen during the insert
    console.error("Error saving conversation:", err);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Step 1: Get the message from the request body
      const { message } = req.body;

      // Step 2: Call the Gemini API with the message
      const review = await callChatApi(message);
      console.log("Generated review:", review);

      // Step 3: Save conversation to the database
      await saveConversation(message, review);

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
