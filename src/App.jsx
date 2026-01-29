import { useState } from 'react'
import {QueryClient, QueryClientProvider, useQuery, useQueryClient} from "@tanstack/react-query"
import './App.css'
import { http, createConfig, useConnect, WagmiProvider, useAccount, useSendTransaction, useBalance, useConnectors } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'


const queryClient = new QueryClient()


export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected()
  ],
  transports: {
    [mainnet.id]: http()
  },
})


function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <WalletConnector/>
        <EthSend/>
        <MyAddress/>
      </QueryClientProvider> 
    </WagmiProvider>
  )
}

function MyAddress(){
  const address = useBalance({
    address: document.getElementById("address")
  })
}

function sendEth(){
  const sendTransaction = useSendTransaction();

  sendTransaction.mutate({
    to: document.getElementById("address"),
    value: parseEther('0.01'),
  })
}

function EthSend(){
  return <div>
    <input id='address'></input>
    <button onClick={sendEth}>Send Eth</button>
  </div>
}

function WalletConnector(){
  const connect = useConnect();
  const connectors = useConnectors();

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}

export default App
