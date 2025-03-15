"use client";

import { getCourses, getStudent } from "@/app/inicio/profesor/publicar-consultar/services/student-profile.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import type { Course, Student } from "../types/student-profile.type";
import SpinnerPage from "@/components/shared/spinner-page";

/**
 * StudentDetail Component
 *
 * Displays the student's academic profile and their enrolled courses.
 *
 * Features:
 * - Fetches and displays student information.
 * - Shows the courses the student is enrolled in.
 * - Uses a tabbed interface to separate profile details and course details.
 *
 * @returns {JSX.Element} A component containing student details and study plan information.
 */
export default function StudentDetail() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [student, setStudent] = useState<Student>();
  const [others, setOthers] = useState<Course[]>([]);
  const [isLoading, setisLoading] = useState(true);

  /**
   * useEffect hook to fetch student and course data when the component mounts.
   */
  useEffect(() => {
    getCourses().then(setCourses);
    getStudent().then(setStudent);
    getStudent().then(data=>setOthers(data.others));
    setisLoading(false);
  }, []);
  if (isLoading) return <SpinnerPage />;

  return (
    <div className="flex justify-center items-center min-h-full min-w-full p-6">
      <Card className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto border-none">

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" style={{ color: "#075985" }}>
              Perfil
            </TabsTrigger>
            <TabsTrigger value="detail" style={{ color: "#075985" }}>
              Detalle plan de estudio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex justify-center flex-col items-center p-4">
            <Card className="w-[400px] flex justify-center flex-col items-center border-none">
              <CardHeader style={{ color: "#075985" }}>
                <CardTitle className="text-2xl">Detalle de inscripción a perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 w-full">
                <ProfileField label="Estudiante" value={student?.name} />
                <ProfileField label="Correo estudiante" value={student?.email} />
                <ProfileField label="Perfil" value={student?.profile} />
                <ProfileField label="Asesor de tesis" value={student?.advisor} />
                <ProfileField label="Semestre inicio tesis 1" value={student?.thesis1} />
                <ProfileField label="Semestre inicio tesis 2" value={student?.thesis2} />
              </CardContent>
              <CardFooter className="flex justify-center flex-col space-y-3 ">
                <CircleAlert style={{ color: "#075985" }} />
                <Label>Estado: {student?.state}</Label>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="detail">
            <div className="grid grid-cols-2 gap-8 w-full pt-6">
              <div className="space-y-6 w-full">
                {courses.map((item, index) => (
                  <CourseField key={index} label="Curso" value={item.name} />
                ))}
                
              </div>
              <div className="space-y-6 w-full">
                {courses.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex flex-col w-full space-y-1">
                      <Label style={{ color: "#075985" }}>Semestre</Label>
                      <Input defaultValue={item.period} disabled className="w-full p-3 text-lg" />
                    </div>
                    <Check className="flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
            {/* Others section */}
            <div className="pt-4">
              <Label className="text-xl" style={{color:"#075985"}}>Otros</Label>
            </div>
            <div className="grid grid-cols-2 gap-8 w-full pt-6">
              
              <div className="space-y-6 w-full">
                {others.map((item, index) => (
                  <CourseField key={index} label="Curso" value={item.name} />
                ))}
              </div>
              <div className="space-y-6 w-full">
                {others.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex flex-col w-full space-y-1">
                      <Label style={{ color: "#075985" }}>Semestre</Label>
                      <Input defaultValue={item.period} disabled className="w-full p-3 text-lg" />
                    </div>
                    <Check className="flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

/**
 * ProfileField Component
 *
 * A reusable field to display student profile information in a read-only format.
 *
 * @param {Object} props
 * @param {string} props.label - The label for the field.
 * @param {string} [props.value] - The value to be displayed in the field.
 *
 * @returns {JSX.Element} A styled input field with a label.
 */
function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-3 flex flex-col items-center">
      <Label style={{ color: "#075985" }}>{label}</Label>
      <Input defaultValue={value} disabled />
    </div>
  );
}

/**
 * CourseField Component
 *
 * A reusable field to display course details in a read-only format.
 *
 * @param {Object} props
 * @param {string} props.label - The label for the field.
 * @param {string} [props.value] - The value to be displayed in the field.
 *
 * @returns {JSX.Element} A styled input field with a label.
 */
function CourseField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <Label style={{ color: "#075985" }}>{label}</Label>
      <Input defaultValue={value} disabled className="w-full p-3 text-lg" />
    </div>
  );
}
