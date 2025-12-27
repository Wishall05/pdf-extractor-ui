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
  title: "Motyl PDF Extractor | Free PDF to Text & Metadata API",
  description: "Extract text and metadata from PDF documents instantly with Motyl PDF Extractor. Powered by our high-performance RapidAPI endpoint. Developer-friendly JSON output.",
  keywords: ["PDF to Text", "PDF API", "Extract Text from PDF", "PDF Metadata", "RapidAPI", "Motyl", "Developer Tool"],
  openGraph: {
    title: "Motyl PDF Extractor | Free PDF to Text API",
    description: "Convert PDFs to text and extract metadata in seconds. Try the live demo now.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motyl PDF Extractor",
    description: "Convert PDFs to text and extract metadata in seconds. Try the live demo now.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
