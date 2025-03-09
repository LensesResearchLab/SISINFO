<p align="center">
    <img src="readme_banner.png" alt="Sisinfo logo" width="300" height="140">
</p>
<h1 align="center">Sisinfo</h1>

<p align="center">
    Sisinfo es una aplicación web diseñada para gestionar múltiples tareas administrativas, como la aplicación a tesis, asistencias graduadas, publicación de ofertas de salones, entre otros. Desarrollada con <strong>Next.js</strong>, <strong>shadcn</strong> y <strong>Tailwind CSS</strong>.
</p>

---

## 🚀 Tecnologías

Sisinfo está construido con las siguientes tecnologías:

- **Next.js**: Un framework de React para la construcción de aplicaciones web modernas con renderizado híbrido y optimización automática.
- **shadcn**: Un conjunto de componentes UI modernos, personalizables y accesibles.
- **Tailwind CSS**: Un framework de CSS utilitario que permite diseñar interfaces de manera rápida y eficiente.
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **npm/yarn**: Gestores de paquetes para manejar dependencias del proyecto.

---

## 🔨 Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

- **Node.js** (Versión ≥ 16)
- **npm** o **yarn** (Gestores de paquetes)
- **Git** (Opcional, para clonar el repositorio)

### Pasos para la instalación

1. Clona el repositorio (o descarga el código fuente):
   ```bash
   git clone https://github.com/TheSoftwareDesignLab/SISINFO
   ```
2. Navega al directorio del proyecto:
    ```bash
    cd sisinfo
    ```

3. Instala las dependencias:
    ```bash
    npm install
    # o
    yarn install
    ```
4. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
5. Abre tu navegador y visita http://localhost:3000 para ver la aplicación en funcionamiento.

# 📂 Estructura del Proyecto

```bash
sisinfo/
├── README.md                  # Documentación del proyecto
├── public/                    # Recursos estáticos como imágenes y fuentes
├── src/                        # Código fuente de la aplicación
│   ├── auth/                   # Módulo de autenticación y autorización
│   ├── app/                    # Páginas principales y funcionalidades
│   │   ├── home/               # Página principal de la aplicación
│   │   ├── undergraduate-thesis/ # Funcionalidad de tesis de pregrado
│   │   │   ├── thesis-list/        # Lista de tesis disponibles
│   │   │   ├── thesis-dates/       # Fechas importantes de tesis
│   │   │   ├── thesis-status/      # Estado actual de las tesis
│   │   │   ├── types/              # Definición de tipos de datos
│   │   ├── graduated-assistance/   # Funcionalidad de asistencias graduadas
│   │   │   ├── assistance-list/     # Lista de asistencias disponibles
│   │   │   ├── assistance-applied-list/ # Asistencias aplicadas
│   │   │   ├── types/               # Definición de tipos de datos
│   │   │   ├── services/            # Lógica de negocio y conexión con la API
│   │   ├── support/                 # Módulo de soporte y ayuda
│   │   │   ├── contact/             # Página de contacto
│   │   │   ├── tutorials/           # Tutoriales de uso
│   │   │   ├── incidence/           # Reporte de incidencias
│   │   │   ├── types/               # Definición de tipos de datos
│   │   │   ├── services/            # Servicios de soporte
│   ├── components/                 # Componentes reutilizables
│   │   ├── ui/                     # Componentes de shadcn
│   │   ├── shared/                 # Componentes personalizados
│   ├── hooks/                      # Hooks personalizados
│   ├── lib/                        # Librerías y utilidades compartidas
│   ├── styles/                     # Estilos globales y temas
│   ├── config/                     # Configuración general del proyecto
│   ├── services/                   # Servicios y lógica de negocio compartida
│   ├── utils/                      # Funciones de utilidad
│   ├── middleware/                 # Middlewares de la aplicación
│   ├── pages/                      # Páginas adicionales fuera del sistema principal
└── ...
```

# 💻 Trabajar en el repositorio

## Estilo de Código

- **Convenciones de Nombres**:
  - Utiliza `camelCase` para variables, funciones y métodos.
  - Utiliza `PascalCase` para componentes React.
  - Utiliza `kebab-case` para nombres de archivos.

## Gestión de Ramas

- **Desarrollo por Funcionalidades**:
  - Cada nueva funcionalidad debe desarrollarse en una rama separada.
  - Nombra las ramas de manera descriptiva, por ejemplo:
    - `feature/nueva-funcionalidad`
    - `fix/correccion-error`

## Pruebas y Documentación

- **Pruebas Unitarias**:
  - Implementa pruebas unitarias para cada funcionalidad.
  - Asegúrate de cubrir los casos de uso principales.

- **Comentarios Explicativos**:
  - Agrega comentarios en el código para facilitar su mantenimiento y comprensión.

