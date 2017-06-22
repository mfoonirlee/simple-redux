export default function compose(...funcs) {
    if (!funcs) {
        throw new Error("Illegal arguments for compose");
    }

    if (funcs.length === 0) {
        return arg => arg;
    }

    return funcs.reduce((x, y) => (...args) => x(y(...args)));
}
