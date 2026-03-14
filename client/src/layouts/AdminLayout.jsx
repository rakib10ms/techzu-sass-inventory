import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Collapse,
  Divider,
  ListSubheader,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 260; // একটু চওড়া করা হয়েছে রিডিং সুবিধার জন্য

export default function AdminLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openHQ, setOpenHQ] = useState(true);
  const [openPOS, setOpenPOS] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin =
    user?.role?.name === 'SUPERADMIN' || user?.role?.name === 'ADMIN';

  console.log('b', isSuperAdmin);

  // Active Item Styling Helper
  const getListItemStyle = (path) => ({
    mb: 0.5,
    mx: 1,
    borderRadius: '8px',
    backgroundColor:
      location.pathname === path ? 'primary.light' : 'transparent',
    color: location.pathname === path ? 'primary.main' : 'text.secondary',
    '& .MuiListItemIcon-root': {
      color: location.pathname === path ? 'primary.main' : 'inherit',
    },
    '&:hover': {
      backgroundColor:
        location.pathname === path ? 'primary.light' : 'action.hover',
    },
  });

  return (
    <Box sx={{ display: 'flex' }} className="bg-gray-50 min-h-screen">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}
            >
              <Typography variant="subtitle2" fontWeight="600">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role?.name}
              </Typography>
            </Box>
            <AccountCircleIcon color="action" fontSize="large" />
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px dashed #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List
            subheader={
              <ListSubheader
                component="div"
                sx={{ fontWeight: 'bold', lineHeight: '24px', mb: 1 }}
              >
                MAIN NAVIGATION
              </ListSubheader>
            }
          >
            {/* --- HQ Section --- */}
            {isSuperAdmin && (
              <>
                <ListItemButton
                  onClick={() => setOpenHQ(!openHQ)}
                  sx={{ mx: 1, borderRadius: '8px', mb: 0.5 }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="HQ Management"
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  {openHQ ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={openHQ} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{ ...getListItemStyle('/master-menu'), pl: 4 }}
                      onClick={() => navigate('/master-menu')}
                    >
                      <ListItemIcon>
                        <MenuBookIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Master Menu" />
                    </ListItemButton>

                    <ListItemButton
                      sx={{ ...getListItemStyle('/outlet-products'), pl: 4 }}
                      onClick={() => navigate('/outlet-products')}
                    >
                      <ListItemIcon>
                        <InventoryIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Outlet Products" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </>
            )}

            <Divider sx={{ my: 2, mx: 2 }} />

            {/* --- POS Section --- */}
            <ListItemButton
              onClick={() => setOpenPOS(!openPOS)}
              sx={{ mx: 1, borderRadius: '8px', mb: 0.5 }}
            >
              <ListItemIcon>
                <PointOfSaleIcon />
              </ListItemIcon>
              <ListItemText
                primary="POS Terminal"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              {openPOS ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openPOS} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ ...getListItemStyle('/pos'), pl: 4 }}
                  onClick={() => navigate('/pos')}
                >
                  <ListItemIcon>
                    <StorefrontIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Billing " />
                </ListItemButton>

                <ListItemButton
                  sx={{ ...getListItemStyle('/sales-report'), pl: 4 }}
                  onClick={() => navigate('/sales-report')}
                >
                  <ListItemIcon>
                    <BarChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Sales Reports" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
