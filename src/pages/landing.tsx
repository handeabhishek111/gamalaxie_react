import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images } from '../store/commonUtils';
import GameCard from '../components/cards/GameCard';
import MetamaskButton from '../components/buttons/MetamaskButton';
import { useAccount } from 'wagmi';
import MetamaskCard from '../components/cards/MetamaskCard';
interface dataProps {
    gameTitle: string;
    gameDescription: string;
    image: string;
    navigateTo: string;
}

const Landing = () => {
    const cardList: dataProps[] = [
        {
            gameTitle: "2048",
            gameDescription: "Play 2048 an easy but addictive game use your math power to score as much points as possible",
            image: images.game1,
            navigateTo: '2048-game'
        },
        {
            gameTitle: "Tetris",
            gameDescription: "Tetris is the old and still gold everyone's favourite passtime game. Try not to create an eiffel tower while playing to score more and more points as possible",
            image: images.game2,
            navigateTo: 'tetris-game'
        },
    ];
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState<`0x${string}` | undefined>();

    useEffect(() => {
        setUserAddress(address);
    }, [isConnected]);

    return (
        <Grid md={12}>
            <Grid item xs={12}>
                <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg} alignItems={'flex-start'}>
                    Gamalaxie
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <MetamaskCard />
                <Grid item xs={12}>
                    <Box borderRadius={3} bgcolor={colors.grayishYellow} paddingY={2} paddingX={2} marginTop={1}>
                        <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                            Games
                        </Typography>
                        <Typography color={colors.moderateRed} fontWeight={'bold'} fontSize={fontSize.xs}>
                            *Please Login with Metamask before chosing a game to play below
                        </Typography>
                    </Box>
                </Grid>
                <Grid marginTop={2} xs={12} rowSpacing={1} container justifyContent={'space-evelnly'} >
                    {cardList.map((item: dataProps, index: number) => (
                        <GameCard
                            data={item}
                            key={index}
                        />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Landing;