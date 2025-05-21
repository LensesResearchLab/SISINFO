import { API_ROUTES } from "../routes"
import { User } from "../types/entities/user.type"

export async function findAllWithRoles(): Promise<User[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.USER_ROLES}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("No se pudo parsear el error:", parseError);
      }
      throw new Error(
        `Error fetching users: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
}