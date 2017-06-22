import compose from "./compose";

export default function applyMiddleware(...middlewares) {
    return createStore => (reducer, preloaderState, enhancer) => {
        const store = createStore(reducer, preloaderState, enhancer);
        let { dispatch, getState } = store;
        let chain = [];

        let middlewareAPI = {
            getState: getState,
            // dispatch: dispatch
            dispatch: action => dispatch(action)
        };

        chain = middlewares.map(middleware => middleware(middlewareAPI));

        dispatch = compose(...chain)(store.dispatch);

        return {
            ...store,
            dispatch
        };
    };
}
