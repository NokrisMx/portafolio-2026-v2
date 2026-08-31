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
- El CSS se importa en `src/styles.css`: `@import 'primeicons/primeicons.css';`
  (aún no está cableado).
- Los valores de `icono` del API (p. ej. `Typescript01Icon`) NO son nombres de
  PrimeIcons: mapea esos nombres a las clases `pi pi-*` correspondientes en el código.

## Contrato de datos

- `design/portfolio-api.md` documenta la mock API externa (endpoint, forma de la
  respuesta, ejemplo) y es la fuente de verdad al modelar interfaces/servicios.
  Los campos están en español (`nombreCompleto`, `experiencia`, `proyectos`,
  `habilidades`, `educacion`) y la respuesta es un arreglo JSON.

## Assets estáticos

- `public/` se sirve en la raíz del sitio (`public/foo.png` → `/foo.png`). Las rutas
  del API tipo `/assets/images/...` por tanto van en `public/assets/...` (no `src/assets`).

## Convenciones Angular

- Angular 22 zoneless (sin zone.js): usa signals para el estado de los componentes,
  como en `src/app/app.ts`.
- Nomenclatura moderna del CLI: `foo.ts`/`foo.html`/`foo.css` con `styleUrl`/`templateUrl`,
  nombres de clase sin sufijo `Component`, prefijo de selector `app`.
- Rutas en `src/app/app.routes.ts`; providers en `src/app/app.config.ts`.
- Los specs usan los globals de Vitest (`describe`/`it`/`expect` sin imports, vía
  `tsconfig.spec.json`) y corren en jsdom — no requieren navegador.

## Componentes reutilizables

- Piensa en reutilización antes de duplicar markup: extrae como componentes standalone
  las piezas que se repiten entre secciones. Los componentes del design system en
  `design/DESIGN.md` (botones, cards, chips, inputs, listas) son los candidatos
  naturales (p. ej. la card de `proyectos`, los chips de `habilidades`).
- Componentes presentacionales: datos vía `input()` y eventos vía `output()` (signals);
  el fetch de la mock API y la lógica quedan en servicios.
- Estructura: lo transversal/reutilizable en `src/app/shared/`; cada sección del
  portafolio (about, experiencia, proyectos, habilidades, educacion) en su propia
  carpeta bajo `src/app/`.

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
- Usa el MCP Context7 para consultar documentación actualizada de librerías (Angular,
  Tailwind, PrimeIcons, Vitest...) cuando haya dudas de API o sintaxis.
