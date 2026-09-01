# SPEC 06 — Sección Habilidades del portafolio

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 02, SPEC 04, SPEC 05
> **Date:** 2026-09-01
> **Objective:** Implementar la sección "Habilidades" (id `habilidades`) del portafolio como componente standalone con `rxResource` sobre `PortfolioService`, mostrando los `nombre` de `habilidades[]` de la mock API como chips de texto centrados mediante un componente compartido `Chip` (extraído a `src/app/shared/chip/` y adoptado también por `experience` y `project-card` en reemplazo de su markup local), siguiendo el layout de `design/code.html`.

## Por qué existe esta spec

Es la quinta sección consumidora de la mock API y la que resuelve la decisión de arquitectura que SPEC 04 y SPEC 05 dejaron explícitamente pendiente: el componente compartido de chips. `habilidades` es el tercer consumidor del mismo markup de pill, lo que justifica la extracción. Además deja documentado por qué el campo `icono` del contrato no se renderiza: verificado contra `primeicons@8` instalado, la librería no tiene iconos de marca tecnológica (no existen `pi-angular`, `pi-typescript`, `pi-javascript`, `pi-figma`, etc.), solo ~5 de las 12 habilidades tendrían mapeo semántico natural y `C#` llega con `icono: ""` en el contrato.

## Scope

**In:**

- Componente presentacional standalone `src/app/shared/chip/` (`chip.ts`, `chip.html`, `chip.css`, `chip.spec.ts`): selector `app-chip`, clase `Chip`, `label = input.required<string>()` y `size = input<'sm' | 'md'>('sm')`. Renderiza la pill de `DESIGN.md` ("Chips (Skill Tags)"): `inline-block bg-surface-container-high text-on-surface font-label-mono text-label-mono border border-outline-variant rounded-full` + `px-3 py-1` en `sm` / `px-4 py-2` en `md`.
- Refactor de los dos consumidores existentes del markup de pill: `experience.html` (chips de `habilidades[]`) y `project-card.html` (chips de `tecnologias[]`) pasan a `<app-chip [label]="...">` en su `@for` y eliminan el span local; `experience.ts` y `project-card.ts` agregan `Chip` a `imports`. El DOM renderizado y las clases visuales no cambian (`sm` por defecto).
- Componente standalone `src/app/skills/` (`skills.ts`, `skills.html`, `skills.css`, `skills.spec.ts`): selector `app-skills`, clase `Skills`, estado vía `rxResource` sobre `PortfolioService` (mismo patrón que hero/about/experience/projects).
- Sección con `id="habilidades"` (id reservado por el header en SPEC 01), fiel a `design/code.html` 521–579 sin variantes `dark:`: fondo `bg-surface-bright`, `px-gutter py-xl`, contenedor `max-w-300 mx-auto text-center`, título "Habilidades" en `headline-md` + barra divisoria `h-1 w-12 bg-primary rounded-full mx-auto mb-12` (centrada: es la única sección centrada del prototipo).
- Fila de chips: `flex flex-wrap justify-center gap-4 max-w-4xl mx-auto` con un `<app-chip [label]="skill.nombre" size="md" />` por elemento de `habilidades[]` (orden del API, `track skill.nombre`, nombre tal cual el contrato: "ANGULAR", "JavaScript", "TAILWIND CSS"...).
- Estados con signals: cargando → skeleton con la estructura (título + barra + fila de ~8 pills placeholder `h-9 w-24 bg-surface-container rounded-full animate-pulse`); error → mensaje discreto + botón "Reintentar" (`reload()`); éxito → fila completa. Arreglo `habilidades` vacío → no se renderizan chips (sin empty-state dedicado).
- Tests: `chip.spec.ts` (label renderizado, clases base, variante `sm` por defecto y `md`) y `skills.spec.ts` con el servicio mockeado (id, título, skeleton, error + "Reintentar", un `app-chip` por habilidad en orden con su nombre). `experience.spec.ts` y `project-card.spec.ts` no cambian y siguen en verde (mismo DOM).
- Integración en `App`: `<app-skills />` tras `<app-projects />` en `src/app/app.html`, import de `Skills` en `src/app/app.ts`, test nuevo en `src/app/app.spec.ts` (render de `app-skills` tras projects).

**Out of scope (for future specs):**

- Sección educacion y footer.
- Iconos en los chips y mapeo `icono` → PrimeIcons (descartado en esta spec; ver Decisions).
- Dark mode (transversal) y rutas en `app.routes.ts` (decisión SPEC 01).
- Caché o fetch compartido en `PortfolioService`.
- Agrupar habilidades por categoría (frontend / backend / herramientas) u ordenarlas: se respeta el orden del API.
- Empty-state dedicado para `habilidades` vacío.
- Filtros o búsqueda de habilidades.

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza la interfaz `Habilidad` de `src/app/shared/models/portfolio.models.ts` (SPEC 02) y `PortfolioService.getPortfolio()` tal cual. El campo `icono` de `Habilidad` no se consume (decisión de esta spec).

```ts
// src/app/shared/chip/chip.ts — componente presentacional
// label = input.required<string>()
// size = input<'sm' | 'md'>('sm')

// src/app/skills/skills.ts — estado del componente (signals, patrón Hero/About/Experience/Projects)
// portfolio = rxResource({ stream: () => this.portfolioService.getPortfolio() })
// habilidades = computed(() => this.portfolio.value()?.habilidades ?? [])
```

Constantes visuales (no vienen en el API):

```ts
export const SECTION_TITLE = 'Habilidades';
// Track del @for de chips: skill.nombre (único por item en el contrato actual)
// Labels escritos en la plantilla: "No se pudo cargar la información. Intenta de nuevo.", "Reintentar"
```

## Implementation plan

1. Crear `Chip` en `src/app/shared/chip/` (`input.required<string>() label`, `size` con default `'sm'`) y refactorizar `experience.html` y `project-card.html` para usar `<app-chip [label]="...">` (agregando `Chip` a los `imports` de `experience.ts` y `project-card.ts`). Manual: `npm run build` y `ng test --watch=false` en verde con `experience.spec.ts` y `project-card.spec.ts` sin cambios (mismo DOM renderizado).
2. Escribir `chip.spec.ts` (label, clases base, padding `sm` por defecto y `md`). Manual: `ng test --include src/app/shared/chip/chip.spec.ts` en verde.
3. Crear el esqueleto standalone `src/app/skills/` e integrarlo: `<app-skills />` tras `<app-projects />` en `src/app/app.html` e import de `Skills` en `src/app/app.ts`. Manual: `npm run build` y ver la sección (vacía) en localhost:4200.
4. Implementar el estado y `skills.html`: `rxResource`, `habilidades` computed, `reload()`, encabezado centrado "Habilidades" + barra con `mx-auto`, fila de `<app-chip size="md">`, skeleton y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px con `npm start`.
5. Escribir `skills.spec.ts` con el servicio mockeado y agregar el test de `app-skills` tras projects en `src/app/app.spec.ts`. Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [ ] `ng test --watch=false` pasa en verde (specs de App, Header, Hero, PortfolioService, About, Experience, ProjectCard, Projects, Chip y Skills).
- [ ] La sección renderiza con `id="habilidades"` y el link "Habilidades" del header la activa al hacer scroll hasta ella.
- [ ] Se renderiza un `app-chip` por elemento de `habilidades[]`, en el orden del arreglo, con `label` igual al `nombre` tal cual el API (p. ej. "ANGULAR", "JavaScript", "TAILWIND CSS", "C#") y `size="md"` (no hardcodeados).
- [ ] Ningún chip muestra icono: el campo `icono` del contrato no se renderiza en la sección.
- [ ] `experience.html` y `project-card.html` no tienen markup local de pill: usan `<app-chip>` y sus specs siguen pasando sin cambios.
- [ ] El título "Habilidades" usa `headline-md` y la barra divisoria va centrada (`mx-auto`) sobre la fila de chips con `justify-center`.
- [ ] Mientras carga se ve el skeleton con la estructura; si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [ ] No hay clases `dark:`; los chips son `rounded-full` con fondo `surface-container-high` y borde `outline-variant` según `DESIGN.md`.
- [ ] El texto visible está en español y los identificadores del código en inglés.
- [ ] `skills.css` y `chip.css` quedan vacíos o mínimos (estilos con utilidades Tailwind en las plantillas).

## Decisions

- **Sí: chips solo texto, ignorando el campo `icono` (decisión del usuario):** fiel al prototipo (`design/code.html` 527–577) y a `DESIGN.md` (pills `label-mono` sin icono). Verificado contra `primeicons@8` instalado: no hay iconos de marca tech; solo ~5 de 12 habilidades tendrían mapeo natural y `C#` trae `icono: ""`. Un fallback genérico dejaría la mitad de los chips con iconos forzados.
- **Sí: título "Habilidades" (decisión del usuario):** coincide con el link del nav de SPEC 01 y el criterio de SPEC 03/04/05; el "Technical Arsenal" del prototipo es copy en inglés.
- **Sí: extraer `src/app/shared/chip/` (decisión del usuario):** tercer consumidor del mismo markup; AGENTS.md y `DESIGN.md` señalan el chip como componente del design system; mismo precedente que `toAbsoluteAssetPath` en SPEC 05 (refactor como paso 1 aislado, specs existentes en verde). Revierte la decisión de SPEC 04/05 de mantener markup local.
- **Sí: variante de tamaño en `Chip` (`sm` por defecto, `md` en habilidades):** experience/project-card usan `px-3 py-1` y el prototipo de habilidades usa `px-4 py-2`; una variante evita duplicar el componente y mantiene el DOM idéntico en los consumidores actuales.
- **Sí: nombres tal cual el contrato ("ANGULAR", "GIT", "FIGMA"):** el API es la fuente de verdad, mismo criterio que las fechas en SPEC 04; sin normalizar capitalización.
- **Sí: `track skill.nombre`:** único por item en el contrato actual (los 12 nombres son distintos).
- **Sí: layout centrado (`text-center`, barra con `mx-auto`, chips con `justify-center` y `max-w-4xl`):** es la única sección centrada del prototipo (521–579).
- **No: iconos PrimeIcons con fallback genérico (decisión del usuario):** inconsistente visualmente y semánticamente forzado para la mayoría de las tecnologías.
- **No: dark mode, rutas en `app.routes.ts`, caché en `PortfolioService`, empty-state, agrupación por categoría, filtros.**

## Risks

| Riesgo                                                | Mitigación                                                                                                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Mock API externa caída o lenta                        | Estados skeleton/error con "Reintentar" (patrón Hero/About/Experience/Projects); los tests usan el servicio mockeado.                |
| Refactor del chip toca código de SPEC 04/05 aprobadas | Paso 1 aislado del plan: el DOM renderizado no cambia y `experience.spec.ts`/`project-card.spec.ts` quedan en verde antes de seguir. |
| `nombre` duplicado rompería el track del `@for`       | `skill.nombre` es único en el contrato actual; documentado en el data model.                                                         |
| jsdom no aplica estilos; responsive no testeable      | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                                          |
| Exceder presupuesto de CSS de componente (4kB)        | Pills y layout con utilidades Tailwind; `chip.css` y `skills.css` vacíos o mínimos.                                                  |

## What is **not** in this spec

- Sección educacion y footer.
- Iconos en los chips y mapeo `icono` → PrimeIcons.
- Dark mode, rutas en `app.routes.ts`, caché en `PortfolioService`.
- Agrupación por categoría, ordenamiento, empty-state, filtros.

Cada uno de esos puntos, si llega, va en su propia spec.
