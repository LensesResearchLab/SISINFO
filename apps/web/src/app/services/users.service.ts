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


export async function assignRole({
  userId,
  roleType,
  roleInfo,
}: {
  userId: string;
  roleType: string;
  roleInfo?: unknown;
}): Promise<void> {
  const url = `${API_ROUTES.BASE}/users/assign-role`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId, roleType, roleInfo }),
    });
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("No se pudo parsear el error:", parseError);
      }
      throw new Error(
        `Error asignando rol: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }
  } catch (error) {
    console.error("Error al asignar el rol:", error);
    throw error;
  }
}
