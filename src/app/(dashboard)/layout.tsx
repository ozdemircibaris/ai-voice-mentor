// app/(dashboard)/layout.tsx
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Menu, User, Bell } from "lucide-react";
import prisma from "@/lib/prisma";
import { Suspense } from "react";

async function getUserInfo() {
  const session = await auth0.getSession();

  if (!session) {
    return null;
  }

  // Find user by Auth0 ID
  const user = await prisma.user.findUnique({
    where: {
      auth0Id: session.user.sub,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      isPremium: true,
    },
  });

  return user;
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInfo();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-2xl font-bold text-blue-600">
                    VoiceMentor
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/recordings"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Recordings
                  </Link>
                  <Link
                    href="/recordings/new"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    New Recording
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.name || ""}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="block h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-6">
          <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Mobile menu, toggle classNamees based on menu state
const MobileMenu = ({ user }: { user: any }) => (
  <div className="sm:hidden">
    <div className="pt-2 pb-3 space-y-1">
      <Link
        href="/dashboard"
        className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        Dashboard
      </Link>
      <Link
        href="/recordings"
        className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        Recordings
      </Link>
      <Link
        href="/recordings/new"
        className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        New Recording
      </Link>
    </div>
    <div className="pt-4 pb-3 border-t border-gray-200">
      <div className="flex items-center px-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name || ""}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <div className="ml-3">
          <div className="text-base font-medium text-gray-800">{user.name}</div>
          <div className="text-sm font-medium text-gray-500">{user.email}</div>
        </div>
        <button
          type="button"
          className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <Link
          href="/profile"
          className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        >
          Your Profile
        </Link>
        <Link
          href="/settings"
          className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        >
          Settings
        </Link>
        <Link
          href="/auth/logout"
          className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        >
          Sign out
        </Link>
      </div>
    </div>
  </div>
);
