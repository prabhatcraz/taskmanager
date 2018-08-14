var fs = require("fs");

const homedir = require('os').homedir();
const taskFile = homedir  + "/tasks.json";

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

var ceateTask = function(task) {
    console.log(task);
    fs.readFile( taskFile, 'utf8', function (err, data) {
        var tasks;
        console.log(data);
        if(data)  {
            tasks = JSON.parse(data);
        }

        task.id = guid();

        if (!tasks) {
            tasks = {};
        }
        tasks[task.id] = task;
        console.log(tasks);

        fs.writeFile( taskFile, JSON.stringify(tasks), function (err) {
            if(err) {
                console.log("Task Creation failed !!" + err);
            } else {
                console.log("Task Creation Success !!");
            }
        });
    });
}

var updateTask = function(id, status) {
    fs.readFile( taskFile, 'utf8', function (err, data) {
        task.status = status;
        task.id = guid();
        data.append(task);
        fs.writeFile( taskFile, JSON.stringify(epics), function (err) {
            if(err) {
                console.log(err.info);
            } else {
                console.log("Success");
            }
        });
    });
}

var listTasks = function () {
    fs.readFile( taskFile, 'utf8', function (err, data) {
        console.log(data);
        if(data)  {
            var tasks = JSON.parse(data);
            console.log(tasks);
            var i = 1;
            for(var key in tasks) {
                var task = tasks[key];
                console.log(i++ + "." + task.title + " : " + task.status);
            };
        }
    });

}

ceateTask({
    "title" : "some task",
    "status" : "OPEN"
});

listTasks();