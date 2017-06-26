import { ACTION_INIT_TYPE } from "./createStore";

function assertReducerInitState(reducers) {
    let initState;
    Object.keys(reducers).forEach(key => {
        initState = reducers[key](undefined, { type: ACTION_INIT_TYPE });
        if (initState === "undefined") {
            throw new Error("Illegal reducer`s init state.");
        }
        //random type check is required
    });
}

export default function combineReducers(reducers) {
    if (!reducers) {
        throw new Error("Init combine reducer fail.");
    }

    let keys = Object.keys(reducers);
    let _reducers = {};

    keys.forEach(key => {
        if (typeof reducers[key] === "function") {
            _reducers[key] = reducers[key];
        } else {
            throw new Error("Illegal reducer type.");
        }
    });

    try {
        assertReducerInitState(_reducers);
    } catch (e) {
        throw e;
    }

    return function combination(state = {}, action) {
        let reducer,
            _currentState,
            _nextState,
            nextState = {},
            hasChanged = false;

        keys.forEach(key => {
            reducer = _reducers[key];
            _currentState = state[key];
            _nextState = reducer(_currentState, action);
            if (_nextState === "undefined") {
                throw new Error(
                    "Action get an undefined as a result, If you need to hold no value, use 'null' instead."
                );
            }
            nextState[key] = _nextState;
            hasChanged = hasChanged || nextState !== _currentState;
        });

        return hasChanged ? nextState : state;
    };
}
