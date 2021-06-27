App = {
  contracts: {},
  load: async () => {
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
    console.log({ taskCounterNumber });

    let html = "";

    for (let i = 1; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      console.log(task);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskDone = task[2];

      // create an element
      let taskElement = `<div>
        <span>${taskContent}</span>
      </div>`;
      html += taskElement;
    }

    document.querySelector("#tasksList").innerHTML = html;
  },
  createTask: async (content) => {
    try {
      const result = await App.tasksContract.createTask(content, {
        from: App.account,
      });
      // console.log(result.logs[0].args)
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.load();
});

document.querySelector("#taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const content = document.querySelector("#newTask").value;
  App.createTask(content);
});
