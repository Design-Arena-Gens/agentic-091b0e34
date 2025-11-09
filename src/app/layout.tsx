import type { Metadata } from "next";
import "./globals.css";

const title = "Multibagger Radar | AI-Driven Intrinsic Value Scanner";
const description =
  "Interactive multibagger stock screener with intrinsic value modeling, future value projections, and margin of safety analytics.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://agentic-091b0e34.vercel.app",
    siteName: "Multibagger Radar",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#05070f] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
