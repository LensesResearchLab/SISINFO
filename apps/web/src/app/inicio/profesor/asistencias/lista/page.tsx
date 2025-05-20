"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "@/app/auth/auth-service";
import { AssistanceList } from "@/components/shared/assistance-list";

/**
 * ProfessorAssistanceList Component
 *
 * This page component is used by professors to view assistance listings related to them.
 * It fetches the authenticated user's information on mount and passes the professor's
 * name as a prop to the reusable <AssistanceList> component.
 *
 * Features:
 * - Fetches authenticated professor's data using `getUserInfo`
 * - Shows a loading indicator until data is ready
 * - Injects professor's name and role to filter assistance records
 */
export default function ProfessorAssistanceList() {
  // Stores the currently authenticated user info (limited to name and role)
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "profesor",
  });

  // Loading state for asynchronous user fetching
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user info on initial render
  useEffect(() => {
    async function fetchUserData() {
      try {
        const userInfo = await getUserInfo();

        // If user is successfully fetched, store their name and set role explicitly
        if (userInfo.success && userInfo.user) {
          setCurrentUser({
            name: userInfo.user.name,
            role: "profesor",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setIsLoading(false); // Whether successful or failed, loading ends
      }
    }

    fetchUserData();
  }, []);

  // Show loading placeholder while fetching user info
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  // Pass the professor name and role to filter the assistance list
  return <AssistanceList role="profesor" professorName={currentUser.name} />;
}
