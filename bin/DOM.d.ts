interface FullEventMap extends HTMLBodyElementEventMap, HTMLFrameSetElementEventMap, HTMLMarqueeElementEventMap, HTMLMediaElementEventMap {
}
interface EventNode {
    addEventListener<K extends keyof FullEventMap>(type: K, listener: (this: Document, ev: FullEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof FullEventMap>(type: K, listener: (this: Document, ev: FullEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    /**
     * Returns the first element that is a descendant of node that matches selectors.
     */
    querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector<E extends EventNode = EventNode>(selectors: string): E | null;
    /**
     * Returns all element descendants of node that match selectors.
     */
    querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
    querySelectorAll<E extends Node = Node>(selectors: string): NodeListOf<E>;
}
/**
 * To be used with disposeNode function.
 * @param element Target DOM Node.
 * @param type Event name.
 * @param listener Listener callback function.
 * @param options Event options.
 */
export declare function addDisposableEventListener<EL extends EventNode, K extends keyof FullEventMap>(element: EL, type: K, listener: (this: EL, ev: FullEventMap[K]) => any, options?: AddEventListenerOptions): void;
/**
 * Remove all event listeners from a Element to delete it savely.
 *
 * The Event listeners have to be added using addDisposableEventListener function.
 * @param element Target DOM Node.
 * @param removeElementFromDOM Whether the remove method should be called after the dispose, true is default.
 */
export declare function disposeNode(element: EventNode, removeElementFromDOM?: boolean): void;
export {};
//# sourceMappingURL=DOM.d.ts.map