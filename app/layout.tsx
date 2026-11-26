import type { Metadata } from "next";
import { Manrope } from 'next/font/google';
import "./globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "Cynbit Technologies | High-Performance Engineering & Careers",
  description: "Architecting scalable digital platforms, AI automation systems, and high-performance engineering labs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.className} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
