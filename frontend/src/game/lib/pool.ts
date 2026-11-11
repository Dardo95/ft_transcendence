/**
 * Pool de objetos genérico: reutiliza instancias en vez de
 * crear y destruir en el bucle de render (menos churn de GC).
 *
 * Genérico y sin dependencias: la factory y el reset los aporta
 * el consumidor, así que se puede testear sin Pixi.
 */
export class ObjectPool<T> {
  private readonly free: T[] = [];
  private readonly create: () => T;
  private readonly reset: (item: T) => void;

  constructor(create: () => T, reset: (item: T) => void) {
    this.create = create;
    this.reset = reset;
  }

  /**
   * Devuelve un elemento listo para usar: reciclado (con su
   * `reset` aplicado) si hay en el pool, o recién creado.
   */
  acquire(): T {
    const item = this.free.pop();

    if (item === undefined) {
      return this.create();
    }

    this.reset(item);
    return item;
  }

  /** Devuelve un elemento al pool para su próxima reutilización. */
  release(item: T): void {
    this.free.push(item);
  }

  /** Elementos esperando ser reciclados. */
  get available(): number {
    return this.free.length;
  }
}
