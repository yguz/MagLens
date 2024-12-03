"use client";

import React, { useState } from "react";
import styles from "../ChatComponent.module.css";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ user: string; fee: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0); // Key to reset input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    setLoading(true);
    setErrorMessage(null); // Reset the error message on new submission

    try {
      let feeResponse = "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const fileResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!fileResponse.ok) {
          throw new Error("File upload failed. Please try again.");
        }

        const fileData = await fileResponse.json();
        feeResponse = fileData.review?.parts?.[0]?.text || `File uploaded: ${selectedFile.name}`;
        setSelectedFile(null);
      }

      if (message.trim()) {
        const textResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        const textData = await textResponse.json();
        feeResponse = textData.review || "No review generated.";
      }

      setChatHistory([...chatHistory, { user: message || `File: ${selectedFile?.name}`, fee: feeResponse }]);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again."); // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      console.log("Please upload a valid PDF file.");
    }
  };

  const handleDiscardFile = () => {
    setSelectedFile(null);
    setFileInputKey(prevKey => prevKey + 1); // Reset the file input key
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fee's ChatGPT-style Review Generator</h1>
      <div className={styles.chatContainer}>
        <div className={styles.chatWindow}>
          {chatHistory.map((entry, index) => (
            <React.Fragment key={index}>
              <div className={styles.message}>
                <img
                  src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                  alt="User Avatar"
                  className={styles.avatar}
                />
                <div className={styles.content}>{entry.user}</div>
              </div>
              <div className={`${styles.message} ${styles.user}`}>
                <img
                  src="https://obi2.kean.edu/~ykumar@kean.edu/sesmag/fee.png"
                  alt="Fee Avatar"
                  className={styles.avatar}
                />
                <div className={styles.content}>{entry.fee}</div>
              </div>
            </React.Fragment>
          ))}
          {loading && (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div>
          )}
          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.inputArea}>
          <textarea
            className={styles.textarea}
            rows={2}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <button className={styles.sendButton} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          <input
            key={fileInputKey} // Resets input on key change
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={styles.uploadButton}
          />
          {selectedFile && (
            <div className={styles.filePreview}>
              <span>{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleDiscardFile}
                className={styles.discardButton}
              >
                ❌
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
