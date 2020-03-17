const cors = require('cors')
const express = require('express');
const app = express()
const bodyParser = require('body-parser');

const AccessLog = require('./src/controller/access-logs');
const ProcessedLog = require('./src/controller/processing-logs');

app.use(cors());
app.use(bodyParser.json());

app.get('/getLogsData', (req, res) => {
    const allData = AccessLog.accessLogsData();
    const processedData = ProcessedLog.processLogs(allData.latency);
    var finalData = {};
    finalData.latency = processedData;
    finalData.targetGroup = allData.targetgroup;
    res.send(finalData).status(200);
});

app.listen(3000);