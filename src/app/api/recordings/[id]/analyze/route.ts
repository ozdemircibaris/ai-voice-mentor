// src/app/api/recordings/[id]/analyze/route.ts
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

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      include: {
        subscriptions: {
          /* ... */
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kaydı getir
    const recording = await prisma.recording.findUnique({
      where: { id },
    });

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }

    // Yetkilendirme kontrolü
    if (recording.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Abonelik kontrolü
    // ...

    // 1. Ses dosyasını metne çevir
    console.log("Transcribing audio...");
    const transcription = await transcribeAudio(recording.audioUrl);
    console.log("Transcription complete:", transcription.substring(0, 100) + "...");

    // 2. Metni Gemini AI ile analiz et
    console.log("Analyzing speech with Gemini AI...");
    const analysisResult = await analyzeSpeech(transcription, {
      duration: recording.duration,
      type: recording.type,
      targetAudience: recording.targetAudience || "general",
    });
    console.log("AI analysis complete");

    // 3. Analiz sonuçlarını veritabanına kaydet
    console.log("Saving analysis to database...");
    const analysis = await prisma.analysis.create({
      data: {
        recordingId: recording.id,
        transcription: transcription,
        speechRate: analysisResult.speechRate.wpm,
        fillerWordsCount: analysisResult.fillerWords.mostCommon.reduce((obj, word) => {
          obj[word] =
            analysisResult.fillerWords.count > 0
              ? Math.floor(analysisResult.fillerWords.count / analysisResult.fillerWords.mostCommon.length)
              : 0;
          return obj;
        }, {}),
        tonality: {
          formal: 0,
          friendly: 0,
          persuasive: 0,
          technical: 0,
        },
        confidenceScore: analysisResult.emotionalTone.confidence,
        emotionAnalysis: {
          confidence: analysisResult.emotionalTone.confidence,
          enthusiasm: analysisResult.emotionalTone.enthusiasm,
        },
        improvementAreas: analysisResult.improvementAreas,
        strengths: analysisResult.strengths,
        feedback: analysisResult.recommendations.join("\n\n"),
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
