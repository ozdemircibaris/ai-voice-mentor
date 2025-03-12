"use client";

import { useState, useRef } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  Award,
  TrendingUp,
  Target,
  Headphones,
  Volume2,
  CheckCircle,
  FileText,
  Zap,
  Play,
  Pause,
} from "lucide-react";
import { Analysis, Recording, WordTimestamp } from "@/types";

interface AnalysisDisplayProps {
  recording: Recording;
  analysis: Analysis;
}

const AnalysisDisplay = ({ recording, analysis }: AnalysisDisplayProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transcription" | "pronunciation" | "pacing" | "structure" | "feedback"
  >("overview");

  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Category styling and icons mapping
  const categoryStyles = {
    overview: { color: "text-blue-600", icon: Award },
    transcription: { color: "text-gray-600", icon: FileText },
    pronunciation: { color: "text-purple-600", icon: Headphones },
    pacing: { color: "text-indigo-600", icon: TrendingUp },
    structure: { color: "text-yellow-600", icon: Target },
    feedback: { color: "text-green-600", icon: CheckCircle },
  };

  // Format data for radar chart
  const getRadarChartData = () => {
    if (!analysis) return [];

    // Calculate percentage scores based on available data
    // Since some values are 0 in the example, we'll use relative scaling for visualization
    const totalWords = analysis.comparisonData?.wordAnalysis?.totalWords || 0;

    // Normalize scores to be between 0-100 for visualization
    const normalizeScore = (value: number, max: number = 100) => {
      if (value === 0) return 20; // Baseline value for empty metrics
      return Math.min(Math.max(value, 0), max);
    };

    return [
      {
        category: "Confidence",
        score: normalizeScore(analysis.confidenceScore || 0),
      },
      {
        category: "Speech Rate",
        score: normalizeScore(analysis.speechRate || 0),
      },
      {
        category: "Structure",
        score: normalizeScore(analysis.comparisonData?.sentenceAnalysis?.structureDetails?.coherenceScore || 0),
      },
      {
        category: "Pronunciation",
        score: normalizeScore(analysis.comparisonData?.wordAnalysis?.overallPronunciationScore || 0),
      },
      {
        category: "Tonality",
        score: normalizeScore(analysis.tonality?.variety || 0),
      },
    ];
  };

  // Format data for word analysis bar chart
  const getWordAnalysisData = () => {
    const wordAnalysis = analysis.comparisonData?.wordAnalysis;
    if (!wordAnalysis) return [];

    const perfectWords = wordAnalysis.perfectWords?.length || 0;
    const minorIssueWords = wordAnalysis.minorIssueWords?.length || 0;
    const significantErrorWords = wordAnalysis.significantErrorWords?.length || 0;
    const totalAnalyzedWords = perfectWords + minorIssueWords + significantErrorWords;

    // If we have no specific word breakdowns, use the total words count
    const totalWords = wordAnalysis.totalWords || 0;

    // If no words were classified, show a general breakdown
    if (totalAnalyzedWords === 0) {
      return [{ name: "Total Words", count: totalWords }];
    }

    return [
      { name: "Perfect", count: perfectWords },
      { name: "Minor Issues", count: minorIssueWords },
      { name: "Significant Errors", count: significantErrorWords },
    ];
  };

  // Format transcription with highlighting
  const formatTranscription = (text: string) => {
    if (!text) return "No transcription available";

    // Split the transcription into sentences for better readability
    const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);

    return (
      <div className="space-y-2">
        {sentences.map((sentence, index) => (
          <p key={index} className="text-gray-700">
            {sentence.trim()}.
          </p>
        ))}
      </div>
    );
  };

  // Play word audio function
  const playWordAudio = (wordData: WordTimestamp) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
    }

    // If the same word is clicked again, just stop playing
    if (playingWord === wordData.word) {
      setPlayingWord(null);
      return;
    }

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(recording.audioUrl);
    }

    // Add context before and after the word for better comprehension
    const contextBuffer = 0.3; // seconds of context before and after the word

    // Calculate start time with context (but don't go before 0)
    const startTime = Math.max(0, wordData.startTime - contextBuffer);

    // Set the current time to the adjusted start time
    audioRef.current.currentTime = startTime;

    // Slow down the playback rate for better clarity
    audioRef.current.playbackRate = 0.75;

    // Play the audio
    audioRef.current
      .play()
      .then(() => {
        // Set current playing word
        setPlayingWord(wordData.word);

        // Calculate the total duration including context
        const originalDuration = wordData.endTime - wordData.startTime;
        const extendedDuration = originalDuration + contextBuffer * 2;

        // Adjust for the slower playback rate
        const adjustedDuration = extendedDuration / audioRef.current!.playbackRate;

        // Set a timeout to stop the audio after the extended word duration
        audioTimeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            // Reset playback rate for next play
            audioRef.current.playbackRate = 1.0;
          }
          setPlayingWord(null);
        }, adjustedDuration * 1000);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
        setPlayingWord(null);
      });
  };
  // Tab content rendering functions
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Words",
            value: analysis.comparisonData?.wordAnalysis?.totalWords || 0,
            icon: FileText,
          },
          {
            label: "Sentences",
            value: analysis.comparisonData?.sentenceAnalysis?.totalSentences || 0,
            icon: Target,
          },
          {
            label: "Confidence",
            value: `${analysis.confidenceScore || 0}%`,
            icon: Zap,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 bg-opacity-80">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">{label}</h2>
                <p className="text-3xl font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transcript Preview</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => setActiveTab("transcription")}>
            View Full Transcript
          </button>
        </div>
        <div className="text-gray-700 line-clamp-3">{analysis.transcription || "No transcription available"}</div>
      </div>

      {/* Strengths */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Strengths</h3>
        {analysis.strengths && analysis.strengths.length > 0 ? (
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No strengths identified in this analysis.</p>
        )}
      </div>

      {/* Areas of Improvement */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Areas of Improvement</h3>
        {analysis.improvementAreas && analysis.improvementAreas.length > 0 ? (
          <ul className="space-y-2">
            {analysis.improvementAreas.map((area, index) => (
              <li key={index} className="flex items-start">
                <ArrowUpRight className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{area}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No improvement areas identified in this analysis.</p>
        )}
      </div>
    </div>
  );

  const renderTranscriptionTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Full Transcription</h3>
      {analysis.transcription ? (
        <div className="prose max-w-none">{formatTranscription(analysis.transcription)}</div>
      ) : (
        <p className="text-gray-500">No transcription available for this recording.</p>
      )}
    </div>
  );

  const renderPronunciationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Word Analysis</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Words</span>
            <span className="text-lg font-bold text-gray-900">
              {analysis.comparisonData?.wordAnalysis?.totalWords || 0}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Pronunciation Score</span>
            <span className="text-lg font-bold text-gray-900">
              {analysis.comparisonData?.wordAnalysis?.overallPronunciationScore || 0}%
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={getWordAnalysisData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Word Lists - Only show if there's data */}
      {(analysis.comparisonData?.wordAnalysis?.minorIssueWords?.length > 0 ||
        analysis.comparisonData?.wordAnalysis?.significantErrorWords?.length > 0) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Problematic Words</h3>

          {analysis.comparisonData?.wordAnalysis?.minorIssueWords?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Words with Minor Issues:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.wordTimestamps?.minorIssueWords && analysis.wordTimestamps.minorIssueWords.length > 0
                  ? // Use timestamps for interactive playback
                    analysis.wordTimestamps.minorIssueWords.map((wordData, index) => (
                      <div key={index} className="inline-flex items-center">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-l-full text-sm">
                          {wordData.word}
                        </span>
                        <button
                          onClick={() => playWordAudio(wordData)}
                          className="h-7 px-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-r-full flex items-center justify-center transition-colors"
                          title="Listen to pronunciation"
                        >
                          {playingWord === wordData.word ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </button>
                      </div>
                    ))
                  : // Fallback if timestamps aren't available
                    analysis.comparisonData.wordAnalysis.minorIssueWords.map((word, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {word}
                      </span>
                    ))}
              </div>
            </div>
          )}

          {analysis.comparisonData?.wordAnalysis?.significantErrorWords?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Words with Significant Errors:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.wordTimestamps?.significantErrorWords &&
                analysis.wordTimestamps.significantErrorWords.length > 0
                  ? // Use timestamps for interactive playback
                    analysis.wordTimestamps.significantErrorWords.map((wordData, index) => (
                      <div key={index} className="inline-flex items-center">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-l-full text-sm">
                          {wordData.word}
                        </span>
                        <button
                          onClick={() => playWordAudio(wordData)}
                          className="h-7 px-2 bg-red-200 hover:bg-red-300 text-red-800 rounded-r-full flex items-center justify-center transition-colors"
                          title="Listen to pronunciation"
                        >
                          {playingWord === wordData.word ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </button>
                      </div>
                    ))
                  : // Fallback if timestamps aren't available
                    analysis.comparisonData.wordAnalysis.significantErrorWords.map((word, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {word}
                      </span>
                    ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPacingTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Speaking Rate</h3>
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium text-gray-700">Words Per Minute</span>
          <span className="text-2xl font-bold text-blue-600">{analysis.speechRate || "N/A"}</span>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Speaking Rate
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {analysis.speechRate || 0}/150 WPM
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${Math.min(((analysis.speechRate || 0) / 150) * 100, 100)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            The ideal speaking rate for clear communication is typically 120-150 words per minute.
            {analysis.speechRate === 0 && " Your speaking rate could not be accurately measured from this sample."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Pauses and Rhythm</h3>
        {analysis.linguisticPerformance?.pauseAnalysis?.totalPauses > 0 ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Pauses</p>
                <p className="text-xl font-bold">{analysis.linguisticPerformance.pauseAnalysis.totalPauses}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Pause Duration</p>
                <p className="text-xl font-bold">
                  {analysis.linguisticPerformance.pauseAnalysis.averagePauseDuration || 0}s
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              {analysis.linguisticPerformance.pauseAnalysis.pauseImpactFeedback ||
                "No detailed feedback available on your pausing patterns."}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            Pause analysis is not available for this recording. For more accurate analysis, try recording a longer
            sample.
          </p>
        )}
      </div>
    </div>
  );

  const renderStructureTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Sentence Structure</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Sentences</span>
            <span className="text-lg font-bold text-gray-900">
              {analysis.comparisonData?.sentenceAnalysis?.totalSentences || 0}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-500">Coherence</span>
              <span className="text-sm font-medium text-gray-700">
                {analysis.comparisonData?.sentenceAnalysis?.structureDetails?.coherenceScore || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${analysis.comparisonData?.sentenceAnalysis?.structureDetails?.coherenceScore || 0}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-500">Grammatical Accuracy</span>
              <span className="text-sm font-medium text-gray-700">
                {analysis.comparisonData?.sentenceAnalysis?.structureDetails?.grammaticalAccuracyScore || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    analysis.comparisonData?.sentenceAnalysis?.structureDetails?.grammaticalAccuracyScore || 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-500">Flow Rating</span>
              <span className="text-sm font-medium text-gray-700">
                {analysis.comparisonData?.sentenceAnalysis?.structureDetails?.flowRating || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${analysis.comparisonData?.sentenceAnalysis?.structureDetails?.flowRating || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Structure Assessment</h4>
          <p className="text-gray-600">
            {analysis.comparisonData?.sentenceAnalysis?.structureDetails?.feedback ||
              "Insufficient data for comprehensive sentence analysis."}
          </p>
        </div>
      </div>
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Comprehensive Feedback</h3>
        {analysis.feedback ? (
          <div className="whitespace-pre-line text-gray-700">{analysis.feedback}</div>
        ) : (
          <p className="text-gray-500">No detailed feedback available for this recording.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">Strengths</h3>
          {analysis.strengths && analysis.strengths.length > 0 ? (
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No strengths identified in this analysis.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Areas of Improvement</h3>
          {analysis.improvementAreas && analysis.improvementAreas.length > 0 ? (
            <ul className="space-y-2">
              {analysis.improvementAreas.map((area, index) => (
                <li key={index} className="flex items-start">
                  <ArrowUpRight className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No improvement areas identified in this analysis.</p>
          )}
        </div>
      </div>
    </div>
  );

  // Main render function
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* Tab navigation */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto">
        {Object.entries(categoryStyles).map(([key, { color, icon: Icon }]) => (
          <button
            key={key}
            className={`
              pb-3 px-4 flex items-center 
              ${activeTab === key ? `border-b-2 border-blue-600 ${color} font-medium` : "text-gray-500"}
              hover:text-gray-700 transition-colors
            `}
            onClick={() => setActiveTab(key as any)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {key.charAt(0).toUpperCase() + key.slice(1).replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && renderOverviewTab()}
      {activeTab === "transcription" && renderTranscriptionTab()}
      {activeTab === "pronunciation" && renderPronunciationTab()}
      {activeTab === "pacing" && renderPacingTab()}
      {activeTab === "structure" && renderStructureTab()}
      {activeTab === "feedback" && renderFeedbackTab()}

      {/* Radar Chart - shows on all tabs */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={getRadarChartData()}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-4 text-center">
          This visualization represents your relative performance across key speaking dimensions.
          {analysis.speechRate === 0 && " Note: Some metrics could not be accurately measured from this sample."}
        </p>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
