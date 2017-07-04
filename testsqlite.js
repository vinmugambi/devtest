var sqlite3 = require('sqlite3').verbose();
var path = require("path");
var chalk = require("chalk");
var fs = require("fs");

var dbpath = path.join(__dirname, "db", "devtest.db");
var db = new sqlite3.Database(dbpath, (err) => {
    if (err) console.log(chalk.red(err));
    else console.log(chalk.green("DB devtest created successfully at "), chalk.blue(dbpath));
});
var csvFile;
if (process.argv[2] !== null && typeof (process.argv[2]) === "string") {
    csvFile = process.argv[2];
} else {
    csvFile = path.join(__dirname, "dummy_delimited.csv");
}

var csvData =fs.readFileSync(csvFile,"utf8");

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
      one text default "A" NOT NULL,
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
  )`);


    // var stmt = db.prepare("INSERT INTO csvEntries VALUES (?)");
    // for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    // db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
    //     console.log(row.id + ": " + row.info);
    // });
});

db.close();
