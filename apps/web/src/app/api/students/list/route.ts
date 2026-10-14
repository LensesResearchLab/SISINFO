import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";

export async function GET(_request: NextRequest) {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  const response = await fetch(`${API_ROUTES.BASE}/users/students/list`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  return NextResponse.json(await response.json().catch(() => []), { status: response.status });
}
