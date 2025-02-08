import Cursor from "@/components/Cursor";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";

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
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Loader /> {/* Client component handles route changes */}
        <Cursor />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
