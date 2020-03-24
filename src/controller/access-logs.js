const fs = require('fs');

const targetgroupData = async () => {
    let targetgroup = {};
    try {
        const files = fs.readdirSync('logs/');
        files.forEach((file) => {
            const data = fs.readFileSync("logs/" + file, 'utf8');
            let logs = data.split('\n');
            logs.forEach((log) => {
                if (log.search("hindi.pratilipi") !== -1) {
                    const logData = log.split(" ");
                    let trgtGrp;
                    if (log.search("targetgroup/") !== -1) {
                        trgtGrp = log.split("targetgroup/");
                        trgtGrp = trgtGrp[trgtGrp.length - 1].split("/")[0];
                        if (!targetgroup[trgtGrp]) {
                            targetgroup[trgtGrp] = {};
                        }
                        if (logData[logData.length - 1].startsWith("\"2")) {
                            if (targetgroup[trgtGrp]['2xx']) {
                                targetgroup[trgtGrp]['2xx']++;
                            } else {
                                targetgroup[trgtGrp]['2xx'] = 1;
                            }
                        } else if (logData[logData.length - 1].startsWith("\"5")) {
                            if (targetgroup[trgtGrp]['5xx']) {
                                targetgroup[trgtGrp]['5xx']++;
                            } else {
                                targetgroup[trgtGrp]['5xx'] = 1;
                            }
                        }
                    }
                }
            })
        })
    }
    catch (err) {
        console.log(err);
    }
    finally {
        return targetgroup;
    }
}

const latencyData = async () => {
    let allData = {};
    try {
        const files = fs.readdirSync('logs/');
        files.forEach((file) => {
            const data = fs.readFileSync("logs/" + file, 'utf8');
            let logs = data.split('\n');
            logs.forEach((log) => {
                if (log.search("hindi.pratilipi") !== -1) {
                    logData = log.split(" ");
                    const date = new Date(logData[1]);
                    if (logData.length > 7 && (date != undefined || date != NaN)) {
                        let fullDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                        let latency = parseFloat(logData[5]) + parseFloat(logData[6]) + parseFloat(logData[7]);
                        if (!allData[fullDate]) {
                            allData[fullDate] = {};
                            var hours = 0;
                            while (hours < 24) {
                                let inHour = hours;
                                allData[fullDate][hours++] = {};
                                var minutes = 1;
                                while (minutes <= 6) {
                                    allData[fullDate][inHour][minutes++ * 10] = [];
                                }
                            }
                        }
                        var mins = parseInt(date.getMinutes() / 10) * 10;
                        var hours = date.getHours();
                        if (allData[fullDate][hours][mins]) {
                            allData[fullDate][hours][mins].push(latency);
                        } else {
                            allData[fullDate][hours][mins] = [latency];
                        }
                    }

                }

            })
        })
    }
    catch (err) {
        console.log(err);
    }
    finally {
        //console.log(allData)
        return allData;
    }
}

const accessLogsData = () => {
    return Promise.all([targetgroupData(), latencyData()]);
}

module.exports = {
    accessLogsData
}
