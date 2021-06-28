App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTasks();
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },
  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },
  loadContract: async () => {
    try {
      const res = await fetch("TasksContract.json");
      const tasksContractJSON = await res.json();
      App.contracts.TasksContract = TruffleContract(tasksContractJSON);
      App.contracts.TasksContract.setProvider(App.web3Provider);

      App.tasksContract = await App.contracts.TasksContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },
  render: async () => {
    document.getElementById("account").innerText = App.account;
  },
  renderTasks: async () => {
    const tasksCounter = await App.tasksContract.tasksCounter();
    const taskCounterNumber = tasksCounter.toNumber();

    let html = "";

    for (let i = 1; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0].toNumber();
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreatedAt = task[4];

      // Creating a task Card
      let taskElement = `<div class="card bg-dark rounded-0 mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${taskTitle}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
              taskDone === true && "checked"
            }>
          </div>
        </div>
        <div class="card-body">
          <span>${taskDescription}</span>
          <span>${taskDone}</span>
          <p class="text-muted">Task was created ${new Date(
            taskCreatedAt * 1000
          ).toLocaleString()}</p>
          </label>
        </div>
      </div>`;
      html += taskElement;
    }

    document.querySelector("#tasksList").innerHTML = html;
  },
  createTask: async (title, description) => {
    try {
      const result = await App.tasksContract.createTask(title, description, {
        from: App.account,
      });
      console.log(result.logs[0].args);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },
  toggleDone: async (element) => {
    const taskId = element.dataset.id;
    await App.tasksContract.toggleDone(taskId, {
      from: App.account,
    });
    window.location.reload();
  },
};
