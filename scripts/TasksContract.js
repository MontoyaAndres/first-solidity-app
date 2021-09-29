const hre = require('hardhat');

async function main() {
  const tasksContractFactory = await hre.ethers.getContractFactory(
    'TasksContract'
  );
  const tasksContract = await tasksContractFactory.deploy();
  await tasksContract.deployed();

  // get Tasks List
  let tasksCounter = await tasksContract.tasksCounter();
  let task = await tasksContract.tasks(tasksCounter);

  console.log(task);

  console.log('-----');

  // task created successfully
  await tasksContract.createTask('My second task', 'My second task!');
  tasksCounter = await tasksContract.tasksCounter();
  task = await tasksContract.tasks(tasksCounter);

  console.log(task, tasksCounter.toNumber());

  console.log('-----');

  // task toggled done
  await tasksContract.toggleDone(1);
  task = await tasksContract.tasks(1);

  console.log(task);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
