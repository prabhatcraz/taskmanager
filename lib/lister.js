var colors = require('colors');
const storage = require("../lib/storage");

var Table = require('cli-table');
var table = new Table({
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
           , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
           , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
           , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    style: { 'padding-left': 0, 'padding-right': 0 }
  });


var listTasks = function (args) {
    if(args == 'a') {
        plainPrint(true);
    } else {
        plainPrint();
    }
};

var plainPrint = function(showAll) {
    storage.retrieveTasksFromDisk(function(tasks) {
        if(!tasks) return;
        var tasksInQueue = [];
        var tasksDone = [];
        
        for(var key in tasks) {
            if(tasks[key]["status"] == "DONE") {
                tasksDone.push(tasks[key]);
            } else {
                tasksInQueue.push(tasks[key]);
            }
        }
        
        printTasksInQueue(tasksInQueue);
        if(showAll){
            printTasksDone(tasksDone);
        } 
    },
    function() {
        console.log("listing failed");
    });
}

var printTasksInQueue = function(tasks) {
    console.log("TASKS IN QUEUE:".green);
    table.splice(0, table.length);
    var i=0;
    tasks.forEach(task => {
        table.push([++i + ".", task.title, task.id]);
    });
    console.log(table.toString().bold);
}

var printTasksDone = function(tasks) {
    console.log("TASKS COMPLETED:".green);
    table.splice(0, table.length);
    var i=0;
    tasks.forEach(task => {
        table.push([++i + ".", task.title, task.id]);
    });
    console.log(table.toString().gray);
}

module.exports.listTasks = listTasks;
