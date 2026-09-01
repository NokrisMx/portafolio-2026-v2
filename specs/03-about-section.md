# SPEC 03 — Sección Sobre mí del portafolio

> **Status:** Implementado
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-09-01
> **Objective:** Implementar la sección "Sobre mí" (id `sobre-mi`) del portafolio como componente standalone con `rxResource` sobre `PortfolioService`, mostrando las tarjetas de correo, ubicación, teléfono y edad más el botón "Descargar CV" con los datos de la mock API, siguiendo el layout de `design/code.html`.

## Por qué existe esta spec

Es la segunda sección consumidora de la mock API y cierra el bloque `about` del contrato: los campos `email`, `ubicacion`, `telefono`, `edad` y `cv` quedaron pendientes desde SPEC 02. Además fija el patrón de datos que reutilizarán las secciones restantes: `rxResource` propio por sección.

## Scope

**In:**

- Componente standalone `src/app/about/` (`about.ts`, `about.html`, `about.css`, `about.spec.ts`): selector `app-about`, clase `About`, datos vía `rxResource` sobre `PortfolioService` (mismo patrón que `src/app/hero/hero.ts`).
- Sección con `id="sobre-mi"` (id reservado por el header en SPEC 01), fiel a `design/code.html` 263–314 sin variantes `dark:`: fondo `bg-surface`, `px-gutter py-xl`, contenedor `max-w-300 mx-auto`, grid `md:grid-cols-3 gap-lg`.
- Columna izquierda (`md:col-span-1`): título "Sobre mí" en `headline-md` + barra divisoria `h-1 w-12 bg-primary rounded-full` (patrón de encabezado de sección del prototipo).
- Columna derecha (`md:col-span-2`): grid de 4 tarjetas `grid-cols-1 sm:grid-cols-2 gap-4`. Cada tarjeta `bg-surface-container-low p-4 rounded-base border border-outline-variant`, con label en `label-mono text-secondary` y valor en `body-md`:
  - **Correo:** anchor `[href]="'mailto:' + about()?.email"` con `about.email`.
  - **Ubicación:** texto plano con `about.ubicacion`.
  - **Teléfono:** anchor `[href]="'tel:' + about()?.telefono"` con `about.telefono`.
  - **Edad:** texto plano con `about.edad`.
- Botón primario "Descargar CV" bajo la grilla de tarjetas: mismo estilo que "Ver proyectos" del hero, anchor con `[href]="about()?.cv"` y atributo `download`.
- Estados con signals: cargando → skeleton con la estructura (título + 4 tarjetas + botón); error → mensaje discreto + botón "Reintentar" (`reload()`); éxito → sección completa.
- Carpeta `public/assets/documents/` versionada con `.gitkeep`; el usuario coloca ahí `CV_Aldo_Guevara_Muñoz.pdf` (el API la referencia como `/assets/documents/CV_Aldo_Guevara_Muñoz.pdf`).
- Tests en `src/app/about/about.spec.ts` con el servicio mockeado (globals de Vitest, jsdom).
- Integración en `App`: `<app-about />` tras `<app-hero />` en `src/app/app.html`, import de `About` en `src/app/app.ts`, actualización de `src/app/app.spec.ts`.

**Out of scope (for future specs):**

- Párrafo de descripción en el About: `about.descripcion` se queda solo en el hero (decisión de las preguntas).
- Secciones experiencia, proyectos, habilidades, educacion y footer.
- Dark mode (transversal).
- Rutas en `app.routes.ts` (página única con anclas, decisión SPEC 01).
- Fetch único compartido entre secciones / caché en `PortfolioService`.
- Optimización o validación del PDF (tamaño, metadata); el archivo en sí lo coloca el usuario.

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza la interfaz `About` de `src/app/shared/models/portfolio.models.ts` (SPEC 02) y `PortfolioService.getPortfolio()` tal cual.

```ts
// src/app/about/about.ts — estado del componente (signals, patrón del Hero)
// portfolio = rxResource({ stream: () => this.portfolioService.getPortfolio() })
// → portfolio.isLoading() / portfolio.error() / portfolio.reload()
// about = computed(() => this.portfolio.value()?.about)
```

Constantes visuales (no vienen en el API):

```ts
export const SECTION_TITLE = 'Sobre mí';
export const CV_BUTTON_LABEL = 'Descargar CV';
// Labels de tarjetas escritos directamente en la plantilla: Correo, Ubicación, Teléfono, Edad
```

## Implementation plan

1. Crear `public/assets/documents/` con `.gitkeep` (el PDF lo coloca el usuario después). Manual: `npm start` y verificar que la ruta `/assets/documents/CV_Aldo_Guevara_Muñoz.pdf` responde 200 una vez colocado el archivo.
2. Crear el esqueleto standalone `src/app/about/` (`about.ts` con selector `app-about`, `about.html` vacío) e integrarlo: `<app-about />` tras `<app-hero />` en `src/app/app.html` e import de `About` en `src/app/app.ts`. Manual: `npm run build` y ver la sección (vacía) en localhost:4200.
3. Implementar el estado en `about.ts`: `rxResource` sobre `PortfolioService`, `about` computed y `reload()`, igual que `hero.ts`. Manual: los datos de la API quedan disponibles para la plantilla.
4. Implementar `about.html` siguiendo `design/code.html` 263–314 (sin `dark:`): grid de 3 columnas, título + divisoria, 4 tarjetas (mailto, texto, tel:, texto), botón "Descargar CV" con `download`; skeleton y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px (tarjetas apiladas).
5. Escribir `about.spec.ts` con el servicio mockeado: cargando (skeleton), éxito (id `sobre-mi`, título, labels, valores, `mailto:`, `tel:`, href y `download` del CV), error + "Reintentar".
6. Actualizar `src/app/app.spec.ts` (render de `app-about` tras el hero). Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [x] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [x] `ng test --watch=false` pasa en verde (specs de App, Header, Hero, PortfolioService y About).
- [x] La sección renderiza con `id="sobre-mi"` y el link "Sobre mí" del header la activa al hacer scroll hasta ella.
- [x] Las 4 tarjetas muestran los labels Correo, Ubicación, Teléfono y Edad, y sus valores vienen de la mock API (`about.email`, `about.ubicacion`, `about.telefono`, `about.edad`), no hardcodeados.
- [x] El correo es un anchor cuyo `href` comienza con `mailto:` y el teléfono un anchor cuyo `href` comienza con `tel:`.
- [x] El botón "Descargar CV" es un anchor con `href` en `about.cv` (`/assets/documents/CV_Aldo_Guevara_Muñoz.pdf`) y atributo `download`.
- [x] El título muestra "Sobre mí" en `headline-md` con la barra divisoria `bg-primary` debajo, y la sección no muestra `about.descripcion`.
- [x] Mientras carga se ve el skeleton con la estructura (título + 4 tarjetas + botón); si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [x] No hay clases `dark:`; los radios siguen `DESIGN.md` (tarjetas y botón `rounded-base`).
- [x] El texto visible está en español.
- [x] `public/assets/documents/` existe versionada con `.gitkeep`.

## Decisions

- **Sí:** About sin párrafo de descripción. El API solo tiene un `about.descripcion` y SPEC 02 ya lo muestra en el hero; repetirlo en dos secciones contiguas sería texto duplicado en pantalla (decisión del usuario).
- **Sí:** botón "Descargar CV" primario con atributo `download`, pendiente explícito de SPEC 02. Sin `target="_blank"`: con `download` el navegador descarga directamente.
- **Sí:** teléfono como enlace `tel:` en vez de texto plano (decisión del usuario): clica en móvil y queda simétrico con el `mailto` del correo.
- **Sí:** `rxResource` propio sobre `PortfolioService` (decisión del usuario): consistente con el Hero y con reintento independiente por sección; una llamada HTTP extra por carga es aceptable para el tráfico de un portafolio.
- **Sí:** labels `Correo / Ubicación / Teléfono / Edad` y título `Sobre mí` (decisión del usuario), este último coincide con el link del nav de SPEC 01.
- **Sí:** tarjetas con `rounded-base` (0.5rem): el `rounded-lg` del prototipo vale 0.5rem en la config local de `code.html`; en los tokens del proyecto ese valor es `rounded-base` y `DESIGN.md` manda en discrepancias (heredado de SPEC 01/02).
- **No:** fetch único compartido o caché en el servicio: tocaría el Hero aprobado o complicaría el "Reintentar" por sección; si mockapi llegara a limitar las peticiones, se resuelve en una spec transversal futura.
- **No:** formatear el teléfono (p. ej. `812 600 7542`): el API es la fuente de verdad y el string va tal cual al `href` y al texto visible.
- **No:** mover la descripción del hero al About: desbalancea el hero y contradice la SPEC 02 aprobada.

## Risks

| Riesgo                                           | Mitigación                                                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `CV_Aldo_Guevara_Muñoz.pdf` aún no colocado      | Carpeta versionada con `.gitkeep`; el criterio del botón valida el `href`; el 200 de la ruta se verifica cuando exista el archivo. |
| Mock API externa caída o lenta                   | Estados skeleton/error con "Reintentar" (mismo patrón del Hero); los tests usan el servicio mockeado y no dependen de la red.      |
| jsdom no aplica estilos; responsive no testeable | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                                        |
| Exceder presupuesto de CSS de componente (4kB)   | Estilos con utilidades Tailwind en la plantilla; `about.css` queda vacío o mínimo.                                                 |

## What is **not** in this spec

- Párrafo de descripción en el About (vive en el hero).
- Secciones experiencia, proyectos, habilidades, educacion y footer.
- Dark mode, rutas en `app.routes.ts`.
- Fetch compartido entre secciones / caché en `PortfolioService`.
- Optimización del PDF; el archivo lo coloca el usuario.

Cada uno de esos puntos, si llega, va en su propia spec.
