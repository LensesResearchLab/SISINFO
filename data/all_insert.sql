select * from "user";


-- ADMIN: --
select * from "administrator";
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb60c', 'admin', 'admin@admin.com', 'admin');
INSERT INTO student VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb60c', true, true, 'admin000');
INSERT INTO professor VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb60c', true);
INSERT INTO coordinator VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb60c', true);
INSERT INTO administrator VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb60c', true);


-- students: --
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb61c', 'Nicolas Camargo Prieto', 'n.camargop@uniandes.edu.co', '123');
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb62c', 'Jorge David Bustamente Pino', 'j.bustamentep@uniandes.edu.co', '123');
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb63c', 'Daniel Felipe Diaz Moreno', 'd.diazm@uniandes.edu.co', '123');

select * from student;

INSERT INTO student VALUES ('b3cb0b7a-15f8-4aca-9c89-3067ay2dfb61c', true, true, '202020782');
INSERT INTO student VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb62c', true, true, '202020782');
INSERT INTO student VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb63c', true, false, '202020782');



-- professors: --
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', 'Camilo Andres Escobar Velasquez', 'ca.escobar2434@uniandes.edu.co', '123');
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', 'Mario Linares Vasquez', 'm.linaresv@uniandes.edu.co', '123');

select * from professor;

INSERT INTO professor VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', true);
INSERT INTO professor VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', true);

-- coordinators: --
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb66c', 'Natalia Franco Tamara', 'n.franco253@uniandes.edu.co', '123');
INSERT INTO "user" VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb67c', 'Juan Pablo Fernandez Ramirez', 'jp.fernandez29@uniandes.edu.co', '123');

select * from coordinator;

INSERT INTO coordinator VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb66c', true);
INSERT INTO coordinator VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb67c', true);


---------------------------------------------------------------------------------


SELECT * FROM period;

INSERT INTO period (id, period, year, semester) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c1', '20', 2025, '2');
INSERT INTO period (id, period, year, semester) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c2', '10', 2025, '1');
INSERT INTO period (id, period, year, semester) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c3', '20', 2024, '2');
INSERT INTO period (id, period, year, semester) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c4', '10', 2024, '1');

select * FROM important_DATE;


INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683da1', 'Inicio', 'Tesis pregrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('1c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683da1', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('12a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683da1', 'Final');

INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683da2', 'Desarrollo', 'Tesis pregrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('2c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683da2', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('22a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683da2', 'Final');

INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683da3', 'Pendiente', 'Tesis pregrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('3c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683da3', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('32a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683da3', 'Final');


INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683da4', 'Pendiente Especial', 'Tesis pregrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('4c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683da4', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('42a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683da4', 'Final');

INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683db1', 'Inicio', 'Tesis postgrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('5c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683db1', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('52a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683db1', 'Final');

INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683db2', 'Desarrollo', 'Tesis postgrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('6c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683db2', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('62a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683db2', 'Final');

INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683db3', 'Pendiente', 'Tesis postgrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');


INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('7c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683db3', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('72a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683db3', 'Final');

INSERT INTO public.important_section (id, name, "academicProcess", "periodId")
VALUES ('ea4f4e1d-6279-4bcc-aa62-631308683db4', 'Pendiente Especial', 'Tesis postgrado'::important_section_academicprocess_enum,
        '58491a18-a866-45e5-90c4-528f3a7f49c1');

INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('8c32f901-e8dc-47c2-a0e0-90fbfe72f5eb', '2025-01-30', 'ea4f4e1d-6279-4bcc-aa62-631308683db4', 'Inicio');
INSERT INTO public.important_date (id, date, "importantSectionId", name) VALUES ('82a2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', '2025-03-15', 'ea4f4e1d-6279-4bcc-aa62-631308683db4', 'Final');


----------------------------------------------------------------------------------------------------

INSERT INTO tag (description) VALUES ('Desarrollo');
INSERT INTO tag (description) VALUES ('Seguridad');
INSERT INTO tag (description) VALUES ('Ciberseguridad');
INSERT INTO tag (description) VALUES ('Emprendimiento');

----------------------------------------------------------------------------------------------------


select * from project;
INSERT INTO project (id, title, description, category, "maxStudents", "isEnded", "professorId", "periodId") 
VALUES (
	'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a',
	'Historias clinicias', 
	'En este proyecto se trabajaran algunas funcionalidades de la aplicación Senecare', 
	'Desarollo', 
	3, 
	false, 
	'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', 
	'58491a18-a866-45e5-90c4-528f3a7f49c2'
);

INSERT INTO project (id, title, description, category, "maxStudents", "isEnded", "professorId", "periodId") 
VALUES (
	'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64b',
	'Sisinfo V2 Parte 2 ', 
	'En este proyecto se trabajaran algunas funcionalidades de la aplicación Sisinfo, terminando el desarrollo de la aplicacion.', 
	'Desarrollo', 
	3, 
	false, 
	'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', 
	'58491a18-a866-45e5-90c4-528f3a7f49c2'
);

INSERT INTO project (id, title, description, category, "maxStudents", "isEnded", "professorId", "periodId") 
VALUES (
	'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c',
    'Sistema de Inventario',
    'Este proyecto consistirá en el desarrollo de un sistema para gestionar inventarios en pequeñas empresas.',
    'Desarrollo',
    5,
    false,
    'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c',
    '58491a18-a866-45e5-90c4-528f3a7f49c2'
);

INSERT INTO project (id, title, description, category, "maxStudents", "isEnded", "professorId", "periodId") 
VALUES (
	'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64d',
    'Sistema de Reservas',
    'Este proyecto consistirá en el desarrollo de un sistema para gestionar reservas en pequeñas empresas.',
    'Reservas',
    4,
    false,
    'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c',
    '58491a18-a866-45e5-90c4-528f3a7f49c1'
);

-----------------------------------------------------------------------------------------------------------


select * from areas_of_interest;

INSERT INTO areas_of_interest (id, description) VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a','Investigacion');
INSERT INTO areas_of_interest (id, description) VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64b','Proyecto aplicado a empresas');
INSERT INTO areas_of_interest (id, description) VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c','Otro');
-------//

select * from project_areas_of_interest;

INSERT INTO project_areas_of_interest VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a','b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a');
INSERT INTO project_areas_of_interest VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64b','b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a');
INSERT INTO project_areas_of_interest VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c','b3cb0b7a-15f8-4aca-9c89-3067a2dfb64b');
INSERT INTO project_areas_of_interest VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb64d','b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c');

----------------------------------------------------------------------------------------------------

INSERT INTO graduated_assistance VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb67c', 'Asistancia graduada ISIS2203', 'Docencia', 'Se requiere un estudiante de maestria para que dicté la clase de los laboratorios del curso ISIS2203', '2025-01-20', '2020-05-30', null, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', '58491a18-a866-45e5-90c4-528f3a7f49c2');
INSERT INTO graduated_assistance VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb68c', 'Asistancia graduada Moviles', 'Docencia', 'Se requiere un estudiante de maestria para que dicté la clase de los laboratorios del curso de moviles', '2025-01-20', '2020-04-30', null, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', '58491a18-a866-45e5-90c4-528f3a7f49c2');

----------------------------------------------------------------------------------------------------

select * from requirement;
INSERT INTO requirement (id, description) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c2','Cursando o terminada la carrera de ingenieria de sistemas, con pasion por aprender y conocimientos en desarollo.');
INSERT INTO requirement (id, description) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c3','Disponibilidad de al menos 10 horas semanales para el proyecto.');
INSERT INTO requirement (id, description) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c4','Experiencia previa en proyectos de desarrollo de software.');
INSERT INTO requirement (id, description) VALUES ('58491a18-a866-45e5-90c4-528f3a7f49c5','Conocimientos básicos en bases de datos y programación orientada a objetos.');


-----------//

select * from graduated_assistance_requirements;
INSERT INTO graduated_assistance_requirements VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb67c', '58491a18-a866-45e5-90c4-528f3a7f49c2');
INSERT INTO graduated_assistance_requirements VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb67c', '58491a18-a866-45e5-90c4-528f3a7f49c3');
INSERT INTO graduated_assistance_requirements VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb68c', '58491a18-a866-45e5-90c4-528f3a7f49c4');
INSERT INTO graduated_assistance_requirements VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb68c', '58491a18-a866-45e5-90c4-528f3a7f49c5');




---------------------------------------------------------------------------------------------------

select * from thesis;

INSERT INTO thesis VALUES ('a3cb0b7a-15f8-4aca-9c89-3067a2dfb67b', 'Tesis de posgrado ciberseguridad', 'En esta tesis de posgrado se trabajara la ciberseguridad de la aplicacion de sisinfo, enfocada en patrones de arquitectura y renovar los certificados SSL.', 'Ciberseguridad' ,false, '58491a18-a866-45e5-90c4-528f3a7f49c2', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c');
INSERT INTO thesis VALUES (
  'a3cb0b7a-15f8-4aca-9c89-3067a2dfb67c',
  'Tesis de posgrado optimizacion de rutas de comercio',
  'En esta tesis de posgrado se trabajará sobre problemas de optimización con tecnologías contemporáneas, enfocándose en el análisis de rutas comerciales eficientes y el uso de algoritmos avanzados para mejorar la logística y reducir costos en la cadena de suministro.',
  'COMIT',
  false,
  '58491a18-a866-45e5-90c4-528f3a7f49c2',
  'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c'
);

INSERT INTO thesis VALUES (
  'c4db1e2f-25a9-4b7c-8d12-123456789abc',
  'Tesis de pregrado sobre inteligencia artificial aplicada a la salud',
  'Este trabajo explora el uso de algoritmos de aprendizaje automático para el diagnóstico temprano de enfermedades crónicas en sistemas hospitalarios.',
  'SALUD',
  false,
  '58491a18-a866-45e5-90c4-528f3a7f49c2',
  'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c'
);

INSERT INTO thesis VALUES (
  'e5fc2f3a-47cb-4d9e-af34-3456789abcde',
  'Optimización de redes de transporte urbano',
  'La tesis propone modelos matemáticos y simulaciones para mejorar la eficiencia de las rutas de buses en ciudades de alta densidad poblacional.',
  'TRANSPORTE',
  false,
  '58491a18-a866-45e5-90c4-528f3a7f49c2',
  'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c'
);

INSERT INTO thesis VALUES (
  'f6ad3c4b-69ed-4fb0-cf56-56789abcdef0',
  'Desarrollo de una plataforma de e-learning para educación superior',
  'El objetivo es diseñar e implementar una plataforma web interactiva que facilite el aprendizaje remoto y la gestión de cursos universitarios.',
  'EDUCACION',
  false,
  '58491a18-a866-45e5-90c4-528f3a7f49c2',
  'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c'
);

INSERT INTO thesis VALUES (
  'a7be4d5c-7bfe-4fd2-e178-789abcdef012',
  'Análisis de datos masivos para la predicción de tendencias de mercado',
  'Se utilizarán técnicas de big data y minería de datos para anticipar cambios en el comportamiento del consumidor en el sector retail.',
  'BIGDATA',
  false,
  '58491a18-a866-45e5-90c4-528f3a7f49c2',
  'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c'
);

INSERT INTO thesis VALUES (
  'b8cf5e6d-8d1f-4fe4-029a-9abcdef01234',
  'Implementación de sistemas de seguridad informática en pymes',
  'El trabajo aborda la integración de soluciones de ciberseguridad para proteger la información sensible en pequeñas y medianas empresas.',
  'SEGURIDAD',
  false,
  '58491a18-a866-45e5-90c4-528f3a7f49c2',
  'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c'
);

----------------------------------------------------------------------------------------------------


select * from assistance_application;

