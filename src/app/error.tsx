"use client";

import { useEffect } from "react";
import ErrorDiagnosticCard from "@/components/custom/ErrorDiagnosticCard";
import { brandingConfig } from "../lib/branding.config";

type ErrorWithDigest = Error & { digest?: string };

export default function ErrorPage({
  error,
  reset,
}: {
  error: ErrorWithDigest;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(`[${brandingConfig.appName} client route error]`, error);
  }, [error]);

  return (
    <ErrorDiagnosticCard
      title="Something failed while loading this page"
      description="Share this report with the developer to diagnose user-specific crashes that are difficult to reproduce."
      error={error}
      onRetry={reset}
    />
  );
}
