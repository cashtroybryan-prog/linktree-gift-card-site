"use client";

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
        const response = await fetch(`/api/orders/${encodeURIComponent(sessionId)}`);
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

  return (
    <main
      className="min-h-screen bg-[#cbea19] flex items-center justify-center px-6 py-12 text-center"
      style={{ fontFamily: '"Link Sans", "Inter", Arial, sans-serif' }}
    >
      <div className="w-full max-w-[760px] rounded-[42px] bg-white px-10 py-14 shadow-[0_24px_90px_rgba(0,0,0,0.16)]">
        <img
          src="/images/linktree-logo.png"
          alt="Linktree"
          className="mx-auto mb-10 h-auto w-[180px]"
        />

        <div className="mx-auto mb-8 flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#ccff00] text-[34px] font-black text-black">
          ✓
        </div>

        <h1 className="text-[56px] leading-[0.9] font-black tracking-[-2.5px] text-black">
          Thank you for your purchase
        </h1>

        {isLoading && (
          <p className="mx-auto mt-6 max-w-[560px] text-[20px] leading-[1.25] font-bold text-[#555555]">
            Loading your gift card details...
          </p>
        )}

        {!isLoading && error && (
          <>
            <p className="mx-auto mt-6 max-w-[560px] text-[20px] leading-[1.25] font-bold text-[#555555]">
              Your payment was successful, but your order details are still loading.
            </p>
            <p className="mt-4 text-[15px] font-bold text-[#777777]">{error}</p>
          </>
        )}

        {!isLoading && order && (
          <>
            <p className="mx-auto mt-6 max-w-[560px] text-[20px] leading-[1.25] font-bold text-[#555555]">
              Your payment was successful. Your gift card details will be sent by email.
            </p>

            <div className="mx-auto mt-9 max-w-[560px] rounded-[30px] border border-[#e5e5e5] bg-[#f7f7f4] p-7 text-left">
              <div className="mb-5 flex items-start justify-between gap-5">
                <div>
                  <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[#777777]">
                    Gift card
                  </p>
                  <h2 className="mt-1 text-[26px] leading-[1] font-black text-black">
                    {order.product_title ?? "Linktree eGift Card"}
                  </h2>
                </div>

                {giftValue && (
                  <div className="rounded-full bg-[#ccff00] px-5 py-3 text-[18px] font-black text-black">
                    {giftValue}
                  </div>
                )}
              </div>

              <div className="rounded-[22px] bg-white px-5 py-5">
                <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[#777777]">
                  Delivery
                </p>
                <p className="mt-2 text-[22px] leading-[1.1] font-black tracking-[-0.4px] text-black">
                  Your gift card code will be sent by email.
                </p>
              </div>

              <div className="mt-5 grid gap-3 text-[16px] font-bold text-[#555555]">
                <p>
                  <span className="text-black">Delivery:</span> {deliveryEmail}
                </p>
                <p>
                  <span className="text-black">Status:</span>{" "}
                  {order.fulfilment_status ?? "created"}
                </p>
              </div>
            </div>
          </>
        )}

        <a
          href={`/${country}/home`}
          className="mx-auto mt-9 flex h-[58px] w-fit items-center justify-center rounded-full bg-black px-10 text-[18px] font-black text-white no-underline"
        >
          Go home
        </a>
      </div>
    </main>
  );
}