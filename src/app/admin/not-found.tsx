import {
  ErrorPageIntro,
  PublicErrorShell,
  errorPrimaryButtonClass,
  errorSecondaryButtonClass,
} from "@/components/main/PublicErrorShell";
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <PublicErrorShell>
      <ErrorPageIntro
        code="404"
        title="Page not found"
        description={`We couldn't find this admin page — it may have been moved or the link is wrong.`}
      />

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/admin" className={errorPrimaryButtonClass}>
          Back to admin dashboard
        </Link>
        <Link href="/admin/login" className={errorSecondaryButtonClass}>
          Admin sign in
        </Link>
      </div>
    </PublicErrorShell>
  );
}
