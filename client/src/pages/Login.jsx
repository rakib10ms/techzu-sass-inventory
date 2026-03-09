import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      if (res.user.role.name === 'SUPERADMIN') {
        navigate('/sales-report');
      } else {
        navigate('/pos');
      }
    } catch (error) {
      alert('Invalid credentials or Server Error!');
    }
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        }}
      >
        <CardContent sx={{ padding: '32px' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '24px',
              color: '#1976d2',
            }}
          >
            System Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  marginTop: '8px',
                  paddingY: '12px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                Login
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
