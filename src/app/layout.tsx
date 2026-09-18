import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Pgl — A Little Reminder of You",
  description: "A quiet, private space for your health, your peace and your worth.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f7",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let theme = "light";
  try {
    const { settings } = await getProfile();
    theme = settings.theme === "dark" ? "dark" : "light";
  } catch {
    // database may still be warming up on the very first request
  }
  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
