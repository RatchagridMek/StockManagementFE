import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTheme } from '@mui/material/styles';

export interface CustomerRankingBoardStruct {
    rank: number;
    customerPhone: string;
    customerName: string;
    totalIncome: number;
    spendingAmount: number;
}

export default function CustomerRankingBoard({ rankingBoardData }: { rankingBoardData: CustomerRankingBoardStruct[] }) {
    const theme = useTheme();

    const getRankStyles = (rank: number) => {
        let style = {};
        if (rank === 1) {
            style = { fontWeight: 'bold', color: '#FFD700', fontSize: '1.2em' }; // Gold
        } else if (rank === 2) {
            style = { fontWeight: 'bold', color: '#C0C0C0', fontSize: '1.2em' }; // Silver
        } else if (rank === 3) {
            style = { fontWeight: 'bold', color: '#CD7F32', fontSize: '1.2em' }; // Bronze
        }
        return style;
    };

    return (
        <Card variant="outlined" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h5" component="h5" sx={{ fontWeight: 600 }}>
                    <AutoAwesomeIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                    5 อันดับลูกค้าที่ทำกำไรให้ร้านมากที่สุด
                </Typography>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="ranking board">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>ชื่อลูกค้า</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>เบอร์โทรศัพท์</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>กำไรที่ได้ (บาท)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>ยอดซื้อของลูกค้า (บาท)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rankingBoardData.map((row) => (
                            <TableRow
                                key={row.rank}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    backgroundColor: row.rank % 2 === 0 ? theme.palette.action.hover : 'inherit'
                                }}
                            >
                                <TableCell component="th" scope="row" align="center" sx={getRankStyles(row.rank)}>
                                    {row.rank}
                                </TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>{row.customerName}</TableCell>
                                <TableCell align="center" sx={{ color: 'text.secondary' }}>{row.customerPhone}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                                    {row.totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                                    {row.spendingAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}