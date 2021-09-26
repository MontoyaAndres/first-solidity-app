const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with the account: ', deployer.address);

  console.log('Account balance: ', (await deployer.getBalance()).toString());

  const Token = await hre.ethers.getContractFactory('WavePortal');
  const token = await Token.deploy();

  console.log('WavePortal address: ', token.address);
}

async function main2() {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await waveContract.deployed();

  console.log('WavePortal address: ', waveContract.address);
}

const runMain = async () => {
  try {
    await main2();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
