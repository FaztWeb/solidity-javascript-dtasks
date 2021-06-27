const { assert } = require("chai");

const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", (accounts) => {
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  it("migrate deployed successfully", async () => {
    const address = await this.tasksContract.address;

    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("get Tasks List", async () => {
    const tasksCounter = await this.tasksContract.tasksCounter();
    const task = await this.tasksContract.tasks(tasksCounter);
    assert.equal(task.id.toNumber(), tasksCounter.toNumber());
    assert.equal(task.content, "first task");
    assert.equal(task.done, false);
    assert.equal(tasksCounter, 1);
  });

  it("task created successfully", async () => {
    const result = await this.tasksContract.createTask("some task");
    const tasksCounter = await this.tasksContract.tasksCounter();
    const taskEvent = result.logs[0].args;

    assert.equal(tasksCounter, 2);
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.content, "some task");
    assert.equal(taskEvent.done, false);
  });
});
