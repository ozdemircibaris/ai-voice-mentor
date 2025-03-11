// app/(dashboard)/recordings/[id]/page.tsx
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Play, Edit, Trash2, Clock, Calendar, Download } from "lucide-react";
import prisma from "@/lib/prisma";
import AnalysisDisplay from "@/components/dashboard/AnalysisDisplay";

interface RecordingPageProps {
  params: {
    id: string;
  };
}

async function getRecordingData(id: string) {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return null;
  }

  // Find user by Auth0 ID
  const user = await prisma.user.findUnique({
    where: {
      auth0Id: session.user.sub,
    },
  });

  if (!user) {
    return null;
  }

  // Get recording by ID
  const recording = await prisma.recording.findUnique({
    where: {
      id,
    },
    include: {
      analyses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!recording) {
    return null;
  }

  // Check if the recording belongs to the user or is public
  if (recording.userId !== user.id && !recording.isPublic) {
    return null;
  }

  return {
    user,
    recording,
    analysis: recording.analyses.length > 0 ? recording.analyses[0] : null,
  };
}

export default async function RecordingPage({ params }: RecordingPageProps) {
  const { id } = params;
  const data = await getRecordingData(id);

  if (!data) {
    notFound();
  }

  const { user, recording, analysis } = data;

  // Format date
  const recordingDate = new Date(recording.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/recordings" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to recordings
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{recording.title}</h1>
              <div className="flex flex-wrap items-center mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  {recording.type}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  {recording.targetAudience}
                </span>
                <div className="flex items-center text-sm text-gray-500 mt-1 md:mt-0 mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(recording.duration)}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1 md:mt-0">
                  <Calendar className="h-4 w-4 mr-1" />
                  {recordingDate}
                </div>
              </div>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-2">
              <Link
                href={`/recordings/${id}/edit`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {recording.description && (
            <div className="mt-3">
              <p className="text-gray-600">{recording.description}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Audio Recording</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <audio src={recording.audioUrl} controls className="w-full" />
            <div className="flex justify-end mt-2">
              <a
                href={recording.audioUrl}
                download
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Download className="h-4 w-4 mr-1" />
                Download audio
              </a>
            </div>
          </div>
        </div>

        {analysis ? (
          <div className="px-6 py-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
            <AnalysisDisplay recording={recording} analysis={analysis} />
          </div>
        ) : (
          <div className="px-6 py-5">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <h2 className="text-lg font-medium text-yellow-800">Analysis in Progress</h2>
              <p className="text-yellow-700 mt-1">
                We're analyzing your recording. This may take a few minutes. Refresh the page shortly to see your
                results.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
