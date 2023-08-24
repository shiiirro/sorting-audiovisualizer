export function* heapSort(array) {
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; --i) {
        yield* siftDown(array, array.length, i);
    }

    for (let i = array.length - 1; i > 0; --i) {
        let tmp = array[i];
        array[i] = array[0];
        array[0] = tmp;
        yield [{index: i, value: array[i], color: 'green'}, {index: 0, value: array[0], color: 'green'}];

        yield* siftDown(array, i, 0);
    }
}

function* siftDown(array, heapSize, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < heapSize && array[l] > array[largest]) {
        yield [{index: l, value: array[l], color: 'red'}, {index: largest, value: array[largest], color: 'red'}];
        largest = l;
    }

    if (r < heapSize && array[r] > array[largest]) {
        yield [{index: r, value: array[r], color: 'red'}, {index: largest, value: array[largest], color: 'red'}];
        largest = r;
    }

    if (largest !== i) {
        let tmp = array[i];
        array[i] = array[largest];
        array[largest] = tmp;
        yield [{index: i, value: array[i], color: 'green'}, {index: largest, value: array[largest], color: 'green'}];

        yield* siftDown(array, heapSize, largest);
    }
}