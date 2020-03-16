const fs = require('fs');



const accessLogsData = () => {
    var allData = {};
    var targetgroup = {};
    const files = fs.readdirSync('logs/');
    console.log(files);
    files.forEach((file) => {
        const data = fs.readFileSync("logs/" + file, 'utf8');
        var logs = data.split('\n');
        logs.forEach((str) => {
            if (str.search("hindi.pratilipi") !== -1) {
                arr = str.split(" ");
                if (str.search("targetgroup/") !== -1) {
                    let trgtGrp = str.split("targetgroup/");
                    trgtGrp = trgtGrp[trgtGrp.length - 1].split("/")[0];
                    if (!targetgroup[trgtGrp]) {
                        targetgroup[trgtGrp] = {};
                        console.log(arr);
                    }
                    if (arr[arr.length - 1].startsWith("\"2")) {
                        if (targetgroup[trgtGrp]['2xx']) {
                            targetgroup[trgtGrp]['2xx']++;
                        } else {
                            targetgroup[trgtGrp]['2xx'] = 1;
                        }
                    } else if (arr[arr.length - 1].startsWith("\"5")) {
                        if (targetgroup[trgtGrp]['5xx']) {
                            targetgroup[trgtGrp]['5xx']++;
                        } else {
                            targetgroup[trgtGrp]['5xx'] = 1;
                        }
                    }
                }
                var date = new Date(arr[1]);
                if (arr.length > 7 && (date != undefined || date != NaN)) {
                    var fullDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                    var latency = parseFloat(arr[5]) + parseFloat(arr[6]) + parseFloat(arr[7]);
                    if (!allData[fullDate]) {
                        allData[fullDate] = {};
                    }
                    if (allData[fullDate]['latency']) {
                        allData[fullDate]['latency'].push(latency);
                    } else {
                        allData[fullDate]['latency'] = [latency];
                    }
                }

            }

        })
    })
    var result = {};
    result.targetgroup = targetgroup;
    result.latency = allData;
    return result;
}


module.exports = {
    accessLogsData
}