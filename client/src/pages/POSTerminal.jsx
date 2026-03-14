import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../utils/api';
import {
  Grid,
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
  MenuItem,
  IconButton,
  Divider,
  Stack,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { API_URL } from '../utils/apiUrl';
import { AuthContext } from '../context/AuthContext';

export default function POSTerminal() {
  const { user } = useContext(AuthContext);

  const isSuperAdmin = user?.role?.name === 'SUPERADMIN';
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutletId, setSelectedOutletId] = useState(
    user?.outlet_id || ''
  );

  const fetchData = async () => {
    if (!selectedOutletId) return;

    try {
      const [pRes, cRes] = await Promise.all([
        api.get(`/api/outlet-products?outlet_id=${selectedOutletId}`),
        api.get(`/api/customers?outlet_id=${selectedOutletId}`),
      ]);
      setProducts(pRes.data.data || []);
      setCustomers(cRes.data.data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };
  useEffect(() => {
    if (user?.role?.name === 'SUPERADMIN') {
      api
        .get('/api/outlets')
        .then((res) => setOutlets(res.data.data || []))
        .catch((err) => console.error('Outlet Fetch Error:', err));
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [selectedOutletId]);

  // 2. Cart Logic
  const addToCart = (product) => {
    if (product.stock_quantity <= 0) return alert('Out of stock!');

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock_quantity)
        return alert('Insufficient stock!');
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleCheckout = async () => {
    if (!selectedCustomer) return alert('Please select a customer!');
    if (cart.length === 0) return alert('Cart is empty!');
    if (!selectedOutletId) return alert('Please select an outlet first!');

    const item = cart[0];

    const payload = {
      outlet_id: Number(selectedOutletId),
      user_id: Number(user.id),
      customer_id: Number(selectedCustomer.id),
      total_amount: Number(totalAmount),
      product_id: Number(item.product_id),
      qty: Number(item.qty),
      unit_price: Number(item.price),
    };

    try {
      await api.post('/api/sales', payload);
      alert('Sale Completed Successfully!');
      setCart([]);
      setSelectedCustomer(null);
      fetchData();
    } catch (error) {
      console.error('Sale Error:', error.response?.data);
      alert(
        error.response?.data?.message ||
          'Transaction failed! Check server logs.'
      );
    }
  };
  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty >= 1 && newQty <= item.stock_quantity) {
            return { ...item, qty: newQty };
          }
        }
        return item;
      })
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        POS Terminal - {user?.outlet?.name}
      </Typography>

      {isSuperAdmin && (
        <TextField
          select
          label="Select Outlet"
          value={selectedOutletId}
          onChange={(e) => setSelectedOutletId(e.target.value)}
          sx={{
            mb: 3,
            minWidth: 250,
          }}
        >
          {outlets.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      <Grid container>
        {/* Left Side: Product List */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} key={p.id}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                  onClick={() => addToCart(p)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {p.product?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Stock: {p.stock_quantity}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ৳{p.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Side: Cart & Checkout */}
        <Grid item xs={12} md={5}>
          <Card
            variant="outlined"
            sx={{
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Current Order
              </Typography>

              {/* Customer Search */}
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => `${option.name} (${option.phone})`}
                onChange={(e, val) => setSelectedCustomer(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {/* MINUS BUTTON */}
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ minWidth: '30px', p: 0 }}
                            onClick={() => updateQty(item.id, -1)}
                            disabled={item.qty <= 1}
                          >
                            -
                          </Button>

                          <Typography
                            sx={{ width: '25px', textAlign: 'center' }}
                          >
                            {item.qty}
                          </Typography>

                          {/* PLUS BUTTON */}
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ minWidth: '30px', p: 0 }}
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.qty >= item.stock_quantity}
                          >
                            +
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>৳{item.price * item.qty}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <Box sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">৳{totalAmount}</Typography>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Complete Sale
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
