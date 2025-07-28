import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { transcribeAudioWithAzure, analyzeTranscriptionWithAzure } from "@/lib/ai/azure-whisper-client";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log("Starting analysis for recording:", id);

  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user by Auth0 ID
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      include: {
        subscriptions: {
          where: {
            status: "active",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get recording
    const recording = await prisma.recording.findUnique({
      where: { id },
    });

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }

    // Authorization check
    if (recording.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Transcribe audio using Azure
    console.log("Transcribing audio with Azure API...");
    const transcriptionResult = await transcribeAudioWithAzure(recording.audioUrl);
    console.log("Transcription complete:", transcriptionResult.text.substring(0, 100) + "...");

    // Generate analysis from transcription using Azure
    console.log("Generating analysis from transcription...");
    const analysisResult = await analyzeTranscriptionWithAzure(transcriptionResult, {
      duration: recording.duration,
      type: recording.type,
      targetAudience: recording.targetAudience || "general",
    });
    console.log("Analysis generation complete");

    // Save analysis to database
    console.log("Saving analysis to database...");
    const analysis = await prisma.analysis.create({
      data: {
        recordingId: recording.id,
        transcription: analysisResult.transcription,
        speechRate: analysisResult.linguisticPerformance.wordsPerMinute,
        fillerWordsCount: analysisResult.linguisticPerformance.fillerWordAnalysis.totalFillerWords,
        tonality: {
          overall: analysisResult.linguisticPerformance.pauseAnalysis.totalPauses,
          variety: analysisResult.sentenceAnalysis.structureAssessment.flowRating,
        },
        confidenceScore: analysisResult.sentenceAnalysis.structureAssessment.coherenceScore,
        emotionAnalysis: {
          confidence: analysisResult.sentenceAnalysis.structureAssessment.coherenceScore,
          engagement: analysisResult.sentenceAnalysis.structureAssessment.grammaticalAccuracyScore,
        },
        improvementAreas: analysisResult.comprehensiveFeedback.improvementAreas,
        strengths: analysisResult.comprehensiveFeedback.strengths,
        feedback: analysisResult.comprehensiveFeedback.detailedRecommendations.join("\n"),
        // Save word timestamps for playback
        wordTimestamps: {
          perfectWords: analysisResult.wordAnalysis.wordTimestamps.perfectWords || [],
          minorIssueWords: analysisResult.wordAnalysis.wordTimestamps.minorIssueWords || [],
          significantErrorWords: analysisResult.wordAnalysis.wordTimestamps.significantErrorWords || [],
        },
        comparisonData: {
          wordAnalysis: {
            totalWords: analysisResult.wordAnalysis.totalWords,
            perfectWords: analysisResult.wordAnalysis.pronunciationBreakdown.perfectWords,
            minorIssueWords: analysisResult.wordAnalysis.pronunciationBreakdown.minorIssueWords,
            significantErrorWords: analysisResult.wordAnalysis.pronunciationBreakdown.significantErrorWords,
            overallPronunciationScore: analysisResult.wordAnalysis.overallPronunciationScore,
          },
          sentenceAnalysis: {
            totalSentences: analysisResult.sentenceAnalysis.totalSentences,
            structureDetails: analysisResult.sentenceAnalysis.structureAssessment,
          },
        },
      },
    });

    console.log("Analysis saved successfully:", analysis.id);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error analyzing recording:", error);

    // More specific error status codes based on error type
    if (error.message.includes("Transcription is too short")) {
      return NextResponse.json(
        {
          error: "Insufficient content",
          details: error.message,
        },
        { status: 422 }, // Unprocessable Entity
      );
    } else if (error.message.includes("Not authenticated") || error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          error: "Authentication error",
          details: error.message,
        },
        { status: 401 },
      );
    } else if (error.message.includes("Not found")) {
      return NextResponse.json(
        {
          error: "Resource not found",
          details: error.message,
        },
        { status: 404 },
      );
    } else {
      // Generic server error for other cases
      return NextResponse.json(
        {
          error: "Analysis failed",
          details: error.message,
        },
        { status: 500 },
      );
    }
  }
}
