import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { API_ROUTES } from "@/app/routes";

/* Here are the endpoint functions for login, fetching the role of the current user and logout */

/*  POST function:
 *     - Input: email and password
 *     - Output: user information and token for authorization in cookies.
 *     Sends the request to the backend to check credentials:
 *     If the credentials are wrong, returns an error.
 *     If the credentials are correct, returns the user id, email and roles.
 *     Then generates and sets the JWT token and sets it as an HTTP-only cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const response = await fetch(`${API_ROUTES.BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message ?? "Invalid credentials" },
        { status: 401 }
      );
    }

    const userData = await response.json();
    const token = userData.access_token; // Use the backend JWT token
    console.log("ACCESS TOKEN" + token.toString());

    /* Set the token as an HTTP-only cookie */
    (await cookies()).set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours in seconds
      sameSite: "lax",
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roles: userData.roles,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


/* GET user authentication status and roles */
export async function GET() {
  try {
    /* Get the JWT token from the cookies and decrypt it */
    const token = (await cookies()).get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    const secretKey = process.env.JWT_SECRET ?? "secret-key";
    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      name: string;
      email: string;
      roles: string[];
    };

    /* Return user information */
    return NextResponse.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        roles: decoded.roles,
      },
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

/* DELETE user auth token by setting it with a past expiration date */
export async function DELETE() {
  try {
    const cookie = cookies();
    (await cookie).set({
      name: "auth-token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Error during logout" },
      { status: 500 }
    );
  }
}
