import { API_ROUTES } from "../routes";

export async function createProfile(body: { name: string; coordinatorId?: string | number }) {
  const url = `${API_ROUTES.BASE}/subareas`;
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

export async function updateProfile(id: string | number, body: { coordinatorId?: string | number }) {
  const url = `${API_ROUTES.BASE}/subareas/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Error actualizando el perfil: ${response.statusText}`);
  }
  return response.json();
}
