"use client";

import {
  ErrorPageIntro,
  PublicErrorShell,
  errorPrimaryButtonClass,
  errorSecondaryButtonClass,
} from "@/components/main/PublicErrorShell";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <PublicErrorShell>
      <ErrorPageIntro
        title="Something went wrong"
        description={`We're sorry — an unexpected error occurred. You can try again or return to the homepage.`}
      />

      {isDev && error.message ? (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-left text-sm text-red-800 break-words">
          {error.message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={reset}
          className={errorPrimaryButtonClass}
        >
          Try again
        </button>
        <Link href="/en" className={errorSecondaryButtonClass}>
          Go to homepage
        </Link>
      </div>
    </PublicErrorShell>
  );
}
