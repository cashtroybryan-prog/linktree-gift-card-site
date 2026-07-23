"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";

type FormStatus = "idle" | "loading" | "error";

export default function LoginPage() {
  const params = useParams<{ country: string }>();
  const router = useRouter();

  const country =
    typeof params.country === "string"
      ? params.country.toLowerCase()
      : "us";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setStatus("error");
      setMessage("Enter your email address and password.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage("That email or password doesn’t look right.");
      return;
    }

const searchParams = new URLSearchParams(window.location.search);
const requestedNext = searchParams.get("next");

const nextPath =
  requestedNext &&
  requestedNext.startsWith("/") &&
  !requestedNext.startsWith("//")
    ? requestedNext
    : `/${country}/home`;

router.push(nextPath);
router.refresh();
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
          maxWidth: "460px",
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
          Welcome back
        </h1>

        <p
          style={{
            margin: "0 0 30px",
            color: "#676767",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          Log in to access your Linktree Wallet and manage your gifts.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "9px",
              color: "#000000",
              fontSize: "16px",
              fontWeight: 700,
            }}
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
            style={{
              boxSizing: "border-box",
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
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "9px",
              color: "#000000",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            style={{
              boxSizing: "border-box",
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
            }}
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
              marginTop: "22px",
              padding: "0 20px",
              border: 0,
              borderRadius: "999px",
              background: "#000000",
              color: "#ffffff",
              fontFamily: '"Link Sans", Arial, sans-serif',
              fontSize: "16px",
              fontWeight: 700,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.65 : 1,
            }}
          >
            {status === "loading" ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p
          style={{
            margin: "24px 0 0",
            color: "#676767",
            fontSize: "15px",
            textAlign: "center",
          }}
        >
          Don’t have an account?{" "}
          <Link
            href={`/${country}/signup`}
            style={{
              color: "#111111",
              fontWeight: 800,
              textDecoration: "underline",
            }}
          >
            Sign up free
          </Link>
        </p>

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
      </section>
    </main>
  );
}