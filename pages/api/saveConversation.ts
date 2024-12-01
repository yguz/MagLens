import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

const saveConversation = (userMessage: string, botResponse: string) => {
  return new Promise<void>((resolve, reject) => {
    db.query(
      "INSERT INTO conversations (user_message, bot_response) VALUES (?, ?)",
      [userMessage, botResponse],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userMessage, botResponse } = req.body;

    try {
      await saveConversation(userMessage, botResponse);
      res.status(200).json({ message: "Conversation saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error saving conversation" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
