import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const allowedAmounts = [
  5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 350, 400, 500,
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);

    if (!allowedAmounts.includes(amount)) {
      return NextResponse.json(
        { error: "Invalid gift card amount." },
        { status: 400 }
      );
    }

    if (!body.checkoutEmail) {
      return NextResponse.json(
        { error: "Checkout email is required." },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const successUrl =
      typeof body.successUrl === "string" && body.successUrl.startsWith(siteUrl)
        ? `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`
        : `${siteUrl}/us/thank-you?session_id={CHECKOUT_SESSION_ID}`;

const cancelUrl =
  typeof body.returnUrl === "string" && body.returnUrl.startsWith(siteUrl)
    ? body.returnUrl
    : `${siteUrl}/us/home?checkout=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.checkoutEmail,
      line_items: [
        {
          price_data: {
            currency: body.currency ?? "usd",
            product_data: {
              name: body.productTitle ?? "Linktree eGift Card",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId: body.productId ?? "",
        productTitle: body.productTitle ?? "",
        amount: String(amount),
        country: body.country ?? "",
        recipientType: body.recipientType ?? "",
        checkoutEmail: body.checkoutEmail ?? "",
        recipientName: body.recipientName ?? "",
        recipientEmail: body.recipientEmail ?? "",
        recipientPhone: body.recipientPhone ?? "",
        creatorHandle: body.creatorHandle ?? "",
        personalMessage: body.personalMessage ?? "",
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}