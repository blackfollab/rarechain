import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
// import { Banner } from "@/components/Banner";
import PrivyProviders from "@/components/Providers";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import "./globals.css";
// import { EnforceBNBChain } from "@/components/EnforceBNBChain";

// Google Fonts
const soraFont = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: "variable",
});
const spaceGroteskFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: "variable",
});

export const metadata: Metadata = {
  title: {
    template: "%s | RareChain",
    default: "RareChain | Acquire Nodes and Earn Rewards",
  },
  description:
    "Rare Chain Network allows you to purchase and operate Node Networks for a specified duration, earning rewards as commissions from your node.",
  keywords: [
    "Blockchain",
    "crypto",
    "web3 Affiliate Platform",
    "Rare Chain",
    "BNB",
    "affiliate platform",
    "blockchain Affiliate Platform",
    "crypto Affiliate Platform",
    "web3",
  ],
  category: "Blockchain",
  metadataBase: new URL("https://www.rarechain.io"),
  openGraph: {
    title: "Rare Chain",
    description: "Acquire Nodes and Earn Rewards",
    url: "https://www.rarechain.io",
    images: [
      {
        url: "/assets/images/logo.png",
        alt: "Rarechain Logo",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "RareChain",
    description: "Acquire Nodes and Earn Rewards.",
    images: [
      {
        url: "/assets/images/logo.png",
        alt: "Rarechain Logo",
        width: 1200,
        height: 630,
      },
    ],
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProviders>
      <html lang="en" className={`${soraFont.variable} ${spaceGroteskFont.variable}`}>
        <body className="antialiased bg-gray-900 text-gray-300 font-body overflow-clip-x">
          {/* <Banner />
          <Navbar /> */}
          {/* <EnforceBNBChain/> */}
          {children}
          {/* <Footer /> */}
        </body>
      </html>
    </PrivyProviders>
  );
}
