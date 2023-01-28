import React from 'react';
import Routes from './routes';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
)

const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
})

function App() {
  return (
    <WagmiConfig client={client}>
      <Routes />
    </WagmiConfig>
  );
}

export default App;
