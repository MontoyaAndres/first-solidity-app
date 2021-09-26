const hre = require('hardhat');

async function main() {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log('Contract addy:', waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave('First message!');
  await waveTxn.wait();

  const [_, randoPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randoPerson).wave('Another message :)');
  await waveTxn.wait();

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
}

async function main2() {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  console.log('Contract addy:', waveContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Send Wave
   */
  const waveTxn = await waveContract.wave('A message');
  await waveTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  const allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
}

const runMain = async () => {
  try {
    await main2();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
