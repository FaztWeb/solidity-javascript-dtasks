App = {
  contracts: {},
  load: async () => {
    console.table({
      web3: Web3.version,
      provider: Web3.givenProvider,
    });
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTasks();
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        App.web3Provider = window.web3.currentProvider;
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
        }
      }
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },
  loadAccount: async () => {
    let accounts = await window.web3.eth.getAccounts();
    App.account = accounts[0];
    console.log(App.account);
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
    console.log({taskCounterNumber})

    let html = '';

    for (let i = 1; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      console.log(task)
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
};

document.addEventListener("DOMContentLoaded", () => {
  App.load();
});
