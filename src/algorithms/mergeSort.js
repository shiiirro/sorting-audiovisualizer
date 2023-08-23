// generates a sequence of steps to visualize the sorting process
export function* mergeSort(array, start, end) {
    if (end - start < 2) return;

    const mid = Math.floor((start + end) / 2);

    yield* mergeSort(array, start, mid);
    yield* mergeSort(array, mid, end);

    yield* merge(array, start, mid, end);
}

function* merge(array, start, mid, end) {
    const l = array.slice(start, mid);
    const r = array.slice(mid, end);

    let idxL = 0;
    let idxR = 0;
    let idxA = start;

    while (idxL < l.length && idxR < r.length) {
        yield [{index: start + idxL, value: l[idxL], color: 'red'}, {index: mid + idxR, value: r[idxR], color: 'red'}];
        if (l[idxL] < r[idxR]) {
            array[idxA++] = l[idxL++];
        } else {
            array[idxA++] = r[idxR++];
        }
    }

    while (idxL < l.length) {
        yield [{index: start + idxL, value: l[idxL], color: 'red'}];
        array[idxA++] = l[idxL++];
    }

    while (idxR < r.length) {
        yield [{index: mid + idxR, value: r[idxR], color: 'red'}];
        array[idxA++] = r[idxR++];
    }

    for (let i = start; i < end; ++i) {
        yield [{index: i, value: array[i], color: 'green'}];
    }
}