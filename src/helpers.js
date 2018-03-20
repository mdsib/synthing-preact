const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
const oneTime = (target, type, handler) => {
    const doOnce = (ev) => {
        target.removeEventListener(type, doOnce);
        handler(ev);
    }
    target.addEventListener(type, doOnce);
}

export default {
    partial,
    oneTime,
    linear: (m, x, b) => (m * x) + b,
    bounded: (val, min, max) => {
        if (min !== undefined && min !== null && val < min) {
            return min;
        }
        else if (max !== undefined && max !== null && val > max) {
            return max;
        }
        else
            return val;
    },
    scale: (buf, amt) => buf.map(val => val * amt),
    add: (arr1, arr2) => arr1.map((v, i) => v + arr2[i]),
    soon: (fn, ms=0) => {
        return (...args) =>
        window.setTimeout(partial(fn, ...args), ms);
    },
    throttle: (fn, ms, performFinalCall) => {
        let time = 0;
        let finalCall = null;
        return (...args) => {
            let now = Date.now();
            if (finalCall)
                window.clearTimeout(finalCall);
            if (now >= time + ms) {
                fn(...args);
                time = now;
            }
            else if (performFinalCall) {
                finalCall = window.setTimeout(() => {
                    fn(...args);
                }, time - now - ms);
            }
        }
    },
    clickNDrag: (el, onDown, onMove, onUp, moveEl=document) => {
        el.addEventListener('mousedown', (downEv) => {
            downEv.preventDefault();
            if (onMove) {
                moveEl.addEventListener('mousemove', onMove);
            }
            onDown && onDown(downEv);
            oneTime(moveEl, 'mouseup', (upEv) => {
                onUp && onUp(upEv);
                if (onMove) {
                    moveEl.removeEventListener('mousemove', onMove)
                }
            });
        })
    },
    boolArray: {
        setLength: (ba, newLength) => {
            let newBa = ba.slice(0, newLength);
            if (ba.length < newLength) {
                newBa = newBa.concat(new Array(newLength - ba.length).fill(false));
            }
            return newBa;
        }, create: (length) => {
            return new Array(length).fill(false);
        },
        update: (ba, idx, val) => {
            const newBa = ba.slice();
            newBa[idx] = val;
            return newBa;
        }
    },
    immObjArray: {
        update: (arr, idx, opts) => {
            const newArr = arr.slice();
            newArr[idx] = Object.assign({}, arr[idx], opts)
            return newArr;
        },
        add: (arr, idx, opts) => {
            const newArr = arr.slice();
            newArr.splice(idx, 0, opts);
            return newArr;
        },
        remove: (arr, idx) => {
            const newArr = arr.slice();
            newArr.splice(idx, 1);
            return newArr;
        }
    }
};
