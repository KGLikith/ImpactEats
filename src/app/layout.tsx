import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const font = DM_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ImpactEats",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${font.className} antialiased`}>
          {children}

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
