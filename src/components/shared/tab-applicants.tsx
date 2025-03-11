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

interface GeneralProps {
  title: string;
  sections: SectionProps[];
}

interface SectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  status: "Aceptado" | "En revisión" | "Rechazado";
}

interface StatusProps {
  title: string;
  applicants: Applicant[];
}

export default function TabApplicants({
  general,
  status,
  children,
}: {
  general: GeneralProps;
  status: StatusProps;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="general h-16">
        <TabsList className="grid w-full grid-cols-2 bg-sky-800 text-white rounded-t-xl h-16">
          <TabsTrigger
            value="general"
            className="rounded-none data-[state=active]:bg-[#00406A] data-[state=active]:rounded data-[state=active]:text-white text-lg h-12 text-white flex items-center justify-center cursor-pointer"
          >
            Información general
          </TabsTrigger>
          <TabsTrigger
            value="status"
            className="rounded-none data-[state=active]:bg-[#00406A] data-[state=active]:rounded data-[state=active]:text-white text-lg h-12 text-white flex items-center justify-center cursor-pointer"
          >
            Aplicantes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <TabGeneralCard
            title={general.title}
            sections={general.sections}
            children={children}
          />
        </TabsContent>
        <TabsContent value="status">
          <TabApplicantsCard
            title={status.title}
            applicants={status.applicants}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TabGeneralCard({
  title,
  sections,
  children,
}: {
  title: string;
  sections: SectionProps[];
  children?: React.ReactNode;
}) {
  return (
    <Card className="max-w-4xl border border-gray-200 shadow-md rounded-b-xl bg-white">
      <CardHeader>
        <h1 className="text-2xl font-medium text-[#00406A]">{title}</h1>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {sections.map((section) => (
            <InformationSection key={section.title} {...section} />
          ))}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function InformationSection({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      {icon}
      <div className="w-full">
        <h1 className="font-medium text-sky-800">{title}</h1>
        <p className="text-gray-700 break-words">{description}</p>
        <hr className="bg-gray-300 h-[1px] w-full my-2 border-0" />
      </div>
    </div>
  );
}

function TabApplicantsCard({
  title,
  applicants,
}: {
  title: string;
  applicants: Applicant[];
}) {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(filteredApplicants.map((a) => a.id));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicants([...selectedApplicants, id]);
    } else {
      setSelectedApplicants(selectedApplicants.filter((a) => a !== id));
    }
  };

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
              className="h-9 px-3 bg-[#00406A] text-white hover:bg-[#00406A]"
            >
              <span className="mr-1">A - Z</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              className="bg-[#00406A] hover:bg-[#00406A]"
              disabled={selectedApplicants.length === 0}
            >
              Aceptar seleccionados
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-[#00406A]">
                <TableRow>
                  <TableHead className="w-12 text-white">
                    <Checkbox
                      onCheckedChange={(checked: boolean) =>
                        handleSelectAll(checked)
                      }
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#00406A]"
                    />
                  </TableHead>
                  <TableHead className="text-white">Nombre</TableHead>
                  <TableHead className="text-white">Correo</TableHead>
                  <TableHead className="text-white">Estado</TableHead>
                  <TableHead className="text-white w-12">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedApplicants.includes(applicant.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleSelectApplicant(applicant.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
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
                            <DropdownMenuItem>Aceptar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Rechazar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
