import type { Metadata } from "next";
import "./globals.css";
import AppNavigation from "@/components/app-navigation";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "ArcPlay — Gaming payments on Arc",
  description: "Explore gaming credits, try test USDC payments on Arc Testnet and create approval-based payment workflow drafts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><a href="#main-content" className="skip-link">Skip to content</a><AppNavigation /><main id="main-content" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main><Footer /></body>
    </html>
  );
}
