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

export default function UpdateProductModal({ open, onClose, onSubmit, updateLoading, updateForm, categoryList }) {

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    costPrice: '',
    salePrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'left', fontWeight: 'bold', fontSize: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        แก้ไขสินค้า
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
              label="ชื่อสินค้า"
              value={form.name}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item size={12}>
            <TextField
              fullWidth
              name="description"
              label="รายละเอียดสินค้า"
              value={form.description}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* หมวดหมู่สินค้า */}
          <Grid item size={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">หมวดหมู่ของสินค้า</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={form.category}
                onChange={handleChange}
                label="หมวดหมู่ของสินค้า"
              >
                {categoryList.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* ราคาต้นทุน / ราคาขาย */}
          <Grid item size={6}>
            <TextField
              fullWidth
              name="costPrice"
              label="ราคาต้นทุนสินค้า (บาท)"
              value={form.costPrice}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item size={6}>
            <TextField
              fullWidth
              name="salePrice"
              label="ราคาขายสินค้า (บาท)"
              value={form.salePrice}
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
              loading={updateLoading}
              loadingPosition="end"
              onClick={() => {
                onSubmit(form)
              }}
            >
              แก้ไขสินค้า
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
