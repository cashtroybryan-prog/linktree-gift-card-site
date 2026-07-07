import { NextResponse } from "next/server";

export const runtime = "nodejs";

const getSupabaseEndpoint = (sessionId: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const cleanSupabaseUrl = supabaseUrl.replace(/\/+$/, "");
  const baseUrl = cleanSupabaseUrl.endsWith("/rest/v1")
    ? cleanSupabaseUrl
    : `${cleanSupabaseUrl}/rest/v1`;

  const endpoint = `${baseUrl}/orders?stripe_session_id=eq.${encodeURIComponent(
    sessionId
  )}&select=*`;

  return {
    endpoint,
    supabaseServiceRoleKey,
  };
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = decodeURIComponent(url.pathname.split("/").pop() ?? "");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID." },
        { status: 400 }
      );
    }

    const { endpoint, supabaseServiceRoleKey } = getSupabaseEndpoint(sessionId);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        { error: `Supabase lookup failed: ${errorText}` },
        { status: 500 }
      );
    }

    const orders = await response.json();

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: "Order not found yet." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: orders[0] });
  } catch (error) {
    console.error("Order lookup failed:", error);

    return NextResponse.json(
      { error: "Could not load order." },
      { status: 500 }
    );
  }
}