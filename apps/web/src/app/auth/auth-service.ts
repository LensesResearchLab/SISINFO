/*
 *   Authentication service for login of the app:
 *   - loginUser: login the user and return the sucess or failure of login to page.
 *   - getUserInfo: get the user info from the session for the roles.
 *   - logoutUser: logout the user
 *
 *    Each function sends the request for the browser session to the endpoints located in: /session/route.ts
 *    - loginUser is used in auth/page.tsx
 *    - getUserInfo is used in inicio/page.tsx
 *    - logoutUser is used in auth/page.tsx
 */

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch("/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message ?? "Invalid credentials",
      };
    }

    return {
      success: true,
      user: data.user,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

export async function getUserInfo() {
  try {
    const response = await fetch("/auth/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message ?? "Failed to get user information",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      success: false,
      message: "An error occurred while fetching user information",
    };
  }
}

export async function logoutUser() {
  try {
    const response = await fetch("/auth/session", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message ?? "Failed to logout",
      };
    }
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "An error occurred during logout",
    };
  }
}
