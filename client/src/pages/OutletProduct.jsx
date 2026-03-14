import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../utils/api';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../utils/apiUrl';
import { AuthContext } from '../context/AuthContext';
export default function OutletProducts() {
  const [outletProducts, setOutletProducts] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  console.log('wala', outletProducts);

  const [form, setForm] = useState({
    outlet_id: '',
    product_id: '',
    outlet_price: '',
    stock: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [opRes, masterRes, outletRes] = await Promise.all([
        api.get('/api/outlet-products'),
        api.get('/api/products'),
        api.get('/api/outlets'),
      ]);
      setOutletProducts(opRes.data.data || []);
      setMasterItems(masterRes.data.data || []);
      setOutlets(outletRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      product_id: Number(form.product_id),
      outlet_id: Number(form.outlet_id),
      price: Number(form.outlet_price),
      stock_quantity: Number(form.stock),
      min_stock_level: 5,
      created_by: Number(user?.id),
    };

    try {
      await api.post('/api/outlet-products', payload);
      alert('Product Assigned Successfully!');
      setOpen(false);
      fetchData();
      setForm({
        outlet_id: '',
        product_id: '',
        outlet_price: '',
        stock: 0,
      });
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || 'Validation failed');
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to remove this product from the outlet?'
      )
    ) {
      try {
        await api.delete(`/api/outlet-products/${id}`);
        alert('Product removed from outlet successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting outlet product:', error);
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };
  return (
    <Box sx={{ padding: '24px' }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Outlet Products & Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Assign to Outlet
        </Button>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Outlet</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Override Price</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {outletProducts?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.outlet?.name}</TableCell>
                    <TableCell>
                      <b>{item.product?.name}</b>
                    </TableCell>

                    <TableCell>৳{item.price || 0}</TableCell>

                    <TableCell>
                      <Typography
                        color={item.stock_quantity < 10 ? 'error' : 'inherit'}
                      >
                        {item.stock_quantity ?? 0}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {item.user?.name || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Assign Master Item to Outlet</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                select
                label="Select Outlet"
                fullWidth
                required
                value={form.outlet_id}
                onChange={(e) =>
                  setForm({ ...form, outlet_id: e.target.value })
                }
              >
                {outlets.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Select Master Product"
                fullWidth
                required
                value={form.product_id}
                onChange={(e) => {
                  const p = masterItems.find((x) => x.id === e.target.value);
                  setForm({
                    ...form,
                    product_id: e.target.value,
                    outlet_price: p?.base_price,
                  });
                }}
              >
                {masterItems.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Outlet Specific Price"
                type="number"
                fullWidth
                required
                value={form.outlet_price}
                inputProps={{ min: 0, step: '0.01' }}
                onChange={(e) =>
                  setForm({ ...form, outlet_price: e.target.value })
                }
              />

              <TextField
                label="Initial Stock"
                type="number"
                fullWidth
                required
                value={form.stock}
                inputProps={{ min: 0 }}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Confirm Assignment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
