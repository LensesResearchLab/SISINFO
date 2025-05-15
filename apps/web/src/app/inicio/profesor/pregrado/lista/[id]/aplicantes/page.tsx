"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";
import { use, useEffect, useState } from "react";
import { getUndergraduateProjectById } from "@/app/services/project.service"; // Asegúrate de que esté importado correctamente
import { updateProjectApplication } from "@/app/services/project-application.service";  // Asegúrate de que esté importado correctamente
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { Application } from "@/app/types/project-application.type";
import { ROUTES } from "@/app/routes";

export default function ProjectDetail({
  params,
}: {
  readonly params: Promise<{ id: string }>;}) {
  const [data, setData] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const { id } = use(params);

  useEffect(() => {
    getUndergraduateProjectById(id).then((data) => {
      setData(data.projectApplications);
      console.log(data);
    });
  }, [id]);

  const handleConfirmAccepted = async () => {
    try {
      await Promise.all(
        selectedApplicantIds.map((id) =>{
          console.log(id);
          updateProjectApplication(id, { status: newStatus })
        }
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (ids: string[], status: string) => {
    setSelectedApplicantIds(ids);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedApplicantIds(checked ? data.map((a) => a.id) : []);
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    setSelectedApplicantIds(
      checked
        ? [...selectedApplicantIds, id]
        : selectedApplicantIds.filter((a) => a !== id)
    );
  };

  return (
    <div className="min-h-full w-full container max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full bg-card shadow-lg rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-core font-semibold text-xl">Lista de aplicantes</h2>
        <DataTableDemo
          data={data}
          handleOpenModal={handleOpenModal}
          handleSelectAll={handleSelectAll}
          handleSelectApplicant={handleSelectApplicant}
          selectedApplicantIds={selectedApplicantIds}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        dialogText={{
          title: "Confirmar Acción",
          description: "¿Estás seguro de que quieres proceder?",
          buttonText: "Aceptar",
          successTitle: "Acción exitosa",
          successText: "Los cambios fueron realizados correctamente.",
          url: ROUTES.HOME + "/" + ROUTES.PROJECTS, // Cambiar según la ruta del proyecto
        }}
        onConfirm={handleConfirmAccepted}
        open={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </div>
  );
}

function DataTableDemo({
  data,
  handleOpenModal,
  handleSelectAll,
  handleSelectApplicant,
  selectedApplicantIds,
}: {
  data: Application[];
  handleOpenModal: (ids: string[], status: string) => void;
  handleSelectAll: (checked: boolean) => void;
  handleSelectApplicant: (id: string, checked: boolean) => void;
  selectedApplicantIds: string[];
}) {
  const [sortAscending, setSortAscending] = useState(true);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
              />
            </TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>
                <Checkbox
                  checked={selectedApplicantIds.includes(applicant.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleSelectApplicant(applicant.id, checked)
                  }
                />
              </TableCell>
              <TableCell>{applicant.student.user.name}</TableCell>
              <TableCell>{applicant.student.code}</TableCell>
              <TableCell>{applicant.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleOpenModal([applicant.id], "Inscrito")}
                    >
                      Aceptar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenModal([applicant.id], "Rechazado")}
                    >
                      Rechazar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}