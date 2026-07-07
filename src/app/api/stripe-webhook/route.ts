import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

const generateGiftCode = (productId?: string | null) => {
  const prefix = productId ? productId.slice(0, 4).toUpperCase() : "GIFT";
  const partOne = Math.random().toString(36).slice(2, 6).toUpperCase();
  const partTwo = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `LINKTREE-${prefix}-${partOne}-${partTwo}`;
};

const saveOrderToSupabase = async (
  order: Record<string, string | number | null>
) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const cleanSupabaseUrl = supabaseUrl.replace(/\/+$/, "");
  const endpoint = cleanSupabaseUrl.endsWith("/rest/v1")
    ? `${cleanSupabaseUrl}/orders`
    : `${cleanSupabaseUrl}/rest/v1/orders`;

  console.log("Saving order to Supabase endpoint:", endpoint);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase insert failed: ${errorText}`);
  }

  return response.json();
};

const sendGiftCardEmail = async (order: {
  product_title: string | null;
  gift_amount: string | null;
  currency: string | null;
  checkout_email: string | null;
  customer_email: string | null;
  recipient_type: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  gift_code: string | null;
  personal_message: string | null;
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing Resend API key.");
  }

  const deliveryEmail =
    order.recipient_type === "someone" && order.recipient_email
      ? order.recipient_email
      : order.checkout_email || order.customer_email;

  if (!deliveryEmail) {
    throw new Error("Missing delivery email.");
  }

  const currencyPrefix =
    order.currency === "gbp"
      ? "£"
      : order.currency === "aud"
        ? "AU$"
        : order.currency === "nzd"
          ? "NZ$"
          : order.currency === "cad"
            ? "CA$"
            : "US$";

  const giftValue = order.gift_amount
    ? `${currencyPrefix}${Number(order.gift_amount).toFixed(2)}`
    : "your gift card";

  const recipientName = order.recipient_name?.trim() || "there";
  const productTitle = order.product_title || "Linktree eGift Card";

  const subject = `Your ${productTitle} is ready`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 32px; color: #111111;">
      <div style="background: #cbea19; border-radius: 28px; padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 36px; line-height: 1; letter-spacing: -1.5px;">Your gift card is ready</h1>
        <p style="font-size: 18px; font-weight: 700; margin: 18px 0 0;">${productTitle}</p>
      </div>

      <div style="background: #f7f7f4; border-radius: 24px; padding: 28px; margin-top: 24px;">
        <p style="font-size: 16px; font-weight: 700; margin: 0 0 14px;">Hi ${recipientName},</p>
        <p style="font-size: 16px; line-height: 1.45; margin: 0 0 20px;">
          Your ${giftValue} gift card has been created successfully.
        </p>

        <div style="background: #ffffff; border-radius: 18px; padding: 22px; margin: 22px 0;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.4px; font-weight: 900; color: #777777; margin: 0 0 8px;">Gift code</p>
          <p style="font-size: 28px; line-height: 1.1; font-weight: 900; margin: 0; word-break: break-word;">${order.gift_code}</p>
        </div>

        ${
          order.personal_message
            ? `<div style="background: #ffffff; border-radius: 18px; padding: 22px; margin-top: 18px;"><p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.4px; font-weight: 900; color: #777777; margin: 0 0 8px;">Message</p><p style="font-size: 16px; line-height: 1.45; margin: 0;">${order.personal_message}</p></div>`
            : ""
        }

        <p style="font-size: 13px; line-height: 1.45; color: #666666; margin: 22px 0 0;">
          This is a prototype email generated after a successful Stripe test payment.
        </p>
      </div>
    </div>
  `;

  const text = `Your gift card is ready\n\n${productTitle}\nValue: ${giftValue}\nGift code: ${order.gift_code}\n${order.personal_message ? `Message: ${order.personal_message}\n` : ""}`;

  console.log("Sending gift card email to:", deliveryEmail);

  const email = await resend.emails.send({
    from: "Linktree Gifts <onboarding@resend.dev>",
    to: deliveryEmail,
    subject,
    html,
    text,
  });

  if (email.error) {
    console.error("Resend email failed:", email.error);
    throw new Error(`Resend email failed: ${email.error.message}`);
  }

  console.log("Gift card email sent:", email.data);
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const productId = session.metadata?.productId ?? null;
    const giftCode = generateGiftCode(productId);

    const order = {
      stripe_session_id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      product_id: productId,
      product_title: session.metadata?.productTitle ?? null,
      gift_amount: session.metadata?.amount ?? null,
      country: session.metadata?.country ?? null,
      recipient_type: session.metadata?.recipientType ?? null,
      checkout_email: session.metadata?.checkoutEmail ?? null,
      recipient_name: session.metadata?.recipientName ?? null,
      recipient_email: session.metadata?.recipientEmail ?? null,
      recipient_phone: session.metadata?.recipientPhone ?? null,
      creator_handle: session.metadata?.creatorHandle ?? null,
      personal_message: session.metadata?.personalMessage ?? null,
      gift_code: giftCode,
      fulfilment_status: "created",
    };

    const savedOrder = await saveOrderToSupabase(order);

    console.log("Order saved to Supabase:", savedOrder);

    await sendGiftCardEmail(order);

    console.log("Gift card email triggered for order:", session.id);
  }

  return NextResponse.json({ received: true });
}