export default {
    linear: (m, x, b) => (m * x) + b,
    bounded: (val, min, max) => val < min ? min : (val > max ? max : val),
    scale: (buf, amt) => buf.map(val => val * amt),
    add: (arr1, arr2) => arr1.map((v, i) => v + arr2[i])
};
