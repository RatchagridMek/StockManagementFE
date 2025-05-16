
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

export default function ConfirmActionModel({ open, onClose, type }) {
    return (
        <Dialog open={open} onClose={() => onClose(false)}>
                <DialogTitle fontWeight="bold">{type === "delete" ? "คุณต้องการที่จะลบสินค้าใช่หรือไม่ ?" : "คุณต้องการที่จะกู้คืนสินค้าใช่หรือไม่ ?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => onClose(false)} color="error" variant="contained">
                        ยกเลิก
                    </Button>
                    <Button onClick={() => onClose(true)} color="success" variant="contained">
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
    )
}