import { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query"
import './App.css'
import { http, createConfig, useConnect, WagmiProvider, useAccount, useSendTransaction, useBalance, useConnectors } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { connect } from 'wagmi/actions'
import { parseEther } from 'viem'


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
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <WalletConnector />
        <EthSend />
      </WagmiProvider>
    </QueryClientProvider>
  )
}


function EthSend() {
  const [address, setAddress] = useState('')
  const sendTransaction = useSendTransaction()

  function sendEth() {

    sendTransaction.mutate({
      to: address,
      value: parseEther('0.01'),
    })
  }
  return <div>
    <input value={address} onChange={(e) => {
      setAddress(e.target.value)
    }}></input>
    <button onClick={sendEth}>Send Eth</button>
  </div>
}

export function WalletConnector() {
  const connectors = useConnectors()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect(config, { connector })}>
      {connector.name}
    </button>
  ))
}

export default App
