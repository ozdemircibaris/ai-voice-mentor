// app/api/recordings/[id]/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

// Mock data for demo purposes - in a real app, this would be connected to an AI service
function generateMockAnalysis(recording: any) {
  // Generate random data for demo
  const speechRate = Math.floor(Math.random() * (180 - 120) + 120);
  const confidenceScore = Math.floor(Math.random() * (95 - 60) + 60);

  // Generate mock filler words count
  const fillerWords = {
    um: Math.floor(Math.random() * 15),
    uh: Math.floor(Math.random() * 12),
    like: Math.floor(Math.random() * 20),
    "you know": Math.floor(Math.random() * 8),
    so: Math.floor(Math.random() * 18),
    actually: Math.floor(Math.random() * 7),
    basically: Math.floor(Math.random() * 5),
  };

  // Generate mock emotion analysis
  const emotionAnalysis = {
    confidence: Math.random() * (100 - 50) + 50,
    enthusiasm: Math.random() * (100 - 40) + 40,
    calmness: Math.random() * (100 - 60) + 60,
    authority: Math.random() * (100 - 30) + 30,
    engagement: Math.random() * (100 - 50) + 50,
  };

  // Generate mock tonality
  const tonality = {
    formal: Math.random() * 100,
    friendly: Math.random() * 100,
    persuasive: Math.random() * 100,
    technical: Math.random() * 100,
  };

  // Normalize the tonality values to sum to 100
  const tonalitySum = Object.values(tonality).reduce((sum, value) => sum + value, 0);
  Object.keys(tonality).forEach((key) => {
    tonality[key as keyof typeof tonality] = parseFloat(
      ((tonality[key as keyof typeof tonality] / tonalitySum) * 100).toFixed(1),
    );
  });

  // Generate mock strengths and improvement areas
  const possibleStrengths = [
    "Good pace and rhythm throughout most of the presentation",
    "Clear articulation of key points",
    "Effective use of pauses for emphasis",
    "Good energy level maintained throughout",
    "Natural tone and conversational delivery",
    "Strong opening that captured attention",
    "Clear structure with logical flow",
    "Concise explanations of complex topics",
  ];

  const possibleImprovements = [
    "Reduce filler words like 'um' and 'uh'",
    "Vary your tone more to emphasize key points",
    "Slow down during technical explanations",
    "Add more pauses after important points",
    "Increase volume slightly for better projection",
    "More vocal variety would enhance engagement",
    "Practice smoother transitions between topics",
    "Consider using more concrete examples",
    "Work on more confident closing statements",
  ];

  // Randomly select 3-4 strengths and improvements
  const strengths = [];
  const improvements = [];

  for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
    const randomStrengthIndex = Math.floor(Math.random() * possibleStrengths.length);
    if (!strengths.includes(possibleStrengths[randomStrengthIndex])) {
      strengths.push(possibleStrengths[randomStrengthIndex]);
    }

    const randomImprovementIndex = Math.floor(Math.random() * possibleImprovements.length);
    if (!improvements.includes(possibleImprovements[randomImprovementIndex])) {
      improvements.push(possibleImprovements[randomImprovementIndex]);
    }
  }

  // Generate mock feedback
  const feedback = `Your ${
    recording.type
  } shows several strengths, particularly in ${strengths[0].toLowerCase()} and ${strengths[1].toLowerCase()}. 
  
Your speech rate of ${speechRate} words per minute is ${
    speechRate < 130 ? "a bit slow" : speechRate > 160 ? "a bit fast" : "within the ideal range"
  } for effective communication. 

The analysis detected ${Object.values(fillerWords).reduce(
    (a, b) => a + b,
    0,
  )} filler words throughout your ${Math.floor(recording.duration / 60)} minute recording, with '${
    Object.entries(fillerWords).sort((a, b) => b[1] - a[1])[0][0]
  }' being most frequent.

To improve your delivery, focus on ${improvements[0].toLowerCase()} and ${improvements[1].toLowerCase()}. With practice on these areas, you can significantly enhance your speaking effectiveness.`;

  // Generate a mock transcription
  const mockWords = [
    "Thank you",
    "today",
    "I'd like to",
    "discuss",
    "share",
    "important",
    "key points",
    "consider",
    "first",
    "second",
    "third",
    "finally",
    "in conclusion",
    "um",
    "uh",
    "actually",
    "basically",
    "moving on",
    "next",
    "looking at",
    "as you can see",
    "what's interesting",
    "highlight",
    "emphasize",
    "critical",
    "essential",
    "valuable",
    "like",
    "you know",
    "so",
    "right",
    "now",
    "let me",
    "I think",
    "we should",
    "remember",
    "forget",
    "understand",
    "realize",
    "appreciate",
    "recognize",
  ];

  let transcription = "";
  const sentenceCount = 20 + Math.floor(Math.random() * 20);

  for (let i = 0; i < sentenceCount; i++) {
    let sentence = "";
    const wordCount = 5 + Math.floor(Math.random() * 10);

    for (let j = 0; j < wordCount; j++) {
      const word = mockWords[Math.floor(Math.random() * mockWords.length)];
      sentence += word + " ";
    }

    // Capitalize first letter and add period
    sentence = sentence.trim();
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". ";

    transcription += sentence;

    // Add paragraph breaks occasionally
    if (i % 5 === 4) {
      transcription += "\n\n";
    }
  }

  return {
    recordingId: recording.id,
    transcription,
    speechRate,
    fillerWordsCount: fillerWords,
    tonality,
    confidenceScore,
    emotionAnalysis,
    improvementAreas: improvements,
    strengths,
    feedback,
  };
}

// Analyze a recording
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    // Find user by Auth0 ID
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub,
      },
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
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Get recording by ID
    const recording = await prisma.recording.findUnique({
      where: {
        id,
      },
    });

    if (!recording) {
      return new NextResponse(JSON.stringify({ error: "Recording not found" }), { status: 404 });
    }

    // Check if the recording belongs to the user
    if (recording.userId !== user.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    // Check if user has active subscription
    const hasSubscription = user.subscriptions.length > 0;

    // For free users, check if they've exceeded their monthly limit
    if (!hasSubscription || user.subscriptions[0].plan === "free") {
      // Get current month's recordings count
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const recordingsThisMonth = await prisma.recording.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: thisMonth,
          },
        },
      });

      if (recordingsThisMonth > 3) {
        return new NextResponse(
          JSON.stringify({
            error: "Monthly limit exceeded",
            message:
              "Free users are limited to 3 analyses per month. Please upgrade to Premium for unlimited recordings.",
          }),
          { status: 403 },
        );
      }
    }

    // In a real application, this would call a speech analysis service
    // For demo purposes, we'll generate mock analysis data
    const analysisData = generateMockAnalysis(recording);

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: analysisData,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing recording:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
