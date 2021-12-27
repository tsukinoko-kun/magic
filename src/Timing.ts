/**
 * @async
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const __retriggerableDelayCache = new Map<symbol, number>();

/**
 * Sets a timer that will get reset on the next call
 * @async
 */
export function retriggerableDelay(callback: () => void, ms: number): number {
  const idempotency = Symbol.for(callback.toString());
  if (__retriggerableDelayCache.has(idempotency)) {
    clearTimeout(__retriggerableDelayCache.get(idempotency));
  }
  const id = window.setTimeout(callback, ms);
  __retriggerableDelayCache.set(idempotency, id);
  return id;
}

const __doOnceIdempotency = new Set<symbol>();
/**
 * The doOnce function executes a callback only one time
 * @async
 */
export function doOnce<T, E>(
  callback: () => T,
  err?: () => E
): T | E | undefined {
  const idempotency = Symbol.for(callback.toString());
  if (__doOnceIdempotency.has(idempotency)) {
    __doOnceIdempotency.add(idempotency);
    return callback();
  } else if (err) {
    return err();
  }

  return undefined;
}

/**
 * @returns {Promise<void>} Promise that resolves after the current Event-Loop has completed
 */
export const nextEventLoop = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
