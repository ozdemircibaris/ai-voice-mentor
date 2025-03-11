export interface Analysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  recordingId: string;
  transcription?: string;
  speechRate?: number;
  fillerWordsCount?: Record<string, number>;
  tonality?: Record<string, number>;
  confidenceScore?: number;
  emotionAnalysis?: Record<string, number>;
  improvementAreas: string[];
  strengths: string[];
  feedback?: string;
  comparisonData?: Record<string, any>;
}
