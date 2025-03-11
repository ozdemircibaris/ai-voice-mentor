// app/page.tsx
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { Mic, Award, BarChart4, Book, Users } from "lucide-react";

export default async function Home() {
  const session = await auth0.getSession();
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 w-full hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative z-10 py-16 md:py-28 lg:py-32">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Improve Your Public Speaking with AI
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                VoiceMentor analyzes your presentations and speeches, providing personalized feedback to help you become
                a more confident and effective speaker.
              </p>
              <div className="mt-10 flex space-x-4">
                {!session ? (
                  <>
                    <a
                      href="/auth/login?screen_hint=signup"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
                    >
                      Get Started Free
                    </a>
                    <a
                      href="/auth/login"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 bg-opacity-40 hover:bg-opacity-50"
                    >
                      Sign In
                    </a>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:block">
          <div className="h-full w-full bg-white bg-opacity-10 backdrop-blur-sm rounded-tl-3xl overflow-hidden">
            <div className="relative h-full">
              {/* Wave patterns or abstract shapes could go here */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Personal Speech Coach</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Get AI-powered insights that help you refine your communication skills.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Mic className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Advanced Speech Analysis</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our AI analyzes your speaking pace, tone, pauses, filler words, and more to provide comprehensive
                    feedback.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <BarChart4 className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Detailed Metrics</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get visual breakdowns of your speech patterns with easy-to-understand charts and performance
                    indicators.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Award className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Personalized Improvement Plan</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Receive tailored exercises and tips based on your specific areas for improvement.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Book className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Progress Tracking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Monitor your development over time with historical comparisons and achievement tracking.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Community Feedback</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Optionally share your recordings and get feedback from other users in the VoiceMentor community.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Practice Mode</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Prepare for your next big speech with guided practice sessions and real-time feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">Plans for every speaker</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              From occasional presenters to professional speakers, we have a plan that fits your needs.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Free</h2>
                <p className="mt-4 text-sm text-gray-500">Perfect for beginners or occasional speakers.</p>
                <p className="mt-8">
                  <span className="text-3xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Link
                  href="/signup"
                  className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700"
                >
                  Start for free
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">3 recordings per month</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Basic speech analysis</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Up to 5 minutes per recording</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border border-blue-600 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Premium</h2>
                <p className="mt-4 text-sm text-gray-500">
                  For professionals seeking to improve their speaking skills.
                </p>
                <p className="mt-8">
                  <span className="text-3xl font-extrabold text-gray-900">$12</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Link
                  href="/signup?plan=premium"
                  className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700"
                >
                  Start premium
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Unlimited recordings</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Advanced speech analytics</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Up to 30 minutes per recording</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Personalized improvement plan</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Enterprise</h2>
                <p className="mt-4 text-sm text-gray-500">For teams and organizations.</p>
                <p className="mt-8">
                  <span className="text-3xl font-extrabold text-gray-900">$49</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Link
                  href="/contact"
                  className="mt-8 block w-full bg-blue-100 border border-blue-600 rounded-md py-2 text-sm font-semibold text-blue-600 text-center hover:bg-blue-200"
                >
                  Contact sales
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Everything in Premium</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Team management dashboard</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Custom workshops and training</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Dedicated support</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Advanced analytics and reporting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to become a better speaker?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Start your journey today with VoiceMentor and transform your speaking skills.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </div>
  );
}
