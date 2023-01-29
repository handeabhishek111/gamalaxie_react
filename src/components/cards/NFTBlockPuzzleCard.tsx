import { Card, CardMedia, CardContent, Typography, CardActions, Button, Grid, Box } from '@mui/material';
import React from 'react';
import { colors } from '../../store/colors';

interface dataProps {
    cardTitle: string;
    cardDescription: string;
    image: string;
    score: number;
    tokenId: number;
}

interface data {
    data: dataProps;
    getTokenData: CallableFunction;
}


const NFTBlockPuzzleCard = ({ data, getTokenData }: data) => {
    return (
        <Grid maxWidth={'calc(25 % - 30px)'} item lg={4} xl={4} md={4} sm={12}>
            <Card onClick={() => { getTokenData(String(data?.tokenId), String(data?.score)) }} style={{ padding: 10, margin: 4 }
            } variant="outlined" >
                <CardMedia
                    component="img"
                    height="220"
                    image={data?.image}
                    alt={data?.cardTitle}
                />
                <CardContent >
                    <Typography gutterBottom variant="h5" component="div">
                        {data?.cardTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data?.cardDescription}
                    </Typography>
                    <Box display={'flex'} marginTop={2} justifyContent={'space-between'} flex={1} alignItems={'center'} flexDirection={'row'}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Score
                            </Typography>
                            <Typography color={colors.moderateRed} variant="subtitle1">
                                {data?.score}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Token
                            </Typography>
                            <Typography color={colors.desaturatedYellow} variant="subtitle1">
                                {data?.tokenId}
                            </Typography>
                        </Box>
                    </Box>

                </CardContent>
            </Card >
        </Grid >
    )
}

export default NFTBlockPuzzleCard;