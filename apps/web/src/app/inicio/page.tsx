/**
 * Home Page Component
 * 
 * This component renders different feature sets based on user roles (student, professor, coordinator).
 * It displays a tabbed interface when multiple roles are present, allowing users to switch between
 * different role-specific views.
 * 
 * The component uses a Map to associate each role with its corresponding feature component.
 * If only one role is available, it directly renders that role's features.
 * If multiple roles exist, it creates a tabbed interface with role-based navigation.
 */
"use client"
import CoordinatorFeatures from "@/app/inicio/components/coordinator-features"
import ProfessorFeatures from "@/app/inicio/components/professor-features"
import StudentFeatures from "@/app/inicio/components/student-features"
import { TabsContent } from "@/components/ui/tabs";
import { useHomeStore } from "./home.store";
import RoleTab from "@/components/shared/role-tab";
import SupportFeatures from "./components/support-features";

// Map to associate roles with their corresponding feature components
const roleMap = new Map<string, React.ReactNode>([
  ["estudiante", <StudentFeatures key={"estudiante"}> <SupportFeatures/> </StudentFeatures> ],
  ["profesor", <ProfessorFeatures  key={"profesor"}/>],
  ["coordinador", <CoordinatorFeatures  key={"coordinador"}/>]
]);

export default function Home() {
  const roles = useHomeStore((state) => state.roles);
  if (roles.length === 0) return null;
  if (roles.length === 1) return roleMap.get(roles[0]);
  return (
    <RoleTab>
      <RoleInformation/>
    </RoleTab>
  );
}

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
  )
}