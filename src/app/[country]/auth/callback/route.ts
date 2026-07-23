import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ country: string }> },
) {
  const { country } = await context.params;
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  const fallbackPath = `/${country}/home`;

  const nextPath =
    requestedNext &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : fallbackPath;

  if (!code) {
    return NextResponse.redirect(
      new URL(`/${country}/login?error=missing_code`, request.url),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/${country}/login?error=auth_callback_failed`, request.url),
    );
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
