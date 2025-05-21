"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from '@/components/data-table';
import { ColumnDef } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/entities/user.type";
import { findAllWithRoles } from "@/app/services/users.service";

const roleColorMap: Record<string, string> = {
  administrador: "bg-blue-100 text-blue-800 border border-blue-800 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-300",
  profesor: "bg-red-100 text-red-800 border border-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-300",
  coordinador: "bg-yellow-100 text-yellow-800 border border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-300",
  estudiante: "bg-green-100 text-green-800 border border-green-800 dark:bg-green-900 dark:text-green-100 dark:border-green-300",
  estudiante_maestria: "bg-purple-100 text-purple-800 border border-purple-800 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-300",
};

const formatRole = (role: string) =>
    role
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const columns: ColumnDef<User>[] = [
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
                    {(roles ?? []).map((role: string, index: number) => {
                        const colorClasses = roleColorMap[role] || "bg-gray-100 text-gray-800 border border-gray-800";
                        return (
                            <Badge
                                key={index}
                                className={`text-sm font-medium px-3 py-1 rounded-md ${colorClasses}`}
                            >
                                {formatRole(role)}
                            </Badge>
                        );
                    })}
                </div>
            );
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: () => {
            return (
                <Button>
                    Asignar roles
                </Button>
            );
        },
    },
];


export default function UserList() {
    const { data, isFetching, isError } = useQuery({
        queryKey: ['users-roles'],
        queryFn: () => findAllWithRoles(),
    });

    if (isFetching) return <SpinnerPage />;
    if (isError) return <ErrorPage />;
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
