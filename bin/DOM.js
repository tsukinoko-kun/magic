const _eventListenerCollection = new WeakMap();
/**
 * To be used with disposeNode function.
 * @param element Target DOM Node.
 * @param type Event name.
 * @param listener Listener callback function.
 * @param options Event options.
 */
export function addDisposableEventListener(element, type, listener, options) {
    element.addEventListener(type, listener, options);
    const listeners = _eventListenerCollection.get(element);
    if (listeners) {
        listeners.add([type, listener]);
    }
    else {
        _eventListenerCollection.set(element, new Set([[type, listener]]));
    }
}
/**
 * Remove all event listeners from a Element to delete it savely.
 *
 * The Event listeners have to be added using addDisposableEventListener function.
 * @param element Target DOM Node.
 * @param removeElementFromDOM Whether the remove method should be called after the dispose, true is default.
 */
export function disposeNode(element, removeElementFromDOM = true) {
    const checkAndClean = (el) => {
        const track = _eventListenerCollection.get(el);
        if (track) {
            track.forEach((data) => {
                el.removeEventListener(...data);
            });
        }
    };
    checkAndClean(element);
    element.querySelectorAll("*").forEach((el) => {
        checkAndClean(el);
    });
    if (removeElementFromDOM && "remove" in element) {
        element.remove();
    }
}
