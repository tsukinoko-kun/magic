/**
 * @async
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const __retriggerableDelayCache = new Map();
/**
 * Sets a timer that will get reset on the next call
 * @async
 */
export function retriggerableDelay(callback, ms) {
    const idempotency = Symbol.for(callback.toString());
    if (__retriggerableDelayCache.has(idempotency)) {
        clearTimeout(__retriggerableDelayCache.get(idempotency));
    }
    const id = window.setTimeout(callback, ms);
    __retriggerableDelayCache.set(idempotency, id);
    return id;
}
const __doOnceIdempotency = new Set();
/**
 * The doOnce function executes a callback only one time
 * @async
 */
export function doOnce(callback, err) {
    const idempotency = Symbol.for(callback.toString());
    if (__doOnceIdempotency.has(idempotency)) {
        __doOnceIdempotency.add(idempotency);
        return callback();
    }
    else if (err) {
        return err();
    }
    return undefined;
}
