// import { createStore, applyMiddleware, combineReducers } from "redux";
import { createStore, applyMiddleware, combineReducers } from "./lib/index";

function calculator(state = 10, action) {
    switch (action.type) {
        case "+":
            return state + action.targetVal || 0;
        case "-":
            return state - action.targetVal || 0;
        case "*":
            return state * action.targetVal || 0;
        case "/":
            return state / action.targetVal || 1;
        default:
            return state;
    }
}

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

let reduxApp = combineReducers({
    counter,
    calculator
});

//日志中间件
const logger = store => next => action => {
    console.log(
        "In middleware: logger, state is " + JSON.stringify(store.getState())
    );
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

//字符串转化中间件
const formatter = store => next => action => {
    console.log("In middleware: formatter");
    if (action.targetVal) {
        action.targetVal = parseInt(action.targetVal);
    }
    return next(action);
};

let store = createStore(reduxApp, applyMiddleware(logger, warner, formatter));
// let store = createStore(counter, applyMiddleware(logger, warner, dispatcher));

store.subscribe(() => {
    console.log("state: " + JSON.stringify(store.getState()));
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

store.dispatch({
    type: "+",
    targetVal: "10"
});

store.dispatch({
    type: "-",
    targetVal: "8"
});

store.dispatch({
    type: "*",
    targetVal: "2"
});

store.dispatch({
    type: "/",
    targetVal: 4
});
