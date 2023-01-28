import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images } from '../store/commonUtils';
import GameCard from '../components/cards/GameCard';
import MetamaskButton from '../components/buttons/MetamaskButton';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import MetamaskCard from '../components/cards/MetamaskCard';
interface dataProps {
    gameTitle: string;
    gameDescription: string;
    image: string;
    navigateTo: string;
}

const Result = () => {
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState<`0x${string}` | undefined>();
    const [gameResult, setGameResult] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        setUserAddress(address);
    }, [isConnected]);

    const result = () => {

    }

    return (

        <Grid md={12}>
            <Grid item xs={12}>
                <Box flexDirection={'row'} justifyContent={'space-between'} display='flex' alignItems={'center'}>
                    <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg} alignItems={'flex-start'}>
                        Result
                    </Typography>
                    <Button onClick={() => navigate('/')} variant="outlined" color={'success'}>
                        Home
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <MetamaskCard />
                <Grid item xs={12}>
                    <Box justifyContent={'space-between'} display={'flex'} flexDirection={'column'} alignItems={'center'} borderRadius={3} bgcolor={colors.grayishYellow} padding={2} marginTop={1}>
                        <Box>
                            <Button onClick={() => result()} variant="contained" color={'success'}>
                                Result
                            </Button>
                        </Box>
                        {gameResult && <Typography marginTop={2} color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                            {gameResult}
                        </Typography>}
                    </Box>
                </Grid>
                {/* <Grid marginTop={2} xs={12} rowSpacing={1} container justifyContent={'space-evelnly'} >
                        {cardList.map((item: dataProps, index: number) => (
                            <GameCard
                                data={item}
                                key={index}
                            />
                        ))}
                    </Grid> */}
            </Grid>
        </Grid>
    )
}

export default Result;