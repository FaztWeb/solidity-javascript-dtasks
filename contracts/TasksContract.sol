// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint256 public tasksCounter = 0;

    struct Task {
        uint256 id;
        string content;
        bool done;
    }

    event TaskCreated(uint256 id, string content, bool done);

    mapping(uint256 => Task) public tasks;

    constructor() {
        createTask("first task");
    }

    function createTask(string memory _content) public {
        tasksCounter++;
        tasks[tasksCounter] = Task(tasksCounter, _content, false);
        emit TaskCreated(tasksCounter, _content, false);
    }
}
