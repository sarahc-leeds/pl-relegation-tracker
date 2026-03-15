import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://relegation-tracker.sarahc.tech"),
  title: "PL Relegation Tracker 2025/26 - Who's Going Down?",
  description:
    "Premier League 2025/26 relegation analysis: probabilities, remaining fixtures, and scenario modelling for the bottom 7 teams as of Matchday 30.",
  openGraph: {
    title: "PL Relegation Tracker 2025/26 - Who's Going Down?",
    description:
      "200,000 Monte Carlo simulations of every remaining fixture. Wolves & Burnley virtually certain; West Ham, Spurs & Forest battling for the final spot.",
    images: [{ url: "/football-stats-image.png", width: 1424, height: 752 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PL Relegation Tracker 2025/26 - Who's Going Down?",
    description:
      "200,000 Monte Carlo simulations of every remaining PL fixture. Who's going down?",
    images: ["/football-stats-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a1628] text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
