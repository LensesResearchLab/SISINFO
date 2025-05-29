/**
 * @module ProjectDetail
 * @description
 * Displays and manages the list of student applicants for a given undergraduate project.
 * Allows the professor to select, accept, or reject applications in bulk or individually.
 *
 * @returns {JSX.Element} The rendered view of applicants associated with a project.
 *
 * @remarks
 * This component fetches project application data and provides UI controls for selection and status updates.
 * Uses a confirmation modal to confirm actions before persisting changes.
 *
 * @see {@link getUndergraduateProjectById} to fetch applicants per project
 * @see {@link updateProjectApplication} to update application status
 */

"use client";

import * as React from "react";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUndergraduateProjectById } from "@/app/services/project.service";
import { updateProjectApplication } from "@/app/services/project-application.service";
import { DataTable } from "@/components/data-table";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Application } from "@/app/types/project-application.type";
import { ROUTES } from "@/app/routes";
import { ColumnDef } from "@tanstack/react-table";

export default function ProjectDetail({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  const {
    data,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-project-application", id],
    queryFn: () => getUndergraduateProjectById(id).then(res => res.projectApplications),
  });

  const handleOpenModal = (ids: string[], status: string) => {
    setSelectedApplicantIds(ids);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  const handleConfirmAccepted = async () => {
    try {
      await Promise.all(
        selectedApplicantIds.map((id) =>
          updateProjectApplication(id, { status: newStatus })
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!data) return;
    setSelectedApplicantIds(checked ? data.map((a: { id: any; }) => a.id) : []);
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    setSelectedApplicantIds((prev) =>
      checked ? [...prev, id] : prev.filter((a) => a !== id)
    );
  };

  const columns: ColumnDef<Application>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedApplicantIds.includes(row.original.id)}
          onCheckedChange={(checked) => handleSelectApplicant(row.original.id, Boolean(checked))}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "student.user.name",
      header: "Nombre",
      cell: ({ row }) => row.original.student.user.name,
    },
    {
      accessorKey: "student.code",
      header: "Código",
      cell: ({ row }) => row.original.student.code,
    },
    {
      accessorKey: "status",
      header: "Estado",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenModal([row.original.id], "Inscrito")}
          >
            Aceptar
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleOpenModal([row.original.id], "Rechazado")}
          >
            Rechazar
          </Button>
        </div>
      ),
    },
  ];

  if (isFetching) return <div className="text-center py-10">Cargando...</div>;
  if (error || !data) return <div className="text-center py-10">Error al cargar los datos.</div>;
  console.log(data);
  const approvedData = data?.filter((a: any) => a.status === "Aceptado");

  return (
    <div className="min-h-full w-full container max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full bg-card shadow-lg rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-core font-semibold text-xl">Lista de aplicantes</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenModal(selectedApplicantIds, "Inscrito")}
            disabled={selectedApplicantIds.length === 0}
          >
            Aceptar seleccionados
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleOpenModal(selectedApplicantIds, "Rechazado")}
            disabled={selectedApplicantIds.length === 0}
          >
            Rechazar seleccionados
          </Button>
        </div>

        <DataTable columns={columns} data={approvedData} />
      </div>

      <ConfirmationModal
        dialogText={{
          title: "Confirmar Acción",
          description: "¿Estás seguro de que quieres proceder?",
          buttonText: "Aceptar",
          successTitle: "Acción exitosa",
          successText: "Los cambios fueron realizados correctamente.",
          url: `${ROUTES.HOME}/${ROUTES.PROJECTS}`,
        }}
        onConfirm={handleConfirmAccepted}
        open={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </div>
  );
}