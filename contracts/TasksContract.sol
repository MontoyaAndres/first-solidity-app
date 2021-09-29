// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract TasksContract {
    uint256 public tasksCounter = 0;

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );
    event TaskToggleDone(uint256 id, bool done);

    mapping(uint256 => Task) public tasks;

    constructor() {
        createTask('my first task', 'my first description');
    }

    function createTask(string memory _title, string memory _description)
        public
    {
        tasksCounter++;
        tasks[tasksCounter] = Task(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );

        emit TaskCreated(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;

        emit TaskToggleDone(_id, _task.done);
    }

    function printTasks() public view {
        console.log('TasksCounter %s', tasksCounter);
    }
}
