import { performance } from 'node:perf_hooks';

/**
 * Tiempo monotónico en milisegundos.
 *
 * Sirve para medir intervalos dentro del proceso.
 * No representa una fecha real del calendario.
 */
export function monotonicNowMs(): number {
  return performance.now();
}
