export interface WordTimestamp {
  word: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

export interface Analysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  recordingId: string;
  transcription?: string;
  speechRate?: number;
  fillerWordsCount?: any;
  tonality?: any;
  confidenceScore?: number;
  emotionAnalysis?: any;
  improvementAreas?: string[];
  strengths?: string[];
  feedback?: string;
  comparisonData?: any;

  wordAnalysis?: {
    totalWords: number;
    pronunciationBreakdown: {
      perfectWords: string[];
      minorIssueWords: string[];
      significantErrorWords: string[];
    };
    wordTimestamps?: {
      perfectWords: WordTimestamp[];
      minorIssueWords: WordTimestamp[];
      significantErrorWords: WordTimestamp[];
    };
    overallPronunciationScore: number;
    pronunciationFeedback: {
      minorIssues: string;
      significantErrors: string;
    };
  };

  sentenceAnalysis?: {
    totalSentences: number;
    structureAssessment: {
      coherenceScore: number;
      grammaticalAccuracyScore: number;
      flowRating: number;
      feedback: string;
    };
  };

  linguisticPerformance?: {
    wordsPerMinute: number;
    pauseAnalysis: {
      totalPauses: number;
      averagePauseDuration: number;
      pauseImpactFeedback: string;
    };
    fillerWordAnalysis: {
      totalFillerWords: number;
      fillerWordTypes: string[];
      fillerWordFeedback: string;
    };
  };

  comprehensiveFeedback?: {
    strengths: string[];
    improvementAreas: string[];
    detailedRecommendations: string[];
  };
}
