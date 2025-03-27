"use client";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical, Search } from "lucide-react";
import { useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";
import { ROUTES } from "@/app/routes";
import { GraduatedAssistanceApplication } from "@/app/types/graduated-assistance-application.type";
import { updateAssistanceApplication } from "@/app/services/assistance.service";

interface Section {
  title: string;
  description: string;
  icon: React.ReactNode;
}


interface TabStatusProps {
  general: {
    title: string;
    sections: Section[];
  };
  status: {
    title: string;
    applicants: GraduatedAssistanceApplication[];
  };
  children?: React.ReactNode;
}

const path = `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST}`;
const dialogTextAccepted = {
  title: "Confirmar Accion",
  description: "¿Estás seguro de que quieres proceder?",
  buttonText: "Aceptar",
  successTitle: "Exitoso.",
  successText: "Accion realizada correctamente.",
  url: path,
};

export default function TabStatus({
  general,
  status,
  children,
}: TabStatusProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2 rounded-t-xl h-16 bg-core color-card">
          {["general", "status"].map((tab, index) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none data-[state=active]:bg-core-highlight data-[state=active]:rounded-t-xl data-[state=active]:text-card text-lg h-12 text-card flex items-center justify-center cursor-pointer"
            >
              {index === 0 ? "Información general" : "Aplicantes"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Card className="max-w-4xl border border-ring shadow-md rounded-b-xl bg-card">
            <CardHeader>
              <h1 className="text-2xl font-medium text-core-highlight">
                {general.title}
              </h1>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {general.sections.map((section) => (
                  <div key={section.title} className="flex gap-3">
                    {section.icon}
                    <div className="w-full">
                      <h1 className="font-medium text-core-highlight">
                        {section.title}
                      </h1>
                      <p className="text-primary break-words">
                        {section.description}
                      </p>
                      <hr className="bg-ring h-[1px] w-full my-2 border-0" />
                    </div>
                  </div>
                ))}
                {children}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <ApplicantsTable applicants={status.applicants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicantsTable({ applicants }: { applicants: GraduatedAssistanceApplication[] }) {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  const handleConfirmAccepted = async () => {
    console.log(selectedApplicantIds)
    console.log(newStatus)
    if (!selectedApplicantIds) return;
    try {
      // Update multiple applicants status or just one
      await Promise.all(
        selectedApplicantIds.map((id) =>
          updateAssistanceApplication(id, { status: newStatus })
        )
      );
      setIsModalOpen(false);
      }
     catch (error) {
      console.error(error);
    };
  }

  const handleOpenModal = (ids: string[], status: string) => {
    setSelectedApplicantIds(ids);
    setNewStatus(status);
    setIsModalOpen(true);
  };


  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedApplicants(checked ? filteredApplicants.map((a) => a.id) : []);
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    setSelectedApplicants(
      checked
        ? [...selectedApplicants, id]
        : selectedApplicants.filter((a) => a !== id)
    );
  };

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    return sortAscending
      ? a.student.name.localeCompare(b.student.name)
      : b.student.name.localeCompare(a.student.name);
  });

  return (
    <Card className="border-none max-w-4xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar un estudiante"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 bg-core text-card hover:bg-core-highlight"
              onClick={() => setSortAscending(!sortAscending)}
            >
              <span className="mr-1">A - Z</span>
              <ChevronDown
                className={`h-4 w-4 transform ${sortAscending ? "" : "rotate-180"}`}
              />
            </Button>
            <Button
              variant="default"
              className="bg-core hover:bg-core-highlight"
              disabled={selectedApplicants.length === 0}
              onClick={() => handleOpenModal(selectedApplicants, "Aceptado")}
            >
              Aceptar seleccionados
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-core">
                <TableRow>
                  <TableHead className="w-12 text-card">
                    <Checkbox
                      onCheckedChange={(checked: boolean) =>
                        handleSelectAll(checked)
                      }
                      className="border-card data-[state=checked]:bg-card data-[state=checked]:text-core"
                    />
                  </TableHead>
                  <TableHead className="text-card">Nombre</TableHead>
                  <TableHead className="text-card">Correo</TableHead>
                  <TableHead className="text-card">Estado</TableHead>
                  <TableHead className="text-card w-12 px-5">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplicants.length > 0 ? (
                  sortedApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedApplicants.includes(applicant.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleSelectApplicant(applicant.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{applicant.student.name}</TableCell>
                      <TableCell>{applicant.student.email}</TableCell>
                      <TableCell>{applicant.status}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenModal([applicant.id], "Aceptado")}>
                              Aceptar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenModal([applicant.id], "Rechazado")}>
                              Rechazar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <ConfirmationModal
                          dialogText={dialogTextAccepted}
                          onConfirm={handleConfirmAccepted}
                          open={isModalOpen}
                          setIsOpen={setIsModalOpen}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay aplicantes que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
