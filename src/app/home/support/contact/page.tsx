"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCoordinators } from "@/app/home/support/services/support.service";
import { Coordinator } from "@/app/home/support/types/support.types";
import Image from "next/image";

/**
 * AcademicCoordinators Component
 *
 * Displays a list of academic coordinators with their images, contact information, and other relevant details.
 *
 * Features:
 * - Fetches and displays the coordinators' data
 * - Displays each coordinator's image, name, office, email, and extension
 * - Includes a button to schedule a meeting with Bookeau
 * 
 * @returns {JSX.Element} A div containing the list of academic coordinators and a "Reserva tu cita" button.
 */
export default function AcademicCoordinators() {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

  /**
   * useEffect hook to fetch coordinator data when the component mounts
   */
  useEffect(() => {
    getCoordinators().then((data) => {
      setCoordinators(data); 
    });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-full min-w-full">
      <Card className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto border-none">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-blue-800 mb-6">
            Tus coordinadores académicos
          </h2>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-6">
          {coordinators.map((coordinator, index) => (
            <Card key={index} className="flex items-center p-6 w-96 shadow-lg rounded-lg border-none">
              <Image
                src={coordinator.image}
                height={96}
                width={96}
                alt={coordinator.name}
                className="w-24 h-24 rounded-full object-cover mr-6"
              />
              <CardContent className="text-left">
                <h3 className="text-xl font-semibold text-blue-800 mb-2 p-2">
                  {coordinator.name}
                </h3>
                <p className="text-lg text-gray-600 mb-1">
                  Oficina: {coordinator.office}
                </p>
                <p className="text-lg text-gray-600 mb-1">
                  Correo: {coordinator.email}
                </p>
                <p className="text-lg text-gray-600">
                  Extensión: {coordinator.extension}
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <div className="mt-6 flex flex-col items-center">
          <Image 
            src="https://images.squarespace-cdn.com/content/v1/58e0281dd482e9ebf9713ccb/9f338ffa-6dd9-4b0b-963c-b7a9fbab3e96/Logo+Bookeau.png" 
            width={256}
            height={64}
            alt="Bookeau" className="w-64 mb-4" />
          <Button className="bg-black text-white px-6 py-2 rounded-md text-lg">
            Reserva tu cita
          </Button>
        </div>
      </Card>
    </div>
  );
}