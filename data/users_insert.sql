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

INSERT INTO student VALUES ('b3cb0b7a-15f8-4aca-9c89-3067a2dfb61c', true, true, '202020782');
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





