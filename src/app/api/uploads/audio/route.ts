// src/app/api/uploads/audio/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await audioFile.arrayBuffer();

    // Create a safe user ID by removing characters that could cause issues in paths
    // Replace any non-alphanumeric characters with underscores
    const safeUserId = session.user.sub.replace(/[^a-zA-Z0-9]/g, "_");

    // Create a unique file name with the sanitized user ID
    const fileName = `${safeUserId}/${uuidv4()}.wav`;

    console.log("Uploading to Supabase with filename:", fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("audio-recordings").upload(fileName, arrayBuffer, {
      contentType: "audio/wav",
    });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: `Failed to upload audio: ${error.message}` }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("audio-recordings").getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      audioUrl: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    console.error("Error uploading audio:", error);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
