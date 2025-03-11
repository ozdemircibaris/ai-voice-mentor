// src/app/api/recordings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";

// Get all recordings for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user by Auth0 ID
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create a new recording
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user by Auth0 ID
    let user = await prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub,
      },
    });

    if (!user) {
      // If the user doesn't exist, create them first
      try {
        console.log("User not found in database, creating user with Auth0 ID:", session.user.sub);
        const newUser = await prisma.user.create({
          data: {
            auth0Id: session.user.sub,
            email: session.user.email || "unknown@example.com",
            name: session.user.name || session.user.nickname || "Anonymous",
          },
        });
        console.log("User created:", newUser.id);
        user = newUser;
      } catch (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "Failed to create user record" }, { status: 500 });
      }
    }

    // Get request body
    const body = await req.json();
    console.log("Received recording data:", body);

    // Validate required fields
    if (!body.title || !body.audioUrl) {
      return NextResponse.json({ error: "Missing required fields: title and audioUrl are required" }, { status: 400 });
    }

    // Ensure duration is a number
    const duration = typeof body.duration === "number" ? body.duration : 0;

    // Create new recording
    console.log("Creating recording for user:", user.id);
    const recording = await prisma.recording.create({
      data: {
        title: body.title,
        description: body.description || "",
        audioUrl: body.audioUrl,
        duration: duration,
        type: body.type || "presentation",
        targetAudience: body.targetAudience || "general",
        isPublic: body.isPublic || false,
        userId: user.id,
      },
    });

    console.log("Recording created successfully:", recording.id);
    return NextResponse.json(recording, { status: 201 });
  } catch (error: any) {
    console.error("Error creating recording:", error);
    // Return more details about the error for debugging
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
