# SPEC 10 — Fetch compartido de la mock API en PortfolioService

> **Status:** Implemented
> **Depends on:** SPEC 02
> **Date:** 2026-09-02
> **Objective:** Deduplicar las 7 llamadas HTTP a la mock API en una sola petición
> por carga de página, compartiendo la cadena del fetch en `PortfolioService`
> mediante `share()` con `ReplaySubject(1)`, sin cambios en los componentes
> consumidores ni en sus tests.

## Por qué existe esta spec

En DevTools se observan 7 GET idénticos al endpoint en cada carga: hero, about,
experience, projects, skills, educacion y footer crean cada uno su `rxResource`
sobre `PortfolioService.getPortfolio()`, y el servicio devuelve un observable
frío nuevo por llamada (cada suscripción = 1 petición). Las SPEC 03–08 dejaron
explícitamente fuera "caché o fetch compartido en PortfolioService"; esta spec
cierra esa deuda.

## Scope

**In:**

- `src/app/shared/services/portfolio.service.ts` (modificado):
  - Campo privado `portfolio$`: la cadena `http.get<Portfolio[]>(API_URL)` + el
    `map` existente (arreglo vacío → error) + `share({ connector: () => new
ReplaySubject(1), resetOnError: true, resetOnComplete: false,
resetOnRefCountZero: false })`, construida UNA vez por instancia del servicio.
  - `getPortfolio()` pasa a devolver el campo `portfolio$`; la firma
    `Observable<Portfolio>` no cambia.
- `src/app/shared/services/portfolio.service.spec.ts` (modificado), tests nuevos
  con `HttpTestingController`:
  - Suscripciones simultáneas (≥ 2) → exactamente 1 request y todas reciben el
    mismo valor.
  - Suscripción tardía tras completar exitoso → recibe el valor cacheado sin
    nuevo request.
  - Tras un error (flush de error HTTP), una nueva suscripción dispara 1 request
    nuevo (resetOnError) y recibe el valor.
  - Los 3 tests existentes siguen pasando.
- Verificación manual en DevTools → Network: exactamente 1 GET al endpoint en la
  carga inicial de la página.

**Out of scope (for future specs):**

- Persistencia entre sesiones (localStorage/IndexedDB) y estrategias TTL /
  stale-while-revalidate.
- Refetch on focus/reconnect e invalidación programática del caché.
- Unificar los estados de carga/error de las secciones en uno global.
- Refactor de los 7 componentes (no cambian: siguen con `rxResource` propio
  sobre `getPortfolio()`).
- Cambios en el endpoint, en `portfolio.models.ts` o en las specs de secciones.

## Data model

Esta feature no introduce estructuras de datos nuevas: reutiliza `Portfolio` y el
endpoint de SPEC 02. El único cambio estructural es interno al servicio:

```ts
// src/app/shared/services/portfolio.service.ts — fetch compartido
private readonly portfolio$: Observable<Portfolio> = this.http
  .get<Portfolio[]>(API_URL)
  .pipe(
    map((items) => {
      if (!items || items.length === 0) {
        throw new Error('La respuesta de la API está vacía');
      }
      return items[0];
    }),
    share({
      connector: () => new ReplaySubject(1),
      resetOnError: true,
      resetOnComplete: false,
      resetOnRefCountZero: false,
    }),
  );

getPortfolio(): Observable<Portfolio> {
  return this.portfolio$;
}
```

La instancia única de la cadena es lo que deduplica: si `share()` se aplicara
dentro de `getPortfolio()` (pipe construido por llamada), cada llamada tendría
su propio subject y seguirían siendo 7 peticiones.

## Implementation plan

1. Modificar `portfolio.service.ts`: extraer la cadena al campo privado
   `portfolio$` con `share()`/`ReplaySubject(1)` y la config acordada;
   `getPortfolio()` devuelve el campo. Manual: `npm run build` en verde y
   `ng test --include src/app/shared/services/portfolio.service.spec.ts` en
   verde (tests existentes intactos).
2. Añadir a `portfolio.service.spec.ts` los tests de multicast: suscripciones
   simultáneas = 1 request, suscripción tardía = valor cacheado sin request,
   error → nueva suscripción = 1 request nuevo. Manual: la spec del servicio en
   verde.
3. Verificación end-to-end: `npm start`, DevTools → Network, recargar la página
   y confirmar exactamente 1 GET a `.../api/v1/portfolio`; las 7 secciones
   renderizan con la misma data.
4. Regresión completa: `npx prettier --write .`, `npm run build` y
   `ng test --watch=false` en verde (ninguna spec de sección cambia).

## Acceptance criteria

- [x] En la carga inicial de la página hay exactamente 1 petición GET al
      endpoint de la mock API (verificado en DevTools → Network), no 7.
- [x] Ninguno de los 7 componentes consumidores fue modificado: siguen con su
      `rxResource` sobre `getPortfolio()` con la misma firma.
- [x] `ng test --watch=false` pasa en verde, incluyendo los tests nuevos del
      servicio (multicast simultáneo, suscripción tardía cacheada, reintento tras
      error).
- [x] `npm run build` termina sin errores y sin exceder presupuestos.
- [x] Tras un error del API, el primer "Reintentar" dispara exactamente 1
      petición nueva; los reintentos de las demás secciones reciben ese resultado
      sin peticiones extra.
- [x] La semántica de la caché es por carga de página, en memoria: no hay
      persistencia en localStorage/IndexedDB.

## Decisions

- **Sí: `share()` + `ReplaySubject(1)` en el servicio (decisión del usuario):**
  multicast de una única petición HTTP a los 7 rxResource con caché en memoria
  del último valor; cambio aislado en `portfolio.service.ts`, sin tocar
  componentes ni sus tests (los mocks de sección reemplazan el servicio
  completo).
- **Sí: instancia única de la cadena (`portfolio$` como campo):** requisito para
  que `share()` deduplique entre llamadas de distintos componentes; con el pipe
  construido dentro de `getPortfolio()` cada llamada tendría su propio subject y
  seguirían siendo 7 peticiones.
- **Sí: `resetOnComplete: false` y `resetOnRefCountZero: false`:** el GET
  completa tras una respuesta y el default (true) destruiría la caché al
  instante; se conserva el valor para suscripciones tardías y reloads.
- **Sí: `resetOnError: true` (decisión del usuario):** un error descarta la
  caché para que "Reintentar" lance una petición real; el resultado exitoso
  queda cacheado para las demás secciones.
- **Sí: caché por carga de página, en memoria (decisión del usuario):** datos
  frescos en cada visita, sin caducidad ni versionado que mantener.
- **Sí: UI de estados sin cambios (decisión del usuario):** cada sección
  conserva su skeleton y su error + "Reintentar" del estado de su propio
  rxResource; cero cambios de plantilla.
- **No: localStorage, TTL/SWR, refetch on focus, invalidación programática,
  estados globales unificados, refactor de componentes.**

## Risks

| Riesgo                                                                             | Mitigación                                                                                                                               |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `share()` aplicado dentro de `getPortfolio()` (pipe por llamada) no deduplica nada | La spec fija el patrón de campo único `portfolio$`; el test de multicast simultáneo fallaría al ver más de 1 request.                    |
| `rxResource` re-ejecuta `stream()` (reload) y podría disparar peticiones extra     | `ReplaySubject(1)` entrega el valor cacheado sin red tras el éxito; solo tras error (reset) hay 1 petición nueva.                        |
| Error cacheado y "Reintentar" que no refresca                                      | `resetOnError: true` garantiza que la nueva suscripción genere una petición nueva; cubierto por test dedicado con HttpTestingController. |
| Mock API caída durante la verificación manual                                      | Los estados skeleton/error por sección ya existen (SPEC 02–08); el reintento se valida en tests con el backend mockeado.                 |

## What is **not** in this spec

- Persistencia entre sesiones (localStorage/IndexedDB).
- TTL / stale-while-revalidate / refetch on focus.
- Invalidación programática del caché.
- Unificación de estados de carga/error globales.
- Refactor de los 7 componentes consumidores.

Cada uno de esos puntos, si llega, va en su propia spec.
