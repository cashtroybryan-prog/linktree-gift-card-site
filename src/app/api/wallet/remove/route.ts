import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const stripeSessionId =
      typeof body.stripeSessionId === "string"
        ? body.stripeSessionId.trim()
        : "";

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: "Missing wallet card ID." },
        { status: 400 },
      );
    }

    const {
      ordersEndpoint,
      serviceRoleKey,
    } = getAdminConfiguration();

    const endpoint =
      `${ordersEndpoint}` +
      `?stripe_session_id=eq.${encodeURIComponent(
        stripeSessionId,
      )}` +
      `&claimed_by=eq.${encodeURIComponent(user.id)}`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        wallet_hidden: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Could not remove wallet card: ${errorText}`,
      );
    }

    const updatedOrders =
      (await response.json()) as unknown[];

    if (
      !Array.isArray(updatedOrders) ||
      updatedOrders.length === 0
    ) {
      return NextResponse.json(
        { error: "Wallet card was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      removed: true,
    });
  } catch (error) {
    console.error(
      "Remove wallet card failed:",
      error,
    );

    return NextResponse.json(
      { error: "Could not remove this card." },
      { status: 500 },
    );
  }
}