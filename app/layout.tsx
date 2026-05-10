import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "AI Spend Audit | Optimize Your Team's AI Costs",
  description:
    'Stop overpaying for AI tools. Get a deterministic audit for Cursor, Copilot, Claude, and more in 60 seconds.',
  openGraph: {
    title: 'AI Spend Audit | Personal Cost Optimization Report',
    description: 'We found potential savings in your AI tool stack. View the full breakdown.',
    url: 'https://tokens.credex.ai/audit',
    siteName: 'AI Spend Audit',
    images: [
      {
        url: 'https://tokens.credex.ai/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Spend Audit Results',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit | Optimize Your AI Costs',
    description: 'Stop overpaying for AI tools. Get a deterministic audit in 60 seconds.',
    images: ['https://tokens.credex.ai/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
