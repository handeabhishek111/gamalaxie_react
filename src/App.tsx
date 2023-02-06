import { Box, Container, Grid } from '@mui/material';
import React from 'react';
// import Routes from './routes';
import { Route, Routes } from 'react-router-dom';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import DuelStart from './pages/duelStart';
import Landing from './pages/landing';
import Result from './pages/result';
import SlidingBlockPuzzle from './pages/slidingBlockPuzzle';

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
      <Box sx={{ display: 'flex', margin: 0, padding: 0 }}>
        {/* if any header is added in future */}
        <Container >
          <Grid container >
            <Routes >
              <Route path="/" element={<Landing />} />
              <Route path="/2048-game" element={<SlidingBlockPuzzle />} />
              <Route path="/tetris-game" element={<SlidingBlockPuzzle />} />
              <Route path="/duel-start" element={<DuelStart />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </Grid>
        </Container>
      </Box>

      {/* <Routes /> */}
    </WagmiConfig>
  );
}

export default App;
