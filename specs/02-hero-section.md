# SPEC 02 — Sección Hero (Intro) del portafolio

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-08-31
> **Objective:** Implementar la sección hero (Inicio) del portafolio como componente standalone que consume la mock API a través de un `PortfolioService` compartido, replicando el diseño de `design/code.html` con `about.foto` (profile.png) en la tarjeta visual derecha.

## Por qué existe esta spec

Es la primera sección visible de la página y la primera consumidora de la mock API. Además del hero en sí, introduce la capa de datos (`PortfolioService` + interfaces del contrato de `design/portfolio-api.md`) que reutilizarán las secciones futuras, pendiente desde la SPEC 01.

## Scope

**In:**

- Interfaces tipadas del contrato en `src/app/shared/models/portfolio.models.ts`: `Portfolio`, `About`, `Experiencia`, `Proyecto`, `Habilidad`, `Educacion` (campos en español).
- `PortfolioService` en `src/app/shared/services/portfolio.service.ts`: `HttpClient`, GET al endpoint de la mock API, devuelve el primer elemento del arreglo como `Observable<Portfolio>`; arreglo vacío → error.
- `provideHttpClient(withFetch())` en `src/app/app.config.ts`.
- Componente standalone `src/app/hero/` (`hero.ts`, `hero.html`, `hero.css`, `hero.spec.ts`): selector `app-hero`, clase `Hero`, datos vía `rxResource` sobre el servicio.
- Sección con `id="inicio"` (id reservado por el header de la SPEC 01), fiel a `design/code.html` líneas 204–262 sin variantes `dark:`: fondo `surface-bright`, `min-h-[80vh]`, blobs decorativos difuminados (`primary-container`/`tertiary-container`, `opacity-20`, `pointer-events-none`), layout de dos columnas centrado en móvil.
- Columna de texto: etiqueta mono hardcodeada "FullStack Developer Jr" (uppercase, `tracking-widest`, `text-primary`); `h1` = `about.nombreCompleto` (`display-lg-mobile` / `display-lg`); párrafo = `about.descripcion` tal cual; botones "Ver proyectos" (primario, ancla `#proyectos`) y "GitHub" (secundario outline, `https://github.com/NokrisMx`, `target="_blank"` + `rel="noopener noreferrer"`).
- Tarjeta visual derecha (`hidden md:block`, como el prototipo): marco con degradado `from-surface-container-high to-surface` rotado 3° que se endereza en hover, e `<img>` con `[src]="about().foto"` y `alt` que incluye el nombre.
- Estados con signals: cargando → skeleton con la estructura del hero (placeholders de texto e imagen); error → mensaje discreto + botón "Reintentar" (`reload()` del resource); éxito → hero completo.
- Carpeta `public/assets/images/` versionada (con `.gitkeep`); el usuario coloca ahí `profile.png` (el API la referencia como `/assets/images/profile.png`).
- Tests: `portfolio.service.spec.ts` (URL, desenpaquetado del arreglo, arreglo vacío → error) y `hero.spec.ts` (estados y contenido con el servicio mockeado).
- Integración en `App`: `<app-hero />` dentro del `<main>` de `src/app/app.html`, encima de `<router-outlet />`; `src/app/app.ts` y `src/app/app.spec.ts` actualizados.

**Out of scope (for future specs):**

- Secciones about, experiencia, proyectos, habilidades, educacion y footer.
- Botón "Descargar CV" y el resto de campos de `about` (email, teléfono, edad, ubicación): van con la sección about.
- Dark mode (transversal).
- Rutas en `app.routes.ts`: página única con anclas (decisión SPEC 01).
- Optimización de imagen (srcset, formatos modernos).
- El archivo `profile.png` en sí: lo coloca el usuario; esta spec solo garantiza la ruta.

## Data model

```ts
// src/app/shared/models/portfolio.models.ts — contrato de design/portfolio-api.md
export interface About {
  nombreCompleto: string;
  descripcion: string;
  email: string;
  ubicacion: string;
  telefono: string;
  edad: string;
  cv: string;
  foto: string; // "/assets/images/profile.png"
}
export interface Experiencia {
  empresa: string;
  url: string;
  logo: string;
  puesto: string;
  descripcion: string;
  habilidades: string[];
  fechaInicio: string;
  fechaFin: string;
}
export interface Proyecto {
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  github: string;
  demo: string;
  image: string;
}
export interface Habilidad {
  nombre: string;
  icono: string;
}
export interface Educacion {
  institucion: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}
export interface Portfolio {
  about: About;
  experiencia: Experiencia[];
  proyectos: Proyecto[];
  habilidades: Habilidad[];
  educacion: Educacion[];
}
```

```ts
// src/app/shared/services/portfolio.service.ts
const API_URL = 'https://69d19cab5043d95be971190e.mockapi.io/api/v1/portfolio';
// getPortfolio(): Observable<Portfolio> — GET + primer elemento del arreglo; vacío → error

// Estado del hero (componente, signals):
// portfolio = rxResource({ loader: () => this.portfolioService.getPortfolio() })
// → portfolio.isLoading() / portfolio.error() / portfolio.value()?.about / portfolio.reload()
```

Constantes del hero (no vienen en el API): `ROLE_LABEL = 'FullStack Developer Jr'`, `GITHUB_URL = 'https://github.com/NokrisMx'`.

## Implementation plan

1. Crear `public/assets/images/` con `.gitkeep` y colocar `profile.png` (archivo provisto por el usuario). Manual: `npm start` y verificar que `/assets/images/profile.png` responde 200.
2. Crear `src/app/shared/models/portfolio.models.ts` con las interfaces del contrato. Manual: `npm run build` sin errores.
3. Crear `src/app/shared/services/portfolio.service.ts` (HttpClient + desenpaquetado del arreglo) y añadir `provideHttpClient(withFetch())` a `src/app/app.config.ts`. Manual: `npm run build`.
4. Escribir `portfolio.service.spec.ts` con `HttpTestingController`: URL correcta, devuelve el primer elemento, arreglo vacío → error. Manual: `ng test --include src/app/shared/services/portfolio.service.spec.ts`.
5. Crear el esqueleto standalone `src/app/hero/` (selector `app-hero`, template vacío) e integrarlo en `src/app/app.html`/`app.ts`. Manual: `npm run build` y ver la sección (aún vacía) en localhost:4200.
6. Implementar estados y datos en `hero.ts`: `rxResource` sobre `PortfolioService`. Manual: el hero pasa de skeleton a contenido con la API real.
7. Implementar `hero.html` siguiendo `design/code.html` 204–262 (sin `dark:`): blobs, etiqueta, h1, párrafo, botones y tarjeta visual con `about.foto`; skeleton y error con "Reintentar". Manual: visual en desktop ≥ 768px y móvil < 768px (imagen oculta).
8. Escribir `hero.spec.ts` con el servicio mockeado: cargando (skeleton), éxito (nombre, descripción, etiqueta, hrefs, imagen, `id="inicio"`), error + Reintentar.
9. Actualizar `src/app/app.spec.ts` (render de `app-hero` junto al header). Formatear y verificar: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde.

## Acceptance criteria

- [ ] `npm run build` termina sin errores y sin exceder presupuestos (bundle inicial < warn 500kB; CSS de componente < 4kB).
- [ ] `ng test --watch=false` pasa en verde (specs de App, Header, Hero y PortfolioService).
- [ ] La sección renderiza con `id="inicio"` y el link "Inicio" del header la activa al estar en ella.
- [ ] El `h1` muestra `about.nombreCompleto` y el párrafo `about.descripcion`, ambos traídos de la mock API (no hardcodeados).
- [ ] La etiqueta superior muestra "FullStack Developer Jr" en `label-mono`, `text-primary` y uppercase.
- [ ] El botón primario "Ver proyectos" apunta a `#proyectos`.
- [ ] El botón secundario "GitHub" apunta a `https://github.com/NokrisMx` con `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] La imagen derecha usa `[src]` desde `about.foto` (`/assets/images/profile.png`), con `alt` que incluye el nombre, y está oculta en viewport < 768px.
- [ ] Mientras carga se ve el skeleton; si el fetch falla se ve el mensaje de error y "Reintentar" relanza la petición.
- [ ] La petición va al endpoint documentado y el servicio entrega el primer elemento del arreglo (arreglo vacío → estado error).
- [ ] No hay clases `dark:` ni `tailwind.config.js`; los radios siguen `DESIGN.md` (botones `rounded-base`, tarjeta `rounded-lg`).
- [ ] El texto visible está en español (excepto "GitHub").

## Decisions

- **Sí:** `PortfolioService` + modelos ahora (elección del usuario): el hero es la primera sección y las demás reutilizarán la misma capa.
- **Sí:** `HttpClient` con `withFetch()` + `rxResource` en el componente. Idiomático en Angular 22 zoneless; `reload()` da el "Reintentar" gratis.
- **Sí:** el servicio desenpaqueta el arreglo y entrega el primer `Portfolio`; arreglo vacío → error (el contrato documenta un arreglo con un elemento).
- **Sí:** etiqueta "FullStack Developer Jr", labels de botones y URL de GitHub hardcodeados: no vienen en el API (igual que el email del header en SPEC 01).
- **Sí:** `about.descripcion` tal cual para el párrafo: el API es la fuente de verdad, aunque difiera del copy en inglés del prototipo.
- **Sí:** hero directo en `app.html` (página única con anclas, hereda la decisión de SPEC 01); `app.routes.ts` sigue vacío.
- **Sí:** imagen derecha oculta en móvil (`hidden md:block`), fiel al prototipo.
- **Sí:** "Reintentar" en el error en vez de datos fallback: evita duplicar contenido hardcodeado que se desincroniza del API.
- **Sí:** `DESIGN.md` manda en discrepancias con `code.html` (heredado de SPEC 01): botones `rounded-base` (0.5rem), tarjeta de imagen `rounded-lg` (1rem).
- **No:** botón "Descargar CV": requeriría colocar también el PDF en `public/`; va con la sección about si llega.
- **No:** rutas por sección, dark mode, optimización de imagen.

## Risks

| Riesgo                                           | Mitigación                                                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `profile.png` aún no colocado al implementar     | La carpeta queda versionada con `.gitkeep`; el criterio de la imagen se valida cuando exista (200 en la ruta). |
| Mock API externa caída o lenta                   | Estados skeleton/error cubren el caso; los tests usan `HttpTestingController` y no dependen de la red.         |
| jsdom no aplica estilos; responsive no testeable | Criterios visuales verificados manualmente con `npm start`; los tests cubren DOM y estados.                    |
| Exceder presupuesto de CSS de componente (4kB)   | Estilos con utilidades Tailwind en la plantilla; `hero.css` mínimo.                                            |

## What is **not** in this spec

- Secciones about, experiencia, proyectos, habilidades, educacion y footer.
- Botón "Descargar CV" y campos restantes de `about`.
- Dark mode, rutas en `app.routes.ts`, optimización de imagen.
- El archivo `profile.png` (lo coloca el usuario).

Cada uno de esos puntos, si llega, va en su propia spec.
