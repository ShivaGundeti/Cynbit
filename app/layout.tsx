import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cynbit Technologies | High-Performance Engineering & Careers",
  description: "Architecting scalable digital platforms, AI automation systems, and high-performance engineering labs.",
  icons: {
    icon: [
      { url: "https://www.cynbit.in/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["https://www.cynbit.in/logo.svg"],
    apple: [
      { url: "https://www.cynbit.in/logo.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="icon" href="https://www.cynbit.in/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="https://www.cynbit.in/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="https://www.cynbit.in/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans" style={{ fontFamily: "'Manrope', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
