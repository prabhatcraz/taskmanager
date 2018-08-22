// 'use strict';

const storage = require("../lib/storage");
var colors = require('colors');
const localStorage = require('node-persist');


var createTask = async function(task) {
    await localStorage.init();
    
    let nextId = await localStorage.getItem('nextId') ;
    var creationDate = new Date();
    
    var id = nextId;
    await localStorage.setItem("nextId", ++id);
    
    storage.retrieveTasksFromDisk(function(tasks) {
        task["id"] = id;
        task["creationDate"] = creationDate.toUTCString();
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
                console.log("done ");
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
    var keys = ["id", "title"];

    storage.retrieveTasksFromDisk(function(tasks) {
        var index = 1;
        for(var key in tasks) {
            var line = tasks[key].id + ". " + tasks[key].title;

            // for(var k in keys) {
            //     line += task[keys[k]] + "  ";
            // }

            if(tasks[key]["status"] == "DONE") {
                if(showAll) {
                    console.log(line.green);
                }
            } else {
                console.log(line.gray.bold);
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
