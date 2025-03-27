"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpinnerPage from "@/components/shared/spinner-page";
import { ROUTES } from "@/app/routes";
import {
  createRequirement,
  getGraduatedAssistanceById,
  updateGraduatedAssistance,
  updateRequirement,
} from "@/app/services/assistance.service";
import { GraduatedAssistance, Requirement } from "@/app/types/graduated-assistance.type";

export default function EditAssistancePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<GraduatedAssistance>({
    id: "",
    title: "",
    category: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    requirements: [],
    professor: { name: "", email: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assistanceData = await getGraduatedAssistanceById(id);
        setFormData(assistanceData);
      } catch (error) {
        console.error("Error fetching assistance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClassificationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      requirements: prevFormData.requirements.map((req, i) =>
        i === index ? { ...req, description: value } : req
      ),
    }));
  };
  

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { id: "", description: "" }],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
  
    try {
      const updatedRequirements = await Promise.all(
        formData.requirements.map(async (requirement) => {
          if (!requirement.id || requirement.id === "") { // If no ID is new
            //console.log(requirement.description)
            const newRequirement = await createRequirement(requirement.description);
            return { ...requirement, id: newRequirement.id }; 
          }
          console.log("dadad");
          await updateRequirement(requirement.id, requirement);
          return requirement;
        })
      );
      setFormData((prev) => ({
        ...prev,
        requirements: updatedRequirements,
      }));  
  
      await updateGraduatedAssistance(id as string, formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST_EDIT}/${id}`);
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
        <h1 className="text-2xl font-bold mb-6 text-core">
          Editar Asistencia Graduada
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="py-2">
                Nombre
              </Label>
              <Input
                id="title"
                name="title"
                value={formData?.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="classification" className="py-2">
                Clasificación
              </Label>
              <Select
                value={formData?.category}
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
              <Label htmlFor="description" className="py-2">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label className="py-2">Requisitos</Label>
              <div className="space-y-2">
                {formData?.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      id={`requirement-${index}`}
                      name={`requirement-${index}`}
                      value={req.description}
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
            <Button type="submit" className="w-32" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
