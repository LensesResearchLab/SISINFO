import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMicrosoftClient, microsoftRedirectUri } from "../config";

export async function GET() {
  try {
    const state = crypto.randomUUID();
    const url = await getMicrosoftClient().getAuthCodeUrl({
      scopes: ["openid", "profile", "email"],
      redirectUri: microsoftRedirectUri,
      responseMode: "query",
      state,
    });
    (await cookies()).set("microsoft-oauth-state", state, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      maxAge: 600, path: "/",
    });
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Microsoft login start error:", error);
    return NextResponse.redirect(new URL("/auth?error=microsoft_config", process.env.FRONT_URL ?? "http://localhost:3000"));
  }
}
