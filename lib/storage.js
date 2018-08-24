var fs = require("fs");
const homedir = require('os').homedir();
const taskFile = homedir  + "/tasks.json";


var retrieveTasksFromDisk = function (success, failure) {
    fs.readFile( taskFile, 'utf8', function (err, data) {
        if(err && err.code != "ENOENT") {
            console.log(err);
            return;
        }
        var tasks = {};
        if(data) {
            tasks = JSON.parse(data);
        }
        success(tasks);
    });
}

var writeBackToFile = function(tasks, success, failure) {
    fs.writeFile( taskFile, JSON.stringify(tasks), function(err) {
        console.log(err)
    });
}

module.exports.retrieveTasksFromDisk = retrieveTasksFromDisk;
module.exports.writeBackToFile = writeBackToFile;
