"use client";

import {getStudentbyId } from "@/app/services/master.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import type { Course } from "../../../../../types/student-profile.type";
import SpinnerPage from "@/components/shared/spinner-page";
import { useParams } from "next/navigation";
import { ProfileTab } from "@/components/shared/profile-tab";
import { StudentTabList } from "@/components/shared/student-tab-list";
import { RenderFields } from "@/components/shared/render-fields";
import { useQuery } from "@tanstack/react-query";

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
  const params = useParams();
  const id = params.id as string;
  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student-detail", id],
    queryFn: () => getStudentbyId(id),
    enabled: !!id,
  });
  
  if (isLoading) return <SpinnerPage />;
  if (error || !student) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">No se encontró ningún estudiante para esta tesis.</p>
        <p className="text-sm mt-2">Intenta más tarde o contacta a soporte.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="profile" className="w-3xl">
        <StudentTabList/>
        <ProfileTab student={student} />
        <PlanDetailsTab courses={student.courses} others={student.otherCourses}/>
      </Tabs>
    </div>
  );
}





function PlanDetailsTab({others, courses}: {readonly others: Course[], readonly courses: Course[]}) {
  return (
    <TabsContent value="detail" className="flex justify-center flex-col items-center p-2">
      <Card className="w-3xl border-none">
        <CardHeader className="text-center text-core">
          <CardTitle className="text-2xl text-center">
            Detalle plan de estudio
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <div className="grid grid-cols-[2fr_3fr] gap-8 w-full pt-6">
            <div className="space-y-6 w-full">
              {courses?.map((course) => (
                <RenderFields key={course.id} label="Curso" value={course.name} />
              ))}
            </div>
            <div className="space-y-6 w-full">
              {courses?.map((course) => (
                <div
                  key={course.id}
                  className="flex w-full columns-2 items-center space-x-4"
                >
                  <RenderFields
                    label="Semestre"
                    className="flex-grow"
                    value={course.name}
                  />
                  <Check className="flex-shrink-0 text-core-highlight"/>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <Label className="text-xl text-core">
              Otros
            </Label>
          </div>
          <div className="grid grid-cols-[2fr_3fr] gap-8 w-full pt-6">
            <div className="space-y-6 w-full">
              {others?.map((item) => (
                <RenderFields key={item.id} label="Curso" value={item.name} />
              ))}
            </div>
            <div className="space-y-6 w-full">
              {others?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <RenderFields
                    label="Semestre"
                    className="flex-grow"
                    value={item.name}
                  />
                  <Check className="flex-shrink-0 text-core-highlight"/>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}