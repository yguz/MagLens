"use client";

import React, { useState } from "react";

const ChatComponent = () => {
  const [message, setMessage] = useState(""); // The input message
  const [review, setReview] = useState(""); // The generated review from Gemini
  const [loading, setLoading] = useState(false); // Loading state
  const [file, setFile] = useState<File | null>(null); // Uploaded file state
  const [fileName, setFileName] = useState(""); // Display file name

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReview(""); // Clear previous review

    try {
      if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", message);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          // Extract review text from file-based response
          const reviewText = data.review?.parts?.[0]?.text || "No review generated.";
          setReview(reviewText);
        } else {
          setReview(data.error || "Error processing file.");
        }
      } else {
        // Handle message-only submission
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();

        if (response.ok) {
          // Extract review text from message-only response
          const reviewText = data?.parts?.map((part: any) => part.text).join("\n") || "No review generated.";
          setReview(reviewText);
        } else {
          setReview(data.error || "Error generating review.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setReview("An error occurred while processing your request.");
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
          {fileName && <p className="text-sm mt-2 text-gray-600">Selected File: {fileName}</p>}
        </div>

        <button
          type="submit"
          className={`mt-2 px-4 py-2 rounded ${
            loading ? "bg-gray-500" : "bg-blue-500 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Review"}
        </button>
      </form>

      {loading && <p>Loading your review...</p>}

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
