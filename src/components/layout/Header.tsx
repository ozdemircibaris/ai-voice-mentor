// components/layout/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user, isLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-200 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
      style={{ width: "100%", left: 0, right: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10 w-full">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              VoiceMentor
            </Link>
          </div>

          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className={`bg-white rounded-md p-2 inline-flex items-center justify-center ${
                isScrolled ? "text-gray-400 hover:text-gray-500" : "text-white"
              } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="hidden md:flex space-x-10">
            <Link
              href="/#features"
              className={`${
                isScrolled ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"
              } font-medium`}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`${
                isScrolled ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"
              } font-medium`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`${
                isScrolled ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"
              } font-medium`}
            >
              About Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {isLoading ? (
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={`${
                    isScrolled ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"
                  } font-medium`}
                >
                  Dashboard
                </Link>
                <span className="h-6 border-l border-gray-300"></span>
                <Link
                  href="/auth/logout"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Out
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`whitespace-nowrap text-base font-medium ${
                    isScrolled ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/api/auth/login"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Link href="/" className="text-2xl font-bold text-blue-600">
                    VoiceMentor
                  </Link>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link
                    href="/#features"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">Features</span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">Pricing</span>
                  </Link>
                  <Link
                    href="/about"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">About Us</span>
                  </Link>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              {user ? (
                <div className="space-y-6">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/logout"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Link
                      href="/api/auth/login"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                      Already have an account?{" "}
                      <Link
                        href="/api/auth/login"
                        className="text-blue-600 hover:text-blue-500"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
