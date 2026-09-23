"use client";

import * as React from "react";
import { ErrorState } from "@/components/common/states";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Public route error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto py-24 px-4">
      <ErrorState
        title="Terjadi Kendala Memuat Halaman"
        description="Sistem sedang mengalami kendala saat memproses permintaan data Anda. Silakan coba kembali."
        onRetry={() => reset()}
      />
    </div>
  );
}
