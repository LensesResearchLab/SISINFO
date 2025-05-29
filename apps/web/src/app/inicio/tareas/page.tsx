
"use client"

import * as React from "react"
import { useHomeStore } from "../home.store"
import { Button } from "@/components/ui/button"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { ROUTES } from "@/app/routes"
import { useRouter } from "next/navigation"
import { TabsContent } from "@radix-ui/react-tabs"
import { Task } from "@/app/types/entities/task.type"
import { ColumnDef } from "@tanstack/react-table"
import { createTask } from "@/app/services/tasks.service"
import { TaskType } from "./flows"
import RoleTab from "@/components/shared/role-tab"
import { DataTable } from "@/components/data-table"

const baseColumns: ColumnDef<Task>[] = [
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
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const parsed = new Date()
      return isNaN(parsed.getTime()) ? "Sin fecha" : parsed.toLocaleDateString()
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
          <div className="font-semibold">{user.name || "Sin nombre"}</div>
          <div className="text-xs text-muted-foreground">{code || "Sin código"}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const router = useRouter()
      const task = row.original
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.TASK_LIST}/${task.id}`)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    },
  },
]

export default function Tasks() {
  const roles = useHomeStore((state) => state.roles)

  if (roles.length === 0) return null

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-semibold text-core m-0">Tareas</h2>
        {roles.length === 1 ? (
          <TasksTable role={roles[0]} />
        ) : (
          <RoleTab>
            {roles.map((role, index) => (
              <TabsContent key={`${role}-${index}`} value={role}>
                <TasksTable role={role} />
              </TabsContent>
            ))}
          </RoleTab>
        )}
      </div>
    </div>
  )
}

function TasksTable({ role }: { role: string }) {
  const allTasks = useHomeStore((state) => state.tasks)
  const [selectedTasks, setSelectedTasks] = React.useState<Task[]>([])

  const columnsWithSelection: ColumnDef<Task>[] = React.useMemo(() => {
    return [
      {
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
      },
      ...baseColumns,
    ]
  }, [])

  const handleBulkApprove = async () => {
    for (const task of selectedTasks) {
      await createTask(task.id, {
        type: TaskType.SEND_APPROVE,
        approved: true,
        comment: "",
        date: new Date(),
        step: task.step,
      })
    }

    window.location.reload()
  }

  const filtered = allTasks.filter((task) => {
    if (role === "estudiante") return !!task.student
    if (role === "profesor") return !!task.professor
    if (role === "coordinador") return !!task.coordinator
    return false
  })

  return (
    <div className="space-y-4">
      {selectedTasks.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleBulkApprove}>
            Aprobar {selectedTasks.length} tarea{selectedTasks.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}
      <DataTable
        columns={columnsWithSelection}
        data={filtered}
        enableRowSelection
        onSelectedRowsChange={(selected) => setSelectedTasks(selected)}
      />
    </div>
  )
}
