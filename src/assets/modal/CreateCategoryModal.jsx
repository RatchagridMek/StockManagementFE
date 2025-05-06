import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CreateCategoryModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'left', fontWeight: 'bold', fontSize: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        สร้างหมวดหมู่สินค้าใหม่
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
            {/* # free spacing block */}
          <div sx={{ display: 'block' }}></div>
          {/* ชื่อสินค้า / รายละเอียด */}
          <Grid item size={12}>
            <TextField
              fullWidth
              name="name"
              label="ชื่อหมวดหมู่"
              value={form.name}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* Submit Button */}
          <Grid size={{ xs: 'grow', md: 6 }} offset={{ md: 3 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#3a3d45',
                px: 4,
                py: 1,
                fontWeight: 'bold',
                borderRadius: 2,
              }}
              loading={loading}
              loadingPosition="end"
              onClick={() => onSubmit(form)}
            >
              เพิ่มหมวดหมู่
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
