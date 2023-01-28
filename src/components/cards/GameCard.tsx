import { Card, CardMedia, CardContent, Typography, CardActions, Button, Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface dataProps {
    gameTitle: string;
    gameDescription: string;
    image: string;
    navigateTo: string;
}

interface data {
    data: dataProps;
}

const GameCard = ({ data }: data) => {
    const navigate = useNavigate();
    return (
        <Grid maxWidth={'calc(25 % - 30px)'} item lg={4} xl={4} md={4} sm={12}>
            <Card style={{ padding: 10, margin: 4 }
            } variant="outlined" >
                <CardMedia
                    component="img"
                    height="220"
                    image={data?.image}
                    alt={data?.gameTitle}
                />
                <CardContent >
                    <Typography gutterBottom variant="h5" component="div">
                        {data?.gameTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data?.gameDescription}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => { navigate(data?.navigateTo) }} variant="contained" color="primary" size="small">Play</Button>
                </CardActions>
            </Card >
        </Grid >
    )
}

export default GameCard;