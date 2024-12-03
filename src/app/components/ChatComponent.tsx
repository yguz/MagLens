"use client";

import React, { useState } from "react";
import styles from "../ChatComponent.module.css";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ user: string; fee: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    try {
      // Mock API call (replace with your actual API endpoint)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const feeResponse = data.review || "No review generated.";
      
      setChatHistory([...chatHistory, { user: message, fee: feeResponse }]);
      setMessage(""); // Clear input
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      console.log("Please upload a valid PDF file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Mock API call for file upload (replace with your actual API endpoint)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      // Add file upload response to chat history as a message
      const uploadMessage = `File uploaded: ${file.name}`;
      setChatHistory([
        ...chatHistory,
        { user: `User uploaded a file ${file.name}`, fee: data.review.parts[0].text },
      ]);

      console.log("File uploaded successfully!"); // Customize this based on your API response
    } catch (error) {
      console.error("Error uploading file:", error);
      console.log("Error uploading file.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fee's ChatGPT-style Review Generator</h1>

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
  type="file"
  accept="application/pdf"
  onChange={handleFileUpload}
  className={styles.uploadButton}
/>

      </form>
    </div>
  );
};

export default ChatComponent;
