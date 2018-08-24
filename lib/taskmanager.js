'use strict';

const storage = require("../lib/storage");
var colors = require('colors');

const ID = "id";
const CREATION_DATE = "creationDate";

var createTask = async function(task) {
    storage.retrieveTasksFromDisk(function(tasks) {
        task[ID] = new Date().getTime();
        task[CREATION_DATE] = new Date().toUTCString();
        if(!tasks) {
            tasks = {};
        }
        tasks[task.id] = task;
        storage.writeBackToFile(tasks);
    },
    function() {
        console.log("Task creation failed, could not write into file".red);
    })
};

var updateTask = function(id, status) {
    storage.retrieveTasksFromDisk(function(tasks) {
        for(var key in tasks) {
            if (key == id) {
                tasks[id].status = status;
                storage.writeBackToFile(tasks);
            }
        }
    },
    function() {
        console.log("Writing to file failed".red);
    });
};

var listTasks = function (showAll) {
    storage.retrieveTasksFromDisk(function(tasks) {
        if(!tasks) return;
        var tasksTobeDone = [];
        var tasksDone = [];
        var i=0;
        for(var key in tasks) {
            var line = ++i + ". " + tasks[key].title + " \t[" + tasks[key].id + "]";
            
            if(tasks[key]["status"] == "DONE") {
                tasksDone.push(line);
            } else {
                tasksTobeDone.push(line);
            }
        }

        printTasksInQueue(tasksTobeDone);
        printDoneTasks(tasksDone);
    },
    function() {
        console.log("listing failed");
    }
)};

var printTasksInQueue = function(taskStrings) {
    console.log("Tasks in queue:".green.underline);
    if(taskStrings.length > 0) {
        
        taskStrings.forEach(function(line) {
            console.log(line.white.bold);
        })
    } else {
        console.log("Enjoy you have no TASKS to do !!!!")
    }
}

var printDoneTasks = function(taskStrings) {
    if(taskStrings.length > 0) {
        console.log("Tasks finished:".green.underline);    
        taskStrings.forEach(function(line) {
            console.log(line.gray);
        })
    }
}



var deleteTask = function (id) {
    storage.retrieveTasksFromDisk(function(tasks) {
        for(var key in tasks) {
            if(key == id) {
                delete tasks[key];
                }
        };
        storage.writeBackToFile(tasks);
    })
};

var deleteAll = function() {
    storage.writeBackToFile("");
}

module.exports.createTask = createTask;
module.exports.updateTask = updateTask;
module.exports.listTasks = listTasks;
module.exports.deleteTask = deleteTask;
module.exports.deleteAll = deleteAll;
