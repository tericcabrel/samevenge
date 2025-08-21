import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const url = process.env.NEXT_PUBLIC_APP_URL;
const title = 'AWS SAM Event Generator';
const description = 'Generate AWS SAM events for local testing';

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    images: [
      {
        alt: 'AWS SAM Event Generator',
        height: 720,
        url: `${url}/og.png`,
        width: 1280,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [
      {
        alt: title,
        height: 720,
        url: `${url}/og.png`,
        width: 1280,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      {process.env.NODE_ENV === 'production' && (
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="3938c37e-7f96-4f1b-ac2f-2844b2841a3d"
          strategy="beforeInteractive"
        />
      )}
    </html>
  );
}
