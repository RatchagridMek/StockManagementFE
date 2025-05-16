import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    styled,
    Grid
} from "@mui/material";
import { Delete, Close } from "@mui/icons-material";
import { useState } from "react";

const productList = [
    { id: 1, name: "เยลลี่รสชาติแอปเปิ้ล", category: "เยลลี่", stock: 20, price: 80 },
    { id: 2, name: "เยลลี่รสชาติส้ม", category: "เยลลี่", stock: 15, price: 80 },
    { id: 3, name: "คุกกี้กัญชารสมิ้น", category: "คุกกี้", stock: 5, price: 80 },
    { id: 4, name: "บราวนี่ช็อคโกแลต", category: "บราวนี่", stock: 10, price: 100 },
    { id: 5, name: "บราวนี่ส้ม", category: "บราวนี่", stock: 6, price: 100 },
    { id: 6, name: "บราวนี่กาแฟ", category: "บราวนี่", stock: 6, price: 100 },
    { id: 7, name: "คุกกี้กัญชารสช็อคโกแลต", category: "คุกกี้", stock: 10, price: 80 },
    { id: 8, name: "คุกกี้กัญชารสโอริโอ้", category: "คุกกี้", stock: 10, price: 80 },
    { id: 9, name: "คุกกี้กัญชารสลัมเลซิน", category: "คุกกี้", stock: 10, price: 80 }
];

const categories = ["ทั้งหมด", "เยลลี่", "คุกกี้", "บราวนี่"];

const StyledButton = styled(Button)(() => ({
    backgroundColor: "#3a3c41",
    color: "#fff",
    borderRadius: 10,
    padding: "6px 20px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
    "&:hover": {
        backgroundColor: "#2f3135"
    }
}));

export default function CreateOrderModal({ open, onClose }) {
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [saveCustomer, setSaveCustomer] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleCreateOrderClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        console.log("Order Submitted", { customerName, selectedProducts });
        setConfirmOpen(false);
        onClose();
    };


    const filteredProducts = productList.filter((p) => {
        const matchesCategory = selectedCategory === "ทั้งหมด" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSelectProduct = (product) => {
        if (!selectedProducts.find((p) => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (id, value) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, quantity: parseInt(value) || 0 } : p
            )
        );
    };

    const handleRemoveProduct = (id) => {
        setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const total = selectedProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleSubmit = () => {
        console.log("Order Submitted", { customerName, selectedProducts });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                สร้างออเดอร์ใหม่
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <TextField
                            fullWidth
                            label="ชื่อลูกค้า"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: "#3a3c41", borderRadius: 2 }}>
                        เลือกข้อมูลลูกค้า
                    </Button>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={saveCustomer}
                                onChange={(e) => setSaveCustomer(e.target.checked)}
                            />
                        }
                        label="บันทึกชื่อของลูกค้า"
                    />
                </Box>

                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    เพิ่มรายการสินค้า
                </Typography>

                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>

                <TextField
                    fullWidth
                    placeholder="ค้นหาชื่อสินค้า"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />


                <Table size="small" sx={{ mb: 3 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ชื่อสินค้า</TableCell>
                            <TableCell>จำนวนสินค้า(ชิ้น)</TableCell>
                            <TableCell>ราคาต่อหน่วย</TableCell>
                            <TableCell align="right">เลือก</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.price} บาท</TableCell>
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

                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    สรุปออเดอร์สินค้า
                </Typography>
                <Table size="small" sx={{ mb: 1 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>รายการสินค้า</TableCell>
                            <TableCell>จำนวน</TableCell>
                            <TableCell>ราคาต่อหน่วย</TableCell>
                            <TableCell>ราคารวม</TableCell>
                            <TableCell align="right">ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedProducts.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        inputProps={{ min: 1 }}
                                    />
                                </TableCell>
                                <TableCell>{item.price} บาท</TableCell>
                                <TableCell>{item.price * item.quantity} บาท</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleRemoveProduct(item.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Typography align="right" fontWeight="bold">
                    ราคารวม {total.toLocaleString()} บาท
                </Typography>
            </DialogContent>

            <DialogActions>
                <StyledButton onClick={handleCreateOrderClick}>สร้างออเดอร์</StyledButton>
            </DialogActions>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle fontWeight="bold">สรุปออเดอร์</DialogTitle>
                <DialogContent dividers>
                    <Typography>ชื่อลูกค้า: <b>{customerName || "ไม่ระบุ"}</b></Typography>
                    <Table size="small" sx={{ mt: 2 }}>
                        <TableBody>
                            {selectedProducts.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name} x {item.quantity}</TableCell>
                                    <TableCell align="right">
                                        {item.price * item.quantity} บาท
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>ราคารวม</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                    {total.toLocaleString()} บาท
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="error" variant="contained">
                        ยกเลิกการสร้างออเดอร์
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="success" variant="contained">
                        ยืนยันการสร้างออเดอร์
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}
