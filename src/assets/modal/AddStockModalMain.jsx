import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

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

export default function AddStockModalMain({ open, onClose, onSubmit, loading, categoryList, productList }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts =
    (selectedCategory === ""
        ? productList
        : productList.filter((p) => p.categoryId === selectedCategory)
    ).filter((p) => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelectProduct = (product) => {
        if (!selectedProducts.find((p) => p.id === product.id)) {
            setSelectedProducts([
                ...selectedProducts,
                { ...product, quantity: "" },
            ]);
        }
    };

    const handleQuantityChange = (id, value) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, quantity: value } : p
            )
        );
    };

    const handleRemoveProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.filter((p) => p.id !== id)
        );
    };

    const handleSubmit = () => {
        // Do something with selectedProducts
        console.log("Submitting stock updates:", selectedProducts);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                เพิ่มสต็อกสินค้า
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    เลือกหมวดหมู่สินค้า
                </Typography>
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    {categoryList.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
                <Typography variant="subtitle2">
                    ค้นหาสินค้า
                </Typography>
                <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="พิมพ์ชื่อสินค้า..."
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <Typography variant="subtitle3" sx={{ mb: 1 }}>
                    รายการสินค้า
                </Typography>
                <Table size="small" sx={{ mb: 4 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ชื่อสินค้า</TableCell>
                            <TableCell>จำนวนคงเหลือ</TableCell>
                            <TableCell align="right">เลือก</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.productAmount}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSelectProduct(product)}
                                        disabled={selectedProducts.some((p) => p.id === product.id)}
                                        sx={{
                                            backgroundColor: "#3A3C41",
                                            color: "#FFFFFF",
                                            "&:hover": {
                                                backgroundColor: "#5D6270"
                                            }
                                        }}
                                    >
                                        เลือก
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Typography variant="subtitle4" sx={{ mb: 1 }}>
                    สินค้าที่เลือกไว้
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ชื่อสินค้า</TableCell>
                            <TableCell>จำนวนที่เพิ่ม</TableCell>
                            <TableCell align="right">ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={product.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(product.id, e.target.value)
                                        }
                                        inputProps={{ min: 0 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleRemoveProduct(product.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>

            <DialogActions>
                <StyledButton variant="contained" loading={loading} loadingPosition="end" onClick={() => onSubmit(selectedProducts)}>
                    เพิ่มสต๊อก
                </StyledButton>
            </DialogActions>
        </Dialog>
    );
}
