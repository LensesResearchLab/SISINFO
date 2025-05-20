/**
 * @module Home
 * @description
 * Main dashboard component that renders different role-based features after user authentication.
 * Fetches the current user's roles and pending tasks, then displays the appropriate role UI.
 * 
 * @returns {JSX.Element} Role-specific dashboard UI.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import CoordinatorFeatures from "@/app/inicio/components/coordinator-features";
import ProfessorFeatures from "@/app/inicio/components/professor-features";
import StudentFeatures from "@/app/inicio/components/student-features";
import GraduateStudentFeatures from "./components/graduate-student-features";
import AdministratorFeatures from "./components/administrator-features";
import SupportFeatures from "./components/support-features";

import { TabsContent } from "@/components/ui/tabs";
import RoleTab from "@/components/shared/role-tab";
import SpinnerPage from "@/components/shared/spinner-page";

import { useHomeStore } from "./home.store";
import { fetchUserRoles, getUserInfo } from "../auth/auth-service";
import {
  getPendingTasksForStudent,
  getPendingTasksForProfessor,
} from "@/app/services/project-application.service";
import { flows } from "./tareas/flows";

/**
 * Maps each user role to the corresponding dashboard component.
 * Includes nested support component for student and professor views.
 */
const roleMap = new Map<string, React.ReactNode>([
  [
    "estudiante",
    <StudentFeatures key={"estudiante"}>
      <SupportFeatures />
    </StudentFeatures>,
  ],
  [
    "estudiante_maestria",
    <GraduateStudentFeatures key={"estudiante_maestria"}>
      <SupportFeatures />
    </GraduateStudentFeatures>,
  ],
  [
    "profesor",
    <ProfessorFeatures key={"profesor"}>
      <SupportFeatures />
    </ProfessorFeatures>,
  ],
  ["coordinador", <CoordinatorFeatures key={"coordinador"} />],
  ["administrador", <AdministratorFeatures key={"administrador"} />],
]);

/**
 * Top-level Home component rendered upon login.
 * Handles role fetching, task loading, and view delegation.
 */
export default function Home() {
  const roles = useHomeStore((state) => state.roles);
  const setRoles = useHomeStore((state) => state.setRoles);
  const setTasks = useHomeStore((state) => state.setTasks);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  // Fetches roles and tasks only once on mount
  useEffect(() => {
    if (!fetchedRef.current) {
      // Step 1: Get roles and mark fetch as done
      fetchUserRoles(setRoles, setLoading, fetchedRef);

      // Step 2: Get user and load all pending tasks (student and professor)
      getUserInfo().then((data) => {
        const userId = data.user.id;

        Promise.all([
          getPendingTasksForStudent(userId),
          getPendingTasksForProfessor(userId),
        ]).then(([studentTasks, professorTasks]) => {
          const allTasks = [...studentTasks, ...professorTasks];

          // Add display info from predefined flow structure
          const parsedTasks = allTasks.map((task: any) => {
            const stepNumber =
              typeof task.step === "number" ? task.step : Number(task.step);
            const stepInfo = flows.proyectoPregrado[stepNumber];
            return {
              ...task,
              step: stepNumber,
              title: stepInfo?.title || "Sin título",
              description: stepInfo?.description || "Sin descripción",
              date: task.date ? new Date(task.date) : new Date(),
            } satisfies import("@/app/types/entities/task.type").Task;
          });

          setTasks(parsedTasks);
        });
      });
    }
  }, [setRoles, setTasks]);

  if (loading) return <SpinnerPage />;
  if (roles.length === 0) return null;

  // Show single role UI directly, or tabbed interface if multiple roles exist
  if (roles.length === 1) return roleMap.get(roles[0]);

  return (
    <RoleTab>
      <RoleInformation />
    </RoleTab>
  );
}

/**
 * Renders each role's UI inside a <TabsContent /> if multiple roles exist.
 */
function RoleInformation() {
  const roles = useHomeStore((state) => state.roles);
  return (
    <>
      {roles.map((role) => (
        <TabsContent key={role} value={role}>
          {roleMap.get(role)}
        </TabsContent>
      ))}
    </>
  );
}