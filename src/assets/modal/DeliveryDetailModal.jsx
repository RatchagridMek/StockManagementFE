import React, { useEffect, useState } from "react";
import {
    Box,
    Modal,
    Typography,
    Grid,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Divider,
    Paper,
    Chip,
    Fade,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import axios from "axios";

const DeliveryDetailModal = ({ open, handleClose, data, setError }) => {

    useEffect(() => {
        setStatus(data.deliveryStatus)
    }, [data])

    const [status, setStatus] = useState(data.deliveryStatus);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSave = (orderId) => {
        if (data.deliveryStatus !== status) {
            axios.post("http://localhost:8000/api/v1/delivery/update/status", {
                "orderId": orderId,
                "deliveryStatus": status
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(() => {
                setError(false)
                handleClose("", "");
            }).catch(() => {
                setError(true)
                handleClose("", "")
            })
        } else {
            // close without doing any action
            document.getElementById("closeBTN").click()
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "warning";
            case "OUT_FOR_DELIVERY":
                return "info";
            case "DELIVERED":
                return "success";
            case "CANCELLED":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Fade in={open}>
                <Box
                    component={Paper}
                    elevation={8}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 550,
                        maxWidth: "95%",
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        p: 4,
                        outline: "none",
                    }}
                >
                    {/* Header */}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2.5}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <LocalShippingOutlinedIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                                รายละเอียดการจัดส่ง
                            </Typography>
                        </Box>
                        <Chip
                            label={data.deliveryCompany}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 2, color: "text.secondary" }}
                    >
                        หมายเลขจัดส่ง: {data.deliveryId}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Delivery Info */}
                    <Box
                        sx={{
                            backgroundColor: "#fafafa",
                            borderRadius: 2,
                            p: 2.5,
                            mb: 3,
                        }}
                    >
                        <Grid container spacing={1.5}>
                            <Grid item xs={5}>
                                <Typography variant="body2" color="text.secondary">
                                    หมายเลขออเดอร์
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography variant="body2">{data.orderId}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1.5}>
                            <Grid item xs={5}>
                                <Typography variant="body2" color="text.secondary">
                                    ราคาค่าจัดส่ง
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography variant="body2">{data.deliveryFee} บาท</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1.5}>
                            <Grid item xs={5}>
                                <Typography variant="body2" color="text.secondary">
                                    ประเภทการจัดส่ง
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography variant="body2">{data.deliveryType}</Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography variant="body2" color="text.secondary">
                                    วันที่จัดส่ง
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography variant="body2">{data.deliveryDate}</Typography>
                            </Grid>
                        </Grid>

                    </Box>

                    {/* Status */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            สถานะการจัดส่ง
                        </Typography>
                        <FormControl fullWidth size="small">
                            <InputLabel>เลือกสถานะ</InputLabel>
                            <Select
                                value={status}
                                label="เลือกสถานะ"
                                onChange={handleStatusChange}
                            >
                                <MenuItem value="PENDING">🕒 รอดำเนินการ</MenuItem>
                                <MenuItem value="OUT_FOR_DELIVERY">🚚 กำลังจัดส่ง</MenuItem>
                                <MenuItem value="DELIVERED">✅ จัดส่งสำเร็จ</MenuItem>
                                <MenuItem value="CANCELLED">❌ ยกเลิก</MenuItem>
                            </Select>
                        </FormControl>

                        <Box mt={1.5}>
                            <Chip
                                label={status}
                                color={getStatusColor(status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>
                    </Box>

                    {/* Dates */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={5}>
                                <Typography variant="body2" color="text.secondary">
                                    วันที่สร้างข้อมูล
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography variant="body2">{data.createdDate}</Typography>
                            </Grid>


                        </Grid>
                        <Grid container spacing={1.5}>
                            <Grid item xs={5}>
                                <Typography variant="body2" color="text.secondary">
                                    วันที่อัปเดตล่าสุด
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography variant="body2">{data.updatedDate}</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Footer */}
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="flex-end" gap={1.5}>
                        <Button variant="outlined" id="closeBTN" onClick={handleClose}>
                            ปิด
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ px: 3 }}
                            onClick={() => handleSave(data.orderId)}
                        >
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal >
    );
};

export default DeliveryDetailModal;
