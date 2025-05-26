
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";


export default function CustomerListModal({ open, onClose, customerList, onSubmit }) {

    useEffect(() => {
        setCustomerData(customerList)
    }, [customerList]);

    const [searchText, setSearchText] = useState("");
    const [customerData, setCustomerData] = useState([]);

    const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };
      
      const filteredCustomers = customerData.filter((customer) => {
        const keyword = escapeRegex(searchText.trim());
        const regex = new RegExp(keyword, "i");
      
        return (
            regex.test(customer.name) || regex.test(customer.phone.replace(/-/g, ""))
        );
      });

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    px: 3,
                    pt: 3,
                }}
            >
                เลือกข้อมูลลูกค้า
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 1 }}>
                {/* Search Input */}
                <TextField
                    fullWidth
                    placeholder="ค้นหาชื่อลูกค้า..."
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{
                        mb: 2,
                        backgroundColor: '#f5f5f5',
                    }}
                />

                {/* Table Header */}
                <Box display="flex" justifyContent="space-between" px={1} pb={1}>
                    <Typography fontWeight={600} fontSize="0.95rem">
                        ชื่อ - เบอร์โทร
                    </Typography>
                </Box>

                {/* Customer Rows */}
                <Box
                    sx={{
                        maxHeight: 300,
                        overflowY: 'auto',
                        borderTop: '1px solid #eee',
                    }}
                >
                    {filteredCustomers.map((customer) => (
                        <Box
                            key={customer.id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            px={1}
                            py={1}
                            sx={{
                                borderBottom: '1px solid #f0f0f0',
                                '&:hover': {
                                    backgroundColor: '#f9f9f9',
                                },
                            }}
                        >
                            <Box>
                                <Typography>{customer.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {customer.phone}
                                </Typography>
                            </Box>
                            <StyledButton
                                variant="contained"
                                size="small"
                                onClick={() => onSubmit(customer)}
    >
                                เลือก
                            </StyledButton>
                        </Box>
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <StyledButton onClick={onClose} sx={{ textTransform: 'none' }} color="primary">
                    ยกเลิก
                </StyledButton>
            </DialogActions>
        </Dialog>




    )
}