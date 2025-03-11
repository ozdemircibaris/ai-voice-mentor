// src/lib/ai/gemini-client.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Gemini AI modelini oluştur
export const geminiModel = google("gemini-2.0-flash-exp");

// Google AI dosya yöneticisi ve API
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Ses dosyasını Gemini'ye yükler ve transcription oluşturur
 */
/**
 * Ses dosyasını Gemini'ye yükler ve transcription oluşturur
 */
export async function transcribeAudio(audioFileUrl: string): Promise<string> {
  try {
    console.log("Fetching audio from URL:", audioFileUrl);
    // Ses dosyasını al
    const audioResponse = await fetch(audioFileUrl);
    const audioBuffer = await audioResponse.arrayBuffer();

    // ArrayBuffer'ı Node.js Buffer'a çevir
    const nodeBuffer = Buffer.from(audioBuffer);

    // Dosyayı Gemini'ye yükle
    console.log("Uploading audio to Gemini...");
    const uploadResult = await fileManager.uploadFile(nodeBuffer, {
      mimeType: "audio/wav", // veya kullandığınız ses formatına göre
      displayName: "audio_recording.wav",
    });

    console.log("Audio uploaded successfully:", uploadResult.file.name);

    // Gemini modeli için konuşma modeli oluştur
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Transcription isteği oluştur
    console.log("Requesting transcription...");
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri,
              },
            },
            {
              text: "Please transcribe this audio file accurately. Include all speech, even if it's in a different language. If you detect a non-English language, please note the language in your response. Return the transcription with appropriate punctuation and paragraphs.",
            },
          ],
        },
      ],
    });

    // Yanıtı al
    const transcription = result.response.text();
    console.log("Transcription completed:", transcription.substring(0, 100) + "...");

    return transcription;
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw error;
  }
}

/**
 * Analiz sonuçları için Gemini API'yi çağırır
 */
export async function analyzeSpeech(
  transcription: string,
  audioMetadata: {
    duration: number;
    type: string;
    targetAudience: string;
  },
): Promise<SpeechAnalysisResult> {
  try {
    // Kısa transkripsiyon kontrolü
    if (transcription.trim().split(/\s+/).length < 10) {
      console.log("Transcription too short for meaningful analysis:", transcription);

      // Eğer transkripsiyon çok kısaysa, minimum varsayılan değerlerle sonuç oluştur
      return {
        speechRate: {
          wpm: transcription.trim().split(/\s+/).length,
          assessment: "The recording is too short for a complete analysis.",
        },
        fillerWords: { count: 0, mostCommon: [], assessment: "Not enough speech data to analyze filler words." },
        emotionalTone: {
          confidence: 50,
          enthusiasm: 50,
          assessment: "Brief recording detected, providing limited emotional tone analysis.",
        },
        contentClarity: { assessment: "The recording is too brief for a comprehensive clarity analysis." },
        strengths: ["Clear pronunciation of the provided words"],
        improvementAreas: ["Provide a longer speech sample for more detailed analysis"],
        recommendations: [
          "Record at least 30 seconds of speech for a full analysis",
          "Try to speak in complete sentences",
          "If recording in a non-English language, please note that our analysis works best with English content",
        ],
        overallScore: 50,
      };
    }

    // Dil tespiti ekleme (basit bir yaklaşım)
    let languagePrompt = "";
    if (!/^[a-zA-Z\s.,!?;:'"-]+$/.test(transcription)) {
      languagePrompt =
        "I notice the transcription may not be in English. First translate it to English, then analyze the translated content. ";
    }

    // Structured prompt hazırla
    const prompt = `
You are a professional speech coach who analyzes presentations and speeches to provide detailed feedback.

${languagePrompt}Analyze the following speech transcript:

Transcript: "${transcription}"

Speech Duration: ${audioMetadata.duration} seconds
Speech Type: ${audioMetadata.type}
Target Audience: ${audioMetadata.targetAudience}

Even if the transcript is very short or in a different language, try to provide a meaningful analysis. For short transcripts, focus on what is available and make reasonable estimates.

Please evaluate this speech in terms of:
1. Speech rate and fluency
2. Filler words usage (um, uh, like, etc.)
3. Emotional tone and confidence
4. Content clarity and structure
5. Strengths (at least 3)
6. Areas for improvement (at least 3)
7. Personalized recommendations for enhancement

Your response MUST be in valid JSON format with the following structure exactly:
{
  "speechRate": {
    "wpm": number,
    "assessment": string
  },
  "fillerWords": {
    "count": number,
    "mostCommon": string[],
    "assessment": string
  },
  "emotionalTone": {
    "confidence": number,
    "enthusiasm": number,
    "assessment": string
  },
  "contentClarity": {
    "assessment": string
  },
  "strengths": string[],
  "improvementAreas": string[],
  "recommendations": string[],
  "overallScore": number
}
`;
    // Gemini API'yi çağır
    const response = await generateText({
      model: geminiModel,
      prompt: prompt,
      temperature: 0.2,
      maxTokens: 1500,
    });

    try {
      // Backtick içine alınmış JSON yanıtını düzgün şekilde çıkar
      const jsonMatch = response.text.match(/```json\s*([\s\S]*?)\s*```/);
      let analysisResult;

      if (jsonMatch && jsonMatch[1]) {
        analysisResult = JSON.parse(jsonMatch[1]);
      } else {
        // Backtick yoksa normal JSON yapısını ara
        const plainJsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (plainJsonMatch) {
          analysisResult = JSON.parse(plainJsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from response");
        }
      }

      // Varsayılan değerler ekleme - zayıf veya boş değerler durumunda yedek
      return {
        speechRate: {
          wpm:
            analysisResult.speechRate?.wpm ||
            Math.max(60, Math.floor(transcription.split(/\s+/).length * (60 / audioMetadata.duration))),
          assessment: analysisResult.speechRate?.assessment || "Your speaking pace is acceptable.",
        },
        fillerWords: {
          count: analysisResult.fillerWords?.count || countFillerWords(transcription),
          mostCommon: analysisResult.fillerWords?.mostCommon || findFillerWords(transcription),
          assessment:
            analysisResult.fillerWords?.assessment || "Try to minimize filler words for more confident delivery.",
        },
        emotionalTone: {
          confidence: analysisResult.emotionalTone?.confidence || 65,
          enthusiasm: analysisResult.emotionalTone?.enthusiasm || 60,
          assessment: analysisResult.emotionalTone?.assessment || "Your tone conveys moderate confidence.",
        },
        contentClarity: {
          assessment: analysisResult.contentClarity?.assessment || "Your content is structured in a clear manner.",
        },
        strengths: analysisResult.strengths || generateStrengths(transcription),
        improvementAreas: analysisResult.improvementAreas || generateImprovementAreas(transcription),
        recommendations: analysisResult.recommendations || generateRecommendations(transcription, audioMetadata),
        overallScore: analysisResult.overallScore || Math.max(50, calculateBasicScore(transcription, audioMetadata)),
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      // Fallback yanıt - hiçbir şey çalışmazsa makul değerler
      return createFallbackAnalysis(transcription, audioMetadata);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Analiz sonuç tipi (aynı kalıyor)
export interface SpeechAnalysisResult {
  speechRate: {
    wpm: number;
    assessment: string;
  };
  fillerWords: {
    count: number;
    mostCommon: string[];
    assessment: string;
  };
  emotionalTone: {
    confidence: number;
    enthusiasm: number;
    assessment: string;
  };
  contentClarity: {
    assessment: string;
  };
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  overallScore: number;
}
