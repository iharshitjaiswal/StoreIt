"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Detect route changes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Show loader when path changes
    const timeout = setTimeout(() => setLoading(false)); // Simulate loading delay

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [pathname]); // Runs every time pathname changes

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}
