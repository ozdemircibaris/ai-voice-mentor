// app/(dashboard)/profile/page.tsx
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { User, Mail, CreditCard, Award, Save, Settings } from "lucide-react";
import prisma from "@/lib/prisma";

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

  // Get usage statistics
  const recordingsCount = await prisma.recording.count({
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

  return {
    user,
    subscription: user.subscriptions.length > 0 ? user.subscriptions[0] : null,
    stats: {
      recordingsCount,
      totalAnalysisTime: totalAnalysisTime._sum.duration || 0,
    },
  };
}

export default async function ProfilePage() {
  const data = await getUserData();

  if (!data) {
    redirect("/login");
  }

  const { user, subscription, stats } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 md:pr-6 mb-6 md:mb-0">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name || ""}
                      fill
                      sizes="(max-width: 80px) 80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="font-medium text-gray-900 mb-4">Account Details</div>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="capitalize">{subscription?.plan || "Free"} Plan</span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <Link
                href="/api/auth/logout"
                className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Account Overview</h2>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 mb-1">Current Plan</div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">{subscription?.plan || "Free"}</div>
                  {subscription?.plan !== "premium" && (
                    <Link href="/pricing" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Upgrade to Premium
                    </Link>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 mb-1">Total Recordings</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.recordingsCount}</div>
                  <Link href="/recordings" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    View all recordings
                  </Link>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 mb-1">Total Analysis Time</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor(stats.totalAnalysisTime / 60)} minutes
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
            </div>

            <div className="px-6 py-5">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={user.name || ""}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={user.email}
                      disabled
                      className="shadow-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email is managed through your account provider and cannot be changed here.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Subscription</h2>
            </div>

            <div className="px-6 py-5">
              {subscription ? (
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 capitalize">{subscription.plan} Plan</h3>
                      <p className="text-gray-500 mt-1">
                        {subscription.status === "active"
                          ? "Your subscription is active."
                          : subscription.status === "canceled"
                          ? "Your subscription has been canceled."
                          : "Your subscription is currently in trial period."}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                      {subscription.plan !== "premium" ? (
                        <Link
                          href="/pricing"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Upgrade
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Manage Subscription
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Subscription Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium capitalize">{subscription.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Started</div>
                        <div className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</div>
                      </div>
                      {subscription.endDate && (
                        <div>
                          <div className="text-sm text-gray-500">Ends</div>
                          <div className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You don't have an active subscription.</p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
