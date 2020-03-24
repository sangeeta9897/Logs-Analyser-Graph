const percentile = (percentile, list, fn) => {
    if (isNaN(Number(percentile))) {
        throw new Error(nanError(percentile));
    }
    percentile = Number(percentile);
    if (percentile < 0) {
        throw new Error(lessThanZeroError(percentile));
    }
    if (percentile > 100) {
        throw new Error(greaterThanHundredError(percentile));
    }
    list = list.slice().sort(function (a, b) {
        if (fn) {
            a = fn(a);
            b = fn(b);
        }
        a = Number.isNaN(a) ? Number.NEGATIVE_INFINITY : a;
        b = Number.isNaN(b) ? Number.NEGATIVE_INFINITY : b;
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });
    if (percentile === 0) return list[0];
    let kIndex = Math.ceil(list.length * (percentile / 100)) - 1;
    return list[kIndex];
}

const processLogs = (data) => {
    Object.keys(data).forEach((dateKey) => {
        Object.keys(data[dateKey]).forEach((hourKey) => {
            Object.keys(data[dateKey][hourKey]).forEach((minKey) => {
                const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
                let arr = data[dateKey][hourKey][minKey];
                data[dateKey][hourKey][minKey] = {};
                if (arr.length != 0) {
                    data[dateKey][hourKey][minKey]["p90"] = percentile(90, arr);
                    data[dateKey][hourKey][minKey]["p99"] = percentile(99, arr);
                    data[dateKey][hourKey][minKey]["p99.9"] = percentile(99.9, arr);
                    data[dateKey][hourKey][minKey]["p99.99"] = percentile(99.99, arr);
                    data[dateKey][hourKey][minKey]["avg"] = arrAvg(arr);
                }
            });
        });

    });
    return data;
}

module.exports = {
    processLogs
}
