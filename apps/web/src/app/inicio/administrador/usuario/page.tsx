"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from '@/components/data-table';
import { ColumnDef } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/entities/user.type";
import { assignRole, findAllWithRoles } from "@/app/services/users.service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from 'react';
import { getUserInfo } from "@/app/auth/auth-service";
import { useRolesStore } from "./roles.store";

const roleColorMap: Record<string, string> = {
  administrador: "bg-blue-100 text-blue-800 border border-blue-800 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-300",
  profesor: "bg-red-100 text-red-800 border border-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-300",
  coordinador: "bg-yellow-100 text-yellow-800 border border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-300",
};

const formatRole = (role: string) =>
  role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles;
      return (
        <div className="flex flex-wrap gap-2">
          {(roles ?? []).map((role: string) => {
            const colorClasses = roleColorMap[role] || "bg-gray-100 text-gray-800 border border-gray-800";
            return (
              <Badge
                key={role}
                className={`text-sm font-medium px-3 py-1 rounded-md ${colorClasses}`}
              >
                {formatRole(role)}
              </Badge>
            );
          })}
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const rolesA = rowA.getValue<string[]>(columnId) ?? [];
      const rolesB = rowB.getValue<string[]>(columnId) ?? [];
      const formattedA = rolesA.map(formatRole).join(", ");
      const formattedB = rolesB.map(formatRole).join(", ");
      return formattedA.localeCompare(formattedB);
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <RoleSelector user={row.original} />,
  },
];

export default function UserList() {
  const setUserId = useRolesStore((state) => state.setUserId);
  const { data, isFetching, isError } = useQuery({
    queryKey: ['users-roles'],
    queryFn: () => findAllWithRoles(),
  });

  const { data: user, isFetching: isFetchingUser, isError: isErrorUser } = useQuery({
    queryKey: ['users-info'],
    queryFn: () => getUserInfo(),
  });

  if (isFetching || isFetchingUser) return <SpinnerPage />;
  if (isError || isErrorUser) return <ErrorPage />;

  setUserId(user?.user.id);

  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container">
      <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-core">
          Listado de usuarios
        </h2>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}

function RoleSelector({ user }: { user: User }) {
  const [roles, setRoles] = useState(user.roles ?? []);
  const [loading, setLoading] = useState(false);
  const userId = useRolesStore((state) => state.userId);
  const queryClient = useQueryClient();

  const availableRoles = Object.keys(roleColorMap);

  const isSelf = userId !== null && user.id === userId;
  const isSelfAdmin = isSelf && roles.includes("administrador");

  const toggleRole = async (role: string) => {
    const isRemovingAdmin = roles.includes(role) && role === "administrador";
    const isSelfRemovingAdmin = isSelf && isRemovingAdmin;

    if (isSelfRemovingAdmin) {
      toast.warning("No puedes quitarte a ti mismo el rol de administrador.");
      return;
    }

    const addingRole = !roles.includes(role);
    const newRoles = addingRole
      ? [...roles, role]
      : roles.filter(r => r !== role);

    if (isSelf && !newRoles.includes("administrador")) {
      toast.warning("Debes mantener al menos el rol de administrador.");
      return;
    }

    setLoading(true);
    try {
      await assignRole({ userId: user.id, roleType: role });
      setRoles(newRoles);
      queryClient.setQueryData<User[]>(['users-roles'], (oldData) => {
        if (!oldData) return [];
        return oldData.map(u => u.id === user.id ? { ...u, roles: newRoles } : u);
      });

      toast.success("Roles actualizados correctamente.");
    } catch (error) {
      console.error("Error updating roles:", error);
      toast.error("Error al actualizar los roles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={loading}>
          Asignar roles
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableRoles.map(role => {
          const isAdminRole = role === "administrador";
          const shouldDisable = loading || (isSelfAdmin && isAdminRole);

          return (
            <DropdownMenuCheckboxItem
              key={role}
              checked={roles.includes(role)}
              onCheckedChange={() => toggleRole(role)}
              disabled={shouldDisable}
            >
              {formatRole(role)}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
