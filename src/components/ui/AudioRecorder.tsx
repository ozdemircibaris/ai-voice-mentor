// components/ui/AudioRecorder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, AlertCircle } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string, duration: number) => void;
  onError?: (error: string) => void;
}

const AudioRecorder = ({ onRecordingComplete, onError }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle cleanup when component unmounts or recording stops
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      // Release media streams if they exist
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }

      // Free up audio URLs
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Start recording function
  const startRecording = async () => {
    // Reset states at the beginning of a new recording
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setPermissionDenied(false);
    audioChunksRef.current = [];

    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");

      // Initialize the media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up the data available event
      mediaRecorder.ondataavailable = (event) => {
        console.log("Data available", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing audio...");
        // Stop the timer
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        // Create the audio blob and URL
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);

        console.log("Recording processed, duration:", recordingTime);

        // Call the completion handler
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, audioUrl, recordingTime);
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      console.log("Recording started");

      // Start the timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          console.log("Timer tick:", prevTime + 1);
          return prevTime + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setPermissionDenied(true);
      if (onError) {
        onError("Could not access microphone. Please check browser permissions.");
      }
    }
  };

  // Stop recording function
  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();

      // Stop all tracks on the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }

      setIsRecording(false);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-2xl font-semibold mb-4">
        {isRecording ? "Recording in progress..." : audioUrl ? "Recording Complete" : "Record Your Speech"}
      </div>

      {/* Timer display */}
      <div className="text-4xl font-mono mb-6">{formatTime(recordingTime)}</div>

      {/* Recording visualization */}
      {isRecording && (
        <div className="wave mb-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bar"></div>
          ))}
        </div>
      )}

      {/* Error message */}
      {permissionDenied && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Microphone access denied. Please check your browser permissions.</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full transition-colors"
          >
            <Mic size={20} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-full transition-colors"
          >
            <Square size={20} />
            Stop Recording
          </button>
        )}

        {audioUrl && (
          <div className="w-full">
            <audio src={audioUrl} controls className="w-full mb-4" />
            <p className="text-sm text-gray-600 text-center">Recording saved! Fill in the details below to continue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
