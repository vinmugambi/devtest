var sqlite3 = require('sqlite3').verbose();
var path = require("path");
var chalk = require("chalk");
var fs = require("fs");

var dbpath = path.join(__dirname, "db", "devtest.db");
var db = new sqlite3.Database(dbpath, (err) => {
    if (err) console.log(chalk.red(err));
    else console.log(chalk.green("DB devtest created successfully at "), chalk.bgYellow(dbpath));
});
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

var dbEntries = csvToJSON().filter(row => row.five === "C" || row.five === "G");
var AMPQEntries = csvToJSON().filter(row => row.five == !"C" || row.five == !"G");

db.serialize(function () {
    db.run('DROP TABLE IF EXISTS csvEntries')
    db.run(`CREATE TABLE csvEntries(
      one text default,
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
            else console.log("sucessfuly created table")
        });
    var stmt = db.prepare("INSERT INTO csvEntries VALUES (?,?,?,?,?,?,?,?,?,?,?)", function (err) {
        if (err) console.log(err)
        else console.log("prepared for insertion")
    });
    dbEntries.forEach(function (element) {
        stmt.run([this.one, this.two, this.three, this.four, this.five, this.six, this.seven, this.eight, this.nine, this.ten, this.eleven, this.twelve])
    }, this);
    stmt.finalize()

    db.each("SELECT * FROM csvEntries", function (err, row) {
        console.log(row)
    })
});

db.close();
