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
export default function RoleTab({ children, showTaskCounts = false }: { readonly children: React.ReactNode; readonly showTaskCounts?: boolean }) {
  const roles = useHomeStore((state) => state.roles);
  const tasks = useHomeStore((state) => state.tasks);
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
            {showTaskCounts && (() => {
              const count = tasks.filter((task) => role === "profesor" || role === "profesor_planta"
                ? Boolean(task.professor)
                : role === "coordinador"
                  ? Boolean(task.coordinator)
                  : role === "estudiante"
                    ? task.student?.isUndergraduate === true
                    : role === "estudiante_maestria"
                      ? task.student?.isUndergraduate === false
                      : false).length;
              return count > 0 ? <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{count}</span> : null;
            })()}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
