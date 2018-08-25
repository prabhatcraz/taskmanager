'use strict';

const storage = require("../lib/storage");

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
module.exports.deleteTask = deleteTask;
module.exports.deleteAll = deleteAll;
