// app/(dashboard)/dashboard/page.tsx
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mic, Clock, ChevronRight, FileText, BarChart, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import RecordingsList from "@/components/dashboard/RecordingsList";
import IntercomInitializerProvider from "@/utils/IntercomInitializerProvider";

async function getDashboardData() {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return null;
  }

  // Find user by Auth0 ID
  const user = await prisma.user?.findUnique({
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
    return null;
  }

  // Get recent recordings
  const recentRecordings = await prisma.recording.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
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

  // Calculate summary statistics
  const totalRecordings = await prisma.recording.count({
    where: {
      userId: user.id,
    },
  });

  const totalAnalysisTime = await prisma.recording.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      duration: true,
    },
  });

  // Get monthly usage for free users
  let monthlyUsage = null;
  let monthlyLimit = null;

  if (!user.isPremium && user.subscriptions.length > 0 && user.subscriptions[0].plan === "free") {
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

    monthlyUsage = recordingsThisMonth;
    monthlyLimit = 3; // Free plan limit
  }

  return {
    user,
    recentRecordings,
    stats: {
      totalRecordings,
      totalAnalysisTime: totalAnalysisTime._sum.duration || 0,
      monthlyUsage,
      monthlyLimit,
    },
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  const { user, recentRecordings, stats } = data;
  const subscription = user.subscriptions.length > 0 ? user.subscriptions[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Recordings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 bg-opacity-80">
              <Mic className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Recordings</h2>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalRecordings}</p>
            </div>
          </div>
        </div>

        {/* Total Analysis Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 bg-opacity-80">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Analysis Time</h2>
              <p className="text-3xl font-semibold text-gray-900">{Math.floor(stats.totalAnalysisTime / 60)} min</p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                subscription?.plan === "premium" || user.isPremium ? "bg-purple-100" : "bg-gray-100"
              }`}
            >
              <svg
                className={`h-8 w-8 ${
                  subscription?.plan === "premium" || user.isPremium ? "text-purple-600" : "text-gray-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Subscription</h2>
              <p className="text-xl font-semibold text-gray-900 capitalize">
                {subscription?.plan === "premium" || user.isPremium ? "Premium" : subscription?.plan || "Free"}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Usage (for free users) */}
        {stats.monthlyUsage !== null && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 bg-opacity-80">
                <BarChart className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Monthly Usage</h2>
                <p className="text-3xl font-semibold text-gray-900">
                  {stats.monthlyUsage}/{stats.monthlyLimit}
                </p>
              </div>
            </div>
            {stats.monthlyUsage >= stats.monthlyLimit && (
              <div className="mt-4 bg-yellow-50 p-2 rounded text-sm text-yellow-800">
                <p>
                  You've reached your monthly limit.{" "}
                  <Link href="/pricing" className="font-medium hover:text-yellow-900">
                    Upgrade to Premium
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-8">
        <h2 className="text-xl font-semibold text-gray-900">Recent Recordings</h2>
        <div className="mt-3 sm:mt-0">
          <Link
            href="/recordings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recording
          </Link>
        </div>
      </div>

      {recentRecordings.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <RecordingsList recordings={recentRecordings} />

          {stats.totalRecordings > 5 && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  Showing <span className="font-medium">5</span> of{" "}
                  <span className="font-medium">{stats.totalRecordings}</span> recordings
                </div>
                <Link
                  href="/recordings"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recordings</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new recording</p>
          <div className="mt-6">
            <Link
              href="/recordings/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Recording
            </Link>
          </div>
        </div>
      )}

      {/* Quick Tips Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Speaking Tips</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium text-gray-900">Control Filler Words</h3>
            <p className="text-sm text-gray-500 mt-1">
              Practice pausing instead of using "um", "uh", or "like" to improve clarity and confidence.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium text-gray-900">Optimal Speaking Rate</h3>
            <p className="text-sm text-gray-500 mt-1">
              Aim for 150-160 words per minute for an engaging yet clear presentation pace.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium text-gray-900">Power of Pauses</h3>
            <p className="text-sm text-gray-500 mt-1">
              Strategic pauses give your audience time to absorb information and emphasize key points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
