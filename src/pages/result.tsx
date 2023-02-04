import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button, Modal } from '@mui/material';
import { gridSpacing, fontSize, colors, images, callRpc, REACT_APP_GAME_CONTRACT, gameAbi, REACT_APP_NFT_CONTRACT, nftAbi } from '../store/commonUtils';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import MetamaskCard from '../components/cards/MetamaskCard';
import { fetchSigner } from '@wagmi/core'
import { ethers } from 'ethers';
import { BounceLoader, PuffLoader } from "react-spinners";
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
	const [openModal, setOpenModal] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [loading1, setLoading1] = useState(false);
	const [showCancelButton, setShowCancelButton] = useState(false);
	const [alertText, setAlertText] = useState('');

	const style = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: colors.white,
		border: `2px solid ${colors.desaturatedYellow}`,
		boxShadow: 24,
		py: 2,
		px: 4,
	};
	useEffect(() => {
		setUserAddress(address);
	}, [isConnected]);
	const handleOpen = () => {
		setOpenModal(true);
	};
	const handleClose = () => {
		setOpenModal(false);
	};

	const result = async () => {
		const priorityFee = await callRpc('eth_maxPriorityFeePerGas');
		const signer: any = await fetchSigner();

		const gameContract = new ethers.Contract(
			REACT_APP_GAME_CONTRACT || '',
			gameAbi,
			signer
		);
		setLoading1(true);
		// check Person in queue
		const isPersonInQueue = await gameContract.isPersonInQueue(address, {
			//maxPriorityFeePerGas: priorityFee,
		});
		if (isPersonInQueue) {
			setAlertText('You are in queue, please wait till you get a match with a random player');
			setLoading1(false);
			handleOpen();
			setShowCancelButton(true);
			return;
		}
		setLoading(true);
		const userData = await gameContract.getPlayer(address, {
			//maxPriorityFeePerGas: priorityFee,
		});
		console.log('userData', userData);

		if (userData.lastBattleFought !== '' && userData.opponent !== '0x0000000000000000000000000000000000000000') {
			setLoading(false);
			const lastBattleFought = JSON.parse(userData.lastBattleFought);
			console.log(lastBattleFought);
			setGameResult(lastBattleFought ? 'You Won' : 'You Lost');
			setAlertText(lastBattleFought
				? 'You Won, to claim the reward you must burn your NFT.\nPlease Approve to burn the NFT'
				: 'You Lost, Your data will be deleted so you can play the next game.\nPlease Approve to burn the NFT')
			handleOpen();
			// declare the NFT contract
			const nftContract = new ethers.Contract(
				REACT_APP_NFT_CONTRACT || '',
				nftAbi,
				signer
			);
			if (lastBattleFought) {
				// call the burn function
				setLoading(true);
				await nftContract
					.burn(userData.tokenId, {
						//maxPriorityFeePerGas: priorityFee,
					})
					.then(async (tx: any) => {
						const reciept = await tx.wait();
						console.log('reciept of Burn---', reciept);
						if (reciept.status) {
							setLoading(false);
							// alert('NFT Burned Successfully, You can claim your reward now');
							setAlertText('NFT Burned Successfully, You can claim your reward now.\nPlease Approve to collect reward')
							handleOpen();
							// load the game contract function withdrawBetAmount
							await gameContract
								.withdrawBetAmount(address, {
									//maxPriorityFeePerGas: priorityFee,
								})
								.then(async (tx: any) => {
									setLoading(true);
									const reciept = await tx.wait();
									console.log('reciept of withdrawBetAmount---', reciept);
									if (reciept.status) {
										setLoading(false);
										setAlertText('Reward Claimed Successfully, Your data has been deleted successfully so can play the next game')
										handleOpen();
										setShowCancelButton(true);
									}
								});
						}
					});
			} else {

				await gameContract
					.deleteUser(address, {
						//maxPriorityFeePerGas: priorityFee,
					})
					.then(async (tx: any) => {
						setLoading(true);
						const reciept = await tx.wait();
						console.log('reciept of deletePlayer---', reciept);
						if (reciept.status) {
							setLoading(false);
							setAlertText('Your data has been deleted successfully')
							handleOpen();
							setShowCancelButton(true);
						}
					});
			}
			// load the game contract function deletePlayer
		} else {
			setLoading(false);
			setAlertText('You have not played any game yet, Please first participate in Duel')
			handleOpen();
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
						<Box >
							<Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
								{/* <img style={{ borderRadius: 10 }} src={gameResult === 'You Won' ? images.trophy : gameResult === 'You Lost' ? images.crying : images.checkResult} width={"45%"} height={"45%"} /> */}
								<img style={{ borderRadius: 10 }} src={images.checkResult} width={500} height={400} />
							</Box>
							<Box mt={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} >
								<Button
									onClick={() => { showCancelButton ? navigate('/') : result() }}
									variant="contained"
									color={'success'}
								>
									{showCancelButton ? "Play Again" : "Check Result"}
								</Button>
							</Box>
						</Box>
						{gameResult && (
							<Typography
								marginTop={2}
								color={colors.veryDarkBlue}
								fontWeight={'bold'}
								fontSize={fontSize.md}
							>
								{gameResult}
							</Typography>
						)}
					</Box>
				</Grid>
			</Grid>
			<Modal
				open={openModal}
				aria-labelledby="child-modal-title"
				aria-describedby="child-modal-description"
			>
				<Box alignContent={'center'} sx={{ ...style, width: '25%' }} borderRadius={2}>
					{loading ? <Box paddingY={1} flex={1} display={'flex'} flexDirection={'column'}>
						<Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
							<BounceLoader
								color={colors.desaturatedYellow}
								loading={loading}
								// loading={loading2}
								size={150}
							/>
						</Box>
						<Typography mt={1} color={colors.moderateRed} fontWeight={'bold'} fontSize={fontSize.md} textAlign={'center'}>
							Please wait
						</Typography>
					</Box> : <Box paddingY={1} flex={1} display={'flex'} flexDirection={'column'} >
						<Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
							{!loading1 ? <img src={images.fireWork} width={"45%"} height={"45%"} />
								: <PuffLoader
									color={colors.desaturatedYellow}
									loading={loading1}
									size={150}
								/>}
						</Box>
						<Box mt={1} bgcolor={colors.grayishYellow} borderRadius={1} p={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
							<Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm} textAlign={'center'}>
								{alertText}
							</Typography>
						</Box>
						{showCancelButton && <Box marginTop={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} >
							<Button onClick={() => handleClose()} variant="contained" color={'success'}>
								Cancel
							</Button>
						</Box>}
					</Box>}
				</Box>
			</Modal>
		</Grid>
	);
};

export default Result;