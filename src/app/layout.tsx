import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  title: "Bitcoin to Euro Conversion | Real-time BTC/EUR Price | bitcointoeuro.com",
  description: "Convert Bitcoin to Euro with real-time exchange rates. Get accurate BTC to EUR price data, conversion tools, and trusted exchange information.",
  keywords: ["bitcoin", "euro", "btc to eur", "bitcoin price", "cryptocurrency conversion", "btc/eur exchange rate"],
  authors: [{ name: "bitcointoeuro.com" }],
  creator: "bitcointoeuro.com",
  publisher: "bitcointoeuro.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bitcointoeuro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bitcoin to Euro Conversion | Real-time BTC/EUR Price",
    description: "Convert Bitcoin to Euro with real-time exchange rates. Get accurate BTC to EUR price data, conversion tools, and trusted exchange information.",
    url: "https://bitcointoeuro.com",
    siteName: "bitcointoeuro.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin to Euro Conversion | Real-time BTC/EUR Price",
    description: "Convert Bitcoin to Euro with real-time exchange rates. Get accurate BTC to EUR price data and trusted exchange information.",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <meta name="robots" content="noindex, follow, nocache" />
        <meta name="X-Robots-Tag" content="noindex, follow, nocache" />
        <meta name="googlebot" content="noindex, follow, nocache" />
        <meta name="Anthropic-Robots" content="noindex, nocache" />
        <meta name="OpenAI-Robots" content="noindex, nocache" />
        <meta name="AI-Robots" content="noindex, nocache" />
      </head>
      <body style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        <Header />
        <main style={{ 
          flex: '1 1 auto',
          backgroundColor: 'var(--background)',
          position: 'relative'
        }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
