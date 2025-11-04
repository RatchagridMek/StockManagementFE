import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CreateDeliveryModal({ open, onClose, onSubmit, loading, categoryList, deliveryTypeList }) {

  const dateFormat = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format
  }

  const defaultForm = {
    orderId: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryFee: '',
    deliveryType: '',
    deliveryCompany: '',
  }

  const [form, setForm] = useState(defaultForm);

  function onHandleSubmit(form) {
    setForm(defaultForm)
    onSubmit(form)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'left', fontWeight: 'bold', fontSize: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        สร้างการจัดส่งใหม่
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
              name="orderId"
              label="หมายเลขออเดอร์"
              value={form.orderId}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item size={12}>
            <TextField
              fullWidth
              name="deliveryAddress"
              label="รายละเอียดที่อยู่การจัดส่ง"
              value={form.deliveryAddress}
              onChange={handleChange}
              variant="outlined"
              multiline
              maxRows={6}
            />
          </Grid>

          <Grid item size={12}>
            <TextField
              fullWidth
              name="deliveryDate"
              label="วันที่คาดว่าจะจัดส่ง รูปแบบ (DD/MM/YYYY HH-MM)"
              value={form.deliveryDate ? form.deliveryDate : new Date().toLocaleString('en-GB', dateFormat).replace(',', '')}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item size={12}>
            <TextField
              fullWidth
              name="deliveryFee"
              label="ราคาค่าจัดส่ง (บาท)"
              value={form.deliveryFee}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item size={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">ประเภทการจัดส่ง</InputLabel>
              <Select
                labelId="category-label"
                name="deliveryType"
                value={form.deliveryType}
                onChange={handleChange}
                label="ประเภทการจัดส่ง"
              >
                {deliveryTypeList.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">บริษัทขนส่ง</InputLabel>
              <Select
                labelId="category-label"
                name="deliveryCompany"
                value={form.deliveryCompany}
                onChange={handleChange}
                label="บริษัทขนส่ง"
              >
                {categoryList.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              onClick={() => onHandleSubmit(form)}
            >
              เพิ่มสินค้า
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
