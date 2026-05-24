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
  getPendingTasksForCoordinator,
} from "@/app/services/project-application.service";
import { mapTasksToTaskTable } from "../mappers/task.mapper";

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
useEffect(() => {
  if (!fetchedRef.current) {
    fetchUserRoles(setRoles, setLoading, fetchedRef);
    getUserInfo().then((data) => {
      const userId = data.user.id;
      const userRoles = data.user.roles;

      const taskPromises = [
        getPendingTasksForStudent(userId),
        getPendingTasksForProfessor(userId),
      ];

      if (userRoles.includes("coordinador") && !userRoles.includes("administrador")) {
        taskPromises.push(getPendingTasksForCoordinator());
      }

      Promise.all(taskPromises).then((results) => {
        const allTasks = results.flat();
        const parsedTasks = mapTasksToTaskTable(allTasks);
        setTasks(parsedTasks);
      });
    });
  }
}, [setRoles, setTasks]);

  if (loading) return <SpinnerPage />;
  if (roles.length === 0) return null;
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