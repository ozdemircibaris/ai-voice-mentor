// components/dashboard/AnalysisDisplay.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ArrowUpRight, ArrowRight, AlertTriangle, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Analysis, Recording } from "@/types";

interface AnalysisDisplayProps {
  recording: Recording;
  analysis: Analysis;
}

const AnalysisDisplay = ({ recording, analysis }: AnalysisDisplayProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showTranscript, setShowTranscript] = useState(false);

  // Format data for charts
  const formatEmotionData = () => {
    if (!analysis.emotionAnalysis) return [];

    const emotions = analysis.emotionAnalysis as Record<string, number>;
    return Object.entries(emotions).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(value.toFixed(1)),
    }));
  };

  const formatFillerWordsData = () => {
    if (!analysis.fillerWordsCount) return [];

    const fillerWords = analysis.fillerWordsCount as Record<string, number>;
    return Object.entries(fillerWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
      }));
  };

  // Calculate speech quality score (0-100)
  const calculateQualityScore = () => {
    if (!analysis) return 0;

    // This is a simplified calculation for demonstration
    // In a real app, you would have a more sophisticated algorithm
    let score = analysis.confidenceScore || 0;

    // Adjust based on filler words (more filler words = lower score)
    const fillerWords = (analysis.fillerWordsCount as Record<string, number>) || {};
    const fillerWordsTotal = Object.values(fillerWords).reduce((a, b) => a + b, 0);
    const fillerWordsPerMinute = fillerWordsTotal / (recording.duration / 60);

    // Penalize for high filler words rate
    if (fillerWordsPerMinute > 10) score -= 20;
    else if (fillerWordsPerMinute > 5) score -= 10;

    // Adjust for speech rate (ideal is 150-160 wpm)
    const speechRate = analysis.speechRate || 0;
    if (speechRate < 100 || speechRate > 180) score -= 10;

    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, score));
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Speech Quality Score</div>
          <div className="text-4xl font-bold text-blue-600">{calculateQualityScore()}/100</div>
          <div className="text-sm text-gray-500 mt-2">Based on confidence, clarity, and pace</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Speech Rate</div>
          <div className="text-4xl font-bold text-blue-600">{analysis.speechRate?.toFixed(1) || 0}</div>
          <div className="text-sm text-gray-500 mt-2">Words per minute (WPM)</div>
          {analysis.speechRate && (
            <div
              className={`text-xs mt-2 ${
                analysis.speechRate < 120
                  ? "text-yellow-600"
                  : analysis.speechRate > 170
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {analysis.speechRate < 120
                ? "Consider speaking faster"
                : analysis.speechRate > 170
                ? "Consider slowing down"
                : "Great pace!"}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Filler Words</div>
          <div className="text-4xl font-bold text-blue-600">
            {Object.values((analysis.fillerWordsCount as Record<string, number>) || {}).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-gray-500 mt-2">Total filler words used</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Summary Feedback</h3>
        <p className="text-gray-700 mb-4">{analysis.feedback}</p>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-green-700 flex items-center">
              <Award className="mr-2" size={16} /> Strengths
            </h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-700">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-700 flex items-center">
              <AlertTriangle className="mr-2" size={16} /> Areas for Improvement
            </h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {analysis.improvementAreas.map((area, index) => (
                <li key={index} className="text-gray-700">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Emotion Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={formatEmotionData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Emotion" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Top Filler Words</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatFillerWordsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="word" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium">Transcription</h3>
          {showTranscript ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showTranscript && (
          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 max-h-96 overflow-y-auto">
            <p className="whitespace-pre-line">{analysis.transcription}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "detailed":
        return renderDetailedTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        <button
          className={`pb-3 px-1 ${
            activeTab === "overview" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`pb-3 px-1 ${
            activeTab === "detailed" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("detailed")}
        >
          Detailed Analysis
        </button>
      </div>

      {renderTab()}
    </div>
  );
};

export default AnalysisDisplay;
