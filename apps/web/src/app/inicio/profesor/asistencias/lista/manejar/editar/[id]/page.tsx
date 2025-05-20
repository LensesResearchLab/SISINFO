"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  getGraduatedAssistanceById,
  updateGraduatedAssistance,
  updateRequirement,
  createRequirimentForGraduatedAssistance,
} from "@/app/services/assistance.service";

import { GraduatedAssistance } from "@/app/types/entities/graduated-assistance.type";

/**
 * EditAssistancePage Component
 *
 * This page allows professors to edit an existing graduated assistance posting.
 * It fetches the assistance data on mount, displays it in a form,
 * and handles saving changes including both assistance details and requirements.
 */
export default function EditAssistancePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // State to manage loading and saving flags
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Main form data state
  const [formData, setFormData] = useState<GraduatedAssistance>({
    id: "",
    title: "",
    category: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    requirements: [],
    professor: {
      user: {
        id: "",
        name: "",
        email: "",
      },
    },
  });

  // Fetch existing assistance data by ID on mount
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
  }, [id]);

  // Handle simple text and textarea field updates
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection from dropdown
  const handleClassificationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  // Handle updates to individual requirement fields
  const handleRequirementChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? { ...req, description: value } : req
      ),
    }));
  };

  // Add a new blank requirement input
  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { id: "", description: "" }],
    }));
  };

  // Remove a requirement input by index
  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission, updates both assistance data and its requirements
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedRequirements = await Promise.all(
        formData.requirements.map(async (requirement) => {
          if (!requirement.id || requirement.id === "") {
            // New requirement (no ID)
            const newRequirement = await createRequirimentForGraduatedAssistance(
              id,
              requirement.description
            );
            return { ...requirement, id: newRequirement.id };
          } else {
            // Existing requirement, update it
            await updateRequirement(requirement.id, requirement);
            return requirement;
          }
        })
      );

      // Update main assistance entry
      const updatedAssistance = {
        ...formData,
        requirements: updatedRequirements,
      };

      await updateGraduatedAssistance(id, updatedAssistance);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST_EDIT}/${id}`);
    } catch (error) {
      console.error("Error saving assistance:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) return <SpinnerPage />;

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-core">Editar Asistencia Graduada</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Nombre</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Classification */}
          <div>
            <Label htmlFor="classification">Clasificación</Label>
            <Select value={formData.category} onValueChange={handleClassificationChange}>
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

          {/* Description */}
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

          {/* Requirements */}
          <div>
            <Label>Requisitos</Label>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input
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

          {/* Action buttons */}
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
