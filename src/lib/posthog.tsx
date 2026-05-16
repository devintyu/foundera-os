"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, ReactNode } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key) {
      return;
    }

    posthog.init(key, {
      api_host: host || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          posthog.debug();
        }
      },
    });
  }, []);

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!key) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export { usePostHog };
