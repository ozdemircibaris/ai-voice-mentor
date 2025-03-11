// components/ui/AudioRecorder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, AlertCircle } from "lucide-react";
import axios from "axios";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string, duration: number) => void;
  onError?: (error: string) => void;
}

const AudioRecorder = ({ onRecordingComplete, onError }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);

        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, audioUrl, recordingTime);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (onError) {
        onError("Could not access microphone. Please check permissions.");
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [isRecording, audioUrl]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-2xl font-semibold mb-4">
        {isRecording ? "Recording..." : audioUrl ? "Recording Complete" : "Record Your Speech"}
      </div>

      <div className="text-4xl font-mono mb-6">{formatTime(recordingTime)}</div>

      <div className="flex gap-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full"
          >
            <Mic size={20} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-full"
          >
            <Square size={20} />
            Stop Recording
          </button>
        )}

        {audioUrl && (
          <div className="flex gap-2">
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Your recording is ready! Fill in the details below and save it.</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
