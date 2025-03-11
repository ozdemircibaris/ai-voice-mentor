// app/api/recordings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

// Get a specific recording by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Get recording by ID
    const recording = await prisma.recording.findUnique({
      where: {
        id,
      },
      include: {
        analyses: true,
      },
    });

    if (!recording) {
      return new NextResponse(JSON.stringify({ error: "Recording not found" }), { status: 404 });
    }

    // Check if the recording belongs to the user or is public
    if (recording.userId !== user.id && !recording.isPublic) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    return NextResponse.json(recording);
  } catch (error) {
    console.error("Error fetching recording:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// Update a recording
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

    // Get request body
    const body = await req.json();

    // Update recording
    const updatedRecording = await prisma.recording.update({
      where: {
        id,
      },
      data: {
        title: body.title !== undefined ? body.title : recording.title,
        description: body.description !== undefined ? body.description : recording.description,
        type: body.type !== undefined ? body.type : recording.type,
        targetAudience: body.targetAudience !== undefined ? body.targetAudience : recording.targetAudience,
        isPublic: body.isPublic !== undefined ? body.isPublic : recording.isPublic,
      },
    });

    return NextResponse.json(updatedRecording);
  } catch (error) {
    console.error("Error updating recording:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// Delete a recording
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

    // Delete recording (and all related analyses due to cascading delete)
    await prisma.recording.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting recording:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
