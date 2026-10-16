import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";

export async function GET(request: NextRequest) {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

  // Reenviar parámetros de búsqueda / filtros de la URL si existen
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : "";

  const response = await fetch(`${API_ROUTES.BASE}/users/students/list${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await response.json().catch(() => []);
  return NextResponse.json(data, { status: response.status });
}