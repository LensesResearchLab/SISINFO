// TasksPage.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { MoreHorizontal } from "lucide-react";

import { useHomeStore } from "../home.store";
import { ROUTES } from "@/app/routes";
import {
  getPendingTasksForStudent,
  getPendingTasksForProfessor,
  getPendingTasksForCoordinator,
} from "@/app/services/project-application.service";
import { getUserInfo } from "@/app/auth/auth-service";
import { createTask } from "@/app/services/tasks.service";
import { Task } from "@/app/types/entities/task.type";
import { TaskType, flows } from "./flows";
import SpinnerPage from "@/components/shared/spinner-page";
import RoleTab from "@/components/shared/role-tab";
import { TabsContent } from "@radix-ui/react-tabs";

/**
 * Common table column definitions that don’t depend on runtime state.
 */
const baseColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-[200px]">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const parsed = new Date(row.getValue("date"));
      return isNaN(parsed.getTime()) ? "Sin fecha" : parsed.toLocaleDateString();
    },
  },
  {
    id: "projectInfo",
    header: "Proyecto / Periodo",
    cell: ({ row }) => {
      const task = row.original;
      const pa = task?.projectActualTask;
      const project = pa?.project;
      const periodObj = pa?.period ?? project?.period;
      if (!project) return "—";
      const periodStr = periodObj ? `${periodObj.year}-${periodObj.period}` : "Sin periodo";
      return (
        <div>
          <div className="font-semibold">{project.title ?? "Sin título"}</div>
          <div className="text-xs text-muted-foreground">{periodStr}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "userInfo",
    header: "Usuario",
    cell: ({ row }) => {
      const task = row.original;
      const user = task?.projectActualTask?.student?.user;
      const code = task?.projectActualTask?.student?.code;
      if (!user) return "—";
      return (
        <div>
          <div className="font-semibold">{user.name ?? "Sin nombre"}</div>
          <div className="text-xs text-muted-foreground">{code ?? "Sin código"}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];


function ActionsCell({ row }: { readonly row: { original: Task } }) {
  const router = useRouter();
  const task = row.original;

  const studentName = task?.projectActualTask?.student?.user?.name ?? "";
  const studentCode = task?.projectActualTask?.student?.code ?? "";
  const projectTitle = task?.projectActualTask?.project?.title ?? "";
  const periodObj = task?.projectActualTask?.period ?? task?.projectActualTask?.project?.period;
  const periodStr = periodObj ? `${periodObj.year}-${periodObj.period}` : "";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        router.push(
          `${ROUTES.HOME}/${ROUTES.TASK_LIST}/${task.id}` +
            `?studentName=${encodeURIComponent(studentName)}` +
            `&studentCode=${encodeURIComponent(studentCode)}` +
            `&projectTitle=${encodeURIComponent(projectTitle)}` +
            `&period=${encodeURIComponent(periodStr)}`,
        )
      }
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );
}


/**
 * Top‑level Tasks page. Ensures tasks are loaded (similar to Home dashboard)
 * and displays them in role‑specific tables.
 */
export default function Tasks() {
  const roles = useHomeStore((state) => state.roles);
  const tasks = useHomeStore((state) => state.tasks);
  const setTasks = useHomeStore((state) => state.setTasks);

  const [loading, setLoading] = useState(tasks.length === 0);

    useEffect(() => {
    if (tasks.length > 0) return; // No hace fetch si ya estan cargadas las tareas

    (async () => {
      try {
        const data = await getUserInfo();
        const userId = data.user.id;
        const userRoles = data.user.roles;

        // Use safe fetch wrappers so a failing endpoint doesn't break the whole page
        const safe = async (fn: Promise<any>) => {
          try {
            return await fn;
          } catch (err) {
            console.error('Error fetching tasks:', err);
            return [];
          }
        };

        const taskPromises = [
          safe(getPendingTasksForStudent(userId)),
          safe(getPendingTasksForProfessor(userId)),
        ];

        if (userRoles.includes("coordinador") && !userRoles.includes("administrador")) {
          taskPromises.push(getPendingTasksForCoordinator());
        }

        const results = await Promise.all(taskPromises);
        const allTasks = results.flat();

        const parsedTasks = allTasks.map((task: Task) => {
          const stepNumber =
            typeof task.step === "number" ? task.step : Number(task.step);
          const stepInfo = flows.proyectoPregrado[stepNumber];
          return {
            ...task,
            step: stepNumber,
            title: stepInfo?.title ?? "Sin título",
            description: stepInfo?.description ?? "Sin descripción",
            // Prefer the task's important date (task.date) if present, otherwise fallback to
            // the project application created date, then to now.
            date: ((): Date => {
              const dateSource = task.date && typeof task.date === 'object' ? (task.date as any).date : task.date;
              if (dateSource) return new Date(dateSource);
              if (task.projectActualTask && (task.projectActualTask as any).createdAt) return new Date((task.projectActualTask as any).createdAt);
              return new Date();
            })(),
          } as Task;
        });

        setTasks(parsedTasks);
      } finally {
        setLoading(false);
      }
    })();
  }, [tasks.length, setTasks]);

  if (loading) return <SpinnerPage />;
  if (roles.length === 0) return null;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-semibold text-core m-0">Tareas</h2>
        {roles.length === 1 ? (
          <TasksTable role={roles[0]} />
        ) : (
          <RoleTab>
            {roles.map((role) => (
              <TabsContent key={role} value={role}>
                <TasksTable role={role} />
              </TabsContent>
            ))}
          </RoleTab>
        )}
      </div>
    </div>
  );
}

interface TasksTableProps {
  readonly role: string;
}

function TasksTable({ role }: TasksTableProps) {
  const allTasks = useHomeStore((state) => state.tasks);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  /**
   * Column definitions with a leading selection column.
   * useMemo avoids recreating on every render.
   */
  const columns: ColumnDef<Task>[] = useMemo(() => {
    const selectColumn: ColumnDef<Task> = {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    // Ensure the project column is inserted after the date column
    const projectColumn: ColumnDef<Task> = {
      id: "projectInfo",
      header: "Proyecto / Periodo",
      cell: ({ row }) => {
        const task = row.original;
        const pa = task?.projectActualTask;
        const project = pa?.project;
        const periodObj = pa?.period ?? project?.period;
        if (!project) return "—";
        const periodStr = periodObj ? `${periodObj.year}-${periodObj.period}` : "Sin periodo";
        return (
          <div>
            <div className="font-semibold">{project.title ?? "Sin título"}</div>
            <div className="text-xs text-muted-foreground">{periodStr}</div>
          </div>
        );
      },
    };

    // baseColumns: [title, description, date, projectInfo?, userInfo, actions]
    const hasProjectColumn = baseColumns.some((c) => (c as any).id === "projectInfo" || (c as any).header === "Proyecto / Periodo" || (c as any).accessorKey === "projectInfo");

    if (hasProjectColumn) {
      return [selectColumn, ...baseColumns];
    }

    // Insert project column after the date column
    return [selectColumn, baseColumns[0], baseColumns[1], baseColumns[2], projectColumn, baseColumns[3], baseColumns[4]];
  }, []);

  /**
   * Approve all selected tasks in bulk, then refresh.
   */
  const handleBulkApprove = async () => {
    for (const task of selectedTasks) {
      await createTask(task.id, {
        type: TaskType.SEND_APPROVE,
        approved: true,
        comment: "",
        date: new Date(),
        step: task.step,
      });
    }
    window.location.reload();
  };

  /**
   * Filter tasks by current role.
   */
  const filtered = allTasks.filter((task) => {
    if (role === "estudiante") return Boolean(task.student);
    if (role === "profesor") return Boolean(task.professor);
    if (role === "coordinador") return Boolean(task.coordinator);
    return false;
  });

  return (
    <div className="space-y-4">
      {selectedTasks.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleBulkApprove}>
            Aprobar {selectedTasks.length} tarea
            {selectedTasks.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        enableRowSelection
        onSelectedRowsChange={(rows) => setSelectedTasks(rows)}
      />
    </div>
  );
}
