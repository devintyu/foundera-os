import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/posthog";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foundera OS — AI Founder Operating System",
  description:
    "One person can now possess the power of a company. AI-powered business strategist, market analyst, offer architect, and founder mentor in one platform.",
  keywords: [
    "AI business",
    "founder tools",
    "one person company",
    "solopreneur",
    "AI strategy",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#0A0A0F] text-[#F8FAFC]">
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
