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

export interface ProductRankingBoardStruct {
    rank: number;
    productName: string;
    totalSpend: number;
    productSaleAmount: number;
    productPrice: number;
}

export default function ProductRankingBoard({ rankingBoardData }: { rankingBoardData: ProductRankingBoardStruct[] }) {
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
                    5 อันดับสินค้าที่ทำยอดขายให้ร้านมากที่สุด
                </Typography>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="ranking board">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold' }}>ชื่อสินค้า</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>ปริมาณที่ขายได้ (ชิ้น)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>ราคาต่อหน่วย (บาท)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>คิดเป็นจำนวนเงิน (บาท)</TableCell>
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
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>{row.productName}</TableCell>
                                <TableCell align="center" sx={{ color: 'text.secondary' }}>{row.productSaleAmount}</TableCell>
                                <TableCell align="center" sx={{ color: 'text.secondary' }}>{row.productPrice.toFixed(2)}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                                    {row.totalSpend.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}