import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../utils/apiUrl';
import { AuthContext } from '../context/AuthContext';

export default function SalesReport() {
  const { user } = useContext(AuthContext);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const isAdmin =
        user.role?.name === 'SUPERADMIN' || user.role?.name === 'ADMIN';
      const initialOutlet = isAdmin ? 'all' : user.outlet_id;
      setSelectedOutlet(initialOutlet);

      if (isAdmin) {
        axios
          .get(`${API_URL}/api/outlets`)
          .then((res) => setOutlets(res.data.data || []));
      }
    }
  }, [user]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      let url =
        selectedOutlet === 'all'
          ? `${API_URL}/api/reports/outlets`
          : `${API_URL}/api/reports/outlets/${selectedOutlet}`;

      const response = await axios.get(url);
      setReportData(response.data.data);
    } catch (error) {
      console.error('Report Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOutlet) fetchReport();
  }, [selectedOutlet]);

  const renderSingleOutletView = (data) => (
    <Grid container spacing={3}>
      {/* Revenue summary card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'primary.dark', color: 'white', height: '100%' }}>
          <CardContent>
            <Typography variant="overline">Total Revenue</Typography>
            <Typography variant="h3">
              ৳{Number(data.total_revenue || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Total Sales: {data.total_sales_count}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Top 5 Items Table */}
      <Grid item xs={12} md={8}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🔥 Top 5 Selling Products
            </Typography>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Sold Qty</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.top_5_items?.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <b>{item.product_name}</b>
                    </TableCell>
                    <TableCell align="right">{item.total_qty_sold}</TableCell>
                    <TableCell align="right">৳{item.total_revenue}</TableCell>
                  </TableRow>
                ))}
                {(!data.top_5_items || data.top_5_items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No sales data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      {data.recent_sales && (
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🕒 Recent Transactions
              </Typography>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Receipt No</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.recent_sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>#{sale.receipt_no}</TableCell>
                      <TableCell>
                        {sale.customer_name || 'Walk-in Guest'}
                      </TableCell>
                      <TableCell align="right">
                        <b>৳{sale.total_amount}</b>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4,
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {selectedOutlet === 'all'
            ? '🌍 HQ Global Sales'
            : '🏪 Outlet Performance'}
        </Typography>

        {(user?.role?.name === 'SUPERADMIN' ||
          user?.role?.name === 'ADMIN') && (
          <TextField
            select
            size="small"
            label="Filter Outlet"
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="all">Consolidated View (All)</MenuItem>
            {outlets.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {selectedOutlet === 'all' && Array.isArray(reportData) ? (
            /* --- ALL OUTLETS LIST VIEW --- */
            <Grid container spacing={3}>
              {reportData.map((outletReport) => (
                <Grid item xs={12} key={outletReport.outlet_id}>
                  <Card
                    variant="outlined"
                    sx={{ borderLeft: '6px solid #1976d2', mb: 1 }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="primary"
                        >
                          {outletReport.outlet_name}
                        </Typography>
                        <Typography variant="h6">
                          Rev: <b>৳{outletReport.total_revenue}</b>
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Orders: {outletReport.total_sales_count}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Top Selling Products:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {outletReport.top_5_items
                            ?.slice(0, 3)
                            .map((item, i) => (
                              <Box
                                key={i}
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  bgcolor: '#f0f4f8',
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  border: '1px solid #d1d9e0',
                                }}
                              >
                                {item.product_name} ({item.total_qty_sold})
                              </Box>
                            ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            /* --- SINGLE OUTLET DETAILED VIEW --- */
            reportData &&
            renderSingleOutletView(
              Array.isArray(reportData) ? reportData[0] : reportData
            )
          )}
        </Box>
      )}
    </Box>
  );
}
