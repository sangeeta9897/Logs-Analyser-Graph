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
    Object.keys(data).forEach((key) => {
        const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length
        let value = data[key]['latency'];
        delete data[key]['latency'];
        data[key]["p90"] = percentile(90, value);
        data[key]["p99"] = percentile(99, value);
        data[key]["p99.9"] = percentile(99.9, value);
        data[key]["p99.99"] = percentile(99.99, value);
        data[key]["avg"] = arrAvg(value);
    });
    return data;
}

module.exports = {
    processLogs
}
