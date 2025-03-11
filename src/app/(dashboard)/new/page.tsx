// app/(dashboard)/recordings/new/page.tsx
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import RecordingForm from "@/components/dashboard/RecordingForm";

async function getUserData() {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return null;
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
    return null;
  }

  // Check monthly recording limit for free users
  if (user.subscriptions.length > 0 && user.subscriptions[0].plan === "free") {
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

    return {
      user,
      limitReached: recordingsThisMonth >= 3,
    };
  }

  return {
    user,
    limitReached: false,
  };
}

export default async function NewRecordingPage() {
  const data = await getUserData();

  if (!data) {
    redirect("/login");
  }

  const { user, limitReached } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/recordings" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to recordings
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Recording</h1>
          <p className="text-gray-600 mt-1">Record your speech or upload an audio file for analysis</p>
        </div>

        {limitReached ? (
          <div className="px-6 py-5">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
              <h2 className="text-lg font-medium text-yellow-800 mb-2">Monthly Limit Reached</h2>
              <p className="text-yellow-700 mb-4">You've used all 3 of your free recordings this month.</p>
              <div className="mt-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-5">
            <RecordingForm />
          </div>
        )}
      </div>
    </div>
  );
}
