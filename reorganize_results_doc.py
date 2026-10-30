from docx import Document

source = r"C:\Users\jjhc7\OneDrive\Escritorio\Proyecto de Grado\Documento final.docx"
output = r"C:\Users\jjhc7\OneDrive\Escritorio\SISINFO\Documento final actualizado con resultados organizados.docx"

doc = Document(source)

start = next((p for p in doc.paragraphs if p.text.strip().startswith("7.9.")), None)
if start is not None:
    element = start._element
    while element is not None:
        next_element = element.getnext()
        element.getparent().remove(element)
        element = next_element

def heading(text, level=2):
    style_name = f"Heading {level}" if f"Heading {level}" in [s.name for s in doc.styles] else "Heading 2"
    doc.add_paragraph(text, style=style_name)

def body(text):
    doc.add_paragraph(text, style="Normal")

def bullet(text):
    doc.add_paragraph("•  " + text, style="Normal")

heading("7.9. Resultados funcionales implementados", 2)
body(
    "Los resultados obtenidos se organizaron a partir de las funcionalidades implementadas, los flujos que ahora puede ejecutar cada rol y las validaciones realizadas durante las pruebas. Esta organización permite relacionar cada resultado con la necesidad funcional que atiende y con las condiciones requeridas para su operación."
)

heading("7.9.1. Autenticación y gestión de acceso", 3)
body(
    "Se integró el inicio de sesión institucional con Microsoft Entra ID mediante OpenID Connect sobre OAuth 2.0. El usuario se autentica con su cuenta institucional y SISINFO crea una sesión local sin almacenar las credenciales de Microsoft. Los usuarios que ingresan correctamente pero no tienen un rol asignado reciben una pantalla informativa con orientación para solicitar acceso y consultar información institucional."
)
bullet("Se configuraron los retornos de autenticación para los ambientes de desarrollo, QA y producción.")
bullet("La navegación y las opciones visibles se determinan según los roles asignados.")
bullet("Los coordinadores pueden contar con permisos de coordinación y administración según la configuración institucional.")

heading("7.9.2. Roles, usuarios y estudiantes", 3)
body(
    "Se implementó la administración diferenciada de usuarios, profesores, coordinadores, administradores y estudiantes. El listado general permite consultar usuarios y modificar sus roles, mientras que el módulo de estudiantes mantiene un listado independiente con código, nombre, correo, rol y estado. La actualización de un rol se refleja inmediatamente y conserva la página actual de la tabla."
)
bullet("Los estudiantes pueden cargarse mediante archivos CSV y gestionarse sin mezclarlos con el listado general de usuarios.")
bullet("Se pueden asignar o cambiar los roles de Estudiante y Estudiante de maestría.")
bullet("Las funciones administrativas se organizaron en usuarios y roles, configuración académica, carga de información, problemas e incidencias y asuntos académicos.")

heading("7.9.3. Procesos académicos y solicitudes", 3)
body(
    "Se consolidaron los flujos de inscripción a subáreas de investigación y las etapas iniciales de tesis. Las solicitudes registran sus responsables, estados y tareas de revisión, lo que permite hacer seguimiento a la intervención del estudiante, el asesor y el coordinador. También se incorporaron validaciones de dependencia entre la inscripción aprobada, Tesis 1 y Tesis 2."
)

heading("7.10. Resultados técnicos y arquitectura", 2)
heading("7.10.1. Integración entre aplicación web, API y base de datos", 3)
body(
    "La solución mantiene una separación entre la aplicación web, la API y la base de datos. La interfaz consume servicios HTTP para consultar y actualizar usuarios, roles, periodos, cartelera, cursos, documentos y programas. Las reglas de autorización se validan en la API, de manera que las restricciones no dependan únicamente de los controles visuales del frontend."
)

heading("7.10.2. Gestión de cartelera y programas de curso", 3)
body(
    "Se ajustó el parser de la cartelera para reconocer los encabezados del archivo institucional y asociar correctamente periodos, códigos, nombres, créditos, secciones y profesores. También se actualizó la plantilla descargable para utilizar el formato vigente."
)
body(
    "La carga de programas se habilitó de forma individual y masiva. En la carga masiva, el profesor selecciona un archivo ZIP que contiene documentos PDF con el formato CODIGO-nombre.pdf, por ejemplo ISIS-4000-programa.pdf. El sistema identifica el código, busca el curso correspondiente, valida los permisos y almacena el documento. Al finalizar informa cuántos programas se cargaron y cuáles fueron rechazados por formato, código inexistente o falta de autorización."
)

heading("7.10.3. Clasificación de programas y profesores líderes", 3)
body(
    "La clasificación académica distingue los cursos ISIS-1, ISIS-2 e ISIS-3 como pregrado, mientras que ISIS-4 se identifica como MISIS. Los códigos diferentes de ISIS se agrupan según el programa de maestría correspondiente. La asignación de profesores líderes se realiza por programa de maestría, de modo que un profesor líder puede gestionar todas las materias asociadas a ese programa. El programa ISIS de pregrado no requiere profesor líder."
)
bullet("Los profesores solo visualizan cursos de pregrado en los que están asignados.")
bullet("Para maestrías, solo visualizan cursos de programas cuyo profesor líder sea el usuario.")
bullet("La API repite la validación antes de permitir cargar o reemplazar un programa.")

heading("7.11. Operación, despliegue y soporte", 2)
body(
    "Los cambios se prepararon para operar en ambientes separados de QA y producción. El despliegue requiere actualizar conjuntamente la aplicación web y la API, conservar las variables de entorno de cada ambiente y verificar la conectividad con Microsoft Entra ID y la base de datos."
)
bullet("En QA se deben validar autenticación, roles, permisos, catálogos académicos y carga de archivos.")
bullet("En producción se deben confirmar los datos de estudiantes, profesores, periodos, cartelera y líderes de maestría.")
bullet("Los errores de carga deben presentarse mediante mensajes resumidos y legibles, sin bloquear innecesariamente la pantalla.")
bullet("La carga masiva debe probarse con archivos PDF válidos, nombres incorrectos, códigos inexistentes y usuarios sin permisos.")

heading("7.12. Validación, restricciones y próximos pasos", 2)
body(
    "Las funcionalidades fueron verificadas mediante pruebas de navegación, asignación de roles, consulta de listados, carga de archivos y revisión de permisos. Los principales resultados son visibles en la interfaz y se complementan con validaciones en la API."
)
body(
    "Como restricciones, la disponibilidad de los cursos y profesores depende de la información cargada en la base de datos del ambiente, y la autenticación institucional depende de las URI y credenciales autorizadas por DSIT. También es necesario mantener actualizada la cartelera para que la clasificación de programas y las asignaciones de líderes correspondan al periodo académico vigente."
)
bullet("Validar con usuarios institucionales los roles y los permisos efectivos.")
bullet("Revisar periódicamente los programas de maestría derivados de la cartelera académica.")
bullet("Completar pruebas de seguridad y regresión antes de cada promoción a producción.")
bullet("Mantener documentación de despliegue, configuración, operación y recuperación ante errores.")

doc.save(output)
print(output)
