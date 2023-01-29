import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import {
	gridSpacing,
	fontSize,
	colors,
	images,
	callRpc,
	gameAbi,
	nftAbi,
	REACT_APP_NFT_CONTRACT,
	REACT_APP_GAME_CONTRACT,
} from '../store/commonUtils';
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
}

const DuelStart = () => {
    const [nftCardList, setNftCardList] = useState<any>([]);
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState<`0x${string}` | undefined>();
    const [tokenId, setTokenId] = useState<string>('');
    const [tokenScore, setTokenScore] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setUserAddress(address);
        getList();

    }, [isConnected]);

    const getList = async () => {
        const signer: any = await fetchSigner();
        const nftcontract = new ethers.Contract(REACT_APP_NFT_CONTRACT || '',
            nftAbi, signer)
        let cardList = [];
        // code to fetch tokeuri using tokenId
        const tokenBalance = await nftcontract.balanceOf(address);
        for (let i = 0; i < tokenBalance; i++) {
            const indexTokenId = await nftcontract.tokenOfOwnerByIndex(address, i)
            const tokenUri = await nftcontract.tokenURI(indexTokenId)
            const response = await fetch(tokenUri);
            const data = await response.json();
            console.log("data---", data);
            data['tokenId'] = parseInt(indexTokenId);
            let newData: dataProps = {
                cardTitle: data?.name,
                cardDescription: data?.description,
                image: data?.image,
                score: data?.attributes[1]?.value,
                tokenId: data?.tokenId,
            }
            cardList.push(newData);
        }
        Promise.all(cardList)
            .then((res) => {
                setNftCardList(res);
                console.log("Response----", res)
                setLoading(false);
            })
    }

    const startDuel = async () => {
			console.log(
				'selected token details: tokenId: ',
				tokenId,
				'| tokenScore: ',
				tokenScore
			);
			const priorityFee = await callRpc('eth_maxPriorityFeePerGas');
			const signer: any = await fetchSigner();

			const gameContract = new ethers.Contract(
				REACT_APP_GAME_CONTRACT || '',
				gameAbi,
				signer
			);
			const isPersoninQueue = await gameContract.isPersonInQueue(address);
			if (!isPersoninQueue) {
				await gameContract
					.getBetAmount({
						maxPriorityFeePerGas: priorityFee,
						value: ethers.utils.parseEther('0.01'),
					})
					.then(async (tx: any) => {
						const reciept = await tx.wait();
						console.log('reciept of getBetAmount---', reciept);
						if (reciept.status) {
							await gameContract
								.joinQueue(address, tokenId, parseInt(tokenScore), {
									maxPriorityFeePerGas: priorityFee,
								})
								.then(async (tx: any) => {
									const reciept = await tx.wait();
									console.log('reciept of joinQueue---', reciept);
								});
						}
					});
			}
		};

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
                {!loading && <Grid marginTop={2} xs={12} rowSpacing={1} container justifyContent={'space-evelnly'} >
                    {nftCardList.map((item: dataProps, index: number) => (
                        <NFTBlockPuzzleCard
                            data={item}
                            key={index}
                            //@ts-ignore
                            getTokenData={(id: string, score: string) => { setTokenId(id); setTokenScore(score) }}
                        />
                    ))}
                </Grid>}
            </Grid>
        </Grid>
    )
}

export default DuelStart;
