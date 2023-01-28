import React from 'react'
import { Outlet } from 'react-router-dom';
import { Container, Grid, Box } from '@mui/material';


const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex', margin: 0, padding: 0 }}>
            {/* if any header is added in future */}
            <Container >
                <Grid container >
                    <Outlet />
                </Grid>
            </Container>
        </Box>
    )
}

export default MainLayout;