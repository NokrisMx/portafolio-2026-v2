# SPEC 08 — Footer del portafolio

> **Status:** Implementado
> **Depends on:** SPEC 02
> **Date:** 2026-09-01
> **Objective:** Implementar el footer del portafolio como componente standalone transversal en `src/app/shared/footer/` con `rxResource` sobre `PortfolioService` (nombre y email desde la mock API), links de LinkedIn/GitHub como constantes compartidas en `src/app/shared/constants/portfolio-links.ts` (refactor de hero), copyright con año dinámico en español y estados skeleton/error con "Reintentar", siguiendo `design/code.html` 610–650.

## Por qué existe esta spec

Es la última pieza del prototipo pendiente de implementar (SPEC 07 la dejó explícitamente fuera). Además resuelve tres decisiones que ni el contrato ni el prototipo cerraban: la URL de LinkedIn (ausente del API, provista por el usuario), el segundo consumidor de `GITHUB_URL` (obliga a mover la constante de hero a shared) y la línea de copyright (año desactualizado y copy en inglés en el prototipo).

## Scope

**In:**

- `src/app/shared/constants/portfolio-links.ts` (nuevo): exporta `GITHUB_URL = 'https://github.com/NokrisMx'` y `LINKEDIN_URL = 'https://www.linkedin.com/in/aldo-guevara-mu%C3%B1oz'` (URL provista por el usuario, tal cual).
- Refactor de hero (SPEC 02): `hero.ts` elimina la declaración local de `GITHUB_URL` y pasa a importarla de `shared/constants/portfolio-links.ts`; `hero.spec.ts` actualiza el import. El DOM renderizado y el valor no cambian.
- Componente standalone `src/app/shared/footer/` (`footer.ts`, `footer.html`, `footer.css`, `footer.spec.ts`): selector `app-footer`, clase `Footer`. En `shared/` como el header (SPEC 01): es cromo de página, no una sección de contenido.
- Estado vía `rxResource` sobre `PortfolioService` (mismo patrón que las 6 secciones): `about = computed(() => this.portfolio.value()?.about)`, `reload()`, `currentYear = new Date().getFullYear()`.
- `<footer>` fiel a `design/code.html` 610–650 sin variantes `dark:`: `w-full py-xl bg-surface-container-highest border-t border-outline-variant`; contenedor `flex flex-col md:flex-row justify-between items-center max-w-300 mx-auto px-gutter gap-6`.
- Bloque izquierdo (`text-center md:text-left`): nombre = `about.nombreCompleto` (`font-headline-sm text-headline-sm font-bold text-primary block mb-2`); línea de copyright `font-body-md text-body-md text-secondary`: "© {{ currentYear }} {{ nombreCompleto }}. Construido con precisión.".
- Bloque derecho `flex gap-6` con 3 links `font-body-md text-body-md text-secondary hover:text-primary transition-colors flex items-center gap-2`:
  - Email: `mailto:` + `about.email` (del API), icono `pi pi-envelope text-xl`.
  - LinkedIn: `LINKEDIN_URL`, `target="_blank"` + `rel="noopener noreferrer"`, icono `pi pi-linkedin text-xl`.
  - GitHub: `GITHUB_URL`, `target="_blank"` + `rel="noopener noreferrer"`, icono `pi pi-github text-xl`.
  - Iconos decorativos con `aria-hidden="true"` (el texto del link es el label accesible).
- Estados con signals: cargando → skeleton con la estructura (placeholder del nombre + línea de copyright + fila de 3 links `animate-pulse`); error → "No se pudo cargar la información. Intenta de nuevo." + botón "Reintentar" (`reload()`); éxito → footer completo.
- Tests: `footer.spec.ts` con el servicio mockeado (nombre/email desde el API, hrefs mailto/LinkedIn/GitHub con atributos externos, copyright con año dinámico y "Construido con precisión.", skeleton, error + "Reintentar") y test nuevo en `src/app/app.spec.ts` (render de `app-footer` al final de la página).
- Integración en `App`: `<app-footer />` tras `</main>` en `src/app/app.html` (hermano de main, como el prototipo), import de `Footer` en `src/app/app.ts`.

**Out of scope (for future specs):**

- Dark mode (transversal) y rutas en `app.routes.ts` (decisión SPEC 01).
- Caché o fetch compartido en `PortfolioService`.
- Link "Descargar CV": About ya lo renderiza (SPEC 03) y el prototipo no lo trae.
- Mover `CONTACT_EMAIL` del header a las constantes compartidas: el header es dataless por decisión de SPEC 01 y el footer toma el email del API.
- Botón "volver arriba", redes sociales adicionales, formulario de contacto.

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza la interfaz `About` de `src/app/shared/models/portfolio.models.ts` (SPEC 02) y `PortfolioService.getPortfolio()` tal cual. Solo consume `nombreCompleto` y `email` de `about`.

```ts
// src/app/shared/constants/portfolio-links.ts — links que el API no expone
export const GITHUB_URL = 'https://github.com/NokrisMx';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/aldo-guevara-mu%C3%B1oz';

// src/app/shared/footer/footer.ts — estado del componente (signals, patrón de las 6 secciones)
// portfolio = rxResource({ stream: () => this.portfolioService.getPortfolio() })
// about = computed(() => this.portfolio.value()?.about)
// currentYear = new Date().getFullYear()
// Labels en la plantilla: "Construido con precisión.", "No se pudo cargar la información. Intenta de nuevo.", "Reintentar"
```

## Implementation plan

1. Crear `src/app/shared/constants/portfolio-links.ts` (`GITHUB_URL`, `LINKEDIN_URL`) y refactorizar hero: `hero.ts` importa `GITHUB_URL` de shared (elimina la declaración local) y `hero.spec.ts` actualiza el import. Manual: `ng test --include src/app/hero/hero.spec.ts` y `npm run build` en verde (DOM sin cambios).
2. Crear el esqueleto standalone `src/app/shared/footer/` e integrarlo: `<app-footer />` tras `</main>` en `src/app/app.html` e import de `Footer` en `src/app/app.ts`. Manual: `npm run build` en verde y ver el footer (vacío) al final de la página en localhost:4200.
3. Implementar el estado y `footer.html`: `rxResource`, `about` computed, `currentYear`, `reload()`, layout con nombre/copyright y los 3 links, skeleton y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px con `npm start` (carga/error con DevTools).
4. Escribir `footer.spec.ts` con el servicio mockeado y agregar el test de `app-footer` en `src/app/app.spec.ts`. Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [ ] `ng test --watch=false` pasa en verde (specs existentes + Footer; `hero.spec.ts` actualizada al import de shared sigue pasando).
- [ ] El footer renderiza tras `</main>`, al final de la página, con fondo `surface-container-highest` y `border-t border-outline-variant`, sin clases `dark:`.
- [ ] El nombre y el email provienen de la mock API (`about.nombreCompleto`, `about.email`), no hardcodeados.
- [ ] El link Email usa `mailto:{about.email}`; LinkedIn y GitHub usan las constantes de `portfolio-links.ts` con `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] La línea de copyright muestra "© {año actual} {nombreCompleto}. Construido con precisión." con el año calculado en runtime.
- [ ] Los iconos son PrimeIcons `pi pi-envelope`, `pi pi-linkedin`, `pi pi-github` (`text-xl`, `aria-hidden="true"`).
- [ ] Mientras carga se ve el skeleton con la estructura; si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [ ] `hero.ts` ya no declara `GITHUB_URL`: la importa de `shared/constants/portfolio-links.ts` con el mismo valor.
- [ ] El contenedor usa `max-w-300 mx-auto px-gutter`, apilado (`flex-col`) en móvil y `md:flex-row` en desktop.
- [ ] El texto visible está en español (excepto "Email", "LinkedIn", "GitHub") y los identificadores del código en inglés.
- [ ] `footer.css` queda vacío o mínimo (estilos con utilidades Tailwind en la plantilla).

## Decisions

- **Sí: `LINKEDIN_URL` como constante (decisión del usuario):** el contrato no expone perfiles sociales; el usuario proporcionó la URL y se guarda tal cual (con la ñ codificada). Mismo criterio que `GITHUB_URL` en SPEC 02 y el email del header en SPEC 01.
- **Sí: mover `GITHUB_URL` a `src/app/shared/constants/portfolio-links.ts` (decisión del usuario):** hero y footer son dos consumidores; AGENTS.md manda lo transversal a `shared/`; mismo precedente que la extracción del `Chip` en SPEC 06. El refactor se aísla en el paso 1 con `hero.spec.ts` en verde.
- **Sí: nombre y email desde el API:** existen en `about`; el footer consume `PortfolioService` como las 6 secciones, a diferencia del header (dataless, SPEC 01).
- **Sí: año dinámico + copy en español (decisión del usuario):** "© {año} {nombre}. Construido con precisión." — no queda desactualizado como el "© 2024" del prototipo y el texto visible va en español (criterio de SPEC 03–07 frente al copy en inglés).
- **Sí: patrón completo de estados (decisión del usuario):** rxResource + skeleton + error con "Reintentar"; consistencia con las 6 secciones previas.
- **Sí: footer en `src/app/shared/footer/`:** cromo de página como el header (SPEC 01 vive en `shared/header/`), no una sección de contenido.
- **Sí: `<app-footer />` fuera de `<main>`:** en el prototipo el footer es hermano de `main`, no una sección del documento.
- **Sí: iconos `text-xl`:** 20px, equivalente del `text-[20px]` del prototipo sin valor arbitrario. Verificado que `pi-envelope`, `pi-linkedin` y `pi-github` existen en `primeicons@8` instalado (a diferencia de los de marca tech descartados en SPEC 06).
- **No: mover también `CONTACT_EMAIL` del header:** fuera de alcance; el header es dataless por diseño (SPEC 01) y el footer toma el email del API.
- **No: link "Descargar CV":** About ya lo renderiza (SPEC 03) y el prototipo no lo trae en el footer.
- **No: dark mode, rutas en `app.routes.ts`, caché en `PortfolioService`, "volver arriba", redes extra, formulario de contacto.**

## Risks

| Riesgo                                           | Mitigación                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Mock API externa caída o lenta                   | Estados skeleton/error con "Reintentar" (patrón de las 6 secciones previas); los tests usan el servicio mockeado.       |
| Refactor de hero toca código de SPEC 02 aprobada | Paso 1 aislado: el valor de la constante no cambia, el DOM es idéntico y `hero.spec.ts` queda en verde antes de seguir. |
| URL de LinkedIn con ñ codificada (`%C3%B1`)      | Se usa tal cual la proporcionó el usuario; el navegador la resuelve. No se normaliza para no divergir de la fuente.     |
| jsdom no aplica estilos; responsive no testeable | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                             |
| Exceder presupuesto de CSS de componente (4kB)   | Layout y links con utilidades Tailwind; `footer.css` vacío o mínimo.                                                    |

## What is **not** in this spec

- Dark mode, rutas en `app.routes.ts`, caché en `PortfolioService`.
- Link "Descargar CV" (ya está en About).
- Mover `CONTACT_EMAIL` del header a shared.
- Botón "volver arriba", redes adicionales, formulario de contacto.

Cada uno de esos puntos, si llega, va en su propia spec.
