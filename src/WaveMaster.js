export default {
    update: (arr, idx, opts) => {
        const newArr = arr.slice();
        Object.assign({}, arr[idx], opts)
        return newArr;
    }
    add: (arr, idx, opts) => {
        const newArr = arr.slice();
        newArr.splice(idx, 0, opts);
        return newArr;
    }
    remove: (arr, idx) => {
        const newArr = arr.slice();
        newArr.splice(idx, 1);
        return newArr;
   }
}
