"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const params = useParams<{ country: string }>();
  const country = params.country ?? "us";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      router.push(`/${country}/home`);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [country, router]);

  return (
    <main className="min-h-screen bg-[#cbea19] flex items-center justify-center px-6 text-center">
      <div className="w-full max-w-[720px] rounded-[42px] bg-white px-10 py-14 shadow-[0_24px_90px_rgba(0,0,0,0.16)]">
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

        <p className="mx-auto mt-6 max-w-[560px] text-[20px] leading-[1.25] font-bold text-[#555555]">
          Your payment was successful. Your eGift Card details and receipt will
          be sent to your email.
        </p>

        <p className="mt-8 text-[16px] font-extrabold text-[#777777]">
          Redirecting you home...
        </p>
      </div>
    </main>
  );
}