import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Select,
    MenuItem,
    Button,
    TextField,
    Box,
    FormControl,
    styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CircularProgress from '@mui/material/CircularProgress';

// Styled button to match dark rounded style
const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#3a3c41',
    color: '#fff',
    borderRadius: 10,
    padding: '6px 20px',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    '&:hover': {
        backgroundColor: '#2f3135',
    },
}));

// Styled dialog to match rounded border
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 12,
        border: '2px solid #2196f3',
        padding: theme.spacing(2),
    },
}));

export default function AddStockModal({ open, onClose, onSubmit, loading }) {
    const [items, setItems] = useState([{ product: '', quantity: '' }]);

    const sampleProducts = [
        'เยลลี่รสชาติแอปเปิ้ล',
        'คุกกี้กลิ่นช็อกโกแลต',
        'เยลลี่รสชาติองุ่น',
        'คุกกี้กลิ่นชาเขียว',
    ];

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { product: '', quantity: '' }]);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                เพิ่มสต็อกสินค้า
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ fontWeight: 'bold', mb: 2 }}>รายการสินค้า</Typography>

                {items.map((item, index) => (
                    <Box key={index} display="flex" gap={2} alignItems="center" mb={2}>
                        <FormControl fullWidth>
                            <Select
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                displayEmpty
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 2,
                                    height: '45px',
                                }}
                            >
                                <MenuItem value="" disabled>
                                    เลือกรายการสินค้า
                                </MenuItem>
                                {sampleProducts
                                    .filter(
                                        (product) =>
                                            // Show if not selected OR it's the current row's product
                                            !items.some((it, i) => i !== index && it.product === product)
                                    )
                                    .map((product) => (
                                        <MenuItem key={product} value={product}>
                                            {product}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <TextField
                            placeholder="ระบุจำนวน(ชิ้น)"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            sx={{
                                width: '250px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: 2,
                                '& input': { padding: '10px' },
                            }}
                        />

                        <IconButton onClick={() => handleRemoveItem(index)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ))}

                <Box display="flex" alignItems="center" gap={1} mt={1} mb={3}>
                    <StyledButton
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddItem}
                        sx={{ backgroundColor: '#4CAF50' }}
                    >
                        เพิ่มสินค้า
                    </StyledButton>
                </Box>

                <Box display="flex" justifyContent="flex-end">
                    <StyledButton variant="contained" loading={loading} loadingPosition="end" onClick={() => onSubmit(items)}>
                        เพิ่มสต๊อก
                    </StyledButton>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
}
