import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images, callRpc, gameAbi, nftAbi } from '../store/commonUtils';
import GameCard from '../components/cards/GameCard';
import MetamaskButton from '../components/buttons/MetamaskButton';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import MetamaskCard from '../components/cards/MetamaskCard';
import { ethers } from 'ethers';
import { fetchSigner } from '@wagmi/core'

interface dataProps {
    gameTitle: string;
    gameDescription: string;
    image: string;
    navigateTo: string;
}

const DuelStart = () => {
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
    const [tokenId, setTokenId] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        setUserAddress(address);
    }, [isConnected]);

    const startDuel = async () => {
        const priorityFee = await callRpc("eth_maxPriorityFeePerGas")
        const signer: any = await fetchSigner();
        const nftcontract = new ethers.Contract(process.env.REACT_APP_NFT_CONTRACT||'', nftAbi, signer)
        // code to fetch tokeuri using tokenId
        const tokenURI = await nftcontract.tokenURI(tokenId);
        const response = await fetch(tokenURI);
        const data = await response.json();
        console.log(data);



        // const gameContract = new ethers.Contract(process.env.REACT_APP_GAME_CONTRACT||'', gameAbi, signer)
        // await gameContract
        // .joinQueue(address, tokenId, {
        //   gasLimit: 1000000000,
        //   maxPriorityFeePerGas: priorityFee
        // })
        // .then((tx: any) => {
        //   console.log("final tx---", tx)
        // })
    }

    return (
        <Grid md={12}>
            <Grid item xs={12}>
                <Box flexDirection={'row'} justifyContent={'space-between'} display='flex' alignItems={'center'}>
                    <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg} alignItems={'flex-start'}>
                        Duel Start
                    </Typography>
                    <Button onClick={() => navigate('/')} variant="outlined" color={'success'}>
                        Home
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <MetamaskCard />
                <Grid item xs={12}>
                    {/* <Box borderRadius={3} bgcolor={colors.grayishYellow} paddingY={2} paddingX={2} marginTop={1}>
                            <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                                Games
                            </Typography>
                            <Typography color={colors.moderateRed} fontWeight={'bold'} fontSize={fontSize.xs}>
                                *Please Login with Metamask before chosing a game to play below
                            </Typography>
                        </Box> */}
                    <Box justifyContent={'space-between'} flexDirection={'row'} display='flex' alignItems={'center'} borderRadius={3} bgcolor={colors.grayishYellow} padding={2} marginTop={1}>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            variant="outlined"
                            size="small"
                            onChange={(e) => { setTokenId(e.target.value) }}
                            value={tokenId ? tokenId : ''}
                            autoComplete='false'
                        />
                        <Box paddingLeft={1}>
                            <Button onClick={() => startDuel()} variant="contained" color={'success'}>
                                Start Duel
                            </Button>
                        </Box>
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

export default DuelStart;
