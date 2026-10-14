import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  const body = await request.json();
  const response = await fetch(`${API_ROUTES.BASE}/users/students/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
}
