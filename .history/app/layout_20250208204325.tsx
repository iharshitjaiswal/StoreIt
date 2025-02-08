"use client";

import Cursor from "@/components/Cursor";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Store It",
  description: "Free storage solution you need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Delay to make transition smoother
    return () => clearTimeout(timer);
  }, [pathname]); // Triggers when route changes

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {loading && <Loader />}
        <Cursor />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
