const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
export default {
    partial,
    linear: (m, x, b) => (m * x) + b,
    bounded: (val, min, max) => val < min ? min : (val > max ? max : val),
    scale: (buf, amt) => buf.map(val => val * amt),
    add: (arr1, arr2) => arr1.map((v, i) => v + arr2[i]),
    oneTime: (target, type, handler) => {
        const doOnce = (ev) => {
            target.removeEventListener(type, doOnce);
            handler(ev);
        }
        target.addEventListener(type, doOnce);
    },
    soon: (fn, ms=0) => {
        return (...args) =>
        window.setTimeout(partial(fn, ...args), ms);
    },
    throttle: (fn, ms) => {
        let time = 0;
        return (...args) => {
            let now = Date.now();
            if (now >= time + ms) {
                fn(...args);
                time = now;
            }
        }
    }
};
