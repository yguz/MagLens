'use client';

import { useState } from 'react';

const FileUpload = ({ onReview }: { onReview: (reviewData: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false); // Track upload state
  const [error, setError] = useState<string | null>(null); // Track error state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null); // Clear any existing errors
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      console.log('Error: No file selected');
      return;
    }
  
    setUploading(true);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      console.log('Starting file upload...');
  
      // Step 1: Upload the file
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      console.log('Upload response:', uploadResponse);
  
      const uploadData = await uploadResponse.json();
  
      if (!uploadResponse.ok) {
        console.log('Upload failed:', uploadData);
        throw new Error(uploadData.error || 'File upload failed');
      }
  
      console.log('File uploaded successfully:', uploadData);
  
      // Step 2: Call the chat API with the uploaded file's extracted text
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: uploadData.text }),
      });
  
      console.log('Chat API response raw:', chatResponse);
  
      const chatData = await chatResponse.json();
  
      if (!chatResponse.ok) {
        console.log('Chat API failed:', chatData);
        throw new Error(chatData.error || 'Chat API failed');
      }
  
      console.log('Chat API response parsed:', chatData);
  
      // Pass the review data to the parent component
      onReview(chatData.review);
  
    } catch (error: any) {
      console.error('Error in handleUpload:', error.message);
      setError(error.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload and Generate Review'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
