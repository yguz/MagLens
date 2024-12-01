'use client';  // This makes the file a client-side component
import { useState } from "react";

interface FileUploadProps {
  onUpload: (fileText: string) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      onUpload(result.text);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Upload PDF</button>
    </form>
  );
};

export default FileUpload;
