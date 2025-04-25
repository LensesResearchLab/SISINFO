import { useHomeStore } from "@/app/inicio/home.store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
/**
 * RoleTab Component
 *
 * Creates a tabbed interface for switching between different role-specific views.
 * Each tab represents a user role and displays the corresponding feature component.
 *
 * @param {Object} props - Component props
 * @returns {JSX.Element} A tabbed interface with role-specific content
 */
export default function RoleTab({ children }: { children: React.ReactNode }) {
  const roles = useHomeStore((state) => state.roles);
  return (
    <Tabs defaultValue={roles[0]} className="w-full">
      <TabsList className="bg-core text-white mx-4 mt-4">
        {roles.map((role) => (
          <TabsTrigger
            key={role}
            value={role}
            className="cursor-pointer data-[state=active]:bg-core-highlight data-[state=active]:font-semibold data-[state=active]:text-white transition-colors duration-200 hover:bg-core-highlight/30"
          >
            {role
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
