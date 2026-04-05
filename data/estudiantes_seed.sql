
-- 1. USERS
INSERT INTO "user" (id, name, email, password) VALUES
('00000000-0000-0000-0000-000000000001', 'Estudiante Postulado',  'est.step0@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000002', 'Estudiante Aceptado',   'est.step1@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000003', 'Estudiante Inscrito',   'est.step2@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000004', 'Estudiante Propuesta',  'est.step3@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000005', 'Estudiante 30%',        'est.step4@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000006', 'Estudiante Poster',     'est.step6@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000007', 'Estudiante ABET',       'est.step9@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000008', 'Estudiante Finalizado', 'est.stepF@uniandes.edu.co', '123'),
('00000000-0000-0000-0000-000000000009', 'Estudiante 8',          'est.step8@uniandes.edu.co', '123');

-- 2. STUDENT
INSERT INTO student (id, "isActive", "isUndergraduate", code, "thesis1Id", "thesis2Id", "projectId", "thesisApplicationId") VALUES
('00000000-0000-0000-0000-000000000001', TRUE, TRUE, '202100001', NULL, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000002', TRUE, TRUE, '202100002', NULL, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000003', TRUE, TRUE, '202100003', NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a', NULL),
('00000000-0000-0000-0000-000000000004', TRUE, TRUE, '202100004', NULL, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000005', TRUE, TRUE, '202100005', NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('00000000-0000-0000-0000-000000000006', TRUE, TRUE, '202100006', NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('00000000-0000-0000-0000-000000000007', TRUE, TRUE, '202100007', NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('00000000-0000-0000-0000-000000000008', TRUE, TRUE, '202100008', NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('00000000-0000-0000-0000-000000000009', TRUE, TRUE, '202100009', NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL);

-- 3. DOCUMENT
INSERT INTO document (id, name, file) VALUES
('1b074d84-1c10-409d-bc3d-efee4df846bf', 'DocPrueba.pdf', decode('4a56424552', 'hex'));

-- 4. PROJECT_APPLICATION 
INSERT INTO project_application (id, status, motivation, grade, "wasContacted", "studentId", "periodId", "projectId", actual_task_id) VALUES
('aabbccdd-0000-0000-0000-000000000001', 'Postulado',   'motivacion', 'No establecido', FALSE, '00000000-0000-0000-0000-000000000001', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a', NULL),
('4dd3eeb7-8540-4d72-9e93-13e82687423e', 'Aceptado',   'Motivacion', 'No establecido', TRUE,  '00000000-0000-0000-0000-000000000002', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64b', NULL),
('d574af23-2e43-48fe-a007-aaa4f5db677d', 'Inscrito',   'motivacion', 'No establecido', TRUE,  '00000000-0000-0000-0000-000000000003', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a', NULL),
('0c8fc7f9-362d-4f0f-bf8a-3cb3bacd21e7', 'Aceptado',   'motivacion', 'No establecido', TRUE,  '00000000-0000-0000-0000-000000000004', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64a', NULL),
('96c9bfa5-1542-445d-a33b-249a43d26ae9', 'Inscrito',   'motivacion', 'No establecido', TRUE,  '00000000-0000-0000-0000-000000000005', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('f7c36dc5-21ef-438e-919f-fb60d86b525d', 'Inscrito',   'motivacion', 'No establecido', TRUE,  '00000000-0000-0000-0000-000000000006', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('b709834f-f97d-4c4f-bb5d-a61a51b68972', 'Inscrito',   'motivacion', 'No establecido', TRUE,  '00000000-0000-0000-0000-000000000007', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('5315685c-9090-4a59-ad8b-ed8a131388e8', 'Finalizado', 'motivacion', '4.8',            TRUE,  '00000000-0000-0000-0000-000000000008', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL),
('b40762d7-89cd-439a-96cd-ba8c4ca81af6', 'Inscrito',   '.',          'No establecido', TRUE,  '00000000-0000-0000-0000-000000000009', '58491a18-a866-45e5-90c4-528f3a7f49c1', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL);

-- 5. TASKS
INSERT INTO tasks (id, type, comment, step, approved, flow, "dateId", "documentId", "studentId", "professorId", "coordinatorId", "projectApplicationId", grade) VALUES
('aaaaaaaa-0000-0000-0000-000000000000', 'SEND_APPROVE',  'EMPTY', 0, FALSE, 'proyectoPregrado', NULL, NULL, NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb66c', 'aabbccdd-0000-0000-0000-000000000001', NULL),
('716d86cd-7d43-42b5-8740-2460e3a4fe64', 'SEND_APPROVE',  'EMPTY', 1, FALSE, 'proyectoPregrado', NULL, NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL, '4dd3eeb7-8540-4d72-9e93-13e82687423e', NULL),
('bd4783b6-b34b-40fb-9094-d6bc42445371', 'UPLOAD_FILE',   'EMPTY', 2, FALSE, 'proyectoPregrado', NULL, NULL, '00000000-0000-0000-0000-000000000003', NULL, NULL, 'd574af23-2e43-48fe-a007-aaa4f5db677d', NULL),
('57098f0f-1997-4f3f-b1e6-b63bcceb5c3d', 'SEND_APPROVE',  'EMPTY', 3, FALSE, 'proyectoPregrado', NULL, NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb64c', NULL, '0c8fc7f9-362d-4f0f-bf8a-3cb3bacd21e7', NULL),
('aaaaaaaa-0000-0000-0000-000000000001', 'SEND_COMMENTS', 'EMPTY', 4, FALSE, 'proyectoPregrado', NULL, NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', NULL, '96c9bfa5-1542-445d-a33b-249a43d26ae9', NULL),
('aaaaaaaa-0000-0000-0000-000000000002', 'UPLOAD_FILE',   'EMPTY', 6, FALSE, 'proyectoPregrado', NULL, NULL, '00000000-0000-0000-0000-000000000006', NULL, NULL, 'f7c36dc5-21ef-438e-919f-fb60d86b525d', NULL),
('aaaaaaaa-0000-0000-0000-000000000004', 'SEND_COMMENTS', 'EMPTY', 6, FALSE, 'proyectoPregrado', NULL, NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', NULL, 'b40762d7-89cd-439a-96cd-ba8c4ca81af6', NULL),
('aaaaaaaa-0000-0000-0000-000000000003', 'ABET_TASK',     'EMPTY', 9, FALSE, 'proyectoPregrado', NULL, NULL, NULL, 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', NULL, 'b709834f-f97d-4c4f-bb5d-a61a51b68972', NULL),
('e601f1d5-cb90-4f5d-962a-d3c5331ed555', 'VIEW_COMMENTS', 'Bien',  8, FALSE, 'proyectoPregrado', NULL, NULL, '00000000-0000-0000-0000-000000000008', 'b3cb0b7a-15f8-4aca-9c89-3067a2dfb65c', NULL, '5315685c-9090-4a59-ad8b-ed8a131388e8', '4.8');

-- 6. ACTUALIZAR actual_task_id
UPDATE project_application SET actual_task_id = 'aaaaaaaa-0000-0000-0000-000000000000' WHERE id = 'aabbccdd-0000-0000-0000-000000000001';
UPDATE project_application SET actual_task_id = '716d86cd-7d43-42b5-8740-2460e3a4fe64' WHERE id = '4dd3eeb7-8540-4d72-9e93-13e82687423e';
UPDATE project_application SET actual_task_id = 'bd4783b6-b34b-40fb-9094-d6bc42445371' WHERE id = 'd574af23-2e43-48fe-a007-aaa4f5db677d';
UPDATE project_application SET actual_task_id = '57098f0f-1997-4f3f-b1e6-b63bcceb5c3d' WHERE id = '0c8fc7f9-362d-4f0f-bf8a-3cb3bacd21e7';
UPDATE project_application SET actual_task_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE id = '96c9bfa5-1542-445d-a33b-249a43d26ae9';
UPDATE project_application SET actual_task_id = 'aaaaaaaa-0000-0000-0000-000000000002' WHERE id = 'f7c36dc5-21ef-438e-919f-fb60d86b525d';
UPDATE project_application SET actual_task_id = 'aaaaaaaa-0000-0000-0000-000000000003' WHERE id = 'b709834f-f97d-4c4f-bb5d-a61a51b68972';
UPDATE project_application SET actual_task_id = NULL                                   WHERE id = '5315685c-9090-4a59-ad8b-ed8a131388e8';
UPDATE project_application SET actual_task_id = 'aaaaaaaa-0000-0000-0000-000000000004' WHERE id = 'b40762d7-89cd-439a-96cd-ba8c4ca81af6';