// app/api/recordings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";

// Get all recordings for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    // Find user by Auth0 ID
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Get recordings for the user
    const recordings = await prisma.recording.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        analyses: {
          select: {
            id: true,
            createdAt: true,
            speechRate: true,
            confidenceScore: true,
          },
        },
      },
    });

    return NextResponse.json(recordings);
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// Create a new recording
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    // Find user by Auth0 ID
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Get request body
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.audioUrl || !body.duration) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Create new recording
    const recording = await prisma.recording.create({
      data: {
        title: body.title,
        description: body.description || "",
        audioUrl: body.audioUrl,
        duration: body.duration,
        type: body.type || "presentation",
        targetAudience: body.targetAudience || "general",
        isPublic: body.isPublic || false,
        userId: user.id,
      },
    });

    return NextResponse.json(recording, { status: 201 });
  } catch (error) {
    console.error("Error creating recording:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
