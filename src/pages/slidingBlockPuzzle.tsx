import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images } from '../store/commonUtils';
import BlockPuzzleComponent from '../games/2048/blockPuzzleComponent';
import MetamaskButton from '../components/buttons/MetamaskButton';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import MetamaskCard from '../components/cards/MetamaskCard';

const SlidingBlockPuzzle = () => {
    const navigate = useNavigate();
    const [bestScore, setBestScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [newGameTrigger, setNewGameTrigger] = useState(true);
    const { address, isConnected } = useAccount();
    const [disableButton, setDisableButton] = useState(false);

    return (
        <Grid md={12}>
            <Grid item xs={12}>
                <Box flexDirection={'row'} justifyContent={'space-between'} display='flex' alignItems={'center'}>
                    <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg} alignItems={'flex-start'}>
                        2048
                    </Typography>
                    <Button onClick={() => navigate('/')} variant="outlined" color={'success'}>
                        Home
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <MetamaskCard />
                <Box borderRadius={3} display={'flex'} flexDirection={'row'} bgcolor={colors.grayishYellow} paddingY={2} paddingX={2} marginTop={1} justifyContent={'space-between'}>
                    <Button disabled={disableButton} onClick={() => setNewGameTrigger(bol => !bol)} variant="contained" color="success">
                        New Game
                    </Button>
                    <Box display={'flex'} flexDirection={'column'} flex={1} paddingX={2} >
                        <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                            Instructions
                        </Typography>
                        <Typography color={colors.veryDarkBlue} fontSize={fontSize.xs}>
                            How To Play
                        </Typography>
                        <Typography color={colors.veryDarkBlue} fontSize={fontSize.sm} marginTop={1}>
                            - Use your arrow keys &#x2190; &#x2191; &#x2192; &#x2193;
                        </Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'row'}>
                        <Box borderRadius={2} bgcolor={colors.moderateRed + '1F'} padding={2} textAlign={'center'} alignItems={'center'}>
                            <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                                Score
                            </Typography>
                            <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg}>
                                {currentScore}
                            </Typography>
                        </Box>
                        <Box borderRadius={2} bgcolor={colors.moderateRed + '1F'} padding={2} textAlign={'center'} alignItems={'center'} marginLeft={2}>
                            <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                                Best
                            </Typography>
                            <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg}>
                                {bestScore}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Grid item>
                    <BlockPuzzleComponent newGameFn={newGameTrigger} bestPropScore={(best: number) => setBestScore(best)} currentPropScore={(current: number) => setCurrentScore(current)} setCurrentLoader={(bol: boolean) => { setDisableButton(bol) }} />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SlidingBlockPuzzle; 