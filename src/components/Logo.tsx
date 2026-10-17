import { useState } from "react";

/**
 * Drop the real logo into /public/imagio-logo.svg and it shows up here.
 * Until then, a text wordmark is used as a placeholder.
 */
export default function Logo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src="/imagio-logo.svg"
        alt="Imagio"
        className={`h-30  w-auto ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={`text-2xl font-semibold tracking-tight ${className}`}>
      imagio<span className="text-accent">.</span>
    </span>
  );
}