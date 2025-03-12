import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { WordTimestamp } from "@/types/analysis";

export const geminiModel = google("gemini-2.0-pro-exp-02-05");

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Transcription result with word timestamps
interface TranscriptionResult {
  text: string;
  wordTimestamps: WordTimestamp[];
}

export async function transcribeAudio(audioFileUrl: string): Promise<TranscriptionResult> {
  try {
    console.log("Fetching audio from URL:", audioFileUrl);
    const audioResponse = await fetch(audioFileUrl);
    const audioBuffer = await audioResponse.arrayBuffer();
    const nodeBuffer = Buffer.from(audioBuffer);

    console.log("Uploading audio to Gemini...");
    const uploadResult = await fileManager.uploadFile(nodeBuffer, {
      mimeType: "audio/wav",
      displayName: "audio_recording.wav",
    });

    // For Gemini model
    const model = genAI.getGenerativeModel({
      // model: "gemini-2.0-flash",
      model: "gemini-2.0-pro-exp-02-05",
    });

    console.log("Requesting transcription with word timestamps...");
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
              text: 'Please transcribe this audio file with the highest accuracy. Include word-level timestamps. Format your response as JSON with this structure: {"transcription": "full text here", "words": [{"word": "example", "startTime": 1.2, "endTime": 1.5}, ...]}',
            },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    console.log("Transcription completed with timestamps");

    // Parse the response to extract timestamps
    // This is a simplified version - in production we'd need more robust parsing
    try {
      // Try to parse direct JSON response
      const parsedResponse = JSON.parse(responseText);
      if (parsedResponse.transcription && Array.isArray(parsedResponse.words)) {
        return {
          text: parsedResponse.transcription,
          wordTimestamps: parsedResponse.words,
        };
      }
    } catch (e) {
      // If direct parsing fails, try to extract JSON from text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedJson = JSON.parse(jsonMatch[0]);
          if (parsedJson.transcription && Array.isArray(parsedJson.words)) {
            return {
              text: parsedJson.transcription,
              wordTimestamps: parsedJson.words,
            };
          }
        } catch (e2) {
          console.error("Failed to parse JSON from response:", e2);
        }
      }
    }

    // Fallback: If we couldn't extract proper timestamps, return the text with empty timestamps
    console.warn("Could not extract word timestamps, returning text only");
    return {
      text: responseText.replace(/\{[\s\S]*\}/, "").trim(),
      wordTimestamps: [],
    };
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw error;
  }
}

export async function analyzeSpeech(
  transcriptionResult: TranscriptionResult,
  audioMetadata: {
    duration: number;
    type: string;
    targetAudience: string;
  },
): Promise<SpeechAnalysisResult> {
  try {
    const transcription = transcriptionResult.text;
    const wordTimestamps = transcriptionResult.wordTimestamps;

    // if (transcription.trim().split(/\s+/).length < 10) {
    //   return createFallbackAnalysis(transcription, wordTimestamps);
    // }
    const prompt = `
Advanced Linguistic Speech Analysis Request:

Transcript to analyze (verbatim): "${transcription}"
Speech Context:
- Duration: ${audioMetadata.duration} seconds
- Speech Type: ${audioMetadata.type}
- Target Audience: ${audioMetadata.targetAudience}

COMPREHENSIVE LINGUISTIC ANALYSIS REQUIREMENTS:

I. COUNTING METHODOLOGY (BE EXACT AND CONSISTENT):
- Total Words: Count each word in the transcript precisely. Split by whitespace and count non-empty tokens.
- Total Sentences: Count each grammatically complete sentence precisely. Split by periods, question marks, and exclamation points.
- All counting must be exact, consistent, and follow standardized linguistic definitions.

II. WORD-LEVEL ANALYSIS - STRICT PRONUNCIATION ASSESSMENT
- Apply the STRICTEST possible standards for pronunciation assessment with ZERO TOLERANCE for pronunciation errors
- For each word, critically evaluate exact phonetic pronunciation against standard norms
- Flag ANY deviation from standard pronunciation, no matter how minor
- Pay special attention to:
  * Vowel and consonant sounds that differ from standard pronunciation
  * Stress patterns on the wrong syllable
  * Subtle phonetic variations that indicate non-native or regional patterns
  * Blended or unclear articulation of any phoneme
- You must be INTENTIONALLY STRICT to provide maximum value to the speaker
- Do not be lenient or polite - identify ALL words with ANY pronunciation issues
- Categorize words into:
  * Perfectly pronounced (ONLY if 100% exact standard pronunciation)
  * Minor issues (any slight deviation from perfect pronunciation)
  * Significant errors (words that would be difficult for listeners to understand correctly)
- Even common words deserve scrutiny - do not assume they are pronounced correctly

III. SENTENCE-LEVEL ANALYSIS
- Assess sentence structure coherence
- Evaluate grammatical accuracy
- Analyze sentence flow and natural delivery
- Identify any unnatural pauses or disruptions

IV. PRONUNCIATION AND ARTICULATION
- Comprehensive pronunciation scoring
- Identify specific phonetic challenges
- Assess accent influence on clarity
- Determine areas of potential misunderstanding

V. LINGUISTIC PERFORMANCE METRICS
- Speaking rate (words per minute) - calculated as (total words / duration in seconds) * 60
- Pause frequency and duration
- Filler word usage
- Emotional tone variation

VI. DETAILED LINGUISTIC FEEDBACK
- Provide specific, constructive feedback
- Highlight strengths in linguistic delivery
- Offer targeted improvement suggestions

CRITICAL INSTRUCTIONS:
- Be completely deterministic and factual in your analysis
- Your analysis must be consistent if analyzing the same text multiple times
- Counts of words, sentences, etc. must be precise and follow standard rules
- Confidently provide scores based on objective linguistic criteria
- Your scores should reflect clear benchmarks (e.g., 95% means excellent, 50% means average)
- For pronunciation, err on the side of strictness - it's better to identify too many potential issues than too few

RESPONSE FORMAT REQUIREMENTS:

Return your analysis ONLY as a valid JSON object with this exact structure:
{
  "word_analysis": {
    "total_words": number,
    "pronunciation_breakdown": {
      "perfect_words": {
        "count": number,
        "words": string[]
      },
      "minor_issues": {
        "count": number,
        "words": string[],
        "feedback": string
      },
      "significant_errors": {
        "count": number,
        "words": string[],
        "feedback": string
      }
    },
    "overall_pronunciation_score": number
  },
  "sentence_analysis": {
    "total_sentences": number,
    "structure_assessment": {
      "coherence_score": number,
      "grammatical_accuracy_score": number,
      "flow_rating": number,
      "feedback": string
    }
  },
  "linguistic_performance": {
    "words_per_minute": number,
    "pause_analysis": {
      "total_pauses": number,
      "average_pause_duration": number,
      "pause_impact_feedback": string
    },
    "filler_word_analysis": {
      "total_filler_words": number,
      "filler_word_types": string[],
      "filler_word_feedback": string
    }
  },
  "comprehensive_feedback": {
    "strengths": string[],
    "improvement_areas": string[],
    "detailed_recommendations": string[]
  }
}

Return ONLY the JSON object with no additional text before or after.
`;

    // First attempt
    let response = await generateText({
      model: geminiModel,
      prompt: prompt,
      temperature: 0, // Setting to 0 to get deterministic results
      maxTokens: 2000,
    });

    try {
      // Improved JSON parsing
      let jsonString = response.text.trim();

      // If there seems to be text before or after the JSON, extract just the JSON part
      if (!jsonString.startsWith("{") || !jsonString.endsWith("}")) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        } else {
          throw new Error("No JSON found in response");
        }
      }

      const parsedAnalysis = JSON.parse(jsonString);

      // Validate that we have basic required fields
      if (!parsedAnalysis.word_analysis || !parsedAnalysis.sentence_analysis) {
        throw new Error("Required fields missing in analysis response");
      }

      return formatAnalysisResult(transcription, parsedAnalysis, wordTimestamps);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Raw response:", response.text);

      // If we couldn't parse the response properly, try one more time with an even clearer prompt
      const retryPrompt =
        prompt +
        "\n\nIMPORTANT: Respond with ONLY a valid JSON object. No introduction, no explanation, just the JSON.";

      response = await generateText({
        model: geminiModel,
        prompt: retryPrompt,
        temperature: 0,
        maxTokens: 2000,
      });

      try {
        let jsonString = response.text.trim();
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }

        const parsedAnalysis = JSON.parse(jsonString);
        return formatAnalysisResult(transcription, parsedAnalysis, wordTimestamps);
      } catch (secondError) {
        console.error("Failed to parse AI response on retry:", secondError);
        return createFallbackAnalysis(transcription, wordTimestamps);
      }
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return createFallbackAnalysis(transcription, []);
  }
}

// Associate word timestamps with the analysis results
function associateWordTimestamps(wordList: string[], allWordTimestamps: WordTimestamp[]): WordTimestamp[] {
  if (!allWordTimestamps || allWordTimestamps.length === 0) {
    return [];
  }

  // Create a map for faster lookups
  const wordMap = new Map<string, WordTimestamp[]>();

  allWordTimestamps.forEach((timestamp) => {
    if (!wordMap.has(timestamp.word)) {
      wordMap.set(timestamp.word, []);
    }
    wordMap.get(timestamp.word)!.push(timestamp);
  });

  // Find timestamps for each word in our list
  return wordList.map((word) => {
    // Try to find the word in our timestamps
    const matches = wordMap.get(word) || [];
    if (matches.length > 0) {
      // Take the first match and remove it from the map to avoid duplicates
      const match = matches.shift()!;
      return match;
    }

    // If no timestamp found, return placeholder
    return {
      word,
      startTime: 0,
      endTime: 0,
    };
  });
}

function formatAnalysisResult(
  transcription: string,
  parsedAnalysis: any,
  wordTimestamps: WordTimestamp[],
): SpeechAnalysisResult {
  // Get pronunciation issue words
  const perfectWords = parsedAnalysis.word_analysis?.pronunciation_breakdown?.perfect_words?.words || [];
  const minorIssueWords = parsedAnalysis.word_analysis?.pronunciation_breakdown?.minor_issues?.words || [];
  const significantErrorWords = parsedAnalysis.word_analysis?.pronunciation_breakdown?.significant_errors?.words || [];

  // Associate timestamps with problem words
  const perfectWordTimestamps = associateWordTimestamps(perfectWords, wordTimestamps);
  const minorIssueWordTimestamps = associateWordTimestamps(minorIssueWords, wordTimestamps);
  const significantErrorWordTimestamps = associateWordTimestamps(significantErrorWords, wordTimestamps);

  return {
    transcription: transcription,
    wordAnalysis: {
      totalWords: parsedAnalysis.word_analysis?.total_words || 0,
      pronunciationBreakdown: {
        perfectWords: perfectWords,
        minorIssueWords: minorIssueWords,
        significantErrorWords: significantErrorWords,
      },
      wordTimestamps: {
        perfectWords: perfectWordTimestamps,
        minorIssueWords: minorIssueWordTimestamps,
        significantErrorWords: significantErrorWordTimestamps,
      },
      overallPronunciationScore: parsedAnalysis.word_analysis?.overall_pronunciation_score || 0,
      pronunciationFeedback: {
        minorIssues: parsedAnalysis.word_analysis?.pronunciation_breakdown?.minor_issues?.feedback || "",
        significantErrors: parsedAnalysis.word_analysis?.pronunciation_breakdown?.significant_errors?.feedback || "",
      },
    },
    sentenceAnalysis: {
      totalSentences: parsedAnalysis.sentence_analysis?.total_sentences || 0,
      structureAssessment: {
        coherenceScore: parsedAnalysis.sentence_analysis?.structure_assessment?.coherence_score || 0,
        grammaticalAccuracyScore:
          parsedAnalysis.sentence_analysis?.structure_assessment?.grammatical_accuracy_score || 0,
        flowRating: parsedAnalysis.sentence_analysis?.structure_assessment?.flow_rating || 0,
        feedback: parsedAnalysis.sentence_analysis?.structure_assessment?.feedback || "",
      },
    },
    linguisticPerformance: {
      wordsPerMinute: parsedAnalysis.linguistic_performance?.words_per_minute || 0,
      pauseAnalysis: {
        totalPauses: parsedAnalysis.linguistic_performance?.pause_analysis?.total_pauses || 0,
        averagePauseDuration: parsedAnalysis.linguistic_performance?.pause_analysis?.average_pause_duration || 0,
        pauseImpactFeedback: parsedAnalysis.linguistic_performance?.pause_analysis?.pause_impact_feedback || "",
      },
      fillerWordAnalysis: {
        totalFillerWords: parsedAnalysis.linguistic_performance?.filler_word_analysis?.total_filler_words || 0,
        fillerWordTypes: parsedAnalysis.linguistic_performance?.filler_word_analysis?.filler_word_types || [],
        fillerWordFeedback: parsedAnalysis.linguistic_performance?.filler_word_analysis?.filler_word_feedback || "",
      },
    },
    comprehensiveFeedback: {
      strengths: parsedAnalysis.comprehensive_feedback?.strengths || [],
      improvementAreas: parsedAnalysis.comprehensive_feedback?.improvement_areas || [],
      detailedRecommendations: parsedAnalysis.comprehensive_feedback?.detailed_recommendations || [],
    },
  };
}

function createFallbackAnalysis(transcription: string, wordTimestamps: WordTimestamp[]): SpeechAnalysisResult {
  return {
    transcription: transcription,
    wordAnalysis: {
      totalWords: transcription.split(/\s+/).length,
      pronunciationBreakdown: {
        perfectWords: [],
        minorIssueWords: [],
        significantErrorWords: [],
      },
      wordTimestamps: {
        perfectWords: [],
        minorIssueWords: [],
        significantErrorWords: [],
      },
      overallPronunciationScore: 0,
      pronunciationFeedback: {
        minorIssues: "Unable to generate detailed pronunciation feedback",
        significantErrors: "Unable to generate detailed error analysis",
      },
    },
    sentenceAnalysis: {
      totalSentences: transcription.split(/[.!?]+/).length,
      structureAssessment: {
        coherenceScore: 0,
        grammaticalAccuracyScore: 0,
        flowRating: 0,
        feedback: "Insufficient data for comprehensive sentence analysis",
      },
    },
    linguisticPerformance: {
      wordsPerMinute: 0,
      pauseAnalysis: {
        totalPauses: 0,
        averagePauseDuration: 0,
        pauseImpactFeedback: "Unable to analyze pauses",
      },
      fillerWordAnalysis: {
        totalFillerWords: 0,
        fillerWordTypes: [],
        fillerWordFeedback: "Unable to analyze filler words",
      },
    },
    comprehensiveFeedback: {
      strengths: ["Basic speech structure maintained"],
      improvementAreas: ["Detailed analysis requires more comprehensive recording"],
      detailedRecommendations: [
        "Provide a longer speech sample",
        "Ensure clear audio recording",
        "Speak with consistent pace and clarity",
      ],
    },
  };
}

export interface SpeechAnalysisResult {
  transcription: string;
  wordAnalysis: {
    totalWords: number;
    pronunciationBreakdown: {
      perfectWords: string[];
      minorIssueWords: string[];
      significantErrorWords: string[];
    };
    wordTimestamps: {
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
