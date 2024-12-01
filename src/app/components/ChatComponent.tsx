// src/app/components/ChatComponent.tsx
import React, { useState } from "react";

const ChatComponent = () => {
  const [message, setMessage] = useState(""); // The input message
  const [review, setReview] = useState(""); // The generated review from Gemini
  const [loading, setLoading] = useState(false); // Loading state to show a spinner or message
  const [file, setFile] = useState<File | null>(null); // File state for storing the uploaded file
  const [fileName, setFileName] = useState(""); // Display file name for user feedback

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Handle form submission (including file upload and message processing)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let requestBody = { message };

      // If a file is uploaded, append it to the request body
      const formData = new FormData();
      if (file) {
        formData.append("file", file); // Append the file to FormData
        formData.append("message", message); // Also append the message text

        // Send file to backend API
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          const reviewText = data.response?.candidates[0]?.content?.parts[0]?.text;
          setReview(reviewText || "No review generated.");
        } else {
          setReview("Error processing file.");
        }
      } else {
        // If no file, only send the message for review
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (response.ok) {
          const reviewText = data.response?.candidates[0]?.content?.parts[0]?.text;
          setReview(reviewText || "No review generated.");
        } else {
          setReview("Error generating review.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setReview("An error occurred while generating the review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fee's Review Generator</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            placeholder="Enter content to get Fee's review"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded"
          />
          {fileName && <p className="text-sm mt-2 text-gray-600">{fileName}</p>}
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Review"}
        </button>
      </form>

      {review && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold mb-2">Fee's Review:</h2>
          <p>{review}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
