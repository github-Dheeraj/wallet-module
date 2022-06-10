import React, { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import { Provider, WagmiProvider, chain, createClient} from 'wagmi'

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useSignMessage,
  useNetwork,
  useSendTransaction,
} from 'wagmi';

import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { Buffer } from "buffer";

if (!window.Buffer) {
  window.Buffer = Buffer;
}
//chains: [defaultChains, chain.mainnet, chain.optimism]
const chains = [chain.polygon, chain.polygonMumbai];
//const defaultChain = chain.mainnet

export const client = createClient({
    autoConnect: true,
    connectors({ chainId }) {
      //const chain = chains.find((x) => x.id === chainId) ?? defaultChain
      console.log(chains);
      const rpcUrl =
        chains.find((x) =>{console.log(x.id,chainId); return  x.id === chainId})?.rpcUrls?.[0] ??
        chain.mainnet.rpcUrls[0]
      console.log(chainId)
      return [
        new InjectedConnector(),
         new WalletConnectConnector({
            chains,
            options: {
            qrcode: true,
            rpc: { [chain.id]: rpcUrl },
          },
        }),
      ]
    },
  })

const App = () => {
  // Render Methods 
  const [ currentAccount, setCurrentAccount ] = useState('');
  const { data: account } = useAccount();
  //const { data: ensName } = useEnsName({ address: account?.address })
  const { activeConnector, connectAsync, connectors, isConnected, isConnecting, pendingConnector} =
    useConnect();
  const {  disconnectAsync } = useDisconnect()

    const {
    activeChain,
    switchNetworkAsync
  } = useNetwork({
      chainId: 137,
      onError(error) {
        console.log('Error', error)
    },
  })
  //console.log('Active chain', activeChain);
console.log('is Connected', isConnected);

  let amountInEther = '1.0';
  let address = '0x631046BC261e0b2e3DB480B87D2B7033d9720c90';
  const { sendTransactionAsync } 
    = useSendTransaction({
      request: {
        to: address,
        value: ethers.utils.parseEther(amountInEther)._hex, // 1 ETH
      },
      onError(error) {
        console.log('Error sending the Value', error)
      },
    })
  
  const { signMessageAsync } = useSignMessage({
    message: 'Sign the message',
    onError(error) {
        console.log('Error', error);
    },
  })

  const connectWallet = async ()=>{
      {connectors.map((connector) => (
       <button
        className="tip-reviewer-button"
        disabled={!connector.ready}
        key={connector.id}
        onClick={() => connectAsync(connector)}
      >
        {connector.name}
        {!connector.ready && ' (unsupported)'}
        {isConnecting &&
          connector.id === pendingConnector?.id &&
          ' (connecting)'}
      </button>
    ))}
  }

	  
 useEffect(()=>{
   if(activeChain){
      if(activeChain.id !== 137 ){
        const return1 = switchNetworkAsync?.()
        console.log(return1)
     }
     setCurrentAccount(account?.address);
     console.log('Connected Account:',currentAccount);
   } 
 },[activeChain])
 
//console.log(connectors)
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Tip Me</p>
          <p className="sub-text">
            Send money to reviewer and support them.
          </p>
          {!activeConnector ?
            <div>
                {connectors.map((connector) => (
                 <button
                  className="tip-reviewer-button"
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connectAsync(connector)}
                >
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                  {isConnecting &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </button>
              ))}
            </div>:
            <div>
              <button className="tip-button tip-reviewer-button" onClick={() => sendTransactionAsync()}>
                  1 matic 
              </button>
              <button className="tip-reviewer-button" onClick={() =>signMessageAsync()}>
                Sign-Message
              </button>
            
            <button className="tip-reviewer-button" onClick={disconnectAsync}>{account?.address}</button>
              <button className="tip-reviewer-button" onClick={()=>switchNetworkAsync?.()}>{activeChain?.id}</button>
            </div>
            
        }
          
        </div>
      </div>
    </div>
   
  );
};

export default App;