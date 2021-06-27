const TasksContract = artifacts.require("TasksContract.sol");

module.exports = function (deployer) {
  deployer.deploy(TasksContract);
};
