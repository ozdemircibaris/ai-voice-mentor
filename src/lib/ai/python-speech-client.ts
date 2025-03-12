// src/lib/ai/python-speech-client.ts
import axios from "axios";
import { SpeechAnalysisResult } from "./gemini-client";
import { WordTimestamp } from "@/types/analysis";

// Python API endpoint
const PYTHON_API_URL = process.env.SPEECH_RECOGNITION_API_URL || "http://localhost:8000";

/**
 * Transcribe audio using our Python Speech Recognition API
 * @param audioUrl URL of the audio file to transcribe
 * @returns Transcription result with basic analysis
 */
export async function transcribeAudioWithPythonAPI(
  audioUrl: string,
): Promise<{ text: string; wordTimestamps: WordTimestamp[] }> {
  try {
    console.log("Sending audio to Python Speech Recognition API:", audioUrl);

    // Call our Python API with the audio URL
    const response = await axios.post(`${PYTHON_API_URL}/transcribe/`, {
      audio_url: audioUrl,
    });

    if (!response.data || !response.data.transcription) {
      throw new Error("No transcription returned from Python API");
    }

    console.log("Transcription from Python API:", response.data.transcription);

    // Since our basic Python API likely doesn't provide word timestamps,
    // we'll create a simple placeholder based on the transcribed text
    const words = response.data.transcription.split(/\s+/).filter(Boolean);
    const wordTimestamps: WordTimestamp[] = words.map((word: string, index: number) => ({
      word,
      startTime: index * 0.5, // Simple placeholder timing
      endTime: index * 0.5 + 0.4,
    }));

    return {
      text: response.data.transcription,
      wordTimestamps,
    };
  } catch (error: any) {
    console.error("Error calling Python Speech Recognition API:", error.message);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

/**
 * Convert a simple transcription into a complete analysis result
 * This function handles the gap between our simple Python API and
 * the rich analysis expected by the application
 */
export function generateAnalysisFromTranscription(
  transcription: string,
  wordTimestamps: WordTimestamp[],
  audioMetadata: {
    duration: number;
    type: string;
    targetAudience: string;
  },
): SpeechAnalysisResult {
  // Count words and calculate basic metrics
  const words = transcription.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const sentences = transcription.split(/[.!?]+/).filter(Boolean);
  const totalSentences = sentences.length;

  // Calculate speech rate (words per minute)
  const wordsPerMinute = audioMetadata.duration > 0 ? Math.round((totalWords / audioMetadata.duration) * 60) : 0;

  // For demonstration, mark ~5% of words as having minor issues
  // and ~2% as having significant errors (in a real system this would be more sophisticated)
  const minorIssueCount = Math.max(1, Math.floor(totalWords * 0.05));
  const significantErrorCount = Math.max(1, Math.floor(totalWords * 0.02));

  // Randomly select words for demonstration purposes
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  const minorIssueWords = shuffled.slice(0, minorIssueCount);
  const significantErrorWords = shuffled.slice(minorIssueCount, minorIssueCount + significantErrorCount);
  const perfectWords = words.filter((word) => !minorIssueWords.includes(word) && !significantErrorWords.includes(word));

  // Extract timestamps for each category
  const extractTimestamps = (wordList: string[], allTimestamps: WordTimestamp[]): WordTimestamp[] => {
    const result: WordTimestamp[] = [];
    const wordMap = new Map<string, WordTimestamp[]>();

    // Create a map of word -> timestamps
    allTimestamps.forEach((timestamp) => {
      if (!wordMap.has(timestamp.word)) {
        wordMap.set(timestamp.word, []);
      }
      wordMap.get(timestamp.word)!.push(timestamp);
    });

    // Get timestamps for each word
    wordList.forEach((word) => {
      const timestamps = wordMap.get(word);
      if (timestamps && timestamps.length > 0) {
        result.push(timestamps[0]); // Take the first occurrence
        // Remove the used timestamp to avoid duplicates
        timestamps.shift();
      }
    });

    return result;
  };

  // Calculate mock confidence score (80-95% range)
  const confidenceScore = Math.floor(80 + Math.random() * 15);

  // Create analysis result
  return {
    transcription,
    wordAnalysis: {
      totalWords,
      pronunciationBreakdown: {
        perfectWords,
        minorIssueWords,
        significantErrorWords,
      },
      wordTimestamps: {
        perfectWords: extractTimestamps(perfectWords, wordTimestamps),
        minorIssueWords: extractTimestamps(minorIssueWords, wordTimestamps),
        significantErrorWords: extractTimestamps(significantErrorWords, wordTimestamps),
      },
      overallPronunciationScore: confidenceScore,
      pronunciationFeedback: {
        minorIssues: "Some words could be pronounced more clearly, particularly when it comes to vowel sounds.",
        significantErrors: "A few words were pronounced in a way that might cause confusion for listeners.",
      },
    },
    sentenceAnalysis: {
      totalSentences,
      structureAssessment: {
        coherenceScore: Math.floor(75 + Math.random() * 20),
        grammaticalAccuracyScore: Math.floor(80 + Math.random() * 15),
        flowRating: Math.floor(70 + Math.random() * 25),
        feedback:
          "Your sentence structure is generally clear, though some transitions between ideas could be smoother.",
      },
    },
    linguisticPerformance: {
      wordsPerMinute,
      pauseAnalysis: {
        totalPauses: Math.floor(totalSentences * 1.5),
        averagePauseDuration: 0.7 + Math.random() * 0.5,
        pauseImpactFeedback:
          "Your pausing is generally effective, though some pauses could be more strategically placed for emphasis.",
      },
      fillerWordAnalysis: {
        totalFillerWords: Math.floor(totalWords * 0.03),
        fillerWordTypes: ["um", "uh", "like", "you know"],
        fillerWordFeedback:
          "You occasionally use filler words which might affect your perceived confidence and clarity.",
      },
    },
    comprehensiveFeedback: {
      strengths: ["Clear articulation of most words", "Generally appropriate speaking pace", "Good sentence structure"],
      improvementAreas: [
        "Pronunciation of certain technical or uncommon words",
        "Reduction of filler words",
        "More strategic use of pauses for emphasis",
      ],
      detailedRecommendations: [
        "Practice pronouncing key terms that are central to your topic",
        "Try recording yourself and counting filler words to become more aware of them",
        "Consider marking your script to indicate planned pauses for emphasis",
        "Focus on maintaining a consistent pace throughout your presentation",
      ],
    },
  };
}
