# Portfolio API

## Endpoint

### GET — Obtener información del portafolio

```http
GET https://69d19cab5043d95be971190e.mockapi.io/api/v1/portfolio
```

Este endpoint devuelve la información utilizada por el portafolio web, incluyendo:

- Información personal
- Experiencia profesional
- Proyectos
- Habilidades
- Educación

---

## Response

### Status Code

```http
200 OK
```

### Response Body

```json
[
  {
    "about": {
      "nombreCompleto": "Aldo Guevara Muñoz",
      "descripcion": "Soy desarrollador FullStack Jr con experiencia en desarrollo web utilizando Angular, Tailwind CSS, SQL Server, C#, ASP.NET Core. He participado en el desarrollo y mantenimiento de un sistema ERP, implementando funcionalidades tanto en frontend como en backend. Complemento mi experiencia profesional con proyectos personales como el de una página de venta de libros con parte administradora.",
      "email": "guevaraaldo44@gmail.com",
      "ubicacion": "Juaréz, Nuevo León",
      "telefono": "8126007542",
      "edad": "26",
      "cv": "/assets/documents/CV_Aldo_Guevara_Muñoz.pdf",
      "foto": "/assets/images/profile.png"
    },
    "experiencia": [
      {
        "empresa": "Grupo Vitek",
        "url": "https://www.grupovitek.com/mx",
        "logo": "assets/images/vitek.png",
        "puesto": "Desarrollador Frontend",
        "descripcion": "Colaboré en el soporte y mantenimiento de un sistema ERP, participando tanto en el frontend como en el backend mediante el uso de SQL, C#, Angular y Tailwind CSS, enfocado en la resolución de incidencias y la implementación de nuevas funcionalidades. Adicionalmente, desarrollé una aplicación móvil en Flutter para el control y gestión de inventarios, siguiendo los lineamientos y requerimientos establecidos.",
        "habilidades": ["Angular", "TypeScript", "Tailwind CSS", "API REST", "SQL", ".Net"],
        "fechaInicio": "Julio 2025",
        "fechaFin": "Enero 2026"
      },
      {
        "empresa": "Vidas y Pensiones de México",
        "url": "https://www.vidasypensiones.com",
        "logo": "assets/images/vidasypensiones.png",
        "puesto": "Desarrollador Web",
        "descripcion": "Desarrollo y rediseño del sitio web — Abril 2024: Rediseño del sitio web utilizando HTML, CSS, Bootstrap, PHP, JavaScript y SQL. Implementación de Blog — 2025: Desarrollo de una sección de blog que actualizo mensualmente. Desarrollo de Simulador de Pensiones — 2026: Desarrollo e integración de una herramienta para estimación de pensiones.",
        "habilidades": ["HTML", "CSS", "JS", "BOOTSTRAP 5", "SQL", "PHP"],
        "fechaInicio": "abril 2024",
        "fechaFin": "abril 2026"
      }
    ],
    "proyectos": [
      {
        "nombre": "Guevara Librerias",
        "descripcion": "Página web con la temática de venta de libros y con parte admin para el manejo de los datos.",
        "tecnologias": ["Angular", "TypeScript", "Tailwind CSS", "DaisyUI"],
        "github": "https://github.com/NokrisMx/front-guevaralibrerias",
        "demo": "https://guevaralibrerias.netlify.app/",
        "image": "/assets/images/guevaralibreriasfront.jpg"
      },
      {
        "nombre": "Guevara Librerias",
        "descripcion": "Api de la página Guevara Librerias.",
        "tecnologias": [
          "ASP.NET Core Web API",
          "EF Core",
          "ASP.NET Core Identity",
          "JWT Authentication"
        ],
        "github": "https://github.com/NokrisMx/api-guevaralibrerias",
        "demo": "http://guevaralibrerias.somee.com/swagger/index.html",
        "image": "/assets/images/guevaralibreriasback.jpg"
      },
      {
        "nombre": "Blackjack",
        "descripcion": "Juego de cartas Blackjack.",
        "tecnologias": ["Angular", "TypeScript", "Tailwind CSS"],
        "github": "https://github.com/NokrisMx/blackjack",
        "demo": "https://blackjack-agm.netlify.app/",
        "image": "/assets/images/blackjack.jpg"
      },
      {
        "nombre": "PetCute",
        "descripcion": "Página web con temática de una veterinaria.",
        "tecnologias": ["Astro", "Tailwind CSS"],
        "github": "https://github.com/NokrisMx/pet-cute",
        "demo": "https://pet-cute.web.app",
        "image": "assets/images/petcute.jpg"
      }
    ],
    "habilidades": [
      {
        "nombre": "ANGULAR",
        "icono": "TriangleIcon"
      },
      {
        "nombre": "TYPESCRIPT",
        "icono": "Typescript01Icon"
      },
      {
        "nombre": "JavaScript",
        "icono": "JavaScriptIcon"
      },
      {
        "nombre": "HTML",
        "icono": "HtmlFile01Icon"
      },
      {
        "nombre": "CSS",
        "icono": "CssFile01Icon"
      },
      {
        "nombre": "TAILWIND CSS",
        "icono": "TailwindcssIcon"
      },
      {
        "nombre": "C#",
        "icono": ""
      },
      {
        "nombre": "ASP.NET Core",
        "icono": "DotIcon"
      },
      {
        "nombre": "SQL Server",
        "icono": "SqlIcon"
      },
      {
        "nombre": "API REST",
        "icono": "ApiIcon"
      },
      {
        "nombre": "GIT",
        "icono": "GitMergeIcon"
      },
      {
        "nombre": "FIGMA",
        "icono": "FigmaIcon"
      }
    ],
    "educacion": [
      {
        "institucion": "Instituto Tecnológico de Nuevo León",
        "titulo": "Licenciatura en Ingeniería en Sistemas Computacionales",
        "descripcion": "Especialidad en Tecnologías Móviles (2020)",
        "fechaInicio": "agosto 2018",
        "fechaFin": "diciembre 2022"
      }
    ]
  }
]
```

---

# Estructura de la respuesta

## `about`

Contiene la información personal y de contacto del desarrollador.

| Campo            | Tipo     | Descripción             |
| ---------------- | -------- | ----------------------- |
| `nombreCompleto` | `string` | Nombre completo         |
| `descripcion`    | `string` | Descripción profesional |
| `email`          | `string` | Correo electrónico      |
| `ubicacion`      | `string` | Ubicación               |
| `telefono`       | `string` | Número telefónico       |
| `edad`           | `string` | Edad                    |
| `cv`             | `string` | Ruta del CV             |
| `foto`           | `string` | Ruta de la fotografía   |

---

## `experiencia`

Arreglo con la experiencia profesional.

Cada elemento contiene:

| Campo         | Tipo       | Descripción                |
| ------------- | ---------- | -------------------------- |
| `empresa`     | `string`   | Nombre de la empresa       |
| `url`         | `string`   | Sitio web de la empresa    |
| `logo`        | `string`   | Ruta del logo              |
| `puesto`      | `string`   | Puesto desempeñado         |
| `descripcion` | `string`   | Descripción de actividades |
| `habilidades` | `string[]` | Tecnologías utilizadas     |
| `fechaInicio` | `string`   | Fecha de inicio            |
| `fechaFin`    | `string`   | Fecha de finalización      |

---

## `proyectos`

Arreglo con los proyectos desarrollados.

| Campo         | Tipo       | Descripción              |
| ------------- | ---------- | ------------------------ |
| `nombre`      | `string`   | Nombre del proyecto      |
| `descripcion` | `string`   | Descripción              |
| `tecnologias` | `string[]` | Tecnologías utilizadas   |
| `github`      | `string`   | Repositorio del proyecto |
| `demo`        | `string`   | Demo o sitio publicado   |
| `image`       | `string`   | Imagen del proyecto      |

---

## `habilidades`

Arreglo con las tecnologías y herramientas conocidas.

| Campo    | Tipo     | Descripción                |
| -------- | -------- | -------------------------- |
| `nombre` | `string` | Nombre de la tecnología    |
| `icono`  | `string` | Nombre del icono utilizado |

---

## `educacion`

Arreglo con la formación académica.

| Campo         | Tipo     | Descripción           |
| ------------- | -------- | --------------------- |
| `institucion` | `string` | Institución educativa |
| `titulo`      | `string` | Título obtenido       |
| `descripcion` | `string` | Información adicional |
| `fechaInicio` | `string` | Fecha de inicio       |
| `fechaFin`    | `string` | Fecha de finalización |

---

# Ejemplo de consumo

## JavaScript / TypeScript

```typescript
fetch('https://69d19cab5043d95be971190e.mockapi.io/api/v1/portfolio')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
```

## Angular

```typescript
this.http.get('https://69d19cab5043d95be971190e.mockapi.io/api/v1/portfolio').subscribe((data) => {
  console.log(data);
});
```

---

# Modelo de datos

La respuesta puede representarse conceptualmente de la siguiente manera:

```text
Portfolio
│
├── about
│   ├── nombreCompleto
│   ├── descripcion
│   ├── email
│   ├── ubicacion
│   ├── telefono
│   ├── edad
│   ├── cv
│   └── foto
│
├── experiencia[]
│   ├── empresa
│   ├── url
│   ├── logo
│   ├── puesto
│   ├── descripcion
│   ├── habilidades[]
│   ├── fechaInicio
│   └── fechaFin
│
├── proyectos[]
│   ├── nombre
│   ├── descripcion
│   ├── tecnologias[]
│   ├── github
│   ├── demo
│   └── image
│
├── habilidades[]
│   ├── nombre
│   └── icono
│
└── educacion[]
    ├── institucion
    ├── titulo
    ├── descripcion
    ├── fechaInicio
    └── fechaFin
```
