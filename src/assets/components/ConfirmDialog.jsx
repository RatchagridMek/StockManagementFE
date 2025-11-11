import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useEffect } from 'react';

export default function ConfirmDialog({ confirmModalToggle, setConfirmModalToggle, confirmText, onSubmit, buttonActionLoading, orderId }) {

    return (
        <Dialog open={confirmModalToggle} onClose={(current) => setConfirmModalToggle(!current)}>
            <DialogTitle fontWeight="bold">{confirmText}</DialogTitle>
            <DialogActions>
                <Button onClick={() => setConfirmModalToggle(!confirmModalToggle)} color="error" variant="contained">
                    ย้อนกลับ
                </Button>
                <Button onClick={() => {
                    onSubmit(orderId)
                }}
                    color="success"
                    variant="contained"
                    loading={buttonActionLoading}
                    loadingPosition="end"
                >
                    ยืนยัน
                </Button>
            </DialogActions>
        </Dialog>
    )
}