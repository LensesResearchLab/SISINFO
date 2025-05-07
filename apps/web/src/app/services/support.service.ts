import { API_ROUTES } from "../routes";


export async function getCoordinators() {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COORDINATORS}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error buscando los coordinadores: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
}