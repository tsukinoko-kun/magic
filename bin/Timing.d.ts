/**
 * @async
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Sets a timer that will get reset on the next call
 * @async
 */
export declare function retriggerableDelay(callback: () => void, ms: number): number;
/**
 * The doOnce function executes a callback only one time
 * @async
 */
export declare function doOnce<T, E>(callback: () => T, err?: () => E): T | E | undefined;
//# sourceMappingURL=Timing.d.ts.map