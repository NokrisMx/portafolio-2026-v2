# AGENTS.md

App de portafolio en Angular 22 (standalone, zoneless) estilada con Tailwind CSS v4 y
testeada con Vitest. El contenido se consume de una mock API externa documentada en `design/`.

## Comandos

- Usa solo npm (`packageManager: npm@11.19.0`); no yarn/pnpm.
- `npm start` — dev server en http://localhost:4200
- `npm run build` — build de producción por defecto; también es el typecheck de facto
  (no hay script de lint ni tsc)
- `npm run watch` — build de desarrollo en modo watch
- `ng test --watch=false` — corrida única de tests. `ng test` simple queda en modo watch
  en una TTY. Un solo archivo: `ng test --include src/app/app.spec.ts`.
  Filtrar suites: `ng test --filter ^App`
- No hay ESLint. Formatea con `npx prettier --write .` (printWidth 100, comillas
  simples, parser de Angular para HTML).

## Presupuestos de build (producción)

- Bundle inicial: warn 500kB / error 1MB
- Estilos de componente: warn 4kB / error 8kB — mantén el CSS de componentes al mínimo;
  prefiere utilidades de Tailwind en las plantillas antes que `*.css` grandes.

## Estilos

- Tailwind v4 con config CSS-first: plugin en `.postcssrc.json`, activado con
  `@import 'tailwindcss'` en `src/styles.css`. NO crees `tailwind.config.js` (la config
  estilo v3 no se toma en cuenta); define los tokens del tema en un bloque `@theme`.
- Los tokens de diseño (colores, tipografía, espaciado, radios, specs de componentes)
  viven en `design/DESIGN.md` — síguelo para UI nueva. `design/code.html` es el
  prototipo HTML estático de la página objetivo.

## Iconos

- Usa PrimeIcons (`primeicons@^8`) para todos los iconos: clases `pi pi-*`.
- El CSS se importa en `src/styles.css`: `@import 'primeicons/primeicons.css';`.
- Los valores de `icono` del API (p. ej. `Typescript01Icon`) NO son nombres de
  PrimeIcons: mapea esos nombres a las clases `pi pi-*` correspondientes en el código.

## Contrato de datos

- `design/portfolio-api.md` es la fuente de verdad del endpoint, la forma de la
  respuesta y el ejemplo.
- Los campos están en español (`nombreCompleto`, `experiencia`, `proyectos`,
  `habilidades`, `educacion`) y la respuesta es un arreglo JSON.
- El fetch se centraliza en `src/app/shared/services/portfolio.service.ts`, que obtiene
  el arreglo y devuelve el primer elemento.

## Assets estáticos

- `public/` se sirve en la raíz del sitio (`public/foo.png` → `/foo.png`). Las rutas
  del API tipo `/assets/images/...` por tanto van en `public/assets/...` (no `src/assets`).
- Ya existen imágenes de proyectos y el CV en `public/assets/`.
- Usa `toAbsoluteAssetPath()` en `src/app/shared/utils/asset-path.ts` para normalizar
  rutas relativas del API a rutas absolutas.

## Estructura del código

```
src/app/
├── app.ts / app.html              # shell de la aplicación
├── app.routes.ts                  # rutas vacías (app de una sola página)
├── app.config.ts                  # providers: HttpClient, Router
├── hero/                          # sección Hero
├── about/                         # sección About
├── experience/                    # sección Experiencia
├── projects/                      # sección Proyectos
│   └── project-card/              # card de proyecto
├── skills/                        # sección Habilidades
├── educacion/                     # sección Educación
└── shared/                        # componentes y lógica transversal
    ├── chip/                      # chip reutilizable
    ├── header/                    # navegación
    ├── footer/                    # pie de página
    ├── services/                  # PortfolioService
    ├── models/                    # tipos del contrato de datos
    ├── constants/                 # enlaces externos (GitHub, LinkedIn)
    └── utils/                     # helpers (asset-path)
```

## Convenciones Angular

- Angular 22 zoneless (sin zone.js): usa signals para el estado de los componentes;
  las secciones del portafolio siguen este patrón.
- Nomenclatura moderna del CLI: `foo.ts`/`foo.html` con `templateUrl`,
  nombres de clase sin sufijo `Component`, prefijo de selector `app`.
- No se usan archivos `*.css` de componente: los estilos se aplican con utilidades
  Tailwind directamente en la plantilla, respetando los presupuestos de build.
- Rutas en `src/app/app.routes.ts`; providers en `src/app/app.config.ts`.
- Los specs usan los globals de Vitest (`describe`/`it`/`expect` sin imports, vía
  `tsconfig.spec.json`) y corren en jsdom — no requieren navegador.

## Componentes reutilizables

- Los componentes del design system ya implementados son: `Chip`, `Header`, `Footer`
  y `ProjectCard`. Para UI nueva, piensa en reutilización antes de duplicar markup.
- Componentes presentacionales: datos vía `input()` y eventos vía `output()` (signals);
  el fetch de la mock API y la lógica quedan en servicios.

## Código limpio

- Nombres de variables, funciones, clases e identificadores SIEMPRE en inglés
  (el contenido/texto visible de la app puede estar en español).
- Código auto-documentado: funciones pequeñas, sin duplicación (DRY), SOLID donde
  aplique, sin expresiones crípticas.
- Comentarios en español, solo cuando aporten valor.

## Skills y MCP

- El proyecto tiene skills en `.agents/skills/` (lock en `skills-lock.json`):
  - Modo plan: usa la skill `spec` para diseñar la spec de la feature (hace preguntas
    de clarificación y la construye sección por sección; NO escribe código). Las specs
    se guardan en `specs/`.
  - Modo build: usa la skill `spec-impl` para implementar una spec aprobada (valida
    estado "Approved", crea una rama git con el nombre de la spec e implementa paso a
    paso con revisión de diffs).
  - Usa la skill relevante según la tarea: `angular-developer`, `tailwind-css-patterns`,
    `vitest`, `typescript-advanced-types`, `frontend-design`, `seo`, `accessibility`,
    entre otras.
- Flujo de specs de sección: el directorio `specs/` contiene specs numeradas
  (`01-header-nav.md`, `02-hero-section.md`, ..., `08-footer-section.md`) y un archivo
  de configuración `.spec-config.yml` con `AutoCreateBranch: true`, que hace que
  `spec-impl` cree y use automáticamente la rama `spec-NN-slug`.
- Usa el MCP Context7 para consultar documentación actualizada de librerías (Angular,
  Tailwind, PrimeIcons, Vitest...) cuando haya dudas de API o sintaxis.
