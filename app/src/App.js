import { useEffect, useState } from 'react';

export const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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

  return (
    <>
      <p>hey: {currentAccount}</p>
      {!currentAccount && (
        <button onClick={connectWallet}>Connect wallet</button>
      )}
    </>
  );
};
