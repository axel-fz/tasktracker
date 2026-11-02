import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import AppToaster from "@/components/AppToaster";
import BackgroundCanvasAnimation from "@/components/BackgroundCanvasAnimation";
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
  title: "Task Tracker - Dashboard",
  description:
    "Production-grade task management dashboard built with Next.js, TypeScript, Tailwind CSS, and Mongoose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('tasktracker_theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0b111e] text-[#f8fafc] antialiased relative">
        <ThemeProvider>
          <BackgroundCanvasAnimation />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
