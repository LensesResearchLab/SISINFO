"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SpinnerPage from "@/components/shared/spinner-page";

interface AssistanceDetail {
  id: number;
  name: string;
  classification: string;
  description: string;
  requirements: string[];
  professor: string;
  start_semester: string;
  publication_date: Date;
  end_date: Date;
}

export default function EditAssistancePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AssistanceDetail>({
    id: 0,
    name: "",
    classification: "",
    description: "",
    requirements: [""],
    professor: "",
    start_semester: "",
    publication_date: new Date(),
    end_date: new Date(),
  });

  useEffect(() => {
    const fetchAssistanceDetails = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFormData({
          id: parseInt(id),
          name: "Asistente graduado ISIS2203",
          classification: "Docencia",
          description: "Se requiere un estudiante de maestría para que dicté la clase de los laboratorios del curso ISIS2203",
          requirements: [
            "Informar el promedio de pregrado",
            "Informar el promedio de la materia (debe ser mayor a 4.5)",
            "Adjuntar hoja de vida",
          ],
          professor: "Camilo Andrés Escobar",
          start_semester: "2025-01",
          publication_date: new Date("2025-12-12"),
          end_date: new Date("2025-12-12"),
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assistance details:", error);
        router.push("/404");
      }
    };

    fetchAssistanceDetails();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClassificationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      classification: value,
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        requirements: newRequirements,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/home/graduated-assistance/assistance-list/manage/${id}`);
    } catch (error) {
      console.error("Error saving assistance:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <SpinnerPage />;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-sky-800 mb-6">Editar Asistencia Graduada</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="classification">Clasificación</Label>
              <Select
                value={formData.classification}
                onValueChange={handleClassificationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una clasificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Docencia">Docencia</SelectItem>
                  <SelectItem value="Investigación">Investigación</SelectItem>
                  <SelectItem value="Administrativa">Administrativa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Requisitos</Label>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder={`Requisito ${index + 1}`}
                      required
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeRequirement(index)}
                        className="shrink-0"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRequirement}
                  className="w-full"
                >
                  Agregar Requisito
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-32"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-sky-800 text-white hover:bg-sky-700 w-32"
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
