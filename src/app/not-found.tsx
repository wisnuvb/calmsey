import {
  ErrorPageIntro,
  PublicErrorShell,
  errorPrimaryButtonClass,
} from "@/components/main/PublicErrorShell";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <PublicErrorShell>
      <ErrorPageIntro
        code="404"
        title="Page not found"
        description={`Sorry, we couldn't find the page you're looking for.`}
      />

      <p className="mt-4 text-center text-sm text-gray-500">
        If you followed a link from another website, it may be incorrect or out
        of date.
      </p>

      <div className="mt-8">
        <Link href="/en" className={errorPrimaryButtonClass}>
          Go to homepage
        </Link>
      </div>
    </PublicErrorShell>
  );
}
