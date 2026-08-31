# SPEC 01 — Header/Nav del portafolio

> **Status:** Draft
> **Depends on:** Ninguna (primera spec del repo)
> **Date:** 2026-08-31
> **Objective:** Implementar el header/nav fijo del portafolio (brand, 6 links de sección en español, CTA de contacto y menú móvil funcional) como componente standalone, cableando por primera vez los tokens de diseño en Tailwind v4.

## Por qué existe esta spec

Es la primera pieza de UI de la app, que hoy solo tiene el placeholder del CLI. Además del header en sí, introduce la infraestructura de estilos que reutilizarán todas las secciones futuras: bloque `@theme` con los tokens de `design/DESIGN.md`, fuentes Inter/JetBrains Mono y PrimeIcons.

## Scope

**In:**

- Bloque `@theme` en `src/styles.css` con los tokens de `design/DESIGN.md` (colores, tipografía, spacing, radios) — config CSS-first de Tailwind v4, sin `tailwind.config.js`.
- Import de PrimeIcons en `src/styles.css` (`@import 'primeicons/primeicons.css';`).
- `src/index.html`: `lang="es"`, title `Aldo Guevara Muñoz | FullStack Developer` y carga de Inter (400/600/700) y JetBrains Mono (500) con `preconnect` y `display=swap`.
- Componente standalone `src/app/shared/header/` (`header.ts`, `header.html`, `header.css`, `header.spec.ts`): selector `app-header`, clase `Header`.
- Barra fija arriba (fondo `surface`, borde inferior `outline-variant`, sombra sutil) con: brand "Aldo Guevara Muñoz" → `#inicio`; 6 links desktop; CTA "Contacto" (`mailto:guevaraaldo44@gmail.com`).
- Links desktop con labels `Inicio`, `Sobre mí`, `Experiencia`, `Proyectos`, `Habilidades`, `Educación` apuntando a los fragments `#inicio`, `#sobre-mi`, `#experiencia`, `#proyectos`, `#habilidades`, `#educacion`.
- Scroll-spy con signals: el link de la sección visible queda activo (color `primary`, bold, borde inferior); sin secciones en el DOM, "Inicio" queda activo por defecto.
- Menú móvil funcional: botón hamburguesa `pi pi-bars` visible solo en `< md`; panel desplegable bajo la barra con los 6 links + CTA; cierre al navegar, con Escape y al hacer click en el backdrop; atributos `aria-expanded`, `aria-controls` y `aria-label`.
- Limpieza del placeholder del CLI: `src/app/app.html` queda con `<app-header />`, `<router-outlet />` y un `<main>` con `padding-top` de 80px para compensar la barra fija; `src/app/app.ts` y `src/app/app.spec.ts` se actualizan en consecuencia.
- Tests del header en `src/app/shared/header/header.spec.ts` (globals de Vitest, jsdom).

**Out of scope (for future specs):**

- Consumo de la mock API (`PortfolioService`, interfaces del contrato de `design/portfolio-api.md`); el header es estático por ahora.
- Dark mode y toggle de tema (transversal a toda la página).
- Las secciones del portafolio (hero, about, experiencia, proyectos, habilidades, educacion) y las rutas de `app.routes.ts`.
- Footer.
- Header con scroll-behavior condensado al hacer scroll (shrink-on-scroll).

## Data model

Sin datos persistidos ni consumo de API. Estructuras locales del componente:

```ts
// src/app/shared/header/header.ts
interface NavItem {
  id: string; // id de la sección destino (fragment de URL, sin acentos)
  label: string; // texto visible en español
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'educacion', label: 'Educación' },
];

const CONTACT_EMAIL = 'guevaraaldo44@gmail.com'; // valor del API, hardcodeado por ahora

// Estado con signals (app zoneless):
// activeSection = signal('inicio')  — sección activa según scroll
// menuOpen = signal(false)          — panel móvil abierto/cerrado
```

Convención: los ids de sección viven en minúsculas, sin acentos y con guiones (`sobre-mi`, `educacion`) para que los fragments de URL sean seguros. Las secciones futuras deberán usar estos mismos ids.

## Implementation plan

1. Actualizar `src/index.html`: `lang="es"`, title nuevo, `preconnect` a `fonts.googleapis.com`/`fonts.gstatic.com` y link de Google Fonts (Inter 400/600/700, JetBrains Mono 500, `display=swap`). Manual: `npm start` y verificar la fuente aplicada.
2. Actualizar `src/styles.css`: import de primeicons y bloque `@theme` con los tokens de `design/DESIGN.md` — colores como `--color-*` (p. ej. `--color-primary: #00327d`), familias como `--font-*`, tamaños/line-height/weight/letter-spacing como `--text-*`, spacing como `--spacing-*` (p. ej. `--spacing-gutter: 24px`) y radios como `--radius-*`. Manual: `npm run build` sin errores.
3. Crear el esqueleto standalone `src/app/shared/header/` (`header.ts` con selector `app-header`, `header.html` vacío). Manual: `npm run build`.
4. Implementar el nav desktop en `header.html` siguiendo `design/code.html` (líneas 124–144, sin las variantes `dark:`): contenedor `fixed top-0 w-full z-50`, brand, 6 links, CTA `mailto`. Manual: visual en `http://localhost:4200` a ≥ 768px.
5. Implementar estado y scroll-spy en `header.ts`: signals `activeSection`/`menuOpen`, listener de `window:scroll` que recorra las secciones con los ids de `NAV_ITEMS` (misma lógica que el script del prototipo: `scrollY >= sectionTop - sectionHeight / 3`), actualizando `activeSection`.
6. Implementar el menú móvil: botón `pi pi-bars` con `aria-expanded`/`aria-controls`, panel con los 6 links + CTA, cierre al navegar/Escape/backdrop. Manual: responsive en devtools < 768px.
7. Escribir `header.spec.ts`: render de brand, labels y `href` de los 6 links, `mailto` del CTA, toggle del menú móvil, cierre al hacer click en un link y link activo por defecto ("Inicio").
8. Integrar en `App`: limpiar el placeholder de `src/app/app.html` (dejar `<app-header />`, `<main>` con padding superior 80px y `<router-outlet />`), importar `Header` en `src/app/app.ts`, actualizar `src/app/app.spec.ts` para el nuevo template.
9. Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder los presupuestos (bundle inicial por debajo del warn de 500kB).
- [ ] `ng test --watch=false` pasa en verde (specs de `App` y `Header`).
- [ ] La barra queda fija arriba con fondo `surface`, borde inferior y sombra sutil, fiel al prototipo en viewport ≥ 768px.
- [ ] El brand muestra "Aldo Guevara Muñoz" y enlaza a `#inicio`.
- [ ] Los 6 links muestran los labels acordados y sus `href` apuntan exactamente a `#inicio`, `#sobre-mi`, `#experiencia`, `#proyectos`, `#habilidades`, `#educacion`.
- [ ] El CTA "Contacto" es un anchor con `href="mailto:guevaraaldo44@gmail.com"`.
- [ ] En viewport < 768px los links desktop y el CTA de la barra se ocultan y solo queda visible el botón hamburguesa con icono `pi pi-bars`.
- [ ] El botón hamburguesa abre/cierra el panel, `aria-expanded` refleja el estado y el panel lista los 6 links + CTA.
- [ ] Hacer click en un link del panel móvil, o pulsar Escape, o click en el backdrop, cierra el panel.
- [ ] Sin secciones en el DOM, el link "Inicio" renderiza con estilo activo (color `primary`, bold, borde inferior) y los demás con estilo inactivo.
- [ ] El HTML raíz tiene `lang="es"`, title `Aldo Guevara Muñoz | FullStack Developer` y carga Inter/JetBrains Mono.
- [ ] `src/styles.css` define el bloque `@theme` con los tokens de `design/DESIGN.md` e importa primeicons; no existe `tailwind.config.js`.
- [ ] El header no usa clases `dark:` y su CSS de componente queda por debajo del presupuesto de 4kB.

## Decisions

- **Sí:** menú móvil funcional. El prototipo lo deja decorativo ("simplified for UI demonstration"); un portafolio real se navega en móvil.
- **Sí:** scroll-spy implementado ahora contra los ids reservados, con "Inicio" activo por defecto. Así el header queda completo y las secciones solo tendrán que usar los ids de `NAV_ITEMS`.
- **Sí:** listener de `window:scroll` (como el prototipo) en vez de IntersectionObserver. jsdom no implementa IntersectionObserver y el listener es testeable en Vitest.
- **Sí:** header estático: `nombreCompleto` y `email` como constantes locales. La capa de datos (`PortfolioService` + interfaces) merece su propio spec y el header se mantiene presentacional.
- **Sí:** labels `Inicio / Sobre mí / Experiencia / Proyectos / Habilidades / Educación` con CTA `Contacto` (decisión del usuario).
- **Sí:** ids de sección sin acentos (`sobre-mi`, `educacion`). Fragments de URL seguros y estables.
- **Sí:** anchors simples `<a href="#...">` sin Angular Router. Es una página única y `app.routes.ts` sigue vacío.
- **Sí:** `design/DESIGN.md` como fuente de verdad de tokens. Donde `code.html` y `DESIGN.md` discrepen (p. ej. valores de radios), gana `DESIGN.md`.
- **No:** dark mode. Es transversal a toda la app y no hay toggle en el prototipo.
- **No:** `tailwind.config.js`. Tailwind v4 config CSS-first; AGENTS.md lo prohíbe explícitamente.

## Risks

| Riesgo                                                      | Mitigación                                                                                           |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Scroll-spy sin secciones en el DOM (comportamiento vacío)   | Default explícito `inicio`; se re-verifica en el spec de cada sección.                               |
| jsdom no aplica estilos; los tests no validan el responsive | Los criterios visuales se verifican manualmente con `npm start`; los tests cubren DOM y estados.     |
| Google Fonts como dependencia externa (latencia o bloqueo)  | `preconnect` + `display=swap` y fallbacks de sistema en la pila de fuentes de cada token `--font-*`. |
| Exceder el presupuesto de estilos de componente (4kB)       | Header con CSS propio mínimo: estilos con utilidades Tailwind en la plantilla.                       |

## What is **not** in this spec

- Consumo de la mock API (`PortfolioService`, interfaces del contrato).
- Dark mode / toggle de tema.
- Secciones del portafolio, rutas y footer.
- Comportamiento shrink-on-scroll del header.

Cada uno de esos puntos, si llega, va en su propia spec.
