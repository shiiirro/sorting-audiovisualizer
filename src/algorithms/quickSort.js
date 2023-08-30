export function* quickSort(array, start = 0, end = array.length) {
    if (end - start <= 1) return;

    const pivot = array[Math.floor(Math.random() * (end - start) + start)]; // random index

    let left = start;
    let right = end - 1;

    while (left < right) {
        while (array[left] < pivot) {
            yield [{index: left, value: array[left], color: 'red'}];
            ++left;
        }
        while (array[right] > pivot) {
            yield [{index: right, value: array[right], color: 'red'}];
            --right;
        }
        if (array[left] !== array[right]) {
            let tmp = array[left];
            array[left] = array[right];
            array[right] = tmp;
        }
        yield [{index: left, value: array[left], color: 'green'}, {index: right, value: array[right], color: 'green'}];
    }
    yield* quickSort(array, start, left);
    yield* quickSort(array, left + 1, end);
}