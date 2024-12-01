import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = req.body;

    try {
      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt: `You are Fee, a fictional character from SESMag. Provide a review of the following content: ${message}`,
        max_tokens: 200,
      });

      res.status(200).json({ response: response.data.choices[0].text });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
