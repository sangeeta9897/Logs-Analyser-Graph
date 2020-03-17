const cors = require('cors')
const express = require('express');
const app = express()
const bodyParser = require('body-parser');

const AccessLog = require('./src/controller/access-logs');
const ProcessedLog = require('./src/controller/processing-logs');

app.use(cors());
app.use(bodyParser.json());

app.get('/getLogsData', (req, res) => {
    try {
        AccessLog.accessLogsData().then((response) => {
            const processedData = ProcessedLog.processLogs(response[1]);
            let finalData = {};
            finalData.latency = processedData;
            finalData.targetGroup = response[0];
            res.json(finalData);
        });
    }
    catch (err) {
        res.status(500).json({ "message": err, "status": "error" });
    }
});

app.listen(process.env.PORT);