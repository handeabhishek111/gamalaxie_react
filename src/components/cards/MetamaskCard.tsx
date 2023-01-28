import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images } from '../../store/commonUtils';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'
import MetamaskButton from '../buttons/MetamaskButton';

const MetamaskCard = () => {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    useEffect(() => {
        (!isConnected) && connect();
    }, [isConnected])
    return (
        <Box flexDirection={'row'} display='flex' justifyContent={'space-between'} alignItems={'center'} borderRadius={3} bgcolor={colors.grayishYellow} padding={2} marginTop={1}>
            <Box flexDirection={'row'} display='flex' alignItems={'center'}>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="outlined"
                    size="small"
                    value={address ? address : ''}
                    autoComplete='false'
                    disabled
                />
                <Typography color={colors.veryDarkBlue} marginLeft={2} paddingRight={1} fontSize={fontSize.sm}>
                    Connected Wallet
                </Typography>
            </Box>
            <MetamaskButton />
        </Box>
    )
}

export default MetamaskCard;