# SPEC 04 — Sección Experiencia del portafolio

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-09-01
> **Objective:** Implementar la sección "Experiencia" (id `experiencia`) del portafolio como componente standalone con `rxResource` sobre `PortfolioService`, mostrando un timeline vertical de cards con puesto, rango de fechas, empresa enlazada con logo y chips de habilidades, alimentado por `experiencia[]` de la mock API y siguiendo el layout de `design/code.html`.

## Por qué existe esta spec

Es la tercera sección consumidora de la mock API y la primera que recorre un arreglo anidado con datos enriquecidos por item (`logo`, `url`, `habilidades[]`), que el prototipo no muestra. Además introduce la normalización de rutas de assets que el API entrega sin `/` inicial.

## Scope

**In:**

- Componente standalone `src/app/experience/` (`experience.ts`, `experience.html`, `experience.css`, `experience.spec.ts`): selector `app-experience`, clase `Experience`, datos vía `rxResource` sobre `PortfolioService` (mismo patrón que `src/app/hero/hero.ts` y `src/app/about/about.ts`).
- Sección con `id="experiencia"` (id reservado por el header en SPEC 01), fiel a `design/code.html` 315–376 sin variantes `dark:`: fondo `bg-surface-bright`, `px-gutter py-xl`, contenedor `max-w-300 mx-auto`, título "Experiencia" en `headline-md` + barra divisoria `h-1 w-12 bg-primary rounded-full mb-12` (patrón de encabezado de sección del prototipo).
- Timeline vertical: contenedor `relative border-l-2 border-surface-container-highest ml-3 md:ml-6 space-y-12` con un item por elemento de `experiencia[]` (orden del API); marcador cuadrado `w-4 h-4 bg-primary rounded-sm` posicionado sobre la línea, con anillo escrito como valor arbitrario con `var(--color-surface-bright)` (el `theme()` del prototipo es sintaxis v3).
- Card por experiencia (efecto glass del prototipo con utilidades Tailwind: `bg-white/80` + `backdrop-blur-md` + `border border-outline-variant` + sombras suaves nivel 2 de `DESIGN.md`, radio `rounded-lg` para contenedor grande):
  - Encabezado: `h3` con `puesto` (`headline-sm`) y badge pill con `fechaInicio – fechaFin` concatenados tal cual el API (`label-mono`, `bg-surface-container-high`, `rounded-full`, `whitespace-nowrap`).
  - Empresa: `<img>` con `[src]` normalizado a ruta absoluta y `alt` que incluye el nombre de la empresa, junto al nombre como anchor a `url` (`text-primary font-medium`, `target="_blank"`, `rel="noopener noreferrer"`).
  - Descripción: `body-md text-on-surface-variant` tal cual el API.
  - Chips de `habilidades[]`: pills `label-mono` estilo `DESIGN.md` (fondo `surface-container-high`, texto `on-surface`, borde `outline-variant`, `rounded-full`), markup local con `@for` (sin componente compartido).
- Estados con signals: cargando → skeleton con la estructura (título + línea + 2 cards placeholder con `animate-pulse`); error → mensaje discreto + botón "Reintentar" (`reload()`); éxito → timeline completo. Arreglo `experiencia` vacío → no se renderizan items (sin empty-state dedicado).
- Helper de normalización de rutas de logo en `experience.ts`: antepone `/` cuando el API la omite (`assets/images/vitek.png` → `/assets/images/vitek.png`).
- Tests en `src/app/experience/experience.spec.ts` con el servicio mockeado (globals de Vitest, jsdom).
- Integración en `App`: `<app-experience />` tras `<app-about />` en `src/app/app.html`, import de `Experience` en `src/app/app.ts`, actualización de `src/app/app.spec.ts`.

**Out of scope (for future specs):**

- Secciones proyectos, habilidades, educacion y footer.
- Componente compartido de chips (`src/app/shared/chip/`): markup local; se extrae si la sección habilidades lo justifica.
- Dark mode (transversal) y rutas en `app.routes.ts` (decisión SPEC 01).
- Formateo de fechas (capitalización/abreviación de meses): el API es la fuente de verdad.
- Ordenamiento cronológico del arreglo: se respeta el orden del API.
- Caché o fetch compartido en `PortfolioService`.
- Optimización de imágenes de logo (formatos, tamaños, `srcset`).

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza la interfaz `Experiencia` de `src/app/shared/models/portfolio.models.ts` (SPEC 02) y `PortfolioService.getPortfolio()` tal cual.

```ts
// src/app/experience/experience.ts — estado del componente (signals, patrón Hero/About)
// portfolio = rxResource({ stream: () => this.portfolioService.getPortfolio() })
// → portfolio.isLoading() / portfolio.error() / portfolio.reload()
// experiencia = computed(() => this.portfolio.value()?.experiencia ?? [])
// toAbsoluteAssetPath(path: string): string — antepone '/' si falta
```

Constantes visuales (no vienen en el API):

```ts
export const SECTION_TITLE = 'Experiencia';
// Track del @for de items: item.empresa (única por item en la práctica)
// Track del @for de chips: la propia habilidad
```

## Implementation plan

1. Crear el esqueleto standalone `src/app/experience/` (`experience.ts` con selector `app-experience`, `experience.html` vacío) e integrarlo: `<app-experience />` tras `<app-about />` en `src/app/app.html` e import de `Experience` en `src/app/app.ts`. Manual: `npm run build` y ver la sección (vacía) en localhost:4200.
2. Implementar el estado en `experience.ts`: `rxResource` sobre `PortfolioService`, `experiencia` computed, `reload()` y `toAbsoluteAssetPath`. Manual: los datos quedan disponibles para la plantilla.
3. Implementar `experience.html` siguiendo `design/code.html` 315–376 (sin `dark:`): encabezado de sección, timeline con marcadores, cards (puesto, badge de fechas, logo + empresa enlazada, descripción, chips); skeleton y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px (badge apilado bajo el puesto, `flex-col md:flex-row`).
4. Escribir `experience.spec.ts` con el servicio mockeado: cargando (skeleton), éxito (id `experiencia`, título, puestos, rango de fechas tal cual, `href`/`target`/`rel` de las empresas, `src` normalizado de logos, chips), error + "Reintentar".
5. Actualizar `src/app/app.spec.ts` (render de `app-experience` tras about). Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [ ] `ng test --watch=false` pasa en verde (specs de App, Header, Hero, PortfolioService, About y Experience).
- [ ] La sección renderiza con `id="experiencia"` y el link "Experiencia" del header la activa al hacer scroll hasta ella.
- [ ] Cada card muestra `puesto`, `empresa` y `descripcion` traídos de la mock API (no hardcodeados), en el orden del arreglo.
- [ ] El badge de fechas muestra `fechaInicio` y `fechaFin` concatenados tal cual el API (p. ej. "Julio 2025 – Enero 2026").
- [ ] La empresa es un anchor a su `url` con `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] El logo de cada empresa usa `[src]` normalizado a `/assets/images/vitek.png` y `/assets/images/vidasypensiones.png` (responden 200 en el dev server), con `alt` que incluye el nombre de la empresa.
- [ ] Cada card muestra un chip por elemento de `habilidades` con estilo `label-mono`.
- [ ] Mientras carga se ve el skeleton con la estructura; si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [ ] No hay clases `dark:`; radios siguen `DESIGN.md` (card `rounded-lg`, badge y chips `rounded-full`).
- [ ] El texto visible está en español y los identificadores del código en inglés.
- [ ] `experience.css` queda vacío o mínimo (estilos con utilidades Tailwind en la plantilla).

## Decisions

- **Sí:** todo el API por card — logo, empresa enlazada y chips de habilidades (decisión del usuario): los datos ya existen en el contrato, los logos están en `public/assets/images/` y `DESIGN.md` define los chips.
- **Sí:** fechas concatenadas tal cual el API, sin formatear (decisión del usuario): el API es la fuente de verdad, mismo criterio que el teléfono en SPEC 03.
- **Sí:** chips con markup local en `experience.html` (decisión del usuario): la futura sección habilidades necesita chips con icono PrimeIcons (forma distinta); extraer `shared/chip` ahora sería abstracción prematura.
- **Sí:** efecto glass con utilidades Tailwind (`bg-white/80` + `backdrop-blur-md`) en vez de la clase custom `.glass-card` del prototipo: cumple el presupuesto de CSS y AGENTS.md prefiere utilidades.
- **Sí:** helper `toAbsoluteAssetPath`: el API mezcla `assets/...` (experiencia, petcute) y `/assets/...` (about, proyectos); el binding de `<img>` necesita ruta absoluta contra `public/`.
- **Sí:** `target="_blank"` + `rel="noopener noreferrer"` en el enlace de la empresa: enlace externo, mismo patrón que el GitHub del hero (SPEC 02).
- **Sí:** orden del arreglo tal cual lo entrega el API (ya viene más reciente primero, coincide con el prototipo).
- **Sí:** `rxResource` propio sobre `PortfolioService` (patrón fijado en SPEC 02/03), con "Reintentar" por sección.
- **Sí:** título "Experiencia": coincide con el link del nav de SPEC 01 y el texto visible va en español (el "Experience" del prototipo es copy en inglés).
- **Sí:** cards `rounded-lg` (1rem): `DESIGN.md` las clasifica como bloques de contenido principales; el `rounded-xl` del prototipo (0.75rem en su config local) mapearía a `rounded-md`, pero `DESIGN.md` manda en discrepancias (heredado de SPEC 01).
- **No:** formatear fechas ni ordenar cronológicamente: el API es la fuente de verdad y ya viene ordenado.
- **No:** empty-state dedicado para `experiencia` vacío: hoy el API siempre trae dos items; si llegara vacío simplemente no se renderizan items.
- **No:** dark mode, componente `shared/chip`, caché en `PortfolioService`.

## Risks

| Riesgo                                           | Mitigación                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Mock API externa caída o lenta                   | Estados skeleton/error con "Reintentar" (patrón Hero/About); los tests usan el servicio mockeado y no dependen de la red. |
| Rutas de logo sin `/` inicial en el API          | Helper `toAbsoluteAssetPath`; criterio de aceptación verifica los dos `src` exactos.                                      |
| `theme()` del prototipo no existe en Tailwind v4 | El anillo del marcador se escribe como valor arbitrario con `var(--color-surface-bright)`.                                |
| jsdom no aplica estilos; responsive no testeable | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                               |
| Exceder presupuesto de CSS de componente (4kB)   | Glass y layout con utilidades Tailwind en la plantilla; `experience.css` vacío o mínimo.                                  |

## What is **not** in this spec

- Secciones proyectos, habilidades, educacion y footer.
- Componente compartido `shared/chip`.
- Dark mode, rutas en `app.routes.ts`.
- Formateo de fechas, ordenamiento cronológico, optimización de logos.
- Caché o fetch compartido en `PortfolioService`.

Cada uno de esos puntos, si llega, va en su propia spec.
