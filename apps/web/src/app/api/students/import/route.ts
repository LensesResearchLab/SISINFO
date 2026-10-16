import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";
  let body: any;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // Manejar si el body es un archivo (FormData/Multipart) o un JSON estándar
  if (contentType.includes("multipart/form-data")) {
    body = await request.formData();
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(await request.json().catch(() => ({})));
  }

  const response = await fetch(`${API_ROUTES.BASE}/users/students/import`, {
    method: "POST",
    headers,
    body,
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}