"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentTabList, ProfileTab } from "../profesor/maestria/lista/[id]/page"
import type { Course, Student } from "../../types/student-profile.type"
import { getStudentbyId } from "@/app/services/master.service"

export default function StudyPlanForm() {
  const [courses, setCourses] = useState<Course[]>([])

  const [student, setStudent] = useState<Student>();
  const [others, setOthers] = useState<Course[]>([]);

  const id = 'Document 10'
  useEffect(() => {
    getStudentbyId(id).then((data)=>{
      setStudent(data)  
      setOthers(data.others)
      setCourses(data.courses)
    } );
  }, [id]);


  const [newCourse, setNewCourse] = useState({
    name: "",
    period: "",
  })
  const [newOtherCourse, setNewOtherCourse] = useState({
    name: "",
    period: "",
  })
  const [showNewForm, setShowNewForm] = useState(false)
  const [showNewOtherForm, setShowNewOtherForm] = useState(false)
  const addCourse = () => {
    if (newCourse.name && newCourse.period) {
      const completeNewCourse: Course = {
        id: courses?.length + 1,
        name: newCourse.name,
        period: newCourse.period,
      }

      setCourses([...courses, completeNewCourse])
      setNewCourse({
        name: "",
        period: "",
      })
      setShowNewForm(false)
    }
  }
  const addOtherCourse = () => {
    if (newOtherCourse.name && newOtherCourse.period) {
      const completeNewCourse: Course = {
        id: others.length + 1,
        name: newOtherCourse.name,
        period: newOtherCourse.period,
      }
      setOthers([...others, completeNewCourse])
      setNewOtherCourse({
        name: "",
        period: "",
      })
      setShowNewOtherForm(false)
    }
  }
  if (!student) return <p>student not found</p>
  return (
    <div className="max-w-3xl mx-auto p-4 bg-subtable" >
      <Tabs defaultValue="profile" className="w-full">
        <StudentTabList/>
        <ProfileTab student={student}/>
        <TabsContent value="details">
          <div className="bg-white rounded-lg p-4">
            <div className="space-y-4">
              {courses?.map((course) => (
                <div key={course.id} className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="text-sm font-medium text-core mb-1">Course</div>
                    <Input
                      value={course.name}
                      onChange={(e) => {
                        const updatedCourses = courses.map((c) =>
                          c.id === course.id ? { ...c, name: e.target.value } : c,
                        )
                        setCourses(updatedCourses)
                      }}
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-core mb-1">period</div>
                      <Input
                        value={course.period}
                        onChange={(e) => {
                          const updatedCourses = courses.map((c) =>
                            c.id === course.id ? { ...c, period: e.target.value } : c,
                          )
                          setCourses(updatedCourses)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showNewForm && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Add New Course</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-core mb-1">Course</div>
                    <Input
                      placeholder="Course name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-core mb-1">period</div>
                    <Input
                      placeholder="Ex: 202510"
                      value={newCourse.period}
                      onChange={(e) => setNewCourse({ ...newCourse, period: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" onClick={() => setShowNewForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addCourse}>Save</Button>
                </div>
              </div>
            )}
            {!showNewForm && (
              <div className="mt-6">
                <Button variant="outline" onClick={() => setShowNewForm(true)}>
                  + Add New Course
                </Button>
              </div>
            )}
            <div className="mt-10 pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">Others</h2>
              <div className="space-y-4">
                {others?.map((course) => (
                  <div key={course.id} className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <div className="text-sm font-medium text-core mb-1">Course</div>
                      <Input
                        value={course.name}
                        onChange={(e) => {
                          const updatedCourses = others.map((c) =>
                            c.id === course.id ? { ...c, name: e.target.value } : c,
                          )
                          setOthers(updatedCourses)
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-core mb-1">period</div>
                        <Input
                          value={course.period}
                          onChange={(e) => {
                            const updatedCourses = others.map((c) =>
                              c.id === course.id ? { ...c, period: e.target.value } : c,
                            )
                            setOthers(updatedCourses)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {showNewOtherForm && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add New Course in Others</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-core mb-1">Course</div>
                      <Input
                        placeholder="Course name"
                        value={newOtherCourse.name}
                        onChange={(e) => setNewOtherCourse({ ...newOtherCourse, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-core mb-1">period</div>
                      <Input
                        placeholder="Ex: 202510"
                        value={newOtherCourse.period}
                        onChange={(e) => setNewOtherCourse({ ...newOtherCourse, period: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" onClick={() => setShowNewOtherForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addOtherCourse}>Save</Button>
                  </div>
                </div>
              )}
              {!showNewOtherForm && (
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setShowNewOtherForm(true)}>
                    + Add New Course in Others
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
