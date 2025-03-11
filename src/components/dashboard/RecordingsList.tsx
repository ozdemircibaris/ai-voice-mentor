// components/dashboard/RecordingsList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, BarChart, Trash2, Play, Pause, MoreVertical, Globe, Lock } from "lucide-react";
import { Recording } from "@/types";

interface RecordingsListProps {
  recordings: Recording[];
}

export default function RecordingsList({ recordings }: RecordingsListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Format speech type
  const formatSpeechType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Toggle audio playback
  const togglePlayback = (recordingId: string, audioUrl: string) => {
    if (playingId === recordingId) {
      // Stop current playback
      const audioElement = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingId(null);
    } else {
      // Stop any current playback
      if (playingId) {
        const currentAudioElement = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
        if (currentAudioElement) {
          currentAudioElement.pause();
        }
      }

      // Start new playback
      const audioElement = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.play();

        // Add event listener to handle playback end
        audioElement.addEventListener("ended", () => {
          setPlayingId(null);
        });
      } else {
        // Create audio element if it doesn't exist
        const newAudioElement = document.createElement("audio");
        newAudioElement.id = `audio-${recordingId}`;
        newAudioElement.src = audioUrl;
        newAudioElement.style.display = "none";
        document.body.appendChild(newAudioElement);

        newAudioElement.play();

        // Add event listener to handle playback end
        newAudioElement.addEventListener("ended", () => {
          setPlayingId(null);
        });
      }

      setPlayingId(recordingId);
    }
  };

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {recordings.map((recording) => (
          <li key={recording.id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => togglePlayback(recording.id, recording.audioUrl)}
                    className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {playingId === recording.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <Link href={`/recordings/${recording.id}`} className="truncate">
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-800">{recording.title}</div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{formatSpeechType(recording.type)}</span>
                      {recording.isPublic ? (
                        <span className="ml-2 inline-flex items-center text-xs text-green-600">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center text-xs text-gray-500">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="hidden md:flex flex-col items-end text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(recording.duration)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(recording.createdAt)}</span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    {recording.analyses && recording.analyses.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <BarChart className="h-3 w-3 mr-1" />
                        Analyzed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/recordings/${recording.id}`}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
