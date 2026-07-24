"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

type Order = {
  stripe_session_id: string;
  product_title: string | null;
  gift_amount: string | null;
  currency: string | null;
  checkout_email: string | null;
  customer_email: string | null;
  recipient_type: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  gift_code: string | null;
  fulfilment_status: string | null;
};

const formatCurrency = (currency?: string | null) => {
  if (currency === "gbp") return "£";
  if (currency === "aud") return "AU$";
  if (currency === "nzd") return "NZ$";
  if (currency === "cad") return "CA$";
  return "US$";
};

export default function ThankYouPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("us");

  useEffect(() => {
    const countryFromPath = window.location.pathname.split("/")[1] || "us";
    setCountry(countryFromPath);

    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Missing order session ID.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(sessionId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Could not find your order yet.");
          return;
        }

        setOrder(data.order);
      } catch (fetchError) {
        console.error("Failed to fetch order:", fetchError);
        setError("Could not load your order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const giftValue = order?.gift_amount
    ? `${formatCurrency(order.currency)}${Number(order.gift_amount).toFixed(2)}`
    : "";

  const deliveryEmail =
    order?.recipient_type === "someone" && order?.recipient_email
      ? order.recipient_email
      : order?.checkout_email || order?.customer_email || "your email";
      const isSelfPurchase = order?.recipient_type === "myself";

  return (
    <main
      className="
        flex
        min-h-[100dvh]
        w-full
        items-start
        justify-center
        overflow-x-hidden
        bg-[#cbea19]
        px-3
        py-3
        text-center
        sm:px-5
        sm:py-6
        md:items-center
        md:px-6
        md:py-12
      "
      style={{ fontFamily: '"Link Sans", "Inter", Arial, sans-serif' }}
    >
      <div
        className="
          w-full
          max-w-[760px]
          overflow-hidden
          rounded-[28px]
          bg-white
          px-5
          py-8
          shadow-[0_24px_90px_rgba(0,0,0,0.16)]
          sm:rounded-[34px]
          sm:px-8
          sm:py-10
          md:rounded-[42px]
          md:px-10
          md:py-14
        "
      >
        <img
          src="/images/linktree-logo.png"
          alt="Linktree"
          className="
            mx-auto
            mb-7
            h-auto
            w-[145px]
            sm:mb-8
            sm:w-[165px]
            md:mb-10
            md:w-[180px]
          "
        />

        <div
          className="
            mx-auto
            mb-6
            flex
            h-[64px]
            w-[64px]
            items-center
            justify-center
            rounded-full
            bg-[#ccff00]
            text-[30px]
            font-black
            text-black
            sm:mb-7
            sm:h-[70px]
            sm:w-[70px]
            sm:text-[32px]
            md:mb-8
            md:h-[74px]
            md:w-[74px]
            md:text-[34px]
          "
        >
          ✓
        </div>

        <h1
          className="
            mx-auto
            max-w-[620px]
            text-[40px]
            leading-[0.9]
            font-black
            tracking-[-1.8px]
            text-black
            sm:text-[48px]
            sm:tracking-[-2.1px]
            md:text-[56px]
            md:tracking-[-2.5px]
          "
        >
          Thank you for your purchase
        </h1>

        {isLoading && (
          <p
            className="
              mx-auto
              mt-5
              max-w-[560px]
              text-[17px]
              leading-[1.25]
              font-bold
              text-[#555555]
              sm:mt-6
              sm:text-[19px]
              md:text-[20px]
            "
          >
            Loading your gift card details...
          </p>
        )}

        {!isLoading && error && (
          <>
            <p
              className="
                mx-auto
                mt-5
                max-w-[560px]
                text-[17px]
                leading-[1.25]
                font-bold
                text-[#555555]
                sm:mt-6
                sm:text-[19px]
                md:text-[20px]
              "
            >
              Your payment was successful, but your order details are still
              loading.
            </p>

            <p className="mt-4 text-[14px] font-bold text-[#777777] sm:text-[15px]">
              {error}
            </p>
          </>
        )}

        {!isLoading && order && (
          <>
            <p
              className="
                mx-auto
                mt-5
                max-w-[560px]
                text-[17px]
                leading-[1.25]
                font-bold
                text-[#555555]
                sm:mt-6
                sm:text-[19px]
                md:text-[20px]
              "
            >
{isSelfPurchase
  ? "Your payment was successful. Your gift card has been added to your wallet."
  : "Your payment was successful. Your gift card details will be sent by email."}
            </p>

            <div
              className="
                mx-auto
                mt-7
                w-full
                max-w-[560px]
                rounded-[24px]
                border
                border-[#e5e5e5]
                bg-[#f7f7f4]
                p-5
                text-left
                sm:mt-9
                sm:rounded-[30px]
                sm:p-7
              "
            >
              <div
                className="
                  mb-5
                  grid
                  min-w-0
                  grid-cols-[minmax(0,1fr)_auto]
                  items-start
                  gap-3
                  sm:gap-5
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      m-0
                      text-[12px]
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-[#777777]
                      sm:text-[13px]
                    "
                  >
                    Gift card
                  </p>

                  <h2
                    className="
                      mt-1
                      min-w-0
                      text-[22px]
                      leading-[0.98]
                      font-black
                      tracking-[-0.5px]
                      text-black
                      sm:text-[24px]
                      md:text-[26px]
                    "
                    style={{
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {order.product_title ?? "Linktree eGift Card"}
                  </h2>
                </div>

                {giftValue && (
                  <div
                    className="
                      flex-shrink-0
                      whitespace-nowrap
                      rounded-full
                      bg-[#ccff00]
                      px-4
                      py-2.5
                      text-[16px]
                      leading-none
                      font-black
                      text-black
                      sm:px-5
                      sm:py-3
                      sm:text-[18px]
                    "
                  >
                    {giftValue}
                  </div>
                )}
              </div>

              <div className="rounded-[18px] bg-white px-5 py-5 sm:rounded-[22px]">
                <p
                  className="
                    m-0
                    text-[12px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#777777]
                    sm:text-[13px]
                  "
                >
                  Delivery
                </p>

<p
  className="
    mt-2
    text-[19px]
    leading-[1.08]
    font-black
    tracking-[-0.4px]
    text-black
    sm:text-[21px]
    md:text-[22px]
  "
>
  {isSelfPurchase
    ? "Gift card is added to your wallet."
    : "Your gift card will be delivered by email."}
</p>
              </div>

<div
  className="
    mt-5
    grid
    min-w-0
    gap-3
    text-[15px]
    leading-[1.3]
    font-bold
    text-[#555555]
    sm:text-[16px]
  "
>
  {!isSelfPurchase && (
    <p
      className="m-0 min-w-0"
      style={{
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      <span className="text-black">Delivery:</span>{" "}
      {deliveryEmail}
    </p>
  )}

  <p className="m-0">
    <span className="text-black">Status:</span>{" "}
    {isSelfPurchase
      ? "Ready in your wallet"
      : order.fulfilment_status ?? "created"}
  </p>
</div>
            </div>
          </>
        )}

{!isLoading && (
  <Link
    href={
      order && isSelfPurchase
        ? `/${country}/wallet`
        : `/${country}/home`
    }
    className="
      mx-auto
      mt-7
      flex
      h-[54px]
      w-full
      max-w-[250px]
      items-center
      justify-center
      rounded-full
      bg-black
      px-8
      text-[17px]
      font-black
      text-white
      no-underline
      sm:mt-9
      sm:h-[58px]
      sm:text-[18px]
    "
  >
    {order && isSelfPurchase ? "View wallet" : "Go home"}
  </Link>
)}
      </div>
    </main>
  );
}