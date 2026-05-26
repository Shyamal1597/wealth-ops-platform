"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FoundationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to CSR page since they're now merged
    router.replace("/about/csr");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to CSR & Foundation page...</p>
    </div>
  );
}
