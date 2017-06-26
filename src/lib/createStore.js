export const ACTION_INIT_TYPE = "_ACTION_INIT";

export default function createStore(reducer, preloadedState, enhancer) {
    let currentReducer = reducer;
    let isDispatching = false;
    let currentListeners = [];
    let currentState = preloadedState;
    let nextListeners = currentListeners;

    if (preloadedState && !enhancer) {
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    if (enhancer) {
        if (typeof enhancer !== "function") {
            throw new Error("Illegal enhancer type");
        }
        return enhancer(createStore)(reducer, preloadedState);
    }

    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
        }
    }

    function subscribe(listener) {
        if (typeof listener !== "function") {
            throw new Error("Illegal subscribe arguments");
        }
        let isSubscribeed = true;

        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe() {
            if (!isSubscribeed) {
                return;
            }

            isSubscribeed = false;

            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
        };
    }

    function dispatch(action) {
        if (!action || typeof action !== "object" || !action.type) {
            throw new Error("Illegal dispatch arguments");
        }

        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        const listeners = (currentListeners = nextListeners);
        for (let i = 0, len = listeners.length; i < len; i++) {
            listeners[i]();
        }

        return action;
    }

    function getState() {
        return currentState;
    }

    dispatch({ type: ACTION_INIT_TYPE });

    return {
        dispatch,
        subscribe,
        getState
    };
}
