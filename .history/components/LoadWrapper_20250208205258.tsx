"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export default function LoaderWrapper() {
  const pathname = usePathname(); // Get current route
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Show loader when pathname changes

    const timeout = setTimeout(() => {
      setLoading(false); // Hide loader after a short delay (ensures smooth UI)
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [pathname]);

  return loading ? <Loader /> : null;
}
