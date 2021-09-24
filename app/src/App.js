import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import WavePortal from './utils/WavePortal.json';

export const App = () => {
  const [wavesAmount, setWavesAmount] = useState(0);
  const [currentAccount, setCurrentAccount] = useState('');
  const [status, setStatus] = useState('idle');
  const contractAddress = '0xc7D259Bb8Ee9281857897164AD7D444b007b7E5F';
  const contractABI = WavePortal.abi;

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const getCurrentWaves = async () => {
      const { ethereum } = window;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const waveportalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let count = await waveportalContract.getTotalWaves();

      setWavesAmount(count.toNumber());
    };

    if (status === 'idle' || status === 'resolved') {
      getCurrentWaves();
    }
  }, [status]);

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;

    console.log(ethereum);

    ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length !== 0) {
        const account = accounts[0];

        setCurrentAccount(account);
      }
    });
  };

  const connectWallet = () => {
    const { ethereum } = window;

    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        setCurrentAccount(accounts[0]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const waveportalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setStatus('pending');

      const waveTxn = await waveportalContract.wave();
      console.log('Mining...', waveTxn.hash);

      await waveTxn.wait();
      console.log('Mined -- ', waveTxn.hash);

      setStatus('resolved');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <p>
        hey: {currentAccount} and here are you're waves:{' '}
        {status === 'pending' ? "I'm thinking about it :)" : wavesAmount}
      </p>
      {!currentAccount ? (
        <button onClick={connectWallet}>Connect wallet</button>
      ) : (
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      )}
    </>
  );
};
