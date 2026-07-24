"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { createClient } from "@/lib/supabase/client";

type FormStatus = "idle" | "loading" | "sent" | "error";

export default function SignupPage() {
  const params = useParams<{ country: string }>();
  const router = useRouter();

  const country =
    typeof params.country === "string"
      ? params.country.toLowerCase()
      : "us";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [status, setStatus] = useState<FormStatus>("idle");
const [message, setMessage] = useState("");
const [isClaimingGift, setIsClaimingGift] =
  useState(false);

const [authNextPath, setAuthNextPath] =
  useState<string | null>(null);

  useEffect(() => {
    const requestedNext = new URLSearchParams(
      window.location.search,
    ).get("next");

    const safeNext =
      requestedNext &&
      requestedNext.startsWith("/") &&
      !requestedNext.startsWith("//")
        ? requestedNext
        : null;

    setAuthNextPath(safeNext);

    setIsClaimingGift(
      Boolean(safeNext?.includes("/claim/")),
    );
  }, []);

  const loginHref = authNextPath
    ? `/${country}/login?next=${encodeURIComponent(
        authNextPath,
      )}`
    : `/${country}/login`;

function getNextPath() {
  const requestedNext = new URLSearchParams(
    window.location.search,
  ).get("next");

  return requestedNext &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
    ? requestedNext
    : `/${country}/home`;
}

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setStatus("error");
      setMessage("Enter your name.");
      return;
    }

    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Enter your email address.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Your passwords do not match.");
      return;
    }

    setStatus("loading");
    setMessage("");

const nextPath = getNextPath();

const callbackUrl =
  `${window.location.origin}/${country}/auth/callback` +
  `?next=${encodeURIComponent(nextPath)}`;

    const supabase = createClient();

    window.dispatchEvent(
      new CustomEvent("app-loading-start"),
    );

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: callbackUrl,
        data: {
          full_name: normalizedName,
        },
      },
    });

    window.dispatchEvent(
      new Event("app-loading-stop"),
    );

    const accountAlreadyExists =
      error?.code === "user_already_exists" ||
      error?.code === "email_exists" ||
      error?.message
        ?.toLowerCase()
        .includes("already registered") ||
      data.user?.identities?.length === 0;

    if (accountAlreadyExists) {
      setStatus("error");
      setMessage(
        "An account already exists with this email. Please log in instead.",
      );
      return;
    }

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.push(nextPath);
      router.refresh();
      return;
    }

    setStatus("sent");
    setMessage(
      `We sent a confirmation email to ${normalizedEmail}.`,
    );
  }

  return (
<main
  className="auth-page"
  style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: '"Link Sans", Arial, sans-serif',
      }}
    >
<section
  className="auth-card"
  style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            marginBottom: "24px",
            color: "#111111",
            fontSize: "42px",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ✱
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            color: "#000000",
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-1.4px",
          }}
        >
          Create your account
        </h1>

        <p
          style={{
            margin: "0 0 30px",
            color: "#676767",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          Sign up to receive, save and manage gifts in your Linktree Wallet.
        </p>

        {status === "sent" ? (
          <div
            role="status"
            style={{
              padding: "22px",
              borderRadius: "18px",
              background: "#e9ffc7",
              color: "#173300",
              fontSize: "16px",
              lineHeight: 1.5,
            }}
          >
            <strong
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 800,
              }}
            >
              Check your inbox
            </strong>

            <div>{message}</div>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: "14px",
                lineHeight: 1.4,
              }}
            >
              Click the confirmation link to finish creating your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          <div
            aria-disabled="true"
            style={{
              position: "relative",
              width: "100%",
              minHeight: "64px",
              marginBottom: "24px",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              border: "2px solid #111111",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#111111",
              fontSize: "16px",
              fontWeight: 800,
              cursor: "default",
            }}
          >
            <span
              aria-hidden="true"
style={{
  fontSize: "26px",
  fontWeight: 900,
  lineHeight: 1,
}}
            >
              ✱
            </span>

            <span>
              Continue with Linktree
            </span>

          </div>

          <div
            style={{
              width: "100%",
              margin: "0 0 25px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#777777",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                height: "1px",
                flex: 1,
                background: "#dededb",
              }}
            />

            <span>or sign up with email</span>

            <span
              style={{
                height: "1px",
                flex: 1,
                background: "#dededb",
              }}
            />
          </div>
            <label style={labelStyle} htmlFor="fullName">
              Full name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />

            <label
              style={{
                ...labelStyle,
                marginTop: "20px",
              }}
              htmlFor="email"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />

            <label
              style={{
                ...labelStyle,
                marginTop: "20px",
              }}
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              style={inputStyle}
            />

            <label
              style={{
                ...labelStyle,
                marginTop: "20px",
              }}
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Enter your password again"
              style={inputStyle}
            />

            {status === "error" && (
              <p
                role="alert"
                style={{
                  margin: "14px 0 0",
                  color: "#b42318",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                width: "100%",
                minHeight: "54px",
                marginTop: "24px",
                padding: "0 20px",
                border: 0,
                borderRadius: "999px",
                background: "#000000",
                color: "#ffffff",
                fontFamily: '"Link Sans", Arial, sans-serif',
                fontSize: "16px",
                fontWeight: 700,
                cursor:
                  status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.65 : 1,
              }}
            >
{status === "loading"
  ? "Creating account..."
  : isClaimingGift
    ? (
                  <>
                    <span>
                      Sign up to receive your
                    </span>

                    <span className="claim-gift-card-line">
                      gift card!
                    </span>
                  </>
                )
    : "Sign up free"}
            </button>
          </form>
        )}

        <p
          style={{
            margin: "24px 0 0",
            color: "#676767",
            fontSize: "15px",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
<Link
  href={loginHref}
  onClick={(event) => {
    event.preventDefault();

    const nextPath = getNextPath();

    router.push(
      `/${country}/login?next=${encodeURIComponent(nextPath)}`,
    );
  }}
  style={{
    color: "#111111",
    fontWeight: 800,
    textDecoration: "underline",
  }}
>
  Log in
</Link>
        </p>

{!isClaimingGift && (
  <Link
    href={`/${country}/home`}
    style={{
      display: "block",
      marginTop: "20px",
      color: "#222222",
      fontSize: "16px",
      fontWeight: 600,
      textAlign: "center",
      textDecoration: "none",
    }}
  >
    Back to home
  </Link>
)}
      </section>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "9px",
  color: "#000000",
  fontSize: "16px",
  fontWeight: 700,
};

const inputStyle = {
  boxSizing: "border-box" as const,
  width: "100%",
  minHeight: "54px",
  padding: "0 16px",
  border: "1px solid #cfcfcf",
  borderRadius: "14px",
  outline: "none",
  background: "#ffffff",
  color: "#111111",
  fontFamily: '"Link Sans", Arial, sans-serif',
  fontSize: "16px",
};
