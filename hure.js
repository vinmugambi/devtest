const fs = require('fs'),
    path = require('path'),
    chalk = require('chalk');

var csvFile;
if (process.argv[2] !== null && typeof (process.argv[2]) === "string") {
    csvFile = process.argv[2];
} else {
    csvFile = path.join(__dirname, "dummy_delimited.csv");
}

var csvData = fs.readFileSync(csvFile, "utf8");

var csvToJSON = () => {
    var lines = csvData.split("\n");
    var result = [],
        headers = lines[0].split("|");
    for (let i = 1; i < lines.length; i++) {
        let obj = {},
            currentLine = lines[i].split("|");
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }
        result.push(obj);
    }
    return result
}

console.log(csvToJSON().filter(row => (row.five === "C" || row.five === "G")))
