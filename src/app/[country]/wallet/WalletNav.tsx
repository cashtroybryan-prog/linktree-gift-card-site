"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { createClient } from "@/lib/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";

const countries = [
  {
    code: "US",
    label: "United States",
    flag: "🇺🇸",
  },
  {
    code: "UK",
    label: "United Kingdom",
    flag: "🇬🇧",
  },
  {
    code: "AU",
    label: "Australia",
    flag: "🇦🇺",
  },
  {
    code: "NZ",
    label: "New Zealand",
    flag: "🇳🇿",
  },
  {
    code: "CA",
    label: "Canada",
    flag: "🇨🇦",
  },
] as const;

type WalletNavProps = {
  country: string;
};

export default function WalletNav({
  country,
}: WalletNavProps) {
  const router = useRouter();

  const lastScrollTopRef = useRef(0);
  const navRef = useRef<HTMLElement | null>(null);
  const countryAreaRef =
    useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const currentCountry =
    countries.find(
      (item) =>
        item.code.toLowerCase() ===
        country.toLowerCase(),
    ) ?? countries[0];

  const [selectedCountry, setSelectedCountry] =
    useState(currentCountry);

  const [navHidden, setNavHidden] = useState(false);
  const [countryOpen, setCountryOpen] =
    useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const [isNavigating, startNavigation] =
    useTransition();

    const [countryToast, setCountryToast] =
  useState<string | null>(null);

  const countrySlug =
    selectedCountry.code.toLowerCase();

  const homePath = `/${countrySlug}/home`;
  const shopPath = `/${countrySlug}/shop`;
  const howPath = `/${countrySlug}/how-it-works`;
  const trackerPath =
    `/${countrySlug}/gift-tracker`;
  const walletPath = `/${countrySlug}/wallet`;

  useEffect(() => {
    setSelectedCountry(currentCountry);
  }, [country]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const previousScrollTop =
        lastScrollTopRef.current;

      if (scrollTop < previousScrollTop) {
        setNavHidden(false);
      }

      if (
        scrollTop > previousScrollTop &&
        scrollTop > 260
      ) {
        setNavHidden(true);
        setCountryOpen(false);
        setMobileMenuOpen(false);
      }

      if (scrollTop < 20) {
        setNavHidden(false);
      }

      lastScrollTopRef.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target = event.target as Node;

      if (
        countryOpen &&
        countryAreaRef.current &&
        !countryAreaRef.current.contains(target)
      ) {
        setCountryOpen(false);
      }

      if (
        mobileMenuOpen &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [countryOpen, mobileMenuOpen]);

useEffect(() => {
  return () => {
    if (toastTimerRef.current) {
      window.clearTimeout(
        toastTimerRef.current,
      );
    }
  };
}, []);

const navigateTo = (path: string) => {
  window.sessionStorage.removeItem(
    "wallet-country-toast",
  );

  if (toastTimerRef.current) {
    window.clearTimeout(
      toastTimerRef.current,
    );

    toastTimerRef.current = null;
  }

  setCountryToast(null);
  setCountryOpen(false);
  setMobileMenuOpen(false);

  startNavigation(() => {
    router.push(path);
  });
};

const triggerCountryToast = (
  nextCountry: (typeof countries)[number],
) => {
  if (toastTimerRef.current) {
    window.clearTimeout(
      toastTimerRef.current,
    );
  }

  setCountryToast(
    `Wallet updated to ${nextCountry.label} ${nextCountry.flag}`,
  );

  toastTimerRef.current = window.setTimeout(
    () => {
      setCountryToast(null);
      toastTimerRef.current = null;
    },
    1600,
  );
};

useEffect(() => {
  const savedToast = window.sessionStorage.getItem(
    "wallet-country-toast",
  );

  if (!savedToast) return;

  window.sessionStorage.removeItem(
    "wallet-country-toast",
  );

  try {
    const savedCountry = JSON.parse(savedToast) as {
      label: string;
      flag: string;
    };

    const matchingCountry = countries.find(
      (item) => item.label === savedCountry.label,
    );

    if (matchingCountry) {
      triggerCountryToast(matchingCountry);
    }
  } catch (error) {
    console.error(
      "Could not show wallet country toast:",
      error,
    );
  }
}, [country]);

const handleCountryChange = (
  nextCountry: (typeof countries)[number],
) => {
  setSelectedCountry(nextCountry);
  setCountryOpen(false);
  setMobileMenuOpen(false);

  window.sessionStorage.setItem(
    "wallet-country-toast",
    JSON.stringify({
      label: nextCountry.label,
      flag: nextCountry.flag,
    }),
  );

  startNavigation(() => {
    router.push(
      `/${nextCountry.code.toLowerCase()}/wallet`,
    );
  });
};

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setCountryOpen(false);
    setMobileMenuOpen(false);

    const supabase = createClient();

    const [{ error }] = await Promise.all([
      supabase.auth.signOut(),
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, 900);
      }),
    ]);

    if (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);

      alert(
        "Could not sign you out. Please try again.",
      );

      return;
    }

    router.push(homePath);
    router.refresh();

    window.setTimeout(() => {
      setIsSigningOut(false);
    }, 250);
  };

  return (
    <>
      {(isSigningOut || isNavigating) && (
        <LoadingOverlay
          message={
            isSigningOut
              ? "Signing out..."
              : "Loading..."
          }
        />
      )}

      {countryToast && (
  <div
    className="country-change-toast"
    role="status"
    aria-live="polite"
  >
    {countryToast}
  </div>
)}

      <header
        className={`linktree-nav-shell ${
          navHidden ? "nav-hidden" : ""
        }`}
      >
        <nav
          ref={navRef}
          className="linktree-nav"
          aria-label="Main navigation"
        >
          <button
            type="button"
            className={`mobile-menu-button ${
              mobileMenuOpen ? "is-open" : ""
            }`}
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              setCountryOpen(false);

              setMobileMenuOpen(
                (previous) => !previous,
              );
            }}
          >
            <span />
            <span />
            <span />
          </button>

          {mobileMenuOpen && (
            <div className="mobile-nav-menu">
              <button
                type="button"
                onClick={() => navigateTo(howPath)}
              >
                How it Works
              </button>

              <button
                type="button"
                onClick={() =>
                  navigateTo(trackerPath)
                }
              >
                Gift Tracker
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                Sign out
              </button>

              <button
                type="button"
                className="mobile-signup-menu-button"
                onClick={() =>
                  navigateTo(walletPath)
                }
              >
                View Wallet
              </button>
            </div>
          )}

          <a
            className="linktree-logo-link"
            href={homePath}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(homePath);
            }}
            aria-label="Go home"
          >
            <img
              className="linktree-logo"
              src="/images/linktree-logo.png"
              alt="Linktree"
            />

            <img
              className="linktree-mobile-logo"
              src="/images/linktree-icon.png"
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </a>

          <a
            className="linktree-nav-item shop-link"
            href={shopPath}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(shopPath);
            }}
          >
            Shop Gift Cards
          </a>

          <a
            className="linktree-nav-item how-link"
            href={howPath}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(howPath);
            }}
          >
            How it Works
          </a>

          <a
            className="linktree-nav-item tracker-link"
            href={trackerPath}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(trackerPath);
            }}
          >
            Gift Tracker
          </a>

          <div
            className="country-area"
            ref={countryAreaRef}
          >
            <button
              type="button"
              className="country-pill"
              onClick={() => {
                setMobileMenuOpen(false);

                setCountryOpen(
                  (previous) => !previous,
                );
              }}
            >
You are currently viewing your wallet in{" "}
{selectedCountry.label}{" "}
{selectedCountry.flag}
            </button>

            {countryOpen && (
              <div className="country-menu">
                {countries.map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    className={
                      item.code ===
                      selectedCountry.code
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      handleCountryChange(item)
                    }
                  >
                    <span>{item.label}</span>
                    <span>{item.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="login-button"
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            Sign out
          </button>

          <button
            className="signup-button"
            type="button"
            onClick={() => navigateTo(walletPath)}
          >
            View Wallet
          </button>
        </nav>
      </header>

      <style>{`
        .linktree-nav-shell,
        .linktree-nav-shell * {
          box-sizing: border-box;
          font-family:
            "Link Sans",
            Arial,
            Helvetica,
            sans-serif;
        }

        .linktree-nav-shell {
          position: fixed;
          left: 50vw;
          top: 3.1%;
          z-index: 999;
          width: 1220px;
          height: 76px;
          transform:
            translateX(-50%)
            translateY(0);
          transform-origin: top center;
          transition:
            transform 700ms ease-in-out;
        }

        .linktree-nav-shell.nav-hidden {
          transform:
            translateX(-50%)
            translateY(-160%);
        }

        .linktree-nav {
          position: relative;
          width: 1220px;
          height: 76px;
          border: 1px solid #ebebeb;
          border-radius: 38px;
          background: #ffffff;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.04),
            0 10px 18px rgba(0, 0, 0, 0.05),
            0 18px 56px rgba(0, 0, 0, 0.08);
        }

        .linktree-logo-link {
          position: absolute;
          left: 32px;
          top: 12px;
          width: 104px;
          height: 52px;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .linktree-logo {
          position: absolute;
          inset: 0;
          display: block;
          width: 104px;
          height: 52px;
          max-width: none;
          object-fit: contain;
        }

        .linktree-mobile-logo,
        .mobile-menu-button,
        .mobile-nav-menu {
          display: none;
        }

        .linktree-nav-item {
          position: absolute;
          top: 17px;
          height: 42px;
          margin: 0;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #000000;
          font-size: 14.5px;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }

        .linktree-nav-item:hover {
          background: #edeee9;
        }

        .shop-link {
          left: 155px;
          width: 154px;
        }

        .how-link {
          left: 310px;
          width: 136px;
        }

        .tracker-link {
          left: 448px;
          width: 128px;
        }

.country-area {
  position: absolute;
  left: 656px;
  top: 12px;
  width: 260px;
  height: 52px;
}

.country-pill {
  width: 260px;
  height: 52px;
          padding: 0 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 26px;
          background: #22451b;
          color: #ffffff;
          font-size: 12.8px;
          font-weight: 700;
          line-height: 1.14;
          letter-spacing: -0.1px;
          text-align: center;
          cursor: pointer;
        }

        .country-pill:hover {
          background: #183914;
        }

        .country-menu {
          position: absolute;
          left: 0;
          top: 60px;
          z-index: 40;
          width: 232px;
          padding: 8px;
          border: 1px solid #ebebeb;
          border-radius: 18px;
          background: #ffffff;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.04),
            0 10px 18px rgba(0, 0, 0, 0.06),
            0 18px 56px rgba(0, 0, 0, 0.12);
          animation: walletCountryMenuIn
            180ms ease both;
        }

        .country-menu button {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #111111;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .country-menu button:hover,
        .country-menu button.is-active {
          background: #edeee9;
        }

        .login-button {
          position: absolute;
          left: 936px;
          top: 16px;
          width: 82px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          background: #edeee9;
          color: #000000;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .login-button:hover {
          background: #e0e1dc;
        }

        .signup-button {
          position: absolute;
          left: 1030px;
          top: 15px;
          width: 138px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 23px;
          background: #000000;
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .signup-button:hover {
          transform: translateY(-1px);
        }

        .country-change-toast {
          position: fixed;
          left: 50%;
          top: 98px;
          z-index: 99999;
          min-width: 280px;
          height: 48px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #cbe534;
color: #000000;
font-family:
  "Link Sans",
  Arial,
  Helvetica,
  sans-serif;
font-size: 16px;
font-weight: 900;
          box-shadow:
            0 8px 18px rgba(0, 0, 0, 0.12),
            0 18px 56px rgba(0, 0, 0, 0.14);
          animation: walletCountryToastIn
            1600ms ease both;
          pointer-events: none;
        }

        .signout-loading-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation:
            walletSignoutOverlayIn
            180ms ease both;
        }

        .signout-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .signout-loading-spinner {
          width: 46px;
          height: 46px;
          border: 4px solid #ddddda;
          border-top-color: #111111;
          border-radius: 50%;
          animation:
            walletSignoutSpin
            700ms linear infinite;
        }

        .signout-loading-content p {
          margin: 0;
          color: #111111;
          font-size: 17px;
          font-weight: 800;
        }

        @keyframes walletCountryMenuIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes walletCountryToastIn {
          0% {
            opacity: 0;
            transform:
              translateX(-50%)
              translateY(-12px)
              scale(0.96);
          }

          14%,
          78% {
            opacity: 1;
            transform:
              translateX(-50%)
              translateY(0)
              scale(1);
          }

          100% {
            opacity: 0;
            transform:
              translateX(-50%)
              translateY(-8px)
              scale(0.98);
          }
        }

        @keyframes walletSignoutSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes walletSignoutOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @media (max-width: 1700px) and (min-width: 769px) {
          .linktree-nav-shell {
            transform:
              translateX(-50%)
              translateY(0)
              scale(1.02);
          }

          .linktree-nav-shell.nav-hidden {
            transform:
              translateX(-50%)
              translateY(-160%)
              scale(1.02);
          }
        }

        @media (min-width: 1701px) {
          .linktree-nav-shell {
            transform:
              translateX(-50%)
              translateY(0)
              scale(1.5);
          }

          .linktree-nav-shell.nav-hidden {
            transform:
              translateX(-50%)
              translateY(-160%)
              scale(1.5);
          }

          .country-change-toast {
            top: 135px;
            padding: 18px 30px;
            font-size: 24px;
          }
        }

        @media (max-width: 768px) {
          .linktree-nav-shell {
            position: fixed;
            left: 3.5398vw;
            right: auto;
            top: max(
              52px,
              calc(
                env(
                    safe-area-inset-top,
                    0px
                  ) + 12px
              )
            );
            width: 92.9204vw;
            max-width: none;
            height: 16.8142vw;
            transform: none;
            z-index: 999;
          }

          .linktree-nav-shell.nav-hidden {
            transform: translateY(-150%);
          }

          .linktree-nav {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            overflow: visible;
            border: 1px solid #ebebeb;
            border-radius: 11.0619vw;
            background: #ffffff;
            box-shadow: none;
          }

          .linktree-logo-link {
            position: absolute;
            display: block;
            left: 5.3097vw;
            top: 50%;
            width: 7.0796vw;
            height: 7.0796vw;
            padding: 0;
            margin: 0;
            transform: translateY(-50%);
            z-index: 5;
          }

          .linktree-logo {
            display: none;
          }

          .linktree-mobile-logo {
            position: absolute;
            display: block;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .linktree-nav-item,
          .login-button,
          .signup-button {
            display: none;
          }

          .linktree-nav-item.shop-link {
            position: absolute;
            display: flex;
            left: 15.9292vw;
            top: 50%;
            width: 25.6637vw;
            height: 4.4248vw;
            align-items: center;
            justify-content: flex-start;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: #111111;
            font-size: 3.0181vw;
            font-weight: 700;
            line-height: 1;
            letter-spacing: -0.04vw;
            transform: translateY(-50%);
            z-index: 5;
          }

          .country-area {
            position: absolute;
            display: block;
            left: 42.8053vw;
            top: 50%;
            width: 36.5vw;
            height: 7.7168vw;
            margin: 0;
            transform: translateY(-50%);
            z-index: 8;
          }

          .country-pill {
            width: 100%;
            height: 100%;
            padding: 0 2.6549vw;
            border-radius: 4.7938vw;
            font-size: 2.0066vw;
            font-weight: 600;
            line-height: 1.08;
            white-space: normal;
            overflow: hidden;
          }

          .mobile-menu-button {
            position: absolute;
            display: flex;
            right: 4.8673vw;
            top: 50%;
            width: 7.9646vw;
            height: 7.9646vw;
            padding: 0;
            border: 0;
            background: transparent;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.8849vw;
            transform: translateY(-50%);
            cursor: pointer;
            z-index: 20;
          }

          .mobile-menu-button span {
            display: block;
            width: 5.7522vw;
            height: 0.4425vw;
            min-height: 1px;
            border-radius: 999px;
            background: #111111;
            transition:
              transform 180ms ease,
              opacity 180ms ease;
          }

          .mobile-menu-button.is-open
            span:nth-child(1) {
            transform:
              translateY(1.3274vw)
              rotate(45deg);
          }

          .mobile-menu-button.is-open
            span:nth-child(2) {
            opacity: 0;
          }

          .mobile-menu-button.is-open
            span:nth-child(3) {
            transform:
              translateY(-1.3274vw)
              rotate(-45deg);
          }

          .country-menu {
            left: auto;
            right: 0;
            top: calc(100% + 2vw);
            width: 48vw;
            padding: 2vw;
            border-radius: 4vw;
          }

          .country-menu button {
            height: 10vw;
            border-radius: 2.5vw;
            font-size: 3.2vw;
          }

          .mobile-nav-menu {
            position: absolute;
            display: grid;
            right: 0;
            top: calc(100% + 2.6549vw);
            width: 56vw;
            padding: 2.6549vw;
            gap: 1.3274vw;
            border: 1px solid #ebebeb;
            border-radius: 4.4248vw;
            background: #ffffff;
            box-shadow:
              0 4vw 10vw
              rgba(0, 0, 0, 0.14);
            z-index: 30;
          }

          .mobile-nav-menu button {
            display: flex;
            width: 100%;
            height: 10.6195vw;
            align-items: center;
            padding: 0 3.5398vw;
            border: 0;
            border-radius: 3.0973vw;
            background: #f3f3f1;
            color: #111111;
            font-size: 3.5398vw;
            font-weight: 700;
            text-align: left;
          }

          .mobile-nav-menu
            .mobile-signup-menu-button {
            background: #22451b;
            color: #ffffff;
          }

          .country-change-toast {
            top: calc(
              max(
                  52px,
                  calc(
                    env(
                        safe-area-inset-top,
                        0px
                      ) + 12px
                  )
                ) + 19vw
            );
            width: auto;
            min-width: 58vw;
            max-width: 84vw;
            height: 11vw;
            padding: 0 5vw;
            border-radius: 999px;
            font-size: 3.2vw;
            white-space: nowrap;
          }
        }
      `}</style>
    </>
  );
}