"use client";
import * as React from "react";
import { useHomeStore } from "../home.store"; // Ajusta la ruta según tu estructura
import { getPendingTasksForStudent, getPendingTasksForProfessor } from "@/app/services/project-application.service"; // Ajusta la ruta si es necesario
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RoleTab from "@/components/shared/role-tab";
import { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, flexRender, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getUserInfo } from "@/app/auth/auth-service";
import { TabsContent } from "@radix-ui/react-tabs";
import { flows } from "./flows";

const roleMap = new Map<string, React.JSX.Element>([
  ["estudiante", <TasksList key="tasks-estudiante" role="estudiante" />],
  ["profesor", <TasksList key="tasks-profesor" role="profesor" />],
  ["coordinador", <TasksList key="tasks-coordinador" role="coordinador" />],
]);

export default function Tasks() {
  const roles = useHomeStore((state) => state.roles);

  if (roles.length === 0) return null;
  if (roles.length === 1) return roleMap.get(roles[0]);

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-semibold text-core m-0">Tareas</h2>
        {roles.length === 1 ? roleMap.get(roles[0]) : <RoleTab><RoleInformation roles={roles} /></RoleTab>}
      </div>
    </div>
  );
}

function RoleInformation({ roles }: { roles: string[] }) {
  return (
    <div>
      {roles.map((role, index) => (
        <TabsContent key={`${role}-${index}`} value={role}>
          {roleMap.get(role)}
        </TabsContent>
      ))}
    </div>
  );
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  date: Date;
}

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
      const date = new Date(row.getValue("date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>Copiar ID de tarea</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Editar tarea</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function TasksList({ role }: { role: string }) {
  const { setTasks } = useHomeStore();

  React.useEffect(() => {
    getUserInfo().then((data) => {
      const userId = data.user.id;
      let taskList: Task[] = [];

      if (role === "estudiante") {
        getPendingTasksForStudent(userId).then((data) => {
          taskList = data.map((task: any) => ({
            ...task,
            title: flows.proyectoPregrado.find((step: { assignee: string; }) => step.assignee === "student")?.title || "Sin título",
            description: flows.proyectoPregrado.find((step: { assignee: string; }) => step.assignee === "student")?.description || "Sin descripción",
          }));
          setTasks(taskList);
        });
      } else if (role === "profesor") {
        getPendingTasksForProfessor(userId).then((data) => {
          taskList = data.map((task: any) => ({
            ...task,
            title: flows.proyectoPregrado.find((step: { assignee: string; }) => step.assignee === "professor")?.title || "Sin título",
            description: flows.proyectoPregrado.find((step: { assignee: string; }) => step.assignee === "professor")?.description || "Sin descripción",
          }));
          setTasks(taskList);
        });
      }
    });
  }, [role, setTasks]);

  return <DataTableDemo />; // Mostramos el DataTableDemo
}

function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const tasks: Task[] = useHomeStore((state) => state.tasks);

  const table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por título..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-core">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-core">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-primary"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay tareas disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} filas seleccionadas
        </div>
        <div className="space-x-2">
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
