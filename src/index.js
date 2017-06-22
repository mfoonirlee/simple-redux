// import { createStore, applyMiddleware } from "redux";
import { createStore, applyMiddleware } from "./lib/index";

function counter(state = 0, action) {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        default:
            return state;
    }
}

//日志中间件
const logger = store => next => action => {
    console.log("In middleware: logger, state is " + store.getState());
    let result = next(action);
    return result;
};

//预警中间件
let _warnerStateBefore, _warnStateAfter;
const warner = store => next => action => {
    console.log("In middleware: warner");

    _warnerStateBefore = store.getState();
    let result = next(action);
    _warnStateAfter = store.getState();

    if (_warnStateAfter < _warnerStateBefore) {
        console.warn("warner message: count has reduced.");
    }
    return result;
};

//分发中间件,在中间件中dispatch指向哪？
const dispatcher = ({ getState, dispatch }) => next => action => {
    console.log("In middleware: dispatcher");
    let result = next(action);
    dispatch({ type: "DECREMENT" });
    return result;
};

let store = createStore(counter, applyMiddleware(logger, warner));
// let store = createStore(counter, applyMiddleware(logger, warner, dispatcher));

store.subscribe(() => {
    console.log("state: " + store.getState());
});

store.dispatch({
    type: "INCREMENT"
});

store.dispatch({
    type: "INCREMENT"
});

store.dispatch({
    type: "DECREMENT"
});

store.dispatch({
    type: "INCREMENT"
});
