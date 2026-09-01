# SPEC 07 — Sección Educación del portafolio

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-09-01
> **Objective:** Implementar la sección "Educación" (id `educacion`) del portafolio como componente standalone con `rxResource` sobre `PortfolioService`, mostrando las entradas de `educacion[]` de la mock API como cards inline con título, institución, descripción y pill de fechas tal cual el contrato, siguiendo el layout de `design/code.html`.

## Por qué existe esta spec

Es la última sección de contenido del prototipo pendiente de implementar y la única del menú sin sección: el header (SPEC 01) ya reserva el id `educacion` con el link "Educación", que hoy no activa ninguna sección. Además fija dos decisiones de contrato que el prototipo no resuelve: mostrar `descripcion` (que el prototipo omite) y renderizar las fechas tal cual el API (sin extraer años).

## Scope

**In:**

- Componente standalone `src/app/educacion/` (`educacion.ts`, `educacion.html`, `educacion.css`, `educacion.spec.ts`): selector `app-educacion`, clase `Educacion`, estado vía `rxResource` sobre `PortfolioService` (mismo patrón que hero/about/experience/projects/skills).
- Sección con `id="educacion"` (id reservado por el header en SPEC 01), fiel a `design/code.html` 580–608 sin variantes `dark:`: fondo `bg-surface`, `px-gutter py-xl`, contenedor `max-w-300 mx-auto text-center md:text-left`, grid `md:grid-cols-3 gap-lg items-center` con columna de título (`md:col-span-1`) y columna de contenido (`md:col-span-2`).
- Encabezado de sección: título "Educación" en `headline-md` + barra divisoria `h-1 w-12 bg-primary rounded-full mb-8 mx-auto md:mx-0` (centrada en móvil, alineada a la izquierda en desktop, como el prototipo).
- Cards inline en `educacion.html` (decisión del usuario, sin componente presentacional): una por elemento de `educacion[]` (orden del API, `track $index`), apiladas verticalmente con `space-y-6` en la columna de contenido. Card fiel al prototipo: `bg-surface-container-lowest p-8 rounded-lg border border-outline-variant shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-4` (radio `rounded-lg` = 1rem de "Large Containers" de `DESIGN.md`, equivalente del `rounded-xl` del prototipo), con:
  - `h3` con `titulo` (`headline-sm`).
  - `p` con `institucion` (`body-lg text-primary mt-2`).
  - `p` con `descripcion` (`body-md text-on-surface-variant mt-2`) — dato que el prototipo no muestra pero el contrato trae (decisión del usuario).
  - Pill de fechas `inline-block px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono rounded-full whitespace-nowrap` con `{{ item.fechaInicio }} – {{ item.fechaFin }}` tal cual el contrato (patrón de `experience.html`).
- Estados con signals: cargando → skeleton con la estructura (título + barra + una card placeholder `animate-pulse`); error → mensaje discreto + botón "Reintentar" (`reload()`); éxito → grid completo. Arreglo `educacion` vacío → no se renderizan cards (sin empty-state dedicado).
- Tests: `educacion.spec.ts` con el servicio mockeado (id, título, skeleton, error + "Reintentar", una card por elemento en orden con `titulo`/`institucion`/`descripcion`/fechas, caso vacío sin cards, y un caso con dos entradas para verificar orden y apilado) y test nuevo en `src/app/app.spec.ts` (render de `app-educacion` tras skills).
- Integración en `App`: `<app-educacion />` tras `<app-skills />` en `src/app/app.html`, import de `Educacion` en `src/app/app.ts`.

**Out of scope (for future specs):**

- Footer (única pieza del prototipo que queda pendiente; va en su propia spec).
- Dark mode (transversal) y rutas en `app.routes.ts` (decisión SPEC 01).
- Caché o fetch compartido en `PortfolioService`.
- Componente presentacional `education-card` (descartado en esta spec; ver Decisions).
- Empty-state dedicado para `educacion` vacío.
- Certificados, cursos o formación complementaria: no existen en el contrato.
- Ordenamiento o agrupación de entradas (se respeta el orden del API).

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza la interfaz `Educacion` de `src/app/shared/models/portfolio.models.ts` (SPEC 02) y `PortfolioService.getPortfolio()` tal cual.

```ts
// src/app/educacion/educacion.ts — estado del componente (signals, patrón Hero/About/Experience/Projects/Skills)
// portfolio = rxResource({ stream: () => this.portfolioService.getPortfolio() })
// educacion = computed(() => this.portfolio.value()?.educacion ?? [])
```

Constantes visuales (no vienen en el API):

```ts
export const SECTION_TITLE = 'Educación';
// Track del @for de cards: $index (dos títulos de la misma institución duplicarían institucion como key)
// Labels escritos en la plantilla: "No se pudo cargar la información. Intenta de nuevo.", "Reintentar"
```

## Implementation plan

1. Crear el esqueleto standalone `src/app/educacion/` e integrarlo: `<app-educacion />` tras `<app-skills />` en `src/app/app.html` e import de `Educacion` en `src/app/app.ts`. Manual: `npm run build` en verde y ver la sección (vacía) en localhost:4200.
2. Implementar el estado y `educacion.html`: `rxResource`, `educacion` computed, `reload()`, grid título/contenido, card inline con los cuatro datos, skeleton y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px con `npm start` (datos reales del API; carga/error con DevTools).
3. Escribir `educacion.spec.ts` con el servicio mockeado y agregar el test de `app-educacion` tras skills en `src/app/app.spec.ts`. Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [ ] `ng test --watch=false` pasa en verde (specs de App, Header, Hero, PortfolioService, About, Experience, ProjectCard, Projects, Chip, Skills y Educacion).
- [ ] La sección renderiza con `id="educacion"` y el link "Educación" del header la activa al hacer scroll hasta ella.
- [ ] Se renderiza una card por elemento de `educacion[]`, en el orden del arreglo, con `titulo` en el `h3`, `institucion`, `descripcion` y fechas traídos de la mock API (no hardcodeados).
- [ ] La pill de fechas muestra `fechaInicio – fechaFin` tal cual el contrato: "agosto 2018 – diciembre 2022".
- [ ] El campo `descripcion` se renderiza bajo la institución (dato que el prototipo omite).
- [ ] Mientras carga se ve el skeleton con la estructura; si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [ ] Con el arreglo `educacion` vacío no se renderizan cards (verificado en `educacion.spec.ts`).
- [ ] No hay clases `dark:`; la card usa `rounded-lg` (1rem, "Large Containers" de `DESIGN.md`) y la pill `rounded-full` con fondo `surface-container-high`.
- [ ] El texto visible está en español y los identificadores del código en inglés.
- [ ] `educacion.css` queda vacío o mínimo (estilos con utilidades Tailwind en las plantillas).

## Decisions

- **Sí: mostrar `descripcion` (decisión del usuario):** el contrato trae "Especialidad en Tecnologías Móviles (2020)" y agrega valor; mismo precedente que SPEC 04 (logo/habilidades) y SPEC 05 (tecnologías) con datos que el prototipo no muestra. Se renderiza en `body-md text-on-surface-variant` para no competir con la institución (`body-lg text-primary`).
- **Sí: fechas tal cual el API, "agosto 2018 – diciembre 2022" (decisión del usuario):** consistente con `experience.html` (mismo par de campos) y sin lógica de parseo frágil sobre strings en español.
- **Sí: card inline en `educacion.html` (decisión del usuario):** el contrato trae un solo elemento y la card no tiene otros consumidores; AGENTS.md pide extraer componentes solo ante duplicación (caso `Chip` en SPEC 06).
- **Sí: título "Educación":** coincide con el label del link del header (SPEC 01); mismo criterio de SPEC 03–06 frente al copy en inglés del prototipo ("Education").
- **Sí: `track $index` en el `@for`:** aunque hoy hay un solo elemento, dos títulos de la misma institución duplicarían `institucion` como key; precedente SPEC 05.
- **Sí: apilar cards con `space-y-6` si el arreglo crece:** el prototipo solo define una card; el apilado vertical en la columna de contenido sigue el patrón de `about.html` sin inventar un layout nuevo.
- **Sí: `rounded-lg` en la card (1rem):** "Large Containers" de `DESIGN.md`; el `rounded-xl` del prototipo (0.75rem en su escala CDN) no existe igual en la escala del app, y la card de proyectos ya mapeó este mismo caso a `rounded-lg` (SPEC 05).
- **No: componente `education-card`:** ceremonia innecesaria para un item sin reutilización (decisión del usuario).
- **No: extraer solo años de las fechas:** parsing frágil y rompe la consistencia con experience (descartado por el usuario).
- **No: footer, dark mode, rutas en `app.routes.ts`, caché en `PortfolioService`, empty-state, certificados, ordenamiento.**

## Risks

| Riesgo                                             | Mitigación                                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Mock API externa caída o lenta                     | Estados skeleton/error con "Reintentar" (patrón de las cinco secciones previas); los tests usan el servicio mockeado. |
| Contrato con un solo elemento: multi-card sin real | `educacion.spec.ts` incluye un caso con dos entradas para verificar apilado y orden.                                  |
| jsdom no aplica estilos; responsive no testeable   | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                           |
| Exceder presupuesto de CSS de componente (4kB)     | Grid, card y pill con utilidades Tailwind; `educacion.css` vacío o mínimo.                                            |

## What is **not** in this spec

- Footer.
- Componente presentacional `education-card`.
- Dark mode, rutas en `app.routes.ts`, caché en `PortfolioService`.
- Empty-state, certificados, ordenamiento o agrupación.

Cada uno de esos puntos, si llega, va en su propia spec.
