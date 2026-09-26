import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "La sesión no está autenticada." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(
      API_ROUTES.BASE + (body.currentStage ? "/thesis-applications/master-stage" : "/thesis-applications"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(body),
      },
    );

    const responseBody = await response.json().catch(() => ({}));
    return NextResponse.json(responseBody, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "No fue posible conectar con la API." },
      { status: 502 },
    );
  }
}
