import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { transcribeAudio, analyzeSpeech } from "@/lib/ai/gemini-client";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Starting analysis for recording:", id);

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

    // Transcribe audio with word timestamps
    console.log("Transcribing audio with timestamps...");
    const transcriptionResult = await transcribeAudio(recording.audioUrl);
    console.log("Transcription complete:", transcriptionResult.text.substring(0, 100) + "...");
    console.log(`Received ${transcriptionResult.wordTimestamps.length} word timestamps`);

    // Analyze speech
    console.log("Analyzing speech with Gemini AI...");
    const analysisResult = await analyzeSpeech(transcriptionResult, {
      duration: recording.duration,
      type: recording.type,
      targetAudience: recording.targetAudience || "general",
    });
    console.log("AI analysis complete");

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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
