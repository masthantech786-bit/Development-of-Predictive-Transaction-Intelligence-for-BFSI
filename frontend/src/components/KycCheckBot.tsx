// frontend/src/components/KycCheckBot.tsx
import React, { useState, useRef } from 'react';
import { Upload, Bot } from 'lucide-react';

// Helper function to convert a file to a base64 string
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

export default function KycCheckBot() {
  const [feedback, setFeedback] = useState("Hi! Upload an image of your PAN card, and I'll check it for common issues like blur or glare before you submit.");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic size check (e.g., limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        setFeedback("Error: Image size should be less than 5MB.");
        return;
    }

    setIsLoading(true);
    setFeedback("Analyzing image...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const imageBase64 = await toBase64(file);

      // Ensure this URL is correct (use http://localhost:5000 if needed)
      const response = await fetch("/api/chatbot/check_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      setFeedback(data.feedback);

    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-inner mb-6 border dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="bg-blue-600 p-2 rounded-full flex-shrink-0 mt-1">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm w-full">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {isLoading ? "Analyzing..." : feedback}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          <Upload className="h-4 w-4" />
          Check My Image
        </button>
      </div>
    </div>
  );
}