import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    CircularProgress,
    Fade,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";


export default function OrderDetailModal({ open, onClose, orderData, loading, setLoading, setNotificationPopup, setNotificationType, setNotificationMessage, customerProfile }) {

    useEffect(() => {
        if (orderData) {
            setOrder(orderData)
            if (Number(orderData.deliveryFee) > 0) setShippingMode("done")
            else if (orderData.deliveryFee === "Free") setShippingMode("done")
            else if (Number(orderData.deliveryFee) === 0) setShippingMode("none")
            else setShippingMode("input")
        }
    }, [orderData]);

    const [shippingMode, setShippingMode] = useState(""); // none | input | done
    const [order, setOrder] = useState({
        id: '',
        customerName: '',
        createdDate: '',
        totalPrice: '',
        deliveryFee: '',
        orderChannel: '',
        productList: [{
            productId: '',
            productName: '',
            productAmount: '',
            totalProductPrice: ''
        }],
        giveawayList: [{
            productId: '',
            productName: '',
            productAmount: '',
            totalProductPrice: ''
        }]
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 24,
        borderRadius: 2,
        p: 3
    }

    const parsedShipping = Number(order.deliveryFee) || 0;

    const handleAddShippingClick = () => setShippingMode("input");

    async function fetchOrderById(orderId) {
        axios.post("http://localhost:8000/api/v1/order/get", {
            orderId: orderId
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((data) => {
                let response = data.data.data
                setOrder(response)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
            });
    }

    const handleConfirmShipping = () => {
        setLoading(true)
        if (!isNaN(parsedShipping)) {
            setShippingMode("done");
            axios.post("http://localhost:8000/api/v1/order/updateRideFee", {
                orderId: orderData.id,
                rideFee: parsedShipping == 0 ? "Free" : String(parsedShipping)
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then((data) => {
                    onClose()
                    setNotificationPopup(true)
                    setNotificationType("success")
                    setNotificationMessage("อัปเดตค่าจัดส่งสำเร็จค่ะ")
                    fetchOrderById(orderData.id)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error("Fetch error:", error)
                    setNotificationPopup(true)
                    setNotificationType("error")
                    setNotificationMessage("อัปเดตค่าจัดส่งไม่สำเร็จค่ะ")
                    setLoading(false)
                });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {loading ? (
                <Fade in={loading}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="300px"
                    >
                        <CircularProgress size={40} />
                        <Typography mt={2} fontSize="1rem" color="textSecondary">
                            กำลังโหลดข้อมูลออเดอร์...
                        </Typography>
                    </Box>
                </Fade>
            ) : (
                <Box>
                    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {/* รายละเอียด {order.id.slice(order.id.length - 5) + order.createdDate.replaceAll("/", "")} */}
                        หมายเลขออเดอร์ {order.id}
                    </DialogTitle>
                    <DialogContent sx={{ fontSize: '1rem' }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography fontWeight="medium" fontSize="1rem">ชื่อลูกค้า</Typography>
                            <Typography fontSize="1rem">{order.customerName}</Typography>
                        </Box>
2
                        <Box display="flex" justifyContent="space-between" mb={1} mt={2}>
                            <Typography fontWeight="bold" fontSize="1rem">ช่องทางสั่งซื้อ</Typography>
                            <Typography fontSize="1rem">{order.orderChannel}</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1} mt={2}>
                            <Typography fontWeight="bold" fontSize="1rem">รายการสินค้า</Typography>
                            <Typography fontWeight="bold" fontSize="1rem">ราคา (บาท)</Typography>
                        </Box>

                        <TableContainer component="div" sx={{ my: 1 }}>
                            <Table size="small">
                                <TableBody>
                                    {order.productList.map((product) => (
                                        <TableRow key={product.productId}>
                                            <TableCell sx={{ borderBottom: 'none', py: 0.5, fontSize: '1rem' }}>
                                                {product.productName} x {product.productAmount}
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: 'none', py: 0.5, fontSize: '1rem' }}>
                                                {product.totalProductPrice} บาท
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box display="flex" justifyContent="space-between" mb={1} mt={2}>
                            <Typography fontWeight="bold" fontSize="1rem">รายการของแถม</Typography>
                            <Typography fontWeight="bold" fontSize="1rem">ราคา (บาท)</Typography>
                        </Box>

                        <TableContainer component="div" sx={{ my: 1 }}>
                            <Table size="small">
                                <TableBody>
                                    {order.giveawayList.map((giveaway) => (
                                        <TableRow key={giveaway.productId}>
                                            <TableCell sx={{ borderBottom: 'none', py: 0.5, fontSize: '1rem' }}>
                                                {giveaway.productName} x {giveaway.productAmount}
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: 'none', py: 0.5, fontSize: '1rem' }}>
                                                {giveaway.totalProductPrice} บาท
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography fontWeight="medium" fontSize="1rem">ราคาสินค้ารวม</Typography>
                            <Typography fontWeight="medium" fontSize="1rem">{order.totalPrice} บาท</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography fontWeight="medium" fontSize="1rem">ราคาค่าจัดส่ง</Typography>
                            <Box>
                                {
                                    (order.deliveryFee === "Free" && shippingMode !== "input") && (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography fontSize="1rem">ไม่มีค่าจัดส่ง</Typography>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<EditIcon />}
                                                onClick={() => setShippingMode("input")}>
                                                แก้ไข
                                            </Button>
                                        </Box>
                                    )
                                }
                                {(parsedShipping === 0 && shippingMode !== "input" && order.deliveryFee !== "Free") && (
                                    <Typography fontSize="1rem">ยังไม่ได้เพิ่มค่าจัดส่ง</Typography>

                                )}
                                {shippingMode === "input" && (
                                    <TextField
                                        size="small"
                                        placeholder="ราคาค่าจัดส่ง"
                                        value={parsedShipping}
                                        onChange={(e) => setOrder({ ...order, deliveryFee: e.target.value })}
                                        sx={{ width: 100 }}
                                    />
                                )}
                                {(parsedShipping > 0 && shippingMode !== "input") && (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography fontSize="1rem">{parsedShipping} บาท</Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => setShippingMode("input")}>
                                            แก้ไข
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography fontWeight="bold" fontSize="1.1rem">ราคารวม</Typography>
                            <Typography fontWeight="bold" fontSize="1.1rem">
                                {Number(order.totalPrice) + parsedShipping} บาท
                            </Typography>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            {(parsedShipping === 0 && shippingMode === "none") && (
                                <Button variant="contained" color="warning" onClick={handleAddShippingClick}>
                                    เพิ่มราคาค่าจัดส่ง
                                </Button>
                            )}
                            {shippingMode === "input" && (
                                <Button variant="contained" color="success" onClick={handleConfirmShipping}>
                                    ยืนยัน
                                </Button>
                            )}
                            {(shippingMode === "done" || shippingMode === "none") && (
                                <Button onClick={onClose} variant="contained" color="success">
                                    เสร็จสิ้น
                                </Button>
                            )}
                        </Box>
                    </DialogContent>
                </Box>
            )}
        </Dialog>

    );
};
