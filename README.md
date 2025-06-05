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
- **Docker**: Usado para desplegar la base de datos en desarrollo.
- **Nest.js**: Servidor REST.
- **Turborepo**: Manejador de monorepositorios. 
- **npm/yarn**: Gestores de paquetes para manejar dependencias del proyecto.

---

## 🧪 Pruebas

Antes de realizar cualquier **commit** o desplegar a **producción**, asegúrate de que todas las pruebas pasen correctamente.

### Ejecutar pruebas unitarias

```bash
npm run test
```

Para verificar qué partes del código están cubiertas por pruebas:

```bash
npm run test:cov
```

Este comando genera un informe de cobertura que permite mejorar la calidad del código.

### Ejecutar pruebas de extremo a extremo

```bash
npm run test:e2e
```

### Ejecutar monkeys

```bash
npx playwright test 'gremlins.test.js'

```
---

## ⚙️ Instalación básica

Sigue estos pasos para preparar el entorno local de desarrollo:

### Prerrequisitos

- **Node.js** (Versión ≥ 16)
- **npm** o **yarn**
- **Git** (opcional, para clonar el repositorio)

### Pasos

1. Clona el repositorio:

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

4. Crea el archivo `.env` en la carpeta `config`, basado en `.env.template` y configura las variables necesarias:

```bash
cd config
cp .env.template .env
```

---

## 🛠️ Despliegue en desarrollo

Para ejecutar el entorno de desarrollo completo con base de datos en Docker y datos de prueba:

1. Asegúrate de haber creado el archivo `.env` como se indicó anteriormente.
2. Inicia la base de datos con Docker:

```bash
docker-compose up -d
```

3. Regresa al directorio principal:

```bash
cd ..
```

4. Abre el archivo ubicado en `apps/api/app.module.ts`.
   **Elimina** la linea:
```typescript
ssl: { rejectUnauthorized: false },
```
5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

6. Ejecuta el archivo `data/all_insert.sql` desde algún manejador de bases de datos.

7. Visita la app en: [http://localhost:3000](http://localhost:3000) o en la ip que especificaste en el `.env`.

### Credenciales de prueba

- email: `admin@admin.com`
- password: `admin`

> Para liberar los puertos `3000` y `8000`, puedes usar el comando:
```bash
npm run kill
```

---

## 🚢 Despliegue en producción

Para un entorno de producción se requiere una base de datos real provisionada (por ejemplo, Heroku.).

### Pasos

1. Crea y configura el archivo `.env` con las variables reales de producción.
2. Construye el proyecto e inicia el servidor en modo producción:
```bash
npm run prod
```

---

Este proyecto fue desarrollado por estudiantes de pregrado del programa de Ingeniería de Sistemas y Computación de la Universidad de Los Andes como parte de su proyecto de grado, con la asesoría de Camilo Escobar-Velásquez, Ph.D.
