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
  title: "NOVA — Human Risk Intelligence",
  description:
    "NOVA Intelligence is a Human Risk Intelligence Platform that turns continuous multimodal data into coordinated action for caregivers, families, care organizations, and risk partners.",
  keywords:
    "human risk intelligence, risk intelligence platform, longitudinal risk modeling, multimodal data fusion, eldercare risk monitoring, device-agnostic risk platform, NOVA Intelligence, NOVA",
  openGraph: {
    title: "NOVA — Human Risk Intelligence",
    description:
      "One intelligence layer for everyone responsible for care — caregivers, families, care organizations, and risk partners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
