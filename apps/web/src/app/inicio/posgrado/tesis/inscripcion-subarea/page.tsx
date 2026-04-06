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
  const [professorTheses, setProfessorTheses] = useState<Array<{ id: string; title: string }>>([]);
  const [coursesList, setCoursesList] = useState<Array<{ id: number | string; name: string }>>([]);
  const [periods, setPeriods] = useState<Array<{ id: number | string; year?: number; semester?: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emptyCourses = Array.from({ length: 7 }).map(() => ({ courseId: "", semester: "", seen: false }));

  const [form, setForm] = useState({
    profileId: "",
    coordinatorId: "",
    advisorId: "",
    topic: "",
    semesterStart1: "",
    semesterStart2: "",
    courses: emptyCourses,
    otherCourse: { courseId: "", semester: "", seen: false },
    otherCourse2: { courseId: "", semester: "", seen: false },
    comments: "",
  });

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const base = API_ROUTES.BASE;
        const [pfRes, prRes, coursesRes, periodsRes] = await Promise.all([
          fetch(`${base}/subareas`).then((r) => r.json()),
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

  // load theses for selected advisor
  useEffect(() => {
    const aid = form.advisorId;
    if (!aid) return setProfessorTheses([]);
    (async () => {
      try {
        const base = API_ROUTES.BASE;
        const res = await fetch(`${base}/theses/professor/${aid}`);
        const data = await res.json();
        // map to simple id/title
        const list = Array.isArray(data)
          ? data.map((t: any) => ({ id: String(t.id), title: t.title ?? t.name ?? `Tema ${t.id}` }))
          : [];
        setProfessorTheses(list);
      } catch (e) {
        setProfessorTheses([]);
      }
    })();
  }, [form.advisorId]);

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

  function handleCourseToggle(index: number, checked: boolean) {
    setForm((f) => {
      const next = { ...f } as any;
      const arr = Array.isArray(next.courses) ? [...next.courses] : [];
      arr[index] = { ...arr[index], seen: checked };
      next.courses = arr;
      return next;
    });
  }

  function handleOtherCourseChange(field: "courseId" | "semester", value: string) {
    setForm((f) => ({ ...f, otherCourse: { ...f.otherCourse, [field]: value } }));
  }

  function handleOtherCourseToggle(checked: boolean) {
    setForm((f) => ({ ...f, otherCourse: { ...f.otherCourse, seen: checked } }));
  }

  function handleOtherCourse2Change(field: "courseId" | "semester", value: string) {
    setForm((f) => ({ ...f, otherCourse2: { ...f.otherCourse2, [field]: value } }));
  }

  function handleOtherCourse2Toggle(checked: boolean) {
    setForm((f) => ({ ...f, otherCourse2: { ...f.otherCourse2, seen: checked } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.profileId) return setError("Selecciona una subárea de investigación.");
    if (!form.advisorId) return setError("Selecciona un asesor de tesis.");
    if (professorTheses.length > 0 && !form.topic) return setError("Selecciona un tema de tesis del asesor.");
    if (!form.semesterStart1) return setError("Ingresa semestre de inicio (Tesis 1).");

    const hasCourse = Array.isArray(form.courses) && form.courses.some((c: any) => c.courseId);
    if (!hasCourse && !form.otherCourse?.courseId) return setError("Selecciona al menos un curso o agrega uno en 'Otros'.");

    setSubmitting(true);
    try {
      const base = API_ROUTES.BASE;
      const payload = {
        profileId: form.profileId,
        coordinatorId: form.coordinatorId || null,
        thesisId: professorTheses.length > 0 ? form.topic : null,
        advisorId: form.advisorId,
        semesterStart1: form.semesterStart1,
        semesterStart2: form.semesterStart2 || null,
        comments: form.comments || null,
        courses: Array.isArray(form.courses)
          ? form.courses.filter((c: any) => c.courseId).map((c: any) => ({ courseId: c.courseId, semester: c.semester, seen: !!c.seen }))
          : [],
        otherCourse: form.otherCourse?.courseId ? { courseId: form.otherCourse.courseId, semester: form.otherCourse.semester, seen: !!form.otherCourse.seen } : null,
        otherCourse2: form.otherCourse2?.courseId ? { courseId: form.otherCourse2.courseId, semester: form.otherCourse2.semester, seen: !!form.otherCourse2.seen } : null,
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
      setForm({ profileId: "", coordinatorId: "", advisorId: "", topic: "", semesterStart1: "", semesterStart2: "", courses: emptyCourses, otherCourse: { courseId: "", semester: "", seen: false }, otherCourse2: { courseId: "", semester: "", seen: false }, comments: "" });
    } catch (err: any) {
      setError(err?.message || "Error al enviar la solicitud");
    } finally {
      setSubmitting(false);
    }
  }

  function isMinValid() {
    if (!form.profileId) return false;
    if (!form.advisorId) return false;
    if (professorTheses.length > 0 && !form.topic) return false;
    if (!form.semesterStart1) return false;
    const hasCourse = Array.isArray(form.courses) && form.courses.some((c: any) => c.courseId);
    if (!hasCourse && !form.otherCourse?.courseId && !form.otherCourse2?.courseId) return false;
    return true;
  }

  return (
    <div className="min-h-full mx-auto p-4 container max-w-[900px]">
      <Card className="w-full mx-auto shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-core-highlight">Solicitud de inscripción a subárea de investigación</CardTitle>
          <div className="text-muted-foreground mt-2">Completa el formulario para enviar tu solicitud. La solicitud llegará al coordinador de la subárea de investigación seleccionada (no al asesor de tesis).</div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {loading ? (
            <p>Cargando subáreas y asesores...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}
              {success && <div className="text-sm text-green-600">{success}</div>}

              <h3 className="text-lg font-semibold text-core-highlight mt-0">Diligenciar solicitud de inscripción</h3>

              <div>
                <label className="block text-sm font-medium">Subárea de investigación <span className="text-red-600">*</span></label>
                <select name="profileId" value={form.profileId} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                  <option value="">Selecciona una subárea de investigación</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.name}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">El coordinador de la subárea recibirá la solicitud.</p>
              </div>

              <div>
                <label className="block text-sm font-medium">Asesor de tesis <span className="text-red-600">*</span></label>
                <select name="advisorId" value={form.advisorId} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                  <option value="">Selecciona un asesor</option>
                  {professors.map((prof) => (
                    <option key={prof.id} value={String(prof.id)}>{prof.user?.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Tema del proyecto</label>
                {professorTheses.length > 0 ? (
                  <select name="topic" value={form.topic} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <option value="">Selecciona un tema publicado por el asesor</option>
                    {professorTheses.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input name="topic" value={form.topic} onChange={handleChange} placeholder="Describe brevemente el tema" className="mt-1 block w-full rounded-md border border-input bg-card px-3 py-2 h-9 text-sm" />
                    <p className="text-xs text-muted-foreground mt-1">El asesor no tiene temas publicados — puedes ingresar el tema manualmente.</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Semestre inicio - Tesis 1 <span className="text-red-600">*</span></label>
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
                <h3 className="text-lg font-semibold text-core-highlight">Cursos del plan de estudios (hasta 7)</h3>
                <p className="text-xs text-muted-foreground mb-2">Selecciona el curso y el semestre en que lo cursaste</p>
                <div className="space-y-2">
                  {form.courses.map((c: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <select value={c.courseId} onChange={(e) => handleCourseChange(idx, "courseId", e.target.value)} className="w-full rounded-md border border-input bg-card px-2 py-1 h-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Selecciona curso (opcional)</option>
                          {coursesList.length > 0 ? coursesList.map((cc) => <option key={String(cc.id)} value={String(cc.id)}>{cc.name}</option>) : <option value="">No hay cursos cargados</option>}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={c.semester} onChange={(e) => handleCourseChange(idx, "semester", e.target.value)} className="w-36 rounded-md border border-input bg-card px-2 py-1 h-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Semestre</option>
                          {(periods.length > 0 ? periods.map((p) => `${p.year}-${p.semester}`) : ["2026-1","2026-2","2027-1"]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={!!c.seen} onChange={(e) => handleCourseToggle(idx, e.target.checked)} className="h-4 w-4" />
                          <span className="text-sm">Visto</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-md font-medium text-core-highlight">Otros cursos</h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <select value={form.otherCourse.courseId} onChange={(e) => handleOtherCourseChange("courseId", e.target.value)} className="w-full rounded-md border border-input bg-card px-2 py-1 h-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Selecciona curso (otro)</option>
                          {coursesList.length > 0 ? coursesList.map((cc) => <option key={String(cc.id)} value={String(cc.id)}>{cc.name}</option>) : <option value="">No hay cursos cargados</option>}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={form.otherCourse.semester} onChange={(e) => handleOtherCourseChange("semester", e.target.value)} className="w-36 rounded-md border border-input bg-card px-2 py-1 h-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Semestre</option>
                          {(periods.length > 0 ? periods.map((p) => `${p.year}-${p.semester}`) : ["2026-1","2026-2","2027-1"]).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={!!form.otherCourse.seen} onChange={(e) => handleOtherCourseToggle(e.target.checked)} className="h-4 w-4" />
                          <span className="text-sm">Visto</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <select value={form.otherCourse2.courseId} onChange={(e) => handleOtherCourse2Change("courseId", e.target.value)} className="w-full rounded-md border border-input bg-card px-2 py-1 h-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Selecciona curso (otro 2)</option>
                          {coursesList.length > 0 ? coursesList.map((cc) => <option key={String(cc.id)} value={String(cc.id)}>{cc.name}</option>) : <option value="">No hay cursos cargados</option>}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={form.otherCourse2.semester} onChange={(e) => handleOtherCourse2Change("semester", e.target.value)} className="w-36 rounded-md border border-input bg-card px-2 py-1 h-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <option value="">Semestre</option>
                          {(periods.length > 0 ? periods.map((p) => `${p.year}-${p.semester}`) : ["2026-1","2026-2","2027-1"]).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={!!form.otherCourse2.seen} onChange={(e) => handleOtherCourse2Toggle(e.target.checked)} className="h-4 w-4" />
                          <span className="text-sm">Visto</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                
                <button type="submit" disabled={!isMinValid() || submitting} className={`px-4 py-2 text-white rounded ${!isMinValid() || submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-core'}`}>
                  {submitting ? "Enviando..." : "Enviar solicitud"}
                </button>
                <button type="button" onClick={() => setForm({ profileId: "", coordinatorId: "", advisorId: "", semesterStart1: "", semesterStart2: "", courses: emptyCourses, otherCourse: { courseId: "", semester: "", seen: false }, otherCourse2: { courseId: "", semester: "", seen: false }, comments: "" })} className="px-4 py-2 border rounded">Limpiar</button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
