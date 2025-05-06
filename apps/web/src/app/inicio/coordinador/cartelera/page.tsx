"use client";
import React, { useState, useMemo, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Billboard, Course } from "@/app/types/billboard.type";
import { createBillboard, getBillboard } from "@/app/services/billboard.service";
import { ROUTES } from "@/app/routes";
import { UploadFilePage } from "@/components/shared/upload-files-page";
import { AlertDialogError } from "@/components/shared/alert-dialog-error";


export default function UploadBillboard() {
  const headers = React.useMemo<(keyof Billboard)[]>(() => [
    "NRC",
    "code",
    "name",
    "departament",
    "credits",
    "section",
    "period",
    "professors",
  ], []);
  
  const [csvData, setCsvData] = useState<Billboard[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loadError, setLoadError] = useState(false);


  const dialogText = {
    title: "Publicar cartelera",
    description: "¿Estás seguro de que deseas publicar esta cartelera?",
    buttonText: "Publicar cartelera",
    successTitle: "Cartelera Publicado",
    successText: "Tu cartelera ha sido publicada exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.BULLETIN_BOARD}`,
  };
  

  const convertToCSV = (headers: (keyof Billboard)[], data: Billboard[]) => {
    const csv = [headers.join(",")];
    data.slice(0, 3).forEach((row) => {
      const rowData = headers.map((header) => row[header] ?? "");
      csv.push(rowData.join(","));
    });
    return csv.join("\n");
  };

  const csvContent = React.useMemo(() => convertToCSV(headers, csvData), [csvData, headers]);

  const handleDownload = () => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadCsv = (data: Billboard[])  => {
    setCsvData(data);
    createBillboard(data);
  };

  const handlePeriodChange = (value: string) => {
    getBillboard(value).then((data) => {
      setCoursesData(data.courses);
      setLoadError(false);
    }).catch(()=>{
      setCoursesData([]);
      setLoadError(true);
      
    })
  };

  return (
    <>
  <UploadFilePage
    title="Cargar cartelera"
    handlePeriodChange={handlePeriodChange}
    handleDownload={handleDownload}
    handleUploadCsv={(data) => {
      const billboardData = data as unknown as Billboard[];
      handleUploadCsv(billboardData);
    }}
    dialogText={dialogText}
  >
    <UploadedBillboard classesData={coursesData} loadError={loadError} />
  </UploadFilePage>
  <AlertDialogError
        open={loadError}
        onOpenChange={setLoadError}/>
  </>
  
  );
}


function UploadedBillboard({ classesData, loadError }: { classesData: Course[], loadError: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDesc, setSortDesc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClasses = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return classesData
      .filter((c) => c.name.toLowerCase().includes(lowerSearch) || c.code.toLowerCase().includes(lowerSearch))
      .sort((a, b) =>
        a.name.localeCompare(b.name) * (sortDesc ? -1 : 1)
      );
  }, [searchTerm, sortDesc, classesData]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortDesc]);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);

  const displayedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredClasses.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredClasses, currentPage]);

  if (loadError) {
    return (
      <BillboardNotFound />
    );
  }

  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Cartelera cargada</h2>
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
            <input
              type="text"
              className="pl-9 pr-4 py-2 border rounded focus:outline-none text-primary w-full text-center"
              placeholder="Busca una clase o profesor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setSortDesc(!sortDesc)} className="bg-core text-card hover:bg-core">
              {sortDesc ? "Z - A" : "A - Z"}
            </Button>
        </div>
        <BillboardTable
          displayedClasses={displayedClasses}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

function BillboardNotFound() {
  return (
      <div className="min-h-full min-w-full">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">Error al cargar la cartelera</h2>
          <p className="text-primary text-center">No se pudo cargar la cartelera. Por favor, intenta nuevamente.</p>
        </div>
      </div>
  )
}

function BillboardTable({
  displayedClasses,
  currentPage,
  setCurrentPage,
  totalPages,
}: {
  displayedClasses: Course[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const toggleRow = (idx: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  return (
    <Fragment>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-core">
            <TableRow>
              <TableHead className="text-card font-bold">Clase</TableHead>
              <TableHead className="text-card font-bold">Código</TableHead>
              <TableHead className="text-card font-bold">Secciones</TableHead>
              <TableHead className="text-card font-bold">Créditos</TableHead>
              <TableHead className="text-card font-bold">Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClasses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-primary text-center">No encontrado.</TableCell>
              </TableRow>
            ) : (
              displayedClasses.map((clase, idx) => (
                <Fragment key={idx}>
                  <TableRow
                    className={`cursor-pointer ${expandedRows[idx] ? "text-primary" : ""}`}
                    onClick={() => toggleRow(idx)}
                  >
                    <TableCell className="font-semibold text-primary">{clase.name}</TableCell>
                    <TableCell className="text-primary">{clase.code}</TableCell>
                    <TableCell className="text-primary">{clase.sections.length}</TableCell>
                    <TableCell className="text-primary">{clase.credits}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleRow(idx); }}>
                        <Search className="w-4 h-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows[idx] && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-4">
                          <Table className="w-full table-fixed">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Profesores</TableHead>
                                <TableHead>Sección</TableHead>
                                <TableHead>NRC</TableHead>
                                <TableHead>Ciclo</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {clase.sections.length > 0 ? (
                                clase.sections.map((section, pidx) => (
                                  <TableRow key={`${idx}-${pidx}`}>
                                    <TableCell>
                                      {section.professors.length > 0
                                        ? section.professors.map((p) => p.user.name).join(", ")
                                        : "No professors assigned"}
                                    </TableCell>
                                    <TableCell>{section.section}</TableCell>
                                    <TableCell>{section.NRC}</TableCell>
                                    <TableCell>{section.period.period}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4}>Profesores no asignados</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <span className="self-center text-primary">
          Página {currentPage} de {totalPages}
        </span>
        <Button size="sm" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
          Siguiente
        </Button>
      </div>
    </Fragment>
  );
}