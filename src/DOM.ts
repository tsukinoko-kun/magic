interface FullEventMap
  extends HTMLBodyElementEventMap,
    HTMLFrameSetElementEventMap,
    // HTMLMarqueeElementEventMap,
    HTMLMediaElementEventMap {}

interface EventNode {
  addEventListener<K extends keyof FullEventMap>(
    type: K,
    listener: (this: Document, ev: FullEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof FullEventMap>(
    type: K,
    listener: (this: Document, ev: FullEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;

  /**
   * Returns the first element that is a descendant of node that matches selectors.
   */
  querySelector<K extends keyof HTMLElementTagNameMap>(
    selectors: K
  ): HTMLElementTagNameMap[K] | null;
  querySelector<K extends keyof SVGElementTagNameMap>(
    selectors: K
  ): SVGElementTagNameMap[K] | null;
  querySelector<E extends EventNode = EventNode>(selectors: string): E | null;
  /**
   * Returns all element descendants of node that match selectors.
   */
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(
    selectors: K
  ): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(
    selectors: K
  ): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<E extends Node = Node>(selectors: string): NodeListOf<E>;
}

interface RemovableEventNode extends EventNode {
  remove(): void;
}

const _eventListenerCollection = new WeakMap<
  EventNode,
  Set<[string, (this: EventNode, ev: Event) => any]>
>();

/**
 * To be used with disposeNode function.
 * @param element Target DOM Node.
 * @param type Event name.
 * @param listener Listener callback function.
 * @param options Event options.
 */
export function addDisposableEventListener<
  EL extends EventNode,
  K extends keyof FullEventMap
>(
  element: EL,
  type: K,
  listener: (this: EL, ev: FullEventMap[K]) => any,
  options?: AddEventListenerOptions
) {
  element.addEventListener(type, listener as any, options);
  const listeners = _eventListenerCollection.get(element);
  if (listeners) {
    listeners.add([type, <(this: EventNode, ev: Event) => any>listener]);
  } else {
    _eventListenerCollection.set(
      element,
      new Set([[type, <(this: EventNode, ev: Event) => any>listener]])
    );
  }
}

/**
 * Remove all event listeners from a Element to delete it savely.
 *
 * The Event listeners have to be added using addDisposableEventListener function.
 * @param element Target DOM Node.
 * @param removeElementFromDOM Whether the remove method should be called after the dispose, true is default.
 */
export function disposeNode(
  element: EventNode,
  removeElementFromDOM: boolean = true
) {
  const checkAndClean = (el: EventNode) => {
    const track = _eventListenerCollection.get(el);
    if (track) {
      track.forEach((data) => {
        el.removeEventListener(...data);
      });
    }
  };

  checkAndClean(element);

  element.querySelectorAll("*").forEach((el) => {
    checkAndClean(<EventNode>(<unknown>el));
  });

  if (removeElementFromDOM && "remove" in element) {
    (<RemovableEventNode>element).remove();
  }
}