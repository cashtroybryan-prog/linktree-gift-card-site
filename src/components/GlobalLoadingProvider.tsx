"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay";

type LoadingEventDetail = {
  message?: string;
};

type RequestLoadingRule = {
  stickyOnSuccess?: boolean;
  holdAfterSuccessMs?: number;
};

const START_EVENT = "app-loading-start";
const STOP_EVENT = "app-loading-stop";

function getRequestDetails(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  let requestUrl = "";

  if (typeof input === "string") {
    requestUrl = input;
  } else if (input instanceof URL) {
    requestUrl = input.href;
  } else {
    requestUrl = input.url;
  }

  const method = (
    init?.method ??
    (input instanceof Request ? input.method : "GET")
  ).toUpperCase();

  try {
    return {
      url: new URL(requestUrl, window.location.origin),
      method,
    };
  } catch {
    return null;
  }
}

function getLoadingRule(
  input: RequestInfo | URL,
  init?: RequestInit,
): RequestLoadingRule | null {
  const request = getRequestDetails(input, init);

  if (!request) {
    return null;
  }

  const { url, method } = request;
  const pathname = url.pathname;

  if (
    pathname === "/api/create-checkout-session"
  ) {
    return {
      stickyOnSuccess: true,
    };
  }

  if (pathname === "/api/wallet/remove") {
    return {
      holdAfterSuccessMs: 1200,
    };
  }

  if (pathname.startsWith("/api/orders/")) {
    return {};
  }

  if (pathname.includes("/rest/v1/orders")) {
    return {};
  }

  if (
    url.origin === window.location.origin &&
    pathname.startsWith("/api/") &&
    method !== "GET"
  ) {
    return {};
  }

  return null;
}

export default function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [loadingMessage, setLoadingMessage] =
    useState<string | null>(null);

  const activeRequestsRef = useRef(0);
  const stickyRef = useRef(false);
  const safetyTimerRef = useRef<number | null>(
    null,
  );

  useEffect(() => {
    const clearSafetyTimer = () => {
      if (safetyTimerRef.current !== null) {
        window.clearTimeout(
          safetyTimerRef.current,
        );

        safetyTimerRef.current = null;
      }
    };

    const startLoading = (
      message = "Loading...",
      sticky = false,
    ) => {
      if (sticky) {
        stickyRef.current = true;
      }

      setLoadingMessage(message);
      clearSafetyTimer();

      safetyTimerRef.current =
        window.setTimeout(() => {
          activeRequestsRef.current = 0;
          stickyRef.current = false;
          setLoadingMessage(null);
        }, 45000);
    };

    const stopLoading = (force = false) => {
      if (force) {
        activeRequestsRef.current = 0;
        stickyRef.current = false;
      }

      if (
        activeRequestsRef.current === 0 &&
        !stickyRef.current
      ) {
        clearSafetyTimer();
        setLoadingMessage(null);
      }
    };

    const handleLoadingStart = (event: Event) => {
      const customEvent =
        event as CustomEvent<LoadingEventDetail>;

      startLoading(
        customEvent.detail?.message ??
          "Loading...",
      );
    };

    const handleLoadingStop = () => {
      stopLoading(true);
    };

    const handleInternalLinkClick = (
      event: MouseEvent,
    ) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");

      if (
        !(anchor instanceof HTMLAnchorElement)
      ) {
        return;
      }

      if (
        anchor.hasAttribute("download") ||
        (anchor.target &&
          anchor.target !== "_self")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      let nextUrl: URL;

      try {
        nextUrl = new URL(
          anchor.href,
          window.location.href,
        );
      } catch {
        return;
      }

      const currentUrl = new URL(
        window.location.href,
      );

      if (
        nextUrl.origin !== currentUrl.origin ||
        nextUrl.href === currentUrl.href ||
        nextUrl.pathname ===
          currentUrl.pathname
      ) {
        return;
      }

      startLoading("Loading...", true);
    };

    const handlePopState = () => {
      startLoading("Loading...");

      window.setTimeout(() => {
        stopLoading(true);
      }, 2500);
    };

    const originalFetch =
      window.fetch.bind(window);

    const trackedFetch: typeof window.fetch =
      async (input, init) => {
        const rule = getLoadingRule(
          input,
          init,
        );

        if (!rule) {
          return originalFetch(input, init);
        }

        activeRequestsRef.current += 1;
        startLoading();

        try {
          const response = await originalFetch(
            input,
            init,
          );

          activeRequestsRef.current = Math.max(
            0,
            activeRequestsRef.current - 1,
          );

          if (
            response.ok &&
            rule.stickyOnSuccess
          ) {
            stickyRef.current = true;
            stopLoading();

            return response;
          }

          if (
            response.ok &&
            rule.holdAfterSuccessMs
          ) {
            window.setTimeout(() => {
              stopLoading();
            }, rule.holdAfterSuccessMs);

            return response;
          }

          stopLoading();

          return response;
        } catch (error) {
          activeRequestsRef.current = Math.max(
            0,
            activeRequestsRef.current - 1,
          );

          stickyRef.current = false;
          stopLoading();

          throw error;
        }
      };

    window.fetch = trackedFetch;

    window.addEventListener(
      START_EVENT,
      handleLoadingStart,
    );

    window.addEventListener(
      STOP_EVENT,
      handleLoadingStop,
    );

    document.addEventListener(
      "click",
      handleInternalLinkClick,
      true,
    );

    window.addEventListener(
      "popstate",
      handlePopState,
    );

    return () => {
      if (window.fetch === trackedFetch) {
        window.fetch = originalFetch;
      }

      clearSafetyTimer();

      window.removeEventListener(
        START_EVENT,
        handleLoadingStart,
      );

      window.removeEventListener(
        STOP_EVENT,
        handleLoadingStop,
      );

      document.removeEventListener(
        "click",
        handleInternalLinkClick,
        true,
      );

      window.removeEventListener(
        "popstate",
        handlePopState,
      );
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new Event(STOP_EVENT),
    );
  }, [pathname]);

  return (
    <>
      {children}

      {loadingMessage && (
        <LoadingOverlay
          message={loadingMessage}
        />
      )}
    </>
  );
}
