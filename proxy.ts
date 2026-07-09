import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Poortwachter voor /beheer: ververst zo nodig het Supabase-token en stuurt
// bezoekers zonder sessie naar de loginpagina. De echte autorisatie
// (admin-check + RLS) gebeurt dieper, in lib/beheer/auth.ts en de database.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          // Cache-headers meegeven zodat een CDN nooit een respons met
          // andermans sessietoken kan serveren.
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    }
  );

  // getClaims verifieert het JWT en ververst het token als het verlopen is.
  const { data } = await supabase.auth.getClaims();
  const isLoginRoute = request.nextUrl.pathname === "/beheer/login";

  if (!data?.claims && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/beheer/login";
    const redirect = NextResponse.redirect(url);
    // Ververste cookies meenemen op de redirect, anders raakt de sessie kwijt.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/beheer/:path*"],
};
