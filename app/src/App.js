import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import WavePortal from './utils/WavePortal.json';

export const App = () => {
  const [wavesAmount, setWavesAmount] = useState(0);
  const [currentAccount, setCurrentAccount] = useState('');
  const [allWaves, setAllWaves] = useState([]);
  const [status, setStatus] = useState('idle');
  const contractAddress = '0x1149001a0636bD3f06153a22f9D1cB6C65897Fa7';
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

      const count = await waveportalContract.getTotalWaves();
      const waves = await waveportalContract.getAllWaves();

      let wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        });
      });

      console.log(wavesCleaned);

      setWavesAmount(count.toNumber());
      setAllWaves(wavesCleaned);
    };

    if (currentAccount && (status === 'idle' || status === 'resolved')) {
      getCurrentWaves();
    }
  }, [currentAccount, status]);

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

      const waveTxn = await waveportalContract.wave('👋');
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
      {allWaves.map((wave, index) => (
        <div
          style={{
            backgroundColor: 'OldLace',
            marginTop: '16px',
            padding: '8px',
          }}
          key={index}
        >
          <div>Address: {wave.address}</div>
          <div>Time: {wave.timestamp.toString()}</div>
          <div>Message: {wave.message}</div>
        </div>
      ))}
    </>
  );
};
