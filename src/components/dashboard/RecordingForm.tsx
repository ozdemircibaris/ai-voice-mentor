// components/dashboard/RecordingForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AudioRecorder from "../ui/AudioRecorder";

const SPEECH_TYPES = [
  { id: "presentation", label: "Business Presentation" },
  { id: "speech", label: "Public Speech" },
  { id: "interview", label: "Interview" },
  { id: "lecture", label: "Lecture/Teaching" },
  { id: "podcast", label: "Podcast/Media" },
  { id: "other", label: "Other" },
];

const TARGET_AUDIENCES = [
  { id: "business", label: "Business Professionals" },
  { id: "academic", label: "Academic Audience" },
  { id: "general", label: "General Public" },
  { id: "technical", label: "Technical Audience" },
  { id: "students", label: "Students" },
  { id: "other", label: "Other" },
];

const RecordingForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "presentation",
    targetAudience: "business",
    isPublic: false,
  });

  const [recordingData, setRecordingData] = useState<{
    audioBlob: Blob | null;
    audioUrl: string | null;
    duration: number | null;
  }>({
    audioBlob: null,
    audioUrl: null,
    duration: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRecordingComplete = (audioBlob: Blob, audioUrl: string, duration: number) => {
    setRecordingData({
      audioBlob,
      audioUrl,
      duration,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!recordingData.audioBlob) {
      setError("Please record audio before submitting");
      return;
    }

    if (!formData.title) {
      setError("Please provide a title for your recording");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create form data for file upload
      const uploadFormData = new FormData();
      uploadFormData.append("audio", recordingData.audioBlob, `${formData.title.replace(/\s+/g, "_")}.wav`);

      // Upload audio file to Supabase storage via our API
      const uploadResponse = await axios.post("/api/uploads/audio", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { audioUrl } = uploadResponse.data;

      // Create recording record in database
      const recordingResponse = await axios.post("/api/recordings", {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        targetAudience: formData.targetAudience,
        isPublic: formData.isPublic,
        audioUrl,
        duration: recordingData.duration,
      });

      const { id: recordingId } = recordingResponse.data;

      // Trigger analysis in the background
      await axios.post(`/api/recordings/${recordingId}/analyze`);

      setSuccess("Recording saved! Analysis is in progress...");

      // Redirect to the recording page after a brief delay
      setTimeout(() => {
        router.push(`/recordings/${recordingId}`);
      }, 2000);
    } catch (error) {
      console.error("Error saving recording:", error);
      setError("Failed to save recording. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Recording</h1>

      <div className="mb-8">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} onError={setError} />
      </div>

      {recordingData.audioBlob && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Q1 Sales Presentation"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What is this recording about?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Speech Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SPEECH_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TARGET_AUDIENCES.map((audience) => (
                  <option key={audience.id} value={audience.id}>
                    {audience.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Share this recording publicly (others can learn from it)
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
            >
              {isSubmitting ? "Saving..." : "Save and Analyze Recording"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RecordingForm;
