# SPEC 09 — SEO on-page y crawlability del portafolio

> **Status:** Implementado
> **Depends on:** Ninguna
> **Date:** 2026-09-02
> **Objective:** Completar el SEO on-page y de crawlability de la one-page con meta description, robots, canonical, Open Graph, Twitter Card y JSON-LD `Person` estáticos en `src/index.html`, más `robots.txt` y `sitemap.xml` estáticos en `public/`, todos con base URL `https://cv-guevaraaldo-dev.netlify.app`.

## Por qué existe esta spec

Las 8 specs previas completaron el prototipo (header → footer), pero todo el SEO vive fuera de los componentes: `src/index.html` solo trae title, viewport y favicon (sin description, canonical ni datos estructurados) y `public/` no tiene `robots.txt` ni `sitemap.xml`. La app es una SPA sin SSR, por lo que los crawlers ven casi exclusivamente el HTML inicial estático: los tags deben vivir en `index.html`, no inyectarse en runtime.

## Scope

**In:**

- `src/index.html` (modificado), todo estático en el `<head>`:
  - `<meta name="description">` redactada a mano (~147 chars), versión corta de `about.descripcion`: "Portafolio de Aldo Guevara Muñoz, desarrollador FullStack Jr: Angular, Tailwind CSS, ASP.NET Core y SQL Server. Proyectos, experiencia y formación."
  - `<meta name="robots" content="index, follow">`.
  - `<link rel="canonical" href="https://cv-guevaraaldo-dev.netlify.app/">`.
  - Open Graph: `og:type=website`, `og:url`, `og:title` (igual al `<title>`), `og:description` (igual a la meta description), `og:image` = `https://cv-guevaraaldo-dev.netlify.app/assets/images/profile.png`, `og:locale=es_MX`.
  - Twitter Card: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (misma imagen).
  - JSON-LD `Person` (script `application/ld+json`): `name`, `jobTitle` ("Desarrollador FullStack Jr"), `url`, `image` (foto absoluta), `email` (el del about) y `sameAs` [`GITHUB_URL`, `LINKEDIN_URL` de `portfolio-links.ts`, hardcodeadas por ser HTML estático].
- `public/robots.txt` (nuevo): `User-agent: *`, `Allow: /`, `Sitemap: https://cv-guevaraaldo-dev.netlify.app/sitemap.xml`.
- `public/sitemap.xml` (nuevo): única URL `https://cv-guevaraaldo-dev.netlify.app/` con `lastmod` 2026-09-02.
- Verificación con Lighthouse (categoría SEO, móvil) y `validator.schema.org` para el JSON-LD.

**Out of scope (for future specs):**

- Prerender/SSR o Angular Universal (decisión del usuario: spec propia si llega).
- Banner `og:image` dedicado 1200x630 (se usa `profile.png` existente).
- Security headers (`netlify.toml` / `_headers`).
- `hreflang` / versión multiidioma (sitio de un solo idioma).
- SEO dinámico desde la mock API (Title/Meta services).
- Envío del sitemap a Google Search Console (operación manual del usuario, no código).
- Cambios en componentes Angular: el audit inicial confirmó único `<h1>` (hero.html:49), `alt` en las 3 imágenes (hero, experience, project-card), `lang="es"` y viewport correctos.

## Data model

Esta feature no introduce estructuras de datos nuevas: no hay código Angular, solo HTML estático y dos archivos de texto servidos desde `public/`. El único dato nuevo es la base URL provista por el usuario:

```text
SITE_URL = "https://cv-guevaraaldo-dev.netlify.app"
og:image / Person.image = SITE_URL + "/assets/images/profile.png"  (asset ya existente)
Person.sameAs = ["https://github.com/NokrisMx", "https://www.linkedin.com/in/aldo-guevara-mu%C3%B1oz"]
```

## Implementation plan

1. Crear `public/robots.txt` y `public/sitemap.xml` con la base URL. Manual: `npm start` y visitar `/robots.txt` y `/sitemap.xml` (se sirven desde `public/` en la raíz).
2. Añadir al `<head>` de `src/index.html` la meta description, robots, canonical y los tags Open Graph + Twitter Card. Manual: view-source en localhost:4200 muestra los tags; Lighthouse SEO (móvil) puntúa 100.
3. Añadir el bloque JSON-LD `Person` a `src/index.html`. Manual: `npm run build` en verde; pegar el HTML en `validator.schema.org` sin errores.
4. Verificación final: `npx prettier --write .`, `npm run build` y `ng test --watch=false` en verde (no se tocan componentes; las specs existentes quedan intactas).

## Acceptance criteria

- [x] `npm run build` termina sin errores y sin exceder presupuestos.
- [x] `ng test --watch=false` pasa en verde (sin cambios en componentes ni servicios).
- [x] `/robots.txt` sirve `User-agent: *`, `Allow: /` y la línea `Sitemap:` con la URL de producción.
- [x] `/sitemap.xml` sirve la única URL canónica con `lastmod` 2026-09-02.
- [x] `index.html` incluye meta description ≤ 160 chars, `robots: index, follow` y canonical a `https://cv-guevaraaldo-dev.netlify.app/`.
- [x] Los tags Open Graph y Twitter Card están presentes, con `og:image` apuntando a la URL absoluta de `profile.png`.
- [x] El JSON-LD `Person` valida sin errores en `validator.schema.org` con `name`, `jobTitle`, `url`, `email` y `sameAs` (GitHub + LinkedIn).
- [x] Lighthouse (SEO, móvil) puntúa 100 sobre el build local.
- [x] Ningún componente Angular fue modificado.

## Decisions

- **Sí: base URL `https://cv-guevaraaldo-dev.netlify.app` (decisión del usuario):** se usa tal cual en canonical, sitemap, robots, `og:url` y JSON-LD.
- **Sí: paquete completo on-page (decisión del usuario):** description + canonical + robots + OG + Twitter Card + JSON-LD, no solo lo crítico.
- **Sí: contenido estático en `index.html` (decisión del usuario):** SPA sin SSR; los crawlers ven el HTML inicial. Se redacta a mano una versión corta del `about.descripcion` (300+ chars) en lugar de consumirlo del API.
- **Sí: `robots.txt` + `sitemap.xml` estáticos en `public/` (decisión del usuario):** app de una sola página, costo mínimo y beneficio completo.
- **Sí: `og:image` = `profile.png` con URL absoluta (decisión del usuario):** cero assets nuevos; el banner 1200x630 queda diferido.
- **Sí: `twitter:card=summary_large_image`:** estándar para portafolios; la imagen es el gancho al compartir. El riesgo de recorte cuadrado queda en la tabla de riesgos.
- **Sí: no tocar componentes Angular:** el audit confirmó que headings y `alt` ya cumplen; el SEO pendiente vivía solo en `index.html` y `public/`.
- **No: prerender/SSR (decisión del usuario):** los tags estáticos cubren lo esencial de una one-page; va en su propia spec si se necesita.
- **No: banner 1200x630, security headers, hreflang, SEO dinámico, Search Console, manifiesto PWA/theme-color.**

## Risks

| Riesgo                                                                    | Mitigación                                                                                                              |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `og:image` cuadrada se recorta en plataformas que esperan 1200x630        | Banner dedicado diferido a spec futura si el shared link se ve mal; las plataformas aplican su propio crop/letterbox.   |
| La URL de Netlify cambia o se migra a dominio propio                      | La URL vive en 3 archivos planos (`index.html`, `robots.txt`, `sitemap.xml`); reemplazo simple documentado, sin lógica. |
| SPA sin SSR: el contenido indexable se limita a title/description/JSON-LD | Aceptado por el usuario; el prerender queda como spec futura si el indexing orgánico lo exige.                          |
| `Person` no genera rich result visual en Google                           | Se valida estructura con `validator.schema.org` (no con Rich Results Test, que solo evalúa tipos con rich result).      |

## What is **not** in this spec

- Prerender/SSR.
- Banner `og:image` 1200x630.
- Security headers (`netlify.toml`).
- `hreflang` / multiidioma.
- SEO dinámico desde la mock API.
- Envío a Google Search Console.

Cada uno de esos puntos, si llega, va en su propia spec.
