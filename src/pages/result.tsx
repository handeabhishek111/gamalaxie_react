import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images, callRpc, REACT_APP_GAME_CONTRACT, gameAbi, REACT_APP_NFT_CONTRACT, nftAbi } from '../store/commonUtils';
import GameCard from '../components/cards/GameCard';
import MetamaskButton from '../components/buttons/MetamaskButton';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import MetamaskCard from '../components/cards/MetamaskCard';
import { fetchSigner } from '@wagmi/core'
import { ethers } from 'ethers';
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

	const result = async () => {
		const priorityFee = await callRpc('eth_maxPriorityFeePerGas');
		const signer: any = await fetchSigner();

		const gameContract = new ethers.Contract(
			REACT_APP_GAME_CONTRACT || '',
			gameAbi,
			signer
		);
		// check Person in queue
		const isPersonInQueue = await gameContract.isPersonInQueue(address, {
			maxPriorityFeePerGas: priorityFee,
		});
		if (isPersonInQueue) {
			alert(
				'You are in queue, please wait till you get a match with a random player'
			);
			return;
		}
		const userData = await gameContract.getPlayer(address, {
			maxPriorityFeePerGas: priorityFee,
		});
		console.log('userData', userData);

		if (
			userData.lastBattleFought !== '' &&
			userData.opponent !== '0x0000000000000000000000000000000000000000'
		) {
			const lastBattleFought = JSON.parse(userData.lastBattleFought);
			console.log(lastBattleFought);
			setGameResult(lastBattleFought ? 'You Won' : 'You Lost');
			alert(
				lastBattleFought
					? 'You Won, to claim the reward you must burn your NFT'
					: 'You Lost, Your data will be deleted so you can play the next game'
			);
			// declare the NFT contract
			const nftContract = new ethers.Contract(
				REACT_APP_NFT_CONTRACT || '',
				nftAbi,
				signer
			);
			if (lastBattleFought) {
				// call the burn function
				await nftContract
					.burn(userData.tokenId, {
						maxPriorityFeePerGas: priorityFee,
					})
					.then(async (tx: any) => {
						const reciept = await tx.wait();
						console.log('reciept of Burn---', reciept);
						if (reciept.status) {
							alert('NFT Burned Successfully, You can claim your reward now');
							// load the game contract function withdrawBetAmount
							await gameContract
								.withdrawBetAmount(address, {
									maxPriorityFeePerGas: priorityFee,
								})
								.then(async (tx: any) => {
									const reciept = await tx.wait();
									console.log('reciept of withdrawBetAmount---', reciept);
									if (reciept.status) {
										alert(
											'Reward Claimed Successfully, Your data will be deleted so you can play the next game'
										);
									}
								});
						}
					});
			}
			// load the game contract function deletePlayer
			await gameContract
				.deleteUser(address, {
					maxPriorityFeePerGas: priorityFee,
				})
				.then(async (tx: any) => {
					const reciept = await tx.wait();
					console.log('reciept of deletePlayer---', reciept);
					if (reciept.status) {
						alert('Your data has been deleted successfully');
					}
				});
		} else {
			alert(
				'You have not played any game yet, Please first participate in Duel'
			);
		}
	};

	return (
		<Grid md={12}>
			<Grid item xs={12}>
				<Box
					flexDirection={'row'}
					justifyContent={'space-between'}
					display="flex"
					alignItems={'center'}
				>
					<Typography
						color={colors.veryDarkBlue}
						fontWeight={'bold'}
						fontSize={fontSize.lg}
						alignItems={'flex-start'}
					>
						Result
					</Typography>
					<Button
						onClick={() => navigate('/')}
						variant="outlined"
						color={'success'}
					>
						Home
					</Button>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<MetamaskCard />
				<Grid item xs={12}>
					<Box
						justifyContent={'space-between'}
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
						borderRadius={3}
						bgcolor={colors.grayishYellow}
						padding={2}
						marginTop={1}
					>
						<Box>
							<Button
								onClick={() => result()}
								variant="contained"
								color={'success'}
							>
								Result
							</Button>
						</Box>
						{gameResult && (
							<Typography
								marginTop={2}
								color={colors.veryDarkBlue}
								fontWeight={'bold'}
								fontSize={fontSize.sm}
							>
								{gameResult}
							</Typography>
						)}
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
	);
};

export default Result;