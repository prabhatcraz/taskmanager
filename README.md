## Command line TaskManager
A command line task manager written in nodejs.

```
Options:

    -h, --help  output usage information

  Commands:

    list|ls     list tasks
    remove|rm   delete a task
    create|c    create a task
    done|d      mark a task done
    notDone|nd  mark a task not done.
    resetAll    deleteAll

  Examples:

    $ tm --help
    $ tm ls
    $ tm c <<task title>>
    $ tm d <<task id>> # Task id is the number in brackets after task title
    $ tm nd <<task id>> # Task id is the number in brackets after task title
    $ tm resetAll

```