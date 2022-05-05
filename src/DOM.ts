import { StringBuilder } from "DataStructures";

export interface FullEventMap
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
export const addDisposableEventListener = <
  EL extends EventNode,
  K extends keyof FullEventMap
>(
  element: EL,
  type: K,
  listener: (this: EL, ev: FullEventMap[K]) => any,
  options?: AddEventListenerOptions
) => {
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
};

/**
 * Remove all event listeners from a Element to delete it savely.
 *
 * The Event listeners have to be added using addDisposableEventListener function.
 * @param element Target DOM Node.
 * @param removeElementFromDOM Whether the remove method should be called after the dispose, true is default.
 */
export const disposeNode = (
  element: EventNode,
  removeElementFromDOM: boolean = true
) => {
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
};

/**
 * Gets the whole parental chain of a DOM node (excluding the node itself).
 */
export const getParentChain = (el: Node): Array<Node> => {
  const chain = new Array<Node>();

  let parent = el.parentNode;
  while (parent) {
    chain.push(parent);
    parent = parent.parentNode;
  }
  return chain;
};

export const describe = (el: Element) => {
  const description = new StringBuilder(`<${el.tagName}`);

  if (el.id) {
    description.append(` id="${el.id}"`);
  }

  if (el.classList.length > 0) {
    description.append(' class="');
    description.append(Array.from(el.classList).join(" "));
    description.append('"');
  }

  if (el.attributes.length > 0) {
    for (const attr of el.attributes) {
      if (attr.value) {
        description.append(` ${attr.name}="${attr.value}"`);
      } else {
        description.append(` ${attr.name}`);
      }
    }
  }

  description.append(">");

  return description.toString();
};
