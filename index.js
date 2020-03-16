const fs = require('fs');
const percentile = require('percentile');
const express = require('express');
const app = express()
const bodyParser = require('body-parser');

var allData = {};


app.use(bodyParser.json());

// make Promise version of fs.readdir()
fs.readdirAsync = function (dirname) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dirname, function (err, filenames) {
            if (err)
                reject(err);
            else
                resolve(filenames);
        });
    });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function (filename, enc) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, enc, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

// utility function, return Promise
function getFile(filename) {
    return fs.readFileAsync("logs/" + filename, 'utf8');
}



app.get('/getLogsData',(req, res) => {
    fs.readdirAsync('logs/').then((filenames) => {
        console.log(filenames);
        return Promise.all(filenames.map(getFile));
    }).then((files) => {
        files.forEach(function (data) {
            var data2 = data.split('\n');
            data2.forEach((str) => {
                arr = str.split(" ");
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
                    if (arr[arr.length - 1] .startsWith("\"2")) {
                        if (allData[fullDate]['2XXs']) {
                            allData[fullDate]['2XXs']++;
                        }else{
                            allData[fullDate]['2XXs'] = 1;
                        }
                    }else if (arr[arr.length - 1] .startsWith("\"5")) {
                        if (allData[fullDate]['5XXs']) {
                            allData[fullDate]['5XXs']++;
                        }else{
                            allData[fullDate]['5XXs'] = 1;
                        }
                    }else{
                        if (allData[fullDate]['4XXs']) {
                            allData[fullDate]['4XXs']++;
                        }else{
                            allData[fullDate]['4XXs'] = 1;
                        }
                    }
                }
    
            })
        });
        //Do All Work here
        Object.keys(allData).forEach(function (key) {
            const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length
            var value = allData[key]['latency'];
            allData[key]['latency'] = value.length;
            allData[key]["p90"] = percentile(90, value);
            allData[key]["p99"] = percentile(99, value);
            allData[key]["p99.9"] = percentile(99.9, value);
            allData[key]["p99.99"] = percentile(99.99, value);
    
            allData[key]["avg"] = arrAvg(value);
    
        });
    
        console.log(allData);
        
        res.send(allData).status(200);
    });
    
})


app.listen(3000);