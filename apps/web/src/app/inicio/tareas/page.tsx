"use client";
import * as React from "react";
import { useHomeStore } from "../home.store";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RoleTab from "@/components/shared/role-tab";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { TabsContent } from "@radix-ui/react-tabs";
import { Task } from "@/app/types/entities/task.type";

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
        {roles.length === 1 ? (
          roleMap.get(roles[0])
        ) : (
          <RoleTab>
            <RoleInformation roles={roles} />
          </RoleTab>
        )}
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

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-[200px]">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("date");
      const parsed = date instanceof Date ? date : new Date();
      const isValid = !isNaN(parsed.getTime());
      return <div>{isValid ? parsed.toLocaleDateString() : "Sin fecha"}</div>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const task = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                router.push(`${ROUTES.HOME}/${ROUTES.TASK_LIST}/${task.id}`)
              }
            >
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem>Editar tarea</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function TasksList({ role }: { role: string }) {
  return <DataTableDemo role={role} />;
}

function DataTableDemo({ role }: { role: string }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const allTasks: Task[] = useHomeStore((state) => state.tasks);

  // ✅ Filtrado por rol (según contenido)
  const tasks = allTasks.filter((task) => {
    if (role === "estudiante") return !!task.student;
    if (role === "profesor") return !!task.professor;
    return false;
  });

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
          value={
            (table.getColumn("title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} filas seleccionadas
        </div>
        <div className="space-x-2">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
