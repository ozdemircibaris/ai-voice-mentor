// app/(dashboard)/recordings/page.tsx
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search, ChevronDown } from "lucide-react";
import prisma from "@/lib/prisma";
import RecordingsList from "@/components/dashboard/RecordingsList";

async function getRecordings() {
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

  // Get all recordings for the user
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

  return {
    user,
    recordings,
  };
}

export default async function RecordingsPage() {
  const data = await getRecordings();

  if (!data) {
    redirect("/login");
  }

  const { user, recordings } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Recordings</h1>
          <p className="text-gray-600">Manage and analyze your speech recordings</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/recordings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recording
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search recordings..."
            />
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-3">
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                id="type-filter"
              >
                All Types
                <ChevronDown className="ml-2 h-5 w-5" />
              </button>
            </div>

            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                id="date-filter"
              >
                All Time
                <ChevronDown className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {recordings.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <RecordingsList recordings={recordings} />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings found</h3>
          <p className="text-gray-500 mb-6">You haven't created any recordings yet.</p>
          <Link
            href="/recordings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create your first recording
          </Link>
        </div>
      )}
    </div>
  );
}
