var sqlite3 = require('sqlite3').verbose();
var path = require("path");
var chalk = require("chalk");
var fs = require("fs");
var queue = require("queue");
var stompit = require("stompit");


var dbpath = path.join(__dirname, "db", "devtest.sqlite3");
var connectOptions = {
    "host": "localhost",
    "port": "61613",
    "connectionHeaders": {
        "host": "/",
        "login": "admin",
        "passcode": "admin"
    }
}
var db = new sqlite3.Database(dbpath, (err) => {
    if (err) console.log(chalk.red(err));
    else console.log(chalk.green("DB devtest created successfully at dbpath"));
});
var csvFile;
if (process.argv[2] !== null && typeof (process.argv[2]) === "string") {
    csvFile = process.argv[2];
} else {
    csvFile = path.join(__dirname, "dummy_delimited.csv");
}
var csvData = fs.readFileSync(csvFile, "utf8");

var csvToJSON = () => {
    //convert CRLF line endings to LF
    var lines = csvData.replace(/\r\n/g, "\n")

    var rows = lines.split("\n");

    clean = rows.filter((row) => row.length !== 0)
    var result = [],
        headers = clean[0].split("|");
    for (let i = 1; i < clean.length; i++) {
        let obj = {},
            currentLine = clean[i].split("|");
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }
        result.push(obj);
    }
    return result
}

var dbEntries = csvToJSON().filter(row => row.five === "C" || row.five === "G");
var AMQEntries = csvToJSON().filter(row => !(row.five === "C" || row.five === "G"));
db.serialize(function () {
    db.run('DROP TABLE IF EXISTS csvEntries')
    db.run(`CREATE TABLE csvEntries(
      one text,
      two text,
      three text,
      four text,
      five text,
      six test,
      seven text,
      eight text,
      nine text,
      ten text,
      eleven text,
      twelve text
  )`, (err) => {
            if (err) console.log(err)
            else console.log(chalk.green("sucessfuly created table"))
        });
    var stmt = db.prepare("INSERT INTO csvEntries VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")

    dbEntries.forEach(function (elem) {
        stmt.run(elem.one, elem.two, elem.three, elem.four, elem.five, elem.six, elem.seven, elem.eight, elem.nine, elem.ten, elem.eleven, elem.twelve)
    });
    stmt.finalize()
});
db.close();
var connectParams = {
    host: 'localhost',
    port: 61613,
    connectHeaders: {
        host: 'localhost',
        login: 'admin',
        passcode: 'admin'
    }
};

stompit.connect(connectParams, function (error, client) {
    if (error) {
        console.log('Unable to connect: ' + error.message);
        return;
    }
    var transaction = client.begin();
    AMQEntries.forEach((element) => {
        transaction.send({ 'destination': '/queue/dev', "content-type": "application/json", "persistent": "true" }).end(JSON.stringify(element));
    })
    transaction.commit();

    client.disconnect(function (error) {
        if (error) {
            console.log('Error while disconnecting: ' + error.message);
            return;
        }
        console.log('Sent messages');
    });
});
