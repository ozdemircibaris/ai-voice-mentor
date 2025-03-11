// app/page.tsx
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { Mic, Award, BarChart4, Book, Users, CheckCircle, Play } from "lucide-react";

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section - Modern design with wave pattern */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-blue-700 opacity-10 bg-opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 md:py-28 lg:py-32 flex flex-col lg:flex-row items-center">
            {/* Left content */}
            <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Elevate Your <span className="text-blue-200">Voice</span>. Master Your{" "}
                <span className="text-blue-200">Delivery</span>.
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-2xl">
                AI-powered speech coaching that analyzes your presentations, provides personalized feedback, and helps
                you become a more confident and effective speaker.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {!session ? (
                  <>
                    <a
                      href="/auth/login?screen_hint=signup&returnTo=/dashboard"
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-indigo-700 bg-white hover:bg-blue-50 transition-all duration-200"
                    >
                      Get Started Free
                    </a>
                    <a
                      href="/auth/login?returnTo=/dashboard"
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white/10 transition-all duration-200"
                    >
                      Sign In
                    </a>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-indigo-700 bg-white hover:bg-blue-50 transition-all duration-200"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>

              {/* Social proof */}
              <div className="mt-10 pt-6 border-t border-blue-500/30">
                <p className="text-blue-200 font-medium">Trusted by speakers worldwide</p>
                <div className="mt-3 flex items-center space-x-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full bg-blue-${
                          300 + i * 100
                        } flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-blue-100">
                    <span className="font-bold">4.9/5</span> from over 2,000 reviews
                  </div>
                </div>
              </div>
            </div>

            {/* Right content - Mockup */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Decorative elements */}
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-400 rounded-full filter blur-xl opacity-30"></div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-400 rounded-full filter blur-xl opacity-30"></div>

                {/* App screenshot/mockup */}
                <div className="relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Mic size={20} />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">Speech Analysis</h3>
                          <p className="text-sm text-gray-500">Recording in progress...</p>
                        </div>
                      </div>

                      {/* Audio wave visualization */}
                      <div className="flex items-center justify-center h-16 mb-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-blue-600 mx-1 w-2 rounded-full animate-pulse"
                            style={{
                              height: `${20 + Math.sin(i / 2) * 30}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          ></div>
                        ))}
                      </div>

                      <div className="text-center font-mono text-xl font-bold text-gray-700">00:45</div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">Real-time Insights</h4>
                        <span className="text-xs text-blue-600 font-medium">LIVE</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-yellow-700">
                          <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                          Speaking pace: 175 wpm (slightly fast)
                        </li>
                        <li className="flex items-center text-green-700">
                          <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                          Good vocal variety
                        </li>
                        <li className="flex items-center text-red-700">
                          <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                          Filler word detected: "um" (4 times)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave-shaped divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path
              d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 70C1248 80 1344 100 1392 110L1440 120V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V120Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              How it Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Three Simple Steps to Improve Your Speaking Skills
            </h2>
            <p className="text-xl text-gray-500">
              Our AI-powered platform makes it easy to get valuable feedback on your presentations and speeches.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Mic className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Record Your Speech</h3>
                <p className="text-gray-600">
                  Use our app to record your presentation or upload an existing audio file of your speech.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <BarChart4 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes your speech patterns, tone, pacing, filler words, and overall delivery.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Personalized Feedback</h3>
                <p className="text-gray-600">
                  Receive detailed insights and actionable tips to improve your speaking skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Tabs */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Become a Better Speaker
            </h2>
            <p className="text-xl text-gray-500">
              Our comprehensive set of features helps you identify strengths and weaknesses in your speaking style.
            </p>
          </div>

          {/* Feature grid */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Speech Analysis</h3>
              <p className="text-gray-600">
                Comprehensive analysis of speaking pace, tone, pauses, filler words, and articulation clarity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Performance Metrics</h3>
              <p className="text-gray-600">
                Easy-to-understand charts and performance indicators with actionable insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Coaching</h3>
              <p className="text-gray-600">Tailored exercises and tips based on your specific areas for improvement.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Book className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your development over time with historical comparisons and achievement badges.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Feedback</h3>
              <p className="text-gray-600">
                Optionally share your recordings to get feedback from peers in the VoiceMentor community.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Play className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Mode</h3>
              <p className="text-gray-600">
                Prepare for your next speech with guided practice sessions and real-time feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-500">
              Don't just take our word for it — hear from people who have transformed their speaking skills.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.063 2.813a1.25 1.25 0 011.874 0l1.358 1.626c.175.21.433.333.708.333h1.747c.69 0 1.25.56 1.25 1.25v1.747c0 .275.124.533.334.708l1.625 1.358a1.25 1.25 0 010 1.874l-1.625 1.358a1.014 1.014 0 00-.334.708v1.747c0 .69-.56 1.25-1.25 1.25h-1.747a1.014 1.014 0 00-.708.334l-1.358 1.625a1.25 1.25 0 01-1.874 0l-1.358-1.625a1.014 1.014 0 00-.708-.334H4.25C3.56 16.25 3 15.69 3 15v-1.747a1.014 1.014 0 00-.334-.708L1.04 11.187a1.25 1.25 0 010-1.874l1.626-1.358c.21-.175.334-.433.334-.708V5.5c0-.69.56-1.25 1.25-1.25h1.747c.275 0 .533-.124.708-.333l1.358-1.626z" />
                </svg>
              </div>
              <div className="text-gray-600 mb-6">
                "VoiceMentor helped me overcome my fear of public speaking. The personalized feedback was eye-opening,
                and I saw improvement after just a few sessions."
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Jessica Davis</h4>
                  <p className="text-sm text-gray-500">Marketing Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.063 2.813a1.25 1.25 0 011.874 0l1.358 1.626c.175.21.433.333.708.333h1.747c.69 0 1.25.56 1.25 1.25v1.747c0 .275.124.533.334.708l1.625 1.358a1.25 1.25 0 010 1.874l-1.625 1.358a1.014 1.014 0 00-.334.708v1.747c0 .69-.56 1.25-1.25 1.25h-1.747a1.014 1.014 0 00-.708.334l-1.358 1.625a1.25 1.25 0 01-1.874 0l-1.358-1.625a1.014 1.014 0 00-.708-.334H4.25C3.56 16.25 3 15.69 3 15v-1.747a1.014 1.014 0 00-.334-.708L1.04 11.187a1.25 1.25 0 010-1.874l1.626-1.358c.21-.175.334-.433.334-.708V5.5c0-.69.56-1.25 1.25-1.25h1.747c.275 0 .533-.124.708-.333l1.358-1.626z" />
                </svg>
              </div>
              <div className="text-gray-600 mb-6">
                "As a sales professional, clear communication is everything. VoiceMentor identified my overuse of filler
                words and helped me sound more confident and authoritative."
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  MS
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Michael Smith</h4>
                  <p className="text-sm text-gray-500">Sales Director</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.063 2.813a1.25 1.25 0 011.874 0l1.358 1.626c.175.21.433.333.708.333h1.747c.69 0 1.25.56 1.25 1.25v1.747c0 .275.124.533.334.708l1.625 1.358a1.25 1.25 0 010 1.874l-1.625 1.358a1.014 1.014 0 00-.334.708v1.747c0 .69-.56 1.25-1.25 1.25h-1.747a1.014 1.014 0 00-.708.334l-1.358 1.625a1.25 1.25 0 01-1.874 0l-1.358-1.625a1.014 1.014 0 00-.708-.334H4.25C3.56 16.25 3 15.69 3 15v-1.747a1.014 1.014 0 00-.334-.708L1.04 11.187a1.25 1.25 0 010-1.874l1.626-1.358c.21-.175.334-.433.334-.708V5.5c0-.69.56-1.25 1.25-1.25h1.747c.275 0 .533-.124.708-.333l1.358-1.626z" />
                </svg>
              </div>
              <div className="text-gray-600 mb-6">
                "I needed to prepare for a conference talk, and VoiceMentor was the perfect coach. The visual metrics
                helped me understand exactly where I needed to improve."
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  AR
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Alex Rodriguez</h4>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section - Improved cards with feature lists */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Plans for Every Speaker</h2>
            <p className="text-xl text-gray-500">
              Whether you're an occasional presenter or a professional speaker, we have a plan that fits your needs.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-500 mb-6">Perfect for getting started</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-xl font-medium text-gray-500">/mo</span>
                </div>
                <a
                  href="/auth/login?screen_hint=signup&returnTo=/dashboard"
                  className="mt-8 block w-full py-3 px-4 rounded-lg text-center font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Start for Free
                </a>
              </div>

              <div className="p-8">
                <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {[
                    "3 recordings per month",
                    "Basic speech analysis",
                    "Up to 5 minutes per recording",
                    "Standard report",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Premium Plan - Highlighted */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-600 relative transform hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center text-sm font-medium py-1">
                MOST POPULAR
              </div>
              <div className="p-8 border-b border-gray-100 mt-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-500 mb-6">For serious improvement</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">$12</span>
                  <span className="text-xl font-medium text-gray-500">/mo</span>
                </div>
                <a
                  href="/auth/login?plan=premium"
                  className="mt-8 block w-full py-3 px-4 rounded-lg text-center font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Get Premium
                </a>
              </div>

              <div className="p-8">
                <h4 className="font-medium text-gray-900 mb-4">Everything in Free, plus:</h4>
                <ul className="space-y-3">
                  {[
                    "Unlimited recordings",
                    "Advanced speech analytics",
                    "Up to 30 minutes per recording",
                    "Personalized improvement plan",
                    "Progress tracking",
                    "Priority support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-500 mb-6">For teams and organizations</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">$49</span>
                  <span className="text-xl font-medium text-gray-500">/mo</span>
                </div>
                <Link
                  href="/contact"
                  className="mt-8 block w-full py-3 px-4 rounded-lg text-center font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>

              <div className="p-8">
                <h4 className="font-medium text-gray-900 mb-4">Everything in Premium, plus:</h4>
                <ul className="space-y-3">
                  {[
                    "Team management dashboard",
                    "Custom workshops and training",
                    "Dedicated account manager",
                    "Advanced analytics and reporting",
                    "Custom integrations",
                    "SOC 2 compliance",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-500 mb-12">Everything you need to know about VoiceMentor</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does VoiceMentor analyze my speech?",
                a: "VoiceMentor uses advanced AI algorithms to analyze various aspects of your speech, including pace, tone, clarity, filler words, and overall delivery. The system provides detailed metrics and actionable feedback to help you improve.",
              },
              {
                q: "Is my data secure and private?",
                a: "Yes, we take data privacy very seriously. Your recordings are encrypted and stored securely. We do not share your data with third parties, and you can delete your recordings at any time.",
              },
              {
                q: "Can I use VoiceMentor for languages other than English?",
                a: "Currently, VoiceMentor supports English (US, UK, Australia) with beta support for Spanish and French. We're actively working on adding more languages.",
              },
              {
                q: "How long does it take to analyze a recording?",
                a: "Most recordings are analyzed within 1-2 minutes, depending on the length of your speech. Premium users receive priority processing.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="absolute inset-0 bg-blue-700 opacity-10 bg-opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Elevate Your Speaking Skills?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of speakers who have transformed their communication skills with VoiceMentor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login?screen_hint=signup"
              className="px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors"
            >
              Start Your Free Trial
            </a>
            <Link
              href="/about"
              className="px-8 py-4 rounded-lg bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* End of page content */}
    </div>
  );
}
