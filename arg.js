var fs = require('fs'),
    path = require('path');

var file=process.argv[2];
console.log(file)

fs.readFile(file, "utf8", (err, data) => {
    if (err) console.log(err.message);
    else {
        console.log(data);
    }
});