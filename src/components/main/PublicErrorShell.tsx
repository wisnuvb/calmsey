import type { ReactNode } from "react";

export function PublicErrorShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pt-28 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
}

export function ErrorPageIntro({
  code,
  title,
  description,
}: {
  code?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      {code ? (
        <h1 className="text-6xl font-bold text-gray-900">{code}</h1>
      ) : null}
      <h2
        className={
          code
            ? "mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            : "text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        }
      >
        {title}
      </h2>
      <p className="mt-4 text-base text-gray-500">{description}</p>
    </div>
  );
}

/** Primary CTA — full width, blue (matches legacy not-found styling). */
export const errorPrimaryButtonClass =
  "inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700";

/** Secondary CTA — outline. */
export const errorSecondaryButtonClass =
  "inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50";
