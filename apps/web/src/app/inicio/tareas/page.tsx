/**
 * @module Tasks
 * @description
 * Renders a tabbed interface to display role-based tasks (e.g., for student or professor).
 * Each tab shows a searchable and filterable table powered by react-table and integrated with Zustand state.
 * 
 * @returns {JSX.Element} Interactive UI for managing and viewing user tasks by role.
 */

"use client";

import * as React from "react";
import { useHomeStore } from "../home.store";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import RoleTab from "@/components/shared/role-tab";
import { TabsContent } from "@radix-ui/react-tabs";
import { Task } from "@/app/types/entities/task.type";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

// Defines columns for the task DataTable
const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div className="line-clamp-2 max-w-[200px]">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const parsed = new Date();
      return isNaN(parsed.getTime()) ? "Sin fecha" : parsed.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const router = useRouter();
      const task = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.TASK_LIST}/${task.id}`)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
];

const roleMap = new Map<string, React.JSX.Element>(["estudiante", "profesor", "coordinador"].map((role) => [role, <TasksTable key={`tasks-${role}`} role={role} />]));

export default function Tasks() {
  const roles = useHomeStore((state) => state.roles);
  if (roles.length === 0) return null;
  if (roles.length === 1) return roleMap.get(roles[0]);

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-semibold text-core m-0">Tareas</h2>
        <RoleTab>
          {roles.map((role, index) => (
            <TabsContent key={`${role}-${index}`} value={role}>
              {roleMap.get(role)}
            </TabsContent>
          ))}
        </RoleTab>
      </div>
    </div>
  );
}

/**
 * Renders a DataTable filtered by role using Zustand task list
 * @param role - Current role to filter tasks by
 */
function TasksTable({ role }: { role: string }) {
  const allTasks = useHomeStore((state) => state.tasks);

  // Filters tasks by role assignment
  const filtered = allTasks.filter((task) => {
    if (role === "estudiante") return !!task.student;
    if (role === "profesor") return !!task.professor;
    if (role === "coordinador") return !!task.professor;
    return false;
  });

  return (
    <DataTable
      columns={columns}
      data={filtered}
    />
  );
}
