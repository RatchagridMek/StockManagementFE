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
    Grid,
} from "@mui/material";
import { Delete, Close } from "@mui/icons-material";
import { useState } from "react";
import CustomerListModal from "./CustomerListModal";

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

export default function CreateOrderModal({ open, onClose, customerList, productList, categoryList, onSubmit, loading, setLoading }) {
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [saveCustomer, setSaveCustomer] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCustomerImported, setIsCustomerImported] = useState(false);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleCreateOrderClick = () => {
        setLoading(true)
        setConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        setConfirmOpen(false);
        onSubmit(customerName, customerPhone, saveCustomer, selectedProducts)
        handleClearModal()
    };

    const handleClearModal = () => {
        handleClearForm()
        setSelectedCategory("ทั้งหมด");
        setSelectedProducts([]);
        setSearchTerm("");
        setCustomerModalOpen(false);
        setConfirmOpen(false);
    }

    const handleClearForm = () => {
        setCustomerName("");
        setCustomerPhone("");
        setIsCustomerImported(false);
    }

    const handleSubmitCustomer = (customer) => {
        setCustomerModalOpen(false);
        setCustomerName(customer.name);
        setCustomerPhone(customer.phone);
        setIsCustomerImported(true);
    }


    const filteredProducts = productList.filter((p) => {
        const matchesCategory = selectedCategory === "ทั้งหมด" || p.categoryId === selectedCategory;
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
                            disabled={isCustomerImported}
                            onChange={(e) => setCustomerName(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <TextField
                            fullWidth
                            label="เบอร์โทรศัพท์ลูกค้า"
                            value={customerPhone}
                            disabled={isCustomerImported || !saveCustomer}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                        <Button variant="contained" onClick={() => setCustomerModalOpen(true)} sx={{ backgroundColor: "#3a3c41", borderRadius: 2 }}>
                            เลือกข้อมูลลูกค้า
                        </Button>
                        <Button variant="contained" onClick={() => handleClearForm()} sx={{ backgroundColor: "#3a3c41", borderRadius: 2, ml: 1 }}>
                            เคลียร์ข้อมูลลูกค้า
                        </Button>
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={saveCustomer}
                                disabled={isCustomerImported}
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
                    {categoryList.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
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
                                <TableCell>{product.amount} ชิ้น</TableCell>
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
                <StyledButton loading={loading} disabled={loading} loadingPosition="end" onClick={handleCreateOrderClick}>สร้างออเดอร์</StyledButton>
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
            <CustomerListModal onSubmit={handleSubmitCustomer} open={customerModalOpen} customerList={customerList} onClose={(current) => setCustomerModalOpen(!current)} />
        </Dialog>
    );
}
