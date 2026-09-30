import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";
import { getMicrosoftClient, microsoftRedirectUri } from "../config";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = (await cookies()).get("microsoft-oauth-state")?.value;
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/auth?error=microsoft_state", url.origin));
  }

  try {
    const result = await getMicrosoftClient().acquireTokenByCode({
      code,
      scopes: ["openid", "profile", "email"],
      redirectUri: microsoftRedirectUri,
    });
    const claims = result.idTokenClaims as Record<string, string>;
    const email = claims.preferred_username ?? claims.email ?? result.account?.username;
    if (!email) throw new Error("Microsoft no devolvió un correo electrónico");

    const response = await fetch(`${API_ROUTES.BASE}/users/login/microsoft`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: claims.name ?? email,
        internalSecret: process.env.SSO_INTERNAL_SECRET,
      }),
    });
    if (!response.ok) throw new Error("El correo no está registrado en SISINFO");
    const userData = await response.json();
    (await cookies()).set("auth-token", userData.access_token, {
      httpOnly: true, path: "/", maxAge: 60 * 60 * 8,
      sameSite: "lax", secure: process.env.NODE_ENV === "production",
    });
    (await cookies()).delete("microsoft-oauth-state");
    return NextResponse.redirect(new URL("/inicio", url.origin));
  } catch (error) {
    console.error("Microsoft login callback error:", error);
    return NextResponse.redirect(new URL("/auth?error=microsoft_login", url.origin));
  }
}
