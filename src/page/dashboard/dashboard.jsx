
import { Box, Grid, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useState } from 'react';
import MainGrid from '../../assets/components/MainGrid';

const getCurrentThaiDate = () => {
    const now = new Date();
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    const dateTimeFormat = new Intl.DateTimeFormat('th-TH', options);
    return dateTimeFormat.format(now);
  };

export default function Dashboard() {

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

                    <Grid container spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                        <Grid item xs>
                            <Typography color="black" variant="h4">
                                Dashboard
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="text.secondary">
                                {getCurrentThaiDate()}
                            </Typography>
                        </Grid>
                    </Grid>

                </Box>
            </Box>
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2}}>
                <MainGrid />
            </Paper>
        </div>
    )
}