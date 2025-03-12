export interface Analysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  recordingId: string;
  transcription?: string;

  wordAnalysis: {
    totalWords: number;
    pronunciationBreakdown: {
      perfectWords: string[];
      minorIssueWords: string[];
      significantErrorWords: string[];
    };
    overallPronunciationScore: number;
    pronunciationFeedback: {
      minorIssues: string;
      significantErrors: string;
    };
  };

  sentenceAnalysis: {
    totalSentences: number;
    structureAssessment: {
      coherenceScore: number;
      grammaticalAccuracyScore: number;
      flowRating: number;
      feedback: string;
    };
  };

  linguisticPerformance: {
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

  comprehensiveFeedback: {
    strengths: string[];
    improvementAreas: string[];
    detailedRecommendations: string[];
  };
}
