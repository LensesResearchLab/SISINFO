"use client";

import { getCourses, getStudent } from "@/app/home/professor/publish-consult/services/student-profile.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    getStudent().then(data => setOthers(data.others));
    setisLoading(false);
  }, []);
  if (isLoading) return <SpinnerPage />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-sky-800 text-white">
          <TabsTrigger value="profile" className="data-[state=active]:bg-sky-900 data-[state=active]:font-semibold data-[state=active]:text-white">
            Perfil
          </TabsTrigger>
          <TabsTrigger value="detail" className="data-[state=active]:bg-sky-900 data-[state=active]:font-semibold data-[state=active]:text-white">
            Detalle plan de estudio
          </TabsTrigger>
        </TabsList>

        {/* Student Profile Tab */}
        <TabsContent value="profile" className="flex justify-center flex-col items-center p-2">
          <Card className="flex justify-center flex-col items-center border-none w-3xl">
            <CardHeader style={{ color: "#075985" }}>
              <CardTitle className="text-2xl">Detalle de inscripción a perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-full">
              <RenderFields label="Estudiante" value={student?.name} />
              <RenderFields label="Correo estudiante" value={student?.email} />
              <RenderFields label="Perfil" value={student?.profile} />
              <RenderFields label="Asesor de tesis" value={student?.advisor} />
              <RenderFields label="Semestre inicio tesis 1" value={student?.thesis1} />
              <RenderFields label="Semestre inicio tesis 2" value={student?.thesis2} />
            </CardContent>
            <CardFooter className="flex justify-center flex-col space-y-3 ">
              <CircleAlert style={{ color: "#075985" }} />
              <Label>Estado: {student?.state}</Label>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Study Plan Details Tab */}
        <TabsContent value="detail" className="flex justify-center flex-col items-center p-2">
          <Card className="w-3xl border-none">
            <CardHeader className="text-center" style={{ color: "#075985" }}>
              <CardTitle className="text-2xl text-center">Detalle plan de estudio</CardTitle>
            </CardHeader>
            <CardContent className="w-fullspace-y-6">
              <div className="grid grid-cols-[2fr_3fr] gap-8 w-full pt-6">
                <div className="space-y-6 w-full">
                  {courses.map((item, index) => (
                    <RenderFields key={index} label="Curso" value={item.name} />
                  ))}
                </div>
                <div className="space-y-6 w-full">
                  {courses.map((item, index) => (
                    <div key={index} className="flex w-full columns-2 items-center space-x-4">
                      <RenderFields key={index} label="Semestre" className="flex-grow" value={item.name}></RenderFields>
                      <Check className="flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Others section */}
              <div className="pt-4">
                <Label className="text-xl" style={{ color: "#075985" }}>Otros</Label>
              </div>
              <div className="grid grid-cols-[2fr_3fr] gap-8 w-full pt-6">
                <div className="space-y-6 w-full">
                  {others.map((item, index) => (
                    <RenderFields key={index} label="Curso" value={item.name} />
                  ))}
                </div>
                <div className="space-y-6 w-full">
                  {others.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <RenderFields key={index} label="Semestre" className="flex-grow" value={item.name}></RenderFields>
                      <Check className="flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * RenderFields Component
 *
 * A reusable field to display student profile information in a read-only format.
 *
 * @param {Object} props
 * @param {string} props.label - The label for the field.
 * @param {string} [props.value] - The value to be displayed in the field.
 *
 * @returns {JSX.Element} A styled input field with a label.
 */
function RenderFields({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="w-full">
        <h3 className="font-medium text-sky-800">{label}</h3>
        <p className="text-gray-700">{value}</p>
        <hr className="bg-gray-300 h-[1px] w-full my-2 border-0" />
      </div>
    </div>
  );
}