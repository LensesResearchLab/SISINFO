"use client";
import React, { useEffect, useState } from "react";
import { API_ROUTES } from "@/app/routes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Profile = {
  id: number | string;
  name: string;
  coordinator?: { id: number | string; user?: { name?: string; email?: string } };
};

type Professor = { id: number | string; user: { name: string; email?: string } };

export default function EnrollPlanPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [coursesList, setCoursesList] = useState<Array<{ id: number | string; name: string }>>([]);
  const [periods, setPeriods] = useState<Array<{ id: number | string; year?: number; semester?: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emptyCourses = Array.from({ length: 7 }).map(() => ({ courseId: "", semester: "" }));

  const [form, setForm] = useState({
    profileId: "",
    coordinatorId: "",
    advisorId: "",
    semesterStart1: "",
    semesterStart2: "",
    courses: emptyCourses,
    otherCourse: { courseId: "", semester: "" },
    comments: "",
  });

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const base = API_ROUTES.BASE;
        const [pfRes, prRes, coursesRes, periodsRes] = await Promise.all([
          fetch(`${base}/profiles`).then((r) => r.json()),
          fetch(`${base}/${API_ROUTES.PROFESSORS}`).then((r) => r.json()),
          fetch(`${base}/${API_ROUTES.COURSES}`).then((r) => r.json()),
          fetch(`${base}/${API_ROUTES.PERIODS}`).then((r) => r.json()),
        ]);
        setProfiles(Array.isArray(pfRes) ? pfRes : []);
        setProfessors(Array.isArray(prRes) ? prRes : []);
        setCoursesList(Array.isArray(coursesRes) ? coursesRes : []);
        setPeriods(Array.isArray(periodsRes) ? periodsRes : []);
      } catch (err) {
        setError("No se pudieron cargar datos del servidor.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    const p = profiles.find((x) => String(x.id) === String(form.profileId));
    if (p && p.coordinator) setForm((f) => ({ ...f, coordinatorId: String(p.coordinator!.id) }));
  }, [form.profileId, profiles]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCourseChange(index: number, field: "courseId" | "semester", value: string) {
    setForm((f) => {
      const next = { ...f } as any;
      const arr = Array.isArray(next.courses) ? [...next.courses] : [];
      arr[index] = { ...arr[index], [field]: value };
      next.courses = arr;
      return next;
    });
  }

  function handleOtherCourseChange(field: "courseId" | "semester", value: string) {
    setForm((f) => ({ ...f, otherCourse: { ...f.otherCourse, [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.profileId) return setError("Selecciona un perfil.");
    if (!form.advisorId) return setError("Selecciona un asesor de tesis.");
    if (!form.semesterStart1) return setError("Ingresa semestre de inicio (Tesis 1).");

    const hasCourse = Array.isArray(form.courses) && form.courses.some((c: any) => c.courseId);
    if (!hasCourse && !form.otherCourse?.courseId) return setError("Selecciona al menos un curso o agrega uno en 'Otros'.");

    setSubmitting(true);
    try {
      const base = API_ROUTES.BASE;
      const payload = {
        profileId: form.profileId,
        coordinatorId: form.coordinatorId || null,
        advisorId: form.advisorId,
        semesterStart1: form.semesterStart1,
        semesterStart2: form.semesterStart2 || null,
        comments: form.comments || null,
        courses: Array.isArray(form.courses)
          ? form.courses.filter((c: any) => c.courseId).map((c: any) => ({ courseId: c.courseId, semester: c.semester }))
          : [],
        otherCourse: form.otherCourse?.courseId ? { courseId: form.otherCourse.courseId, semester: form.otherCourse.semester } : null,
      };

      const res = await fetch(`${base}/${API_ROUTES.THESIS_APPLICATIONS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Error al enviar la solicitud");
      }

      setSuccess("Solicitud enviada correctamente. El coordinador la recibirá para evaluación.");
      setForm({ profileId: "", coordinatorId: "", advisorId: "", semesterStart1: "", semesterStart2: "", courses: emptyCourses, otherCourse: { courseId: "", semester: "" }, comments: "" });
    } catch (err: any) {
      setError(err?.message || "Error al enviar la solicitud");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full mx-auto p-4 container max-w-[900px]">
      <Card className="w-full mx-auto shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-core-highlight">Inscribir plan de estudios</CardTitle>
          <div className="text-muted-foreground mt-2">Completa el formulario para enviar tu solicitud. La solicitud llegará al coordinador del perfil seleccionado (no al asesor de tesis).</div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {loading ? (
            <p>Cargando perfiles y asesores...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}
              {success && <div className="text-sm text-green-600">{success}</div>}

              <div>
                <label className="block text-sm font-medium">Perfil</label>
                <select name="profileId" value={form.profileId} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                  <option value="">Selecciona un perfil</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.name}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">El coordinador del perfil recibirá la solicitud.</p>
              </div>

              <div>
                <label className="block text-sm font-medium">Asesor de tesis</label>
                <select name="advisorId" value={form.advisorId} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                  <option value="">Selecciona un asesor</option>
                  {professors.map((prof) => (
                    <option key={prof.id} value={String(prof.id)}>{prof.user?.name}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">El asesor es informativo; la decisión la toma el coordinador del perfil.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Semestre inicio - Tesis 1</label>
                  <select name="semesterStart1" value={form.semesterStart1} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <option value="">Selecciona semestre</option>
                    {periods.length > 0 ? periods.map((p) => <option key={String(p.id)} value={`${p.year}-${p.semester}`}>{`${p.year}-${p.semester}`}</option>) : ["2026-1","2026-2","2027-1"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Semestre inicio - Tesis 2 (opcional)</label>
                  <select name="semesterStart2" value={form.semesterStart2} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <option value="">Selecciona semestre</option>
                    {periods.length > 0 ? periods.map((p) => <option key={String(p.id)} value={`${p.year}-${p.semester}`}>{`${p.year}-${p.semester}`}</option>) : ["2026-1","2026-2","2027-1"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold">Cursos del plan de estudios (hasta 7)</h3>
                <p className="text-xs text-muted-foreground mb-2">Selecciona el curso y el semestre en que lo cursaste</p>
                <div className="space-y-3">
                  {form.courses.map((c: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <div className="md:col-span-2">
                        <select value={c.courseId} onChange={(e) => handleCourseChange(idx, "courseId", e.target.value)} className="block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Selecciona curso (opcional)</option>
                          {coursesList.length > 0 ? coursesList.map((cc) => <option key={String(cc.id)} value={String(cc.id)}>{cc.name}</option>) : <option value="">No hay cursos cargados</option>}
                        </select>
                      </div>
                      <div>
                        <select value={c.semester} onChange={(e) => handleCourseChange(idx, "semester", e.target.value)} className="block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Semestre</option>
                          {(periods.length > 0 ? periods.map((p) => `${p.year}-${p.semester}`) : ["2026-1","2026-2","2027-1"]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-md font-medium">Otro curso (si aplica)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mt-2">
                    <div className="md:col-span-2">
                      <select value={form.otherCourse.courseId} onChange={(e) => handleOtherCourseChange("courseId", e.target.value)} className="block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="">Selecciona curso (otro)</option>
                        {coursesList.length > 0 ? coursesList.map((cc) => <option key={String(cc.id)} value={String(cc.id)}>{cc.name}</option>) : <option value="">No hay cursos cargados</option>}
                      </select>
                    </div>
                    <div>
                      <select value={form.otherCourse.semester} onChange={(e) => handleOtherCourseChange("semester", e.target.value)} className="block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="">Semestre</option>
                        {(periods.length > 0 ? periods.map((p) => `${p.year}-${p.semester}`) : ["2026-1","2026-2","2027-1"]).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-core text-white rounded">{submitting ? "Enviando..." : "Enviar solicitud"}</button>
                <button type="button" onClick={() => setForm({ profileId: "", coordinatorId: "", advisorId: "", semesterStart1: "", semesterStart2: "", courses: emptyCourses, otherCourse: { courseId: "", semester: "" }, comments: "" })} className="px-4 py-2 border rounded">Limpiar</button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
