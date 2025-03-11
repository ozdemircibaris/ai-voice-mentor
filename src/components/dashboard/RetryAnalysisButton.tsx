// src/components/dashboard/RetryAnalysisButton.tsx
"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface RetryAnalysisButtonProps {
  recordingId: string;
}

export default function RetryAnalysisButton({ recordingId }: RetryAnalysisButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRetryAnalysis = async () => {
    try {
      setIsLoading(true);

      // API endpoint'ine istek gönder
      const response = await fetch(`/api/recordings/${recordingId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to retry analysis");
      }

      // Başarılı olursa sayfayı yenile
      router.refresh();

      // Başarı mesajı göster
    } catch (error) {
      console.error("Error retrying analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRetryAnalysis}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
        isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      <RefreshCcw className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : "Try Again"}
    </button>
  );
}
