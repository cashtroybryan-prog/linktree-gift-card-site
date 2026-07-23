import WalletCard from "./WalletCard";
import WalletNav from "./WalletNav";
import "server-only";

import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type WalletPageProps = {
  params: Promise<{
    country: string;
  }>;
};

type WalletOrder = {
  stripe_session_id: string;
  product_id: string | null;
  product_title: string | null;
  gift_amount: string | null;
  amount_total: number | null;
  currency: string | null;
  gift_code: string | null;
  fulfilment_status: string | null;
  claimed_at: string | null;
  personal_message: string | null;
  country_code: string | null;
};

const supportedCountries: string[] = [
  "us",
  "uk",
  "au",
  "nz",
  "ca",
];

const countryDetails: Record<
  string,
  {
    label: string;
    flag: string;
  }
> = {
  us: {
    label: "United States",
    flag: "🇺🇸",
  },
  uk: {
    label: "United Kingdom",
    flag: "🇬🇧",
  },
  au: {
    label: "Australia",
    flag: "🇦🇺",
  },
  nz: {
    label: "New Zealand",
    flag: "🇳🇿",
  },
  ca: {
    label: "Canada",
    flag: "🇨🇦",
  },
};

const productImages: Record<string, string> = {
  linktree: "/images/linktree-smart-card-v2.png",
  uber: "/images/uber-v2.png",
  amc: "/images/amc-theatre-v2.png",
  target: "/images/target-v2.png",
  "best-buy": "/images/best-buy-v2.png",
  ebay: "/images/ebay.png",
  roblox: "/images/roblox-v2.png",
  "american-eagle": "/images/american-eagle-v2.png",
  airbnb: "/images/airbnb-v2.png",
  doordash: "/images/door-dash.png",
  instacart: "/images/instacart.png",
  cvs: "/images/cvs-pharmacy.png",
  macys: "/images/macys.png",
  "bath-body-works": "/images/bath-and-body.png",
  albertsons: "/images/albertsons.png",
  kroger: "/images/kroger.png",
  playstation: "/images/playstation-v2.png",
  "target-muscle-chef":
    "/images/target-muscle-chef-card.png",
};

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

async function loadWalletOrders(
  userId: string,
  country: string,
): Promise<WalletOrder[]> {
  const {
    ordersEndpoint,
    serviceRoleKey,
  } = getAdminConfiguration();

  const fields = [
    "stripe_session_id",
    "product_id",
    "product_title",
    "gift_amount",
    "amount_total",
    "currency",
    "gift_code",
    "fulfilment_status",
    "claimed_at",
    "personal_message",
    "country_code",
  ].join(",");

const query =
  `${ordersEndpoint}` +
  `?claimed_by=eq.${encodeURIComponent(userId)}` +
  `&wallet_hidden=is.false` +
  `&select=${fields}` +
  `&order=claimed_at.desc`;

  const response = await fetch(query, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Could not load wallet: ${errorText}`,
    );
  }

  const orders =
    (await response.json()) as WalletOrder[];

  return orders.filter((order) => {
    const orderCountry =
      order.country_code?.toLowerCase();

    return !orderCountry || orderCountry === country;
  });
}

function formatGiftValue(order: WalletOrder) {
  const giftAmount =
    order.gift_amount !== null
      ? Number(order.gift_amount)
      : order.amount_total !== null
        ? order.amount_total / 100
        : null;

  if (
    giftAmount === null ||
    !Number.isFinite(giftAmount)
  ) {
    return "Gift card";
  }

  const currency =
    order.currency?.toUpperCase() || "USD";

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).format(giftAmount);
  } catch {
    return `${currency} ${giftAmount.toFixed(2)}`;
  }
}

function formatClaimedDate(value: string | null) {
  if (!value) {
    return "Recently added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getProductImage(productId: string | null) {
  if (!productId) {
    return "/images/linktree-smart-card-v2.png";
  }

  return (
    productImages[productId] ??
    "/images/linktree-smart-card-v2.png"
  );
}

export default async function WalletPage({
  params,
}: WalletPageProps) {
  const { country: rawCountry } = await params;

  const requestedCountry = rawCountry.toLowerCase();

  const country = supportedCountries.includes(
    requestedCountry,
  )
    ? requestedCountry
    : "us";

  const walletPath = `/${country}/wallet`;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/${country}/login?next=${encodeURIComponent(
        walletPath,
      )}`,
    );
  }

  const orders = await loadWalletOrders(
    user.id,
    country,
  );

  const countryDetail =
    countryDetails[country] ?? countryDetails.us;

  return (
    <main className="wallet-page">

<WalletNav country={country} />

      <section className="wallet-content">
        <div className="wallet-heading-row">
<div className="wallet-heading-copy">
  <h1>Gift card wallet</h1>

  <div className="wallet-count-mobile">
    {orders.length}{" "}
    {orders.length === 1 ? "card" : "cards"}
  </div>

  <p className="wallet-email">
    Logged in as{" "}
    <strong>
      {user.email ?? "your account"}
    </strong>
  </p>
</div>

<div className="wallet-count">
  {orders.length}{" "}
  {orders.length === 1 ? "card" : "cards"}
</div>
        </div>

        {orders.length === 0 ? (
          <section className="wallet-empty">
            <div className="wallet-empty-icon">
              ✱
            </div>

            <h2>Your wallet is empty</h2>

            <p>
              Gift cards will appear here after they are
              purchased for you or claimed from a gift
              email.
            </p>

            <Link
              href={`/${country}/shop`}
              className="wallet-primary-button"
            >
              Browse gift cards
            </Link>
          </section>
        ) : (
          <section className="wallet-grid">
{orders.map((order) => {
  const productTitle =
    order.product_title || "Gift card";

  const giftValue =
    formatGiftValue(order);

  const productImage =
    getProductImage(order.product_id);

  const claimedDate =
    formatClaimedDate(order.claimed_at);

  return (
    <WalletCard
      key={order.stripe_session_id}
      stripeSessionId={
        order.stripe_session_id
      }
      productTitle={productTitle}
      productImage={productImage}
      giftValue={giftValue}
      giftCode={order.gift_code ?? ""}
      claimedDate={claimedDate}
      personalMessage={
        order.personal_message
      }
    />
  );
})}
          </section>
        )}
      </section>

      <style>{`
        @font-face {
          font-family: "Link Sans";
          src: url("/font/90fc7c5e1633bace7675c76b94f742eb.woff2")
            format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/030bed0195cd98cd301bdd3e3a59f234.woff2")
            format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/c26c0c2ba8f7711fba5695569b82cb10.woff2")
            format("woff2");
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        * {
          box-sizing: border-box;
        }

        .wallet-page {
          min-height: 100svh;
          margin: 0;
          padding: 0 24px 90px;
          overflow-x: hidden;
          background: #f1f1ef;
          color: #111111;
          font-family:
            "Link Sans",
            Arial,
            Helvetica,
            sans-serif;
        }

        .wallet-nav-shell {
          position: fixed;
          left: 50%;
          top: 28px;
          z-index: 1000;
          width: min(1220px, calc(100vw - 48px));
          height: 76px;
          transform: translateX(-50%);
        }

        .wallet-nav {
          width: 100%;
          height: 76px;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 31px;
          border: 1px solid #ebebeb;
          border-radius: 999px;
          background: #ffffff;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.04),
            0 10px 18px rgba(0, 0, 0, 0.05),
            0 18px 56px rgba(0, 0, 0, 0.08);
        }

        .wallet-logo-link {
          width: 104px;
          height: 52px;
          flex: 0 0 104px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-logo-link img {
          width: 104px;
          height: 52px;
          object-fit: contain;
          display: block;
        }

        .wallet-nav-link {
          min-height: 42px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #111111;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
        }

        .wallet-nav-link:hover {
          background: #edeee9;
        }

        .wallet-nav-spacer {
          flex: 1;
        }

        .wallet-country-pill {
          width: 232px;
          min-height: 52px;
          padding: 0 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #22451b;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.12;
          text-align: center;
        }

        .wallet-signout-button {
          min-width: 82px;
          height: 44px;
          padding: 0 18px;
          border: 0;
          border-radius: 9px;
          background: #edeee9;
          color: #111111;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .wallet-signout-button:hover {
          background: #e0e1dc;
        }

        .wallet-current-button {
          width: 138px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #111111;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .wallet-content {
          width: min(1297px, 100%);
          margin: 0 auto;
          padding-top: 158px;
        }

        .wallet-heading-row {
          margin-bottom: 40px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .wallet-eyebrow {
          margin: 0 0 12px;
          color: #666666;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

.wallet-heading-copy h1 {
  margin: 0;
  color: #111111;
  font-family: "Link Sans", Arial, sans-serif;
  font-size: clamp(42px, 4.5vw, 66px);
  font-weight: 900;
  line-height: 0.94;
  letter-spacing: -3px;
}

        .wallet-email {
          margin: 19px 0 0;
          color: #666666;
          font-size: 24px;
          line-height: 1.35;
        }

        .wallet-email strong {
          color: #111111;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .wallet-count {
          flex: 0 0 auto;
          min-width: 96px;
          min-height: 48px;
          padding: 0 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #ffffff;
          font-size: 20px;
          font-weight: 900;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .wallet-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 34px 28px;
        }

        .wallet-card-cell {
          min-width: 0;
        }

        .wallet-card {
          width: 100%;
          min-height: 590px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          background: #ffffff;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.04),
            0 10px 18px rgba(0, 0, 0, 0.05),
            0 18px 56px rgba(0, 0, 0, 0.1);
        }

        .wallet-card-image-wrap {
          width: 100%;
          aspect-ratio: 1.62 / 1;
          overflow: hidden;
          background: #ffffff;
        }

        .wallet-card-image {
          width: 100%;
          height: 100%;
          max-width: none;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .wallet-card-main {
          flex: 1;
          padding: 24px 22px 20px;
          display: flex;
          flex-direction: column;
        }

        .wallet-card-title-row {
          min-height: 58px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 12px;
        }

        .wallet-card-title-row h2 {
          min-width: 0;
          margin: 0;
          color: #111111;
          font-size: 22px;
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.65px;
          overflow-wrap: anywhere;
        }

        .wallet-menu-button {
          width: 32px;
          height: 32px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: #f3f3f1;
          color: #111111;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }

        .wallet-value-block {
          margin-top: 22px;
          text-align: center;
        }

        .wallet-value-block p,
        .wallet-balance-block p {
          margin: 0 0 7px;
          color: #555555;
          font-size: 13px;
          font-weight: 600;
        }

        .wallet-value-block strong {
          color: #111111;
          font-size: 29px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
        }

        .wallet-balance-block {
          margin-top: 26px;
          padding: 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px;
          border-radius: 16px;
          background: #f7f7f4;
        }

        .wallet-balance-block strong {
          color: #111111;
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
        }

        .wallet-status {
          color: #22451b;
          font-size: 12px;
          font-weight: 900;
          text-align: right;
        }

        .wallet-added-date {
          margin: 14px 0 0;
          color: #777777;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .wallet-secondary-action {
          width: 100%;
          min-height: 44px;
          margin-top: auto;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          background: #f6f6f9;
          color: #2559cd;
          font-size: 14px;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
        }

        .wallet-secondary-action:hover {
          background: #eeeeF4;
        }

        .wallet-details {
          border-top: 1px solid #dededb;
          background: #ffffff;
        }

        .wallet-details summary {
          min-height: 58px;
          margin: 16px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #461f67;
          border-radius: 6px;
          color: #461f67;
          font-size: 14px;
          font-weight: 900;
          text-align: center;
          cursor: pointer;
          list-style: none;
        }

        .wallet-details summary::-webkit-details-marker {
          display: none;
        }

        .wallet-details[open] summary {
          background: #461f67;
          color: #ffffff;
        }

        .wallet-details-content {
          margin: 0 16px 16px;
          padding: 18px;
          border-radius: 14px;
          background: #f3f3f1;
        }

        .wallet-field-label {
          margin: 0 0 7px;
          color: #777777;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .wallet-gift-code {
          margin: 0;
          color: #111111;
          font-family: monospace;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .wallet-message {
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid #d7d7d4;
        }

        .wallet-message p:last-child {
          margin: 0;
          color: #444444;
          font-size: 14px;
          line-height: 1.45;
        }

        .wallet-expiry {
          margin: 14px 0 0;
          color: #555555;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }

        .wallet-empty {
          padding: 74px 26px;
          border-radius: 34px;
          background: #ffffff;
          text-align: center;
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.06);
        }

        .wallet-empty-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #cbea19;
          color: #111111;
          font-size: 32px;
        }

        .wallet-empty h2 {
          margin: 0;
          color: #111111;
          font-size: 34px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1.4px;
        }

        .wallet-empty p {
          max-width: 460px;
          margin: 18px auto 28px;
          color: #626262;
          font-size: 16px;
          line-height: 1.5;
        }

        .wallet-primary-button {
          min-height: 54px;
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #cbea19;
          color: #111111;
          font-size: 16px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (min-width: 1701px) {
  .wallet-content {
    width: min(1680px, calc(100% - 160px));
    padding-top: 215px;
  }

  .wallet-heading-row {
    margin-bottom: 52px;
  }

  .wallet-heading-copy h1 {
    font-size: 68px;
    letter-spacing: -3.4px;
  }

  .wallet-email {
    margin-top: 18px;
    font-size: 18px;
  }

  .wallet-grid {
    gap: 44px 34px;
  }
}

        @media (max-width: 1180px) {
          .wallet-nav {
            gap: 11px;
            padding: 0 22px;
          }

          .wallet-nav-link {
            font-size: 13px;
            padding: 0 7px;
          }

          .wallet-country-pill {
            width: 205px;
          }

          .wallet-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .wallet-nav-link,
          .wallet-country-pill {
            display: none;
          }

          .wallet-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .wallet-heading-copy h1 {
            letter-spacing: -2.5px;
          }
        }

        @media (max-width: 600px) {
          .wallet-page {
            padding: 0 16px 70px;
          }

          .wallet-nav-shell {
            top: 16px;
            width: calc(100vw - 24px);
            height: 64px;
          }

          .wallet-nav {
            height: 64px;
            gap: 8px;
            padding: 0 13px;
          }

          .wallet-logo-link {
            width: 88px;
            height: 42px;
            flex-basis: 88px;
          }

          .wallet-logo-link img {
            width: 88px;
            height: 42px;
          }

          .wallet-nav-spacer {
            min-width: 4px;
          }

          .wallet-signout-button {
            min-width: 67px;
            height: 40px;
            padding: 0 11px;
            font-size: 11px;
          }

          .wallet-current-button {
            width: 90px;
            height: 40px;
            font-size: 11px;
          }

.wallet-content {
  padding-top: calc(
    max(
        52px,
        calc(
          env(safe-area-inset-top, 0px) + 12px
        )
      ) + 24vw
  );
}

          .wallet-heading-row {
            margin-bottom: 28px;
            align-items: flex-start;
          }

          .wallet-heading-copy h1 {
            font-size: 44px;
            letter-spacing: -2.2px;
          }

          .wallet-email {
            max-width: 270px;
            font-size: 14px;
          }

          .wallet-count {
            min-width: 76px;
            min-height: 42px;
            padding: 0 13px;
            font-size: 12px;
          }

          .wallet-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .wallet-card {
            min-height: 0;
            border-radius: 22px;
          }

          .wallet-card-main {
            padding: 23px 21px 20px;
          }

          .wallet-expiry {
            margin-top: 11px;
          }
        }
          @media (min-width: 1701px) {
  .wallet-content {
    padding-top: 190px;
  }
}
  @media (min-width: 1701px) {
  .wallet-email {
    font-size: 24px !important;
  }

  .wallet-count {
    font-size: 20px !important;
  }

  .wallet-count-mobile {
  display: none;
} 
}
@media (max-width: 768px) {
  .wallet-grid {
    display: flex !important;
    grid-template-columns: none !important;
    gap: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 0;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    touch-action: pan-x pan-y;
  }

  .wallet-grid::-webkit-scrollbar {
    display: none;
  }

  .wallet-grid > * {
    flex: 0 0 100% !important;
    width: 100% !important;
    min-width: 100% !important;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }
}
  .wallet-count-mobile {
  display: none;
}

@media (min-width: 1701px) {
  .wallet-content {
    padding-top: 230px;
  }

  .wallet-email {
    font-size: 24px !important;
  }

  .wallet-count {
    font-size: 20px !important;
  }
}

@media (max-width: 768px) {
  .wallet-heading-row {
    display: block !important;
    margin-bottom: 22px !important;
  }

  .wallet-heading-copy {
    width: 100%;
    text-align: center;
  }

  .wallet-heading-copy h1 {
    max-width: none !important;
    margin: 0 auto !important;
    font-size: 34px !important;
    line-height: 0.95 !important;
    letter-spacing: -1.7px !important;
    text-align: center;
  }

  .wallet-count {
    display: none !important;
  }

  .wallet-count-mobile {
    width: fit-content;
    min-width: 90px;
    min-height: 40px;
    margin: 12px auto 11px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #ffffff;
    color: #111111;
    font-size: 14px;
    font-weight: 900;
  }

  .wallet-email {
    max-width: none !important;
    margin: 0 auto !important;
    color: #666666;
    font-size: 12.5px !important;
    line-height: 1.3 !important;
    text-align: center;
  }

  .wallet-email strong {
    display: block;
    margin-top: 2px;
    font-size: 12.5px !important;
  }

.wallet-grid {
  display: flex !important;
  grid-template-columns: none !important;
  gap: 12px !important;

  width: 100vw !important;
  margin-left: calc(50% - 50vw) !important;
  padding: 0 32px 16px !important;

  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 32px;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}

.wallet-grid::-webkit-scrollbar {
  display: none;
}

.wallet-grid > * {
  flex: 0 0 calc(100vw - 64px) !important;
  width: calc(100vw - 64px) !important;
  min-width: calc(100vw - 64px) !important;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
  
  .wallet-grid::-webkit-scrollbar {
    display: none;
  }

  .wallet-grid > * {
    flex: 0 0 100% !important;
    width: 100% !important;
    min-width: 100% !important;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }
}
      `}</style>
    </main>
  );
}
