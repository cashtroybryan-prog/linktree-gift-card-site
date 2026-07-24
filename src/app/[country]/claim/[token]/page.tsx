import "server-only";

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ClaimPageProps = {
  params: Promise<{
    country: string;
    token: string;
  }>;
};

type OrderRecord = {
  claimed_by: string | null;
  checkout_email: string | null;
  customer_email: string | null;
  recipient_email: string | null;
  recipient_type: string | null;
  product_title: string | null;
  gift_amount: string | null;
  currency: string | null;
};

const supportedCountries = ["us", "uk", "au", "nz", "ca"];

function getAdminConfiguration() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables.",
    );
  }

  const cleanSupabaseUrl = supabaseUrl
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/, "");

  return {
    ordersEndpoint:
      `${cleanSupabaseUrl}/rest/v1/orders`,
    serviceRoleKey,
  };
}

async function findOrderByToken(
  token: string,
): Promise<OrderRecord | null> {
  const {
    ordersEndpoint,
    serviceRoleKey,
  } = getAdminConfiguration();

  const fields = [
    "claimed_by",
    "checkout_email",
    "customer_email",
    "recipient_email",
    "recipient_type",
    "product_title",
    "gift_amount",
    "currency",
  ].join(",");

  const response = await fetch(
    `${ordersEndpoint}` +
      `?claim_token=eq.${encodeURIComponent(token)}` +
      `&select=${fields}` +
      `&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Could not retrieve gift: ${errorText}`,
    );
  }

  const orders = (await response.json()) as OrderRecord[];

  return orders[0] ?? null;
}

async function claimOrder(
  token: string,
  userId: string,
): Promise<OrderRecord | null> {
  const {
    ordersEndpoint,
    serviceRoleKey,
  } = getAdminConfiguration();

  const fields = [
    "claimed_by",
    "checkout_email",
    "customer_email",
    "recipient_email",
    "recipient_type",
    "product_title",
    "gift_amount",
    "currency",
  ].join(",");

  const response = await fetch(
    `${ordersEndpoint}` +
      `?claim_token=eq.${encodeURIComponent(token)}` +
      `&claimed_by=is.null` +
      `&select=${fields}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        claimed_by: userId,
        claimed_at: new Date().toISOString(),
        fulfilment_status: "claimed",
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Could not claim gift: ${errorText}`,
    );
  }

  const orders = (await response.json()) as OrderRecord[];

  return orders[0] ?? null;
}

function getDeliveryEmail(order: OrderRecord) {
  if (
    order.recipient_type === "someone" &&
    order.recipient_email
  ) {
    return order.recipient_email;
  }

  return order.checkout_email || order.customer_email;
}

function normaliseEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return "the original delivery email";
  }

  const visibleStart = name.slice(0, 2);

  return `${visibleStart}***@${domain}`;
}

function formatGiftValue(
  amount: string | null,
  currency: string | null,
) {
  if (!amount) {
    return null;
  }

  const currencyCode = currency?.toLowerCase();

  const prefix =
    currencyCode === "gbp"
      ? "£"
      : currencyCode === "aud"
        ? "AU$"
        : currencyCode === "nzd"
          ? "NZ$"
          : currencyCode === "cad"
            ? "CA$"
            : "US$";

  return `${prefix}${Number(amount).toFixed(2)}`;
}

export default async function ClaimPage({
  params,
}: ClaimPageProps) {
  const rawParams = await params;

  const country = rawParams.country.toLowerCase();
  const token = rawParams.token;

  const safeCountry = supportedCountries.includes(country)
    ? country
    : "us";

  const claimPath =
    `/${safeCountry}/claim/${encodeURIComponent(token)}`;

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={errorIconStyle}>!</div>

          <h1 style={titleStyle}>
            This claim link is invalid
          </h1>

          <p style={copyStyle}>
            Check that you opened the complete link from your
            gift email.
          </p>

          <Link
            href={`/${safeCountry}/home`}
            style={secondaryButtonStyle}
          >
            Return home
          </Link>
        </section>
      </main>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/${safeCountry}/signup?next=${encodeURIComponent(
        claimPath,
      )}`,
    );
  }

  const order = await findOrderByToken(token);

  if (!order) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={errorIconStyle}>!</div>

          <h1 style={titleStyle}>
            We couldn’t find this gift
          </h1>

          <p style={copyStyle}>
            The claim link may be incorrect or no longer
            available.
          </p>

          <Link
            href={`/${safeCountry}/home`}
            style={secondaryButtonStyle}
          >
            Return home
          </Link>
        </section>
      </main>
    );
  }

  const deliveryEmail = getDeliveryEmail(order);

  const signedInEmail = normaliseEmail(user.email);
  const expectedEmail = normaliseEmail(deliveryEmail);

  if (
    expectedEmail &&
    signedInEmail !== expectedEmail
  ) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={errorIconStyle}>!</div>

          <h1 style={titleStyle}>
            This gift belongs to another email
          </h1>

          <p style={copyStyle}>
            Please sign in using the email address that received
            the gift:
          </p>

          <p style={emailStyle}>
            {maskEmail(expectedEmail)}
          </p>

          <Link
            href={`/${country}/login?next=${encodeURIComponent(
    `/${country}/claim/${token}`,
  )}`}
            style={secondaryButtonStyle}
          >
            Sign in again
          </Link>
        </section>
      </main>
    );
  }

  if (
    order.claimed_by &&
    order.claimed_by !== user.id
  ) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={errorIconStyle}>!</div>

          <h1 style={titleStyle}>
            This gift has already been claimed
          </h1>

          <p style={copyStyle}>
            This claim link has already been used by another
            account.
          </p>

          <Link
            href={`/${safeCountry}/home`}
            style={secondaryButtonStyle}
          >
            Return home
          </Link>
        </section>
      </main>
    );
  }

  let claimedOrder = order;
  let wasAlreadyClaimed = order.claimed_by === user.id;

  if (!order.claimed_by) {
    const updatedOrder = await claimOrder(token, user.id);

    if (updatedOrder) {
      claimedOrder = updatedOrder;
    } else {
      const latestOrder = await findOrderByToken(token);

      if (latestOrder?.claimed_by === user.id) {
        claimedOrder = latestOrder;
        wasAlreadyClaimed = true;
      } else {
        return (
          <main style={pageStyle}>
            <section style={cardStyle}>
              <div style={errorIconStyle}>!</div>

              <h1 style={titleStyle}>
                You’ve already claimed this gift
              </h1>

              <p style={copyStyle}>
                The gift may have just been claimed by another
                account.
              </p>

              <Link
                href={`/${safeCountry}/home`}
                style={secondaryButtonStyle}
              >
                Return home
              </Link>
            </section>
          </main>
        );
      }
    }
  }

  const productTitle =
    claimedOrder.product_title || "Gift card";

  const giftValue = formatGiftValue(
    claimedOrder.gift_amount,
    claimedOrder.currency,
  );

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={successIconStyle}>✓</div>

        <p style={eyebrowStyle}>
          {wasAlreadyClaimed
            ? "Already in your wallet"
            : "Gift successfully claimed"}
        </p>

        <h1 style={titleStyle}>
          Your gift is ready
        </h1>

        <div style={giftSummaryStyle}>
          <p style={giftTitleStyle}>
            {productTitle}
          </p>

          {giftValue && (
            <p style={giftValueStyle}>
              {giftValue}
            </p>
          )}
        </div>

        <p style={copyStyle}>
          This gift card has been securely added to your
          account.
        </p>

        <Link
          href={`/${safeCountry}/wallet?claimed=1`}
          style={primaryButtonStyle}
        >
          View wallet
        </Link>

        <Link
          href={`/${safeCountry}/home`}
          style={textLinkStyle}
        >
          Return home
        </Link>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100svh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 20px",
  background: "#f4f4f0",
  fontFamily:
    '"Link Sans", Arial, Helvetica, sans-serif',
};

const cardStyle = {
  width: "100%",
  maxWidth: "520px",
  padding: "42px 30px",
  borderRadius: "30px",
  background: "#ffffff",
  textAlign: "center" as const,
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
};

const successIconStyle = {
  width: "68px",
  height: "68px",
  margin: "0 auto 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "#cbea19",
  color: "#111111",
  fontSize: "34px",
  fontWeight: 900,
};

const errorIconStyle = {
  width: "68px",
  height: "68px",
  margin: "0 auto 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "#f0f0ec",
  color: "#111111",
  fontSize: "34px",
  fontWeight: 900,
};

const eyebrowStyle = {
  margin: "0 0 10px",
  color: "#555555",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "1.2px",
  textTransform: "uppercase" as const,
};

const titleStyle = {
  margin: "0",
  color: "#111111",
  fontSize: "38px",
  lineHeight: 1,
  letterSpacing: "-1.5px",
};

const copyStyle = {
  margin: "22px auto",
  maxWidth: "390px",
  color: "#626262",
  fontSize: "16px",
  lineHeight: 1.5,
};

const emailStyle = {
  margin: "-8px 0 24px",
  color: "#111111",
  fontSize: "17px",
  fontWeight: 800,
};

const giftSummaryStyle = {
  margin: "28px 0 20px",
  padding: "24px",
  borderRadius: "22px",
  background: "#f4f4f0",
};

const giftTitleStyle = {
  margin: "0",
  color: "#111111",
  fontSize: "19px",
  fontWeight: 800,
};

const giftValueStyle = {
  margin: "9px 0 0",
  color: "#111111",
  fontSize: "30px",
  fontWeight: 900,
};

const primaryButtonStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: "26px",
  padding: "17px 24px",
  borderRadius: "999px",
  background: "#cbea19",
  color: "#111111",
  fontSize: "17px",
  fontWeight: 800,
  textDecoration: "none",
};

const secondaryButtonStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: "26px",
  padding: "17px 24px",
  borderRadius: "999px",
  background: "#111111",
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: 800,
  textDecoration: "none",
};

const textLinkStyle = {
  display: "inline-block",
  marginTop: "22px",
  color: "#111111",
  fontSize: "15px",
  fontWeight: 700,
  textDecoration: "underline",
};