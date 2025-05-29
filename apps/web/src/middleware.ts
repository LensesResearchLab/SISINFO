import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* Dont need authentication for these */
const publicRoutes = ["/auth", "/auth/api", "/api/auth/login"];

/* Routes that each role can access to */
const roleRoutes = {
  estudiante: [
    "/inicio/estudiante",
    "/inicio/pregrado",
    "/inicio/maestria",
    "/inicio/soporte",
    "/inicio/tareas",
  ],
  estudiante_maestria: [
    "/inicio/estudiante",
    "/inicio/posgrado",
    "/inicio/maestria",
    "/inicio/soporte",
    "/inicio/tareas",
  ],
  profesor: ["/inicio/profesor", "/inicio/tareas", "/inicio/soporte"],
  coordinador: ["/inicio/coordinador", "/inicio/tareas", "/inicio/soporte"],
  administrador: ["/inicio/administrador"]
};

/* Key for decryption */
const secretKey = process.env.JWT_SECRET ?? "secret-key";
const encodedKey = new TextEncoder().encode(secretKey);

/* Middleware decryption */
async function decryptSession(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error(`Error decrypting session: ${error}`);
    return null;
  }
}

/* Function to check if the user has the role needed to access a page */
function hasRoleAccess(path: string, userRoles: string[]) {
  if (path === "/inicio") return true;
  for (const role of userRoles) {
    const allowedPaths = roleRoutes[role as keyof typeof roleRoutes] ?? [];
    if (allowedPaths.some((allowedPath) => path.startsWith(allowedPath))) {
      return true;
    }
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute =
    path.startsWith("/inicio") ||
    path.startsWith("/pregrado") ||
    path.startsWith("/posgrado") ||
    path.startsWith("/maestria") ||
    path.startsWith("/estudiante") ||
    path.startsWith("/profesor") ||
    path.startsWith("/coordinador") ||
    path.startsWith("/administrador") ||
    path.startsWith("/soporte");

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  /* Get cookie session auth-token from request and decrypt it */
  const token = req.cookies.get("auth-token")?.value;
  const session = await decryptSession(token);

  /* If accessing protected route and session token is invalid redirect to login */
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }

  /* Check if the user can access the page based on his role */
  if (isProtectedRoute && session?.roles) {
    const userRoles = session.roles as string[];
    if (!hasRoleAccess(path, userRoles)) {
      return NextResponse.redirect(new URL("/inicio", req.nextUrl.origin));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
