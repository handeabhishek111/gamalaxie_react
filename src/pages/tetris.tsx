import React from 'react';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { gridSpacing, fontSize, colors, images } from '../store/commonUtils';
import MetamaskCard from '../components/cards/MetamaskCard';

const SlidingBlockPuzzle = () => {
    return (
        <Grid md={12}>
            <Grid item xs={12}>
                <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.lg} alignItems={'flex-start'}>
                    Tetris
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <MetamaskCard />
                <Grid item xs={12}>
                    <Box borderRadius={3} bgcolor={colors.grayishYellow} paddingY={2} paddingX={2} marginTop={1}>
                        <Typography color={colors.veryDarkBlue} fontWeight={'bold'} fontSize={fontSize.sm}>
                            Tetris
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SlidingBlockPuzzle; 