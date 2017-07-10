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
    else console.log(chalk.green("Connection to the sqlite DB located at " + dbpath));
});
var csvHeaders = "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve"
var directory = path.join(__dirname, "output")
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
}
db.serialize(() => {
    db.all("SELECT * from csvEntries", function (err, rows) {
        if (err) console.log(chalk.red(err))
        else {
            var lines = []
            lines[0] = csvHeaders;
            rows.forEach((row) => {
                lines.push(`${row.one}|${row.two}|${row.three}|${row.four}|${row.five}|${row.six}|${row.seven}|${row.eight}|${row.nine}|${row.ten}|${row.eleven}|${row.twelve}`)
            })
        }
        var csvData = lines.join("\n");
        fs.open(path.join(directory, "fromDb.csv"), "w", (err) => {
            if (err) throw new Error(err);
            else {
                fs.writeFile(path.join(directory, "fromDb.csv"), csvData, (err) => {
                    if (err) throw new Error(err);
                    else console.log("Data from Sqlite table csvEntries has been entered into " + directory + "/fromDb.csv")
                })
            }
        })
    })
})
db.close();
function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
var msgbuffer = [];
function readAMQ() {
    stompit.connect(connectOptions, function (error, client) {

        if (error) {
            console.log('Unable to connect: ' + error.message);
            return;
        }
        var consuming = false;

        client.subscribe({ "destination": "/queue/dev", "ack": "client-individual" }, function (error, message) {
            if (error) {
                console.log('subscribe error ' + error.message);
                return;
            }

            message.readString('utf-8', function (error, body) {

                if (error) {
                    console.log('read message error ' + error.message);
                    return;
                }
                msgbuffer.push(body);
                client.ack(message);

                client.disconnect();
            });
        });
    });
}
for (let i = 0; i < 80; i++) {
    readAMQ();
    sleep(1);
}
setTimeout(() => {
    var lines2 = []
    console.log(lines2)
    lines2[0] = csvHeaders;
    console.log(msgbuffer.length)
    msgbuffer.forEach((elem) => {
        var row = JSON.parse(elem)
        lines2.push(`${row.one}|${row.two}|${row.three}|${row.four}|${row.five}|${row.six}|${row.seven}|${row.eight}|${row.nine}|${row.ten}|${row.eleven}|${row.twelve}`)
    })
    var csvData2 = lines2.join("\n");
    fs.open(path.join(directory, "fromActiveMQ.csv"), "w", (err) => {
        if (err) throw new Error(err);
        else {
            fs.writeFile(path.join(directory, "fromActiveMQ.csv"), csvData2, (err) => {
                if (err) throw new Error(err);
                else console.log("Data from ActiveMQ has been entered into " + directory + "/fromActiveMq.csv")
            })
        }
    })

}, 1000)