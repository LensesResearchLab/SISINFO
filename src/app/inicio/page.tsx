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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHomeStore } from "./home.store";

// Map to associate roles with their corresponding feature components
const roleMap = new Map<string, React.ReactNode>([
  ["estudiante", <StudentFeatures />],
  ["profesor", <ProfessorFeatures />],
  ["coordinador", <CoordinatorFeatures />]
]);

export default function Home() {
  const roles = useHomeStore((state) => state.roles);
  if (roles.length === 0) return null;
  if (roles.length === 1) return roleMap.get(roles[0]);
  return (
    <RoleTab roles={roles} />
  );
}

/**
 * RoleTab Component
 * 
 * Creates a tabbed interface for switching between different role-specific views.
 * Each tab represents a user role and displays the corresponding feature component.
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.roles - Array of role names to display as tabs
 * @returns {JSX.Element} A tabbed interface with role-specific content
 */
function RoleTab({ roles }: { roles: string[] }) {
  return (
    <Tabs defaultValue={roles[0]} className="w-full">
      <TabsList className="bg-core text-white mx-4 mt-4">
        {roles.map((role) => (
          <TabsTrigger
            key={role}
            value={role}
            className="cursor-pointer data-[state=active]:bg-core-highlight data-[state=active]:font-semibold data-[state=active]:text-white transition-colors duration-200 hover:bg-core-highlight/30"
          >
            {role[0].toUpperCase() + role.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      {roles.map((role) => (
        <TabsContent key={role} value={role}>
          {roleMap.get(role)}
        </TabsContent>
      ))}
    </Tabs>
  )
}