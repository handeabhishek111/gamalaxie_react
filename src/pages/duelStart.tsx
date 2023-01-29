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
import NFTBlockPuzzleCard from '../components/cards/NFTBlockPuzzleCard';

interface dataProps {
    cardTitle: string;
    cardDescription: string;
    image: string;
    score: number;
    tokenId: number;
    getToken: FunctionStringCallback;
}

const DuelStart = () => {
    const cardList: dataProps[] = [
        {
            cardTitle: "2048 Game Card",
            cardDescription: "A game of 2048",
            image: images.game1,
            score: 11,
            tokenId: 1,
            getToken: () => { }
        },
        {
            cardTitle: "2048 Game Card",
            cardDescription: "A game of 2048",
            image: images.game1,
            score: 11,
            tokenId: 1,
            getToken: () => { }
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
        const nftcontract = new ethers.Contract(process.env.REACT_APP_NFT_CONTRACT || '', nftAbi, signer)
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
                <Grid marginTop={2} xs={12} rowSpacing={1} container justifyContent={'space-evelnly'} >
                    {cardList.map((item: dataProps, index: number) => (
                        <NFTBlockPuzzleCard
                            data={item}
                            key={index}
                        />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DuelStart;
