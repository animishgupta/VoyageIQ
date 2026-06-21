"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * After OAuth (Google / Apple) completes, NextAuth redirects here.
 * We fetch the session from /api/auth/session (no next-auth/react import
 * needed — avoids Turbopack module-factory issues), then persist
 * name / email / avatar to localStorage and redirect to dashboard.
 */
export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let attempts = 0;

    const tryFetch = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();

        if (session?.user) {
          const { name, email, image } = session.user as {
            name?: string;
            email?: string;
            image?: string;
          };

          if (name)  localStorage.setItem("userName",     name);
          if (email) localStorage.setItem("userEmail",    email);
          if (image) localStorage.setItem("profilePhoto", image);
          localStorage.setItem("token", "oauth-session-active");

          window.dispatchEvent(new Event("userUpdated"));
          window.dispatchEvent(new Event("profilePhotoUpdated"));

          setStatus("done");
          window.location.href = "/dashboard";
        } else if (attempts < 5) {
          // Session may not be ready yet — retry up to 5 times
          attempts++;
          setTimeout(tryFetch, 600);
        } else {
          // No session after retries — go back to login
          setStatus("error");
          window.location.href = "/login";
        }
      } catch {
        if (attempts < 3) {
          attempts++;
          setTimeout(tryFetch, 800);
        } else {
          setStatus("error");
          window.location.href = "/login";
        }
      }
    };

    tryFetch();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-background text-foreground">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
        VIQ
      </div>

      {status === "error" ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-rose-500">Sign-in failed. Redirecting…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold">Completing sign-in…</p>
            <p className="text-xs text-neutral-400">Fetching your account details</p>
          </div>
        </div>
      )}
    </div>
  );
}
