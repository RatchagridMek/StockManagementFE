import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
  Fade,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function OrderDetailModal({
  open,
  onClose,
  orderData,
  loading,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [order, setOrder] = useState({
    id: "",
    customerName: "",
    customerAddress: "",
    createdDate: "",
    totalPrice: "",
    deliveryFee: "",
    orderChannel: "",
    productList: [],
    giveawayList: [],
  });

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
    }
  }, [orderData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
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
        <Box sx={{ bgcolor: "background.default" }}>
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              color: "primary.main",
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: 2,
            }}
          >
            หมายเลขออเดอร์
            <Typography
              component="div"
              sx={{
                fontSize: isMobile ? "1rem" : "1.2rem",
                color: "text.primary",
                mt: 0.5,
                wordBreak: "break-all",
                fontWeight: 600,
              }}
            >
              {order.id}
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            {/* Customer Info */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: "background.paper",
              }}
            >
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  ข้อมูลลูกค้า
                </Typography>
                <Typography fontWeight="bold" variant="body1">
                  {order.customerName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-line", mt: 0.5, lineHeight: 1.6 }}
                >
                  {order.customerAddress}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ช่องทางสั่งซื้อ: <b>{order.orderChannel}</b>
                </Typography>
              </CardContent>
            </Card>

            {/* Product List */}
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}
            >
              รายการสินค้า
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                mb: 3,
                overflow: "hidden",
              }}
            >
              <Table size="small">
                <TableBody>
                  {order.productList.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          py: 1,
                          fontSize: isMobile ? "0.9rem" : "1rem",
                        }}
                      >
                        {product.productName} x {product.productAmount}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          py: 1,
                          fontWeight: 500,
                          fontSize: isMobile ? "0.9rem" : "1rem",
                        }}
                      >
                        {product.totalProductPrice} บาท
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Giveaway List */}
            {order.giveawayList.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}
                >
                  รายการของแถม
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    mb: 3,
                    overflow: "hidden",
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      {order.giveawayList.map((giveaway) => (
                        <TableRow key={giveaway.productId}>
                          <TableCell
                            sx={{
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              py: 1,
                              fontSize: isMobile ? "0.9rem" : "1rem",
                            }}
                          >
                            {giveaway.productName} x {giveaway.productAmount}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              py: 1,
                              fontSize: isMobile ? "0.9rem" : "1rem",
                            }}
                          >
                            {giveaway.totalProductPrice} บาท
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Total */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                ราคารวมทั้งหมด
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="success.main"
                sx={{ fontSize: isMobile ? "1rem" : "1.2rem" }}
              >
                {Number(order.totalPrice)} บาท
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={onClose}
                sx={{
                  px: isMobile ? 3 : 5,
                  py: 1,
                  borderRadius: 3,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  textTransform: "none",
                }}
              >
                เสร็จสิ้น
              </Button>
            </Box>
          </DialogContent>
        </Box>
      )}
    </Dialog>
  );
}
