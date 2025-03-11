// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceMentor - AI-Powered Speech Coaching",
  description: "Improve your speaking skills with AI-powered speech analysis and personalized feedback.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
