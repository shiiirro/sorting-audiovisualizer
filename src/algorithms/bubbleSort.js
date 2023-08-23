const INDICES_PER_STEP = 8

export function* bubbleSort(array) {
    let swapped = false;
    for (let i = array.length - 1; i > 0; --i) {
        swapped = false;
        let start = 0; // start and end of array range that could have changed since last iteration
        let end = 0;
        for (let j = 0; j < i; ++j) {
            if (array[j] > array[j + 1]) {
                let tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
                swapped = true;
            }
            ++end;
            if (j === i - 1) { // last iteration
                let step = [];
                for (let k = start; k < i + 1; ++k) {
                    step.push({index: k, value: array[k], color: 'red'});
                }
                yield step;
            } else if (end - start + 1 >= INDICES_PER_STEP) {
                let step = [];
                for (let k = start; k <= end; ++k) {
                    step.push({index: k, value: array[k], color: 'red'});
                }
                start = end;
                yield step;
            }
        }
        if (!swapped) break;
    }
}