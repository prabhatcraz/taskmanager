'use strict';

const storage = require("../lib/storage");
var colors = require('colors');
const localStorage = require('node-persist');

const NEXT_ID = "nextId";
const ID = "id";
const CREATION_DATE = "creationDate";


var resetTaskCounter = async function() {
    await localStorage.init();
    await localStorage.setItem(NEXT_ID, 0);
}

var createTask = async function(task) {
    await localStorage.init();
    
    let nextId = await localStorage.getItem(NEXT_ID);
    var id = parseInt(nextId, 10) || 0;
    await localStorage.setItem(NEXT_ID, ++id);
    
    storage.retrieveTasksFromDisk(function(tasks) {
        task[ID] = id;
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
        console.log("Writing to file failed");
    });
};

var listTasks = function (showAll) {
    storage.retrieveTasksFromDisk(function(tasks) {
        if(!tasks) return;
        for(var key in tasks) {
            var index = tasks[key].id;
            var line = index + ". " + tasks[key].title;

            if(tasks[key]["status"] == "DONE") {
                if(showAll) {
                    console.log(line.gray);
                }
            } else {
                console.log(line.white.bold.underline);
            }
        }
    },
    function() {
        console.log("listing failed");
    }
)};

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
module.exports.resetTaskCounter = resetTaskCounter;
