export default async function handleRequest<T>(input: RequestInfo, init: RequestInit): Promise<T> {
  try {
    const response = await fetch(input, { ...init, credentials: "include" });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("No se pudo parsear el error:", parseError);
      }
      throw new Error(`${response.status} ${response.statusText}`, { cause: errorData });
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
}
