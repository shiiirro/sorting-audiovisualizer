export function* bubbleSort(array) {
    let swapped = false;
    for (let i = array.length - 1; i > 0; --i) {
        swapped = false;
        let start = 0;
        let end = 1;
        for (let j = 0; j < i; ++j) {
            if (array[j] > array[j + 1]) {
                let tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
                swapped = true;
            }
            ++end;
            if (end - start >= 8 || j === i - 1) {
                let step = [];
                for (let k = start; k < end; ++k) {
                    step.push({index: k, value: array[k], color: 'red'});
                }
                start = end;
                yield step;
            }
        }
        if (!swapped) break;
    }
}