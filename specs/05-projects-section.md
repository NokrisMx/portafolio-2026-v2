# SPEC 05 — Sección Proyectos del portafolio

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 02, SPEC 04
> **Date:** 2026-09-01
> **Objective:** Implementar la sección "Proyectos" (id `proyectos`) del portafolio como componente standalone con `rxResource` sobre `PortfolioService`, mostrando un bento-grid de cards reutilizables (`ProjectCard` con datos vía `input()`) con imagen, nombre, descripción, chips de tecnologías y botones GitHub / "Ver demo" condicional, alimentado por `proyectos[]` de la mock API y siguiendo el layout de `design/code.html`.

## Por qué existe esta spec

Es la cuarta sección consumidora de la mock API y la primera que extrae un componente reutilizable (`ProjectCard`, candidato señalado por AGENTS.md). Además promueve `toAbsoluteAssetPath` a `shared/` al aparecer su segundo consumidor (la imagen de PetCute viene sin `/` inicial) y resuelve el primer dato condicional del portafolio: el botón "Ver demo" cuando `demo` llegue vacío.

## Scope

**In:**

- Utilidad `src/app/shared/utils/asset-path.ts` con `toAbsoluteAssetPath` (movida desde `experience.ts`, SPEC 04): `experience.ts` pasa a importarla y elimina su copia local; `experience.spec.ts` no cambia (mismo comportamiento).
- Componente presentacional standalone `src/app/projects/project-card/` (`project-card.ts`, `project-card.html`, `project-card.css`, `project-card.spec.ts`): selector `app-project-card`, clase `ProjectCard`, dato vía `input.required<Proyecto>()`. Card fiel a `design/code.html` 385–516 sin variantes `dark:`: contenedor `bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden flex flex-col group hover:border-primary transition-colors` + sombras suaves nivel 2 de `DESIGN.md`; imagen `<img>` en contenedor `h-48 bg-surface-container-high relative overflow-hidden`, con `[src]` normalizado, `alt` = nombre del proyecto y `group-hover:scale-105 transition-transform duration-500`; cuerpo `p-6 flex flex-col flex-grow` con `h3` nombre (`headline-sm`), `p` descripcion (`body-md text-on-surface-variant flex-grow`), chips de `tecnologias[]` (pills `label-mono` estilo SPEC 04: `bg-surface-container-high text-on-surface border border-outline-variant rounded-full`) y botones `flex gap-2 mt-auto`:
  - **GitHub** (ghost): anchor a `github` (`bg-surface-container-high text-on-surface label-mono text-sm rounded-base hover:bg-surface-container`).
  - **Ver demo** (secondary): anchor a `demo` (`border border-primary text-primary label-mono text-sm rounded-base hover:bg-primary/5`), renderizado solo con `@if (project().demo)`.
  - Ambos con `target="_blank"` y `rel="noopener noreferrer"` (patrón SPEC 02/04).
- Componente standalone `src/app/projects/` (`projects.ts`, `projects.html`, `projects.css`, `projects.spec.ts`): selector `app-projects`, clase `Projects`, estado vía `rxResource` sobre `PortfolioService` (mismo patrón que hero/about/experience).
- Sección con `id="proyectos"` (id reservado por el header en SPEC 01), fiel a `design/code.html` 377–519 sin `dark:`: fondo `bg-surface`, `px-gutter py-xl`, contenedor `max-w-300 mx-auto`, título "Proyectos" en `headline-md` + barra divisoria `h-1 w-12 bg-primary rounded-full mb-12` (patrón de encabezado de sección).
- Bento-grid del prototipo con utilidad arbitraria de Tailwind (sin clase custom `.bento-grid`): `grid gap-md grid-cols-[repeat(auto-fit,minmax(300px,1fr))]`, un `app-project-card` por elemento de `proyectos[]` (orden del API, `track $index` porque dos proyectos comparten nombre).
- Estados con signals: cargando → skeleton con la estructura (título + barra + grid con 4 cards placeholder `animate-pulse`: bloque `h-48` + líneas de texto); error → mensaje discreto + botón "Reintentar" (`reload()`); éxito → grid completo. Arreglo `proyectos` vacío → no se renderizan cards (sin empty-state dedicado).
- Tests: `project-card.spec.ts` (render con `input`, chip por tecnología, `@if` del demo, `href`/`target`/`rel` de los botones, `src` normalizado y `alt`) y `projects.spec.ts` con el servicio mockeado (id, título, skeleton, error + "Reintentar", una card por proyecto en orden).
- Integración en `App`: `<app-projects />` tras `<app-experience />` en `src/app/app.html`, import de `Projects` en `src/app/app.ts`, actualización de `src/app/app.spec.ts`.

**Out of scope (for future specs):**

- Secciones habilidades, educacion y footer.
- Componente compartido de chips (`src/app/shared/chip/`): la sección habilidades necesitará chips con icono PrimeIcons (forma distinta); sigue la decisión de SPEC 04.
- Dark mode (transversal) y rutas en `app.routes.ts` (decisión SPEC 01).
- Caché o fetch compartido en `PortfolioService`.
- Paginación, filtros o búsqueda de proyectos.
- Optimización de imágenes (`srcset`, `loading="lazy"`): la card usa `<img>` plano como el resto del sitio.
- Empty-state dedicado para `proyectos` vacío.

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza la interfaz `Proyecto` de `src/app/shared/models/portfolio.models.ts` (SPEC 02) y `PortfolioService.getPortfolio()` tal cual.

```ts
// src/app/shared/utils/asset-path.ts
// export function toAbsoluteAssetPath(path: string): string — antepone '/' si falta

// src/app/projects/projects.ts — estado del componente (signals, patrón Hero/About/Experience)
// portfolio = rxResource({ stream: () => this.portfolioService.getPortfolio() })
// proyectos = computed(() => this.portfolio.value()?.proyectos ?? [])

// src/app/projects/project-card/project-card.ts — componente presentacional
// project = input.required<Proyecto>()
```

Constantes visuales (no vienen en el API):

```ts
export const SECTION_TITLE = 'Proyectos';
// Labels de botones escritos en la plantilla: "GitHub", "Ver demo"
// Track del @for de cards: $index (dos proyectos comparten nombre "Guevara Librerias")
```

## Implementation plan

1. Extraer `toAbsoluteAssetPath` a `src/app/shared/utils/asset-path.ts` y refactorizar `experience.ts` para importarla (sin copia local). Manual: `npm run build` y `ng test --watch=false` en verde con `experience.spec.ts` sin cambios (mismo comportamiento).
2. Crear `ProjectCard` en `src/app/projects/project-card/` con `input.required<Proyecto>()` y la plantilla de la card del prototipo (imagen, nombre, descripción, chips, botones con `@if` del demo). Manual: `npm run build` en verde.
3. Crear el esqueleto standalone `src/app/projects/` e integrarlo: `<app-projects />` tras `<app-experience />` en `src/app/app.html` e import de `Projects` en `src/app/app.ts`. Manual: `npm run build` y ver la sección (vacía) en localhost:4200.
4. Implementar el estado y `projects.html`: `rxResource`, `proyectos` computed, `reload()`, encabezado "Proyectos" + barra, bento-grid con `@for` + `app-project-card`, skeleton (4 placeholders) y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px con `npm start`.
5. Escribir `project-card.spec.ts` y `projects.spec.ts` con el servicio mockeado, y actualizar `src/app/app.spec.ts` (render de `app-projects` tras experience). Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [ ] `ng test --watch=false` pasa en verde (specs de App, Header, Hero, PortfolioService, About, Experience, ProjectCard y Projects).
- [ ] La sección renderiza con `id="proyectos"` y el link "Proyectos" del header la activa al hacer scroll hasta ella.
- [ ] Se renderiza un `app-project-card` por elemento de `proyectos[]`, en el orden del arreglo, con `nombre`, `descripcion` e `image` traídos de la mock API (no hardcodeados).
- [ ] Cada card muestra un chip por elemento de `tecnologias` con estilo `label-mono`.
- [ ] El botón GitHub es un anchor a `project.github` con `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] El botón "Ver demo" solo aparece cuando `demo` no está vacío (hoy los 4 proyectos lo muestran; verificado con un caso vacío en `project-card.spec.ts`).
- [ ] La imagen de cada card usa `[src]` normalizado a `/assets/images/guevaralibreriasfront.jpg`, `/assets/images/guevaralibreriasback.jpg`, `/assets/images/blackjack.jpg` y `/assets/images/petcute.jpg` (responden 200 en el dev server), con `alt` igual al nombre del proyecto.
- [ ] Mientras carga se ve el skeleton con la estructura; si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [ ] `toAbsoluteAssetPath` vive en `src/app/shared/utils/asset-path.ts` y `experience.ts` la importa (sin copia local).
- [ ] No hay clases `dark:`; radios siguen `DESIGN.md` (card `rounded-lg`, botones `rounded-base`, chips `rounded-full`).
- [ ] El texto visible está en español y los identificadores del código en inglés.
- [ ] `projects.css` y `project-card.css` quedan vacíos o mínimos (estilos con utilidades Tailwind en las plantillas).

## Decisions

- **Sí:** chips de `tecnologias[]` en cada card (decisión del usuario): el prototipo no los muestra pero el contrato los trae; mismo precedente que SPEC 04 con logo y habilidades, y `DESIGN.md` define los chips.
- **Sí:** ocultar "Ver demo" con `@if` cuando `demo` esté vacío (decisión del usuario): replica el comportamiento del prototipo (card 2 solo tiene GitHub) y evita un botón muerto.
- **Sí:** `ProjectCard` como componente presentacional con `input.required<Proyecto>()` (decisión del usuario): AGENTS.md lo señala como candidato natural; la sección queda como orquestadora (fetch + estados) y la card se testa aislada.
- **Sí:** promover `toAbsoluteAssetPath` a `src/app/shared/utils/asset-path.ts` (decisión del usuario): segundo consumidor (PetCute sin `/`), DRY; refactor mínimo y aislado de `experience.ts` (paso 1 del plan).
- **Sí:** título "Proyectos" (decisión del usuario): coincide con el link del nav de SPEC 01, mismo criterio de SPEC 03/04.
- **Sí:** bento-grid con clase arbitraria de Tailwind (`grid-cols-[repeat(auto-fit,minmax(300px,1fr))]`) en vez de la clase custom `.bento-grid` del prototipo: cumple el presupuesto de CSS y AGENTS.md prefiere utilidades.
- **Sí:** imagen como `<img>` con `object-cover` y `alt` (nombre del proyecto) en vez del `background-image` del prototipo: accesible y consistente con los logos de SPEC 04.
- **Sí:** `track $index` en el `@for`: dos proyectos comparten nombre ("Guevara Librerias") y el orden del API es estable.
- **Sí:** `target="_blank"` + `rel="noopener noreferrer"` en GitHub y demo: enlaces externos, patrón SPEC 02/04.
- **No:** componente compartido `shared/chip`: la sección habilidades necesita chips con icono PrimeIcons (forma distinta); se mantiene la decisión de SPEC 04.
- **No:** empty-state dedicado, paginación, filtros, `loading="lazy"`/`srcset`, dark mode, caché en `PortfolioService`.

## Risks

| Riesgo                                              | Mitigación                                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Mock API externa caída o lenta                      | Estados skeleton/error con "Reintentar" (patrón Hero/About/Experience); los tests usan el servicio mockeado y no dependen de la red. |
| Rutas de imagen sin `/` inicial en el API           | Helper compartido `toAbsoluteAssetPath`; el criterio de aceptación verifica los 4 `src` exactos.                                     |
| Refactor del helper toca código de SPEC 04 aprobada | Paso 1 aislado del plan: build y tests en verde (sin cambios en `experience.spec.ts`) antes de continuar.                            |
| `nombre` duplicado rompe el track del `@for`        | `track $index` documentado en el data model.                                                                                         |
| jsdom no aplica estilos; responsive no testeable    | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                                          |
| Exceder presupuesto de CSS de componente (4kB)      | Grid, hover y sombras con utilidades Tailwind en las plantillas; `projects.css` y `project-card.css` vacíos o mínimos.               |

## What is **not** in this spec

- Secciones habilidades, educacion y footer.
- Componente compartido `shared/chip`.
- Dark mode, rutas en `app.routes.ts`.
- Caché o fetch compartido en `PortfolioService`.
- Paginación, filtros, optimización de imágenes, empty-state.

Cada uno de esos puntos, si llega, va en su propia spec.
