<p align="center">
    <img src="readme_banner.png" alt="Sisinfo logo" width="300" height="140">
</p>
<h1 align="center">Sisinfo</h1>

<p align="center">
    Sisinfo es una aplicación web diseñada para gestionar múltiples tareas administrativas, como la aplicación a tesis, asistencias graduadas, publicación de ofertas de salones, entre otros. Desarrollada con <strong>React 18</strong>, <strong>shadcn</strong> y <strong>Tailwind CSS</strong>.
</p>

---

## 🚀 Tecnologías

Sisinfo está construido con las siguientes tecnologías:

- **React 18**: Una biblioteca de JavaScript para construir interfaces de usuario interactivas y reactivas.
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
    npm run start
    ```
5. Abre tu navegador y visita http://localhost:3000 para ver la aplicación en funcionamiento.

#  Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

```bash
sisinfo/
├── README.md                  # Documentación del proyecto
├── src/                       # Código fuente de la aplicación
│   ├── assets/                # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── auth/                  # Funcionalidad de autenticación
│   │   ├── pages/             # Páginas relacionadas con la autenticación
│   │   └── components/        # Componentes específicos de autenticación
│   ├── components/            # Componentes globales reutilizables
│   │   ├── ui/                # Componentes de shadcn
│   │   └── custom/            # Componentes personalizados creados a mano
│   ├── graduatedAssistance/   # Funcionalidad de asistencias graduadas
│   │   ├── pages/             # Páginas relacionadas con asistencias graduadas
│   │   └── components/        # Componentes específicos de asistencias graduadas
│   ├── hooks/                 # Hooks personalizados
│   ├── lib/                   # Librerías o utilidades compartidas
│   ├── support/               # Funcionalidad de soporte
│   │   ├── pages/             # Páginas relacionadas con soporte
│   │   └── components/        # Componentes específicos de soporte
│   ├── undergraduateThesis/   # Funcionalidad de tesis de pregrado
│   │   ├── pages/             # Páginas relacionadas con tesis de pregrado
│   │   └── components/        # Componentes específicos de tesis de pregrado
│   │   └── services/          # Contiene los servicios de la funcionalidad de tesis de pregrado
│   ├── App.css                # Estilos globales de la aplicación
│   ├── App.test.js            # Pruebas del componente App
│   ├── App.tsx                # Componente principal de la aplicación
│   ├── about.tsx              # Componente que contiene la información de funcionalidades
│   └── index.css              # Estilos de entrada de la aplicación
└── ...
```


# Trabajar en el repositorio

## Estilo de Código

- **Convenciones de Nombres**:
  Utiliza `camelCase` para nombrar variables, funciones y métodos. Utiliza `kebab-case` para el nombre de los archivos de componentes


## Gestión de Ramas

- **Desarrollo por Funcionalidades**:
  Cada funcionalidad o característica nueva debe desarrollarse en una rama separada.
  Nombra las ramas de manera descriptiva (por ejemplo, `feature/nombre-funcionalidad` o `fix/nombre-correccion`).

## Pruebas y Documentación

- **Pruebas Unitarias**:
  Asegúrate de incluir pruebas unitarias para cada funcionalidad implementada.
  Las pruebas deben ser claras y cubrir los casos de uso principales.

- **Comentarios Explicativos**:
  Incluye comentarios en el código para explicar los componentes desarrollados.
