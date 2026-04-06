import { API_ROUTES } from "../routes";

export async function createProfile(body: { name: string; coordinatorId?: string | number }) {
  const url = `${API_ROUTES.BASE}/profiles`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Error creando el perfil: ${response.statusText}`);
  }
  return response.json();
}
