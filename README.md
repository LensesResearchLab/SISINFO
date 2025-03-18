<p align="center">
    <img src="readme_banner.png" alt="Sisinfo logo" width="300" height="140">
</p>
<h1 align="center">Sisinfo</h1>

<p align="center">
    Sisinfo es una aplicación web diseñada para gestionar múltiples tareas administrativas, como la aplicación a tesis, asistencias graduadas, publicación de ofertas de salones, entre otros. Desarrollada con <strong>Next.js</strong>, <strong>shadcn</strong>, <strong>Tailwind CSS</strong>, <strong>Zustand</strong> y <strong>TanStack Query</strong>.
</p>

> Para obtener documentación más detallada, por favor visita la [Wiki del proyecto](https://github.com/TheSoftwareDesignLab/SISINFO/wiki).

---

## 🚀 Tecnologías

Sisinfo está construido con las siguientes tecnologías:

- **Next.js**: Un framework de React para la construcción de aplicaciones web modernas con renderizado híbrido y optimización automática.
- **shadcn**: Un conjunto de componentes UI modernos, personalizables y accesibles.
- **Tailwind CSS**: Un framework de CSS utilitario que permite diseñar interfaces de manera rápida y eficiente.
- **Zustand**: Una solución ligera y flexible para el manejo del estado global de la aplicación.
- **TanStack Query**: Una librería para gestionar, almacenar en caché y sincronizar datos del servidor.
- **Docker**: Usado para desplegar la base de datos en un contenedor.
- **Nest.js**: Servidor REST.
- **Turborepo**: Manejador de monorepositorios. 
- **npm/yarn**: Gestores de paquetes para manejar dependencias del proyecto.

---

## 🔨 Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

- **Node.js** (Versión ≥ 16)
- **npm** o **yarn** (Gestores de paquetes)
- **Git** (Opcional, para clonar el repositorio)
- **Docker** (Para desplegar la base de datos)

### Pasos para la instalación

1. Clona el repositorio (o descarga el código fuente):
   ```bash
   git clone https://github.com/TheSoftwareDesignLab/SISINFO
   ```
2. Navega al directorio del proyecto:
    ```bash
    cd SISINFO
    ```

3. Instala las dependencias:
    ```bash
    npm install
    # o
    yarn install
    ```
4. Navega a la carpeta config:
    ```bash
    cd config
    ```
5. Ingresa el archivo `.env` basado en el archivo `.env.template` y configura las variables de entorno necesarias.

6. Despliega la base de datos en un contenedor de Docker:
    ```bash
    docker-compose up -d
    ```
7. Navega a la carpeta principal:
    ```bash
    cd ..
    ```


8. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
9. Abre tu navegador y visita http://localhost:8000/api/SEED para cargar los datos de prueba (generados de forma aleatoria).
10. Visita http://localhost:3000 para ver la aplicación en funcionamiento.

> Si deseas liberar los puertos 3000 y 8000, puedes usar el comando `npm run kill`.