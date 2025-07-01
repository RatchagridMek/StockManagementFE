
import { Box, Grid, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useState } from 'react';
import MainGrid from '../../assets/components/MainGrid';

export default function dashboard() {

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >

                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item size={6}>
                            <Typography color="black" variant="h4" gutterBottom>
                                Dashboard
                            </Typography>
                        </Grid>
                    </Grid>

                </Box>
            </Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <MainGrid/>
            </Paper>
        </div>
    )
}