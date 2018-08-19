#!/usr/bin/env node
'use strict';

const program = require('commander');
const storage = require("./lib/storage");
const print = require("./lib/colorconsole").print;

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var createTask = function(task) {
    var creationDate = new Date();
    
    var id = Math.floor((creationDate.getTime() / 1000) % 1000);
    
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
        console.log("Task creation failed, could not write into file");
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
        for(var key in tasks) {
            var line = "";
            var task = tasks[key];

            for(var k in keys) {
                line += task[keys[k]] + "  ";
            }

            if(tasks[key]["status"] == "DONE") {
                if(showAll) {
                    print("green", line);
                }
            } else {
                // console.log(line);
                print("white", line);
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

/** Utilities */
var sortByStatus = function(tasks) {
    tasks.sort(function(a, b) {
    });
}

/** Cli interaction */
program.command("list").alias("ls").description("list tasks")
    .action(function(args) {
        var showAll = args;
        listTasks(showAll);
    });
    
program.command("remove").alias("rm").description("delete tasks")
    .action(function(taskId) {
        deleteTask(taskId);
    });

program.command("create").alias("c").description("create tasks")
    .action(function(title) {
        console.log("tasks: " + title);
        createTask({
            "title" : title,
            "status" : "OPEN"
        });
    });

program.command("done").alias("d").description("marks status done")
    .action(function(args) {
        var id = args; 
        updateTask(id, "DONE");
    });

program.command("notDone").alias("nd").description("marks status as not done done")
    .action(function(args) {
        var id = args; 
        updateTask(id, "OPEN");
    });

program.command("deleteAll").description("deleteAll")
    .action(function() {
        deleteAll();
    });

program.parse(process.argv);
