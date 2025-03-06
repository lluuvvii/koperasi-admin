'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    // You would need to pass this state up to the Layout component
    // to toggle the Sidebar on mobile
  };
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleClose();
    signOut({ callbackUrl: '/login' });
  };
  
  return (
    <AppBar 
      position="static" 
      elevation={0}
      className="bg-white text-gray-800 border-b border-gray-200"
    >
      <Toolbar className="flex justify-between">
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="mr-2"
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" noWrap component="div" className="text-primary-600 font-bold">
          Koperasi Admin
        </Typography>
        
        <div className="flex items-center space-x-2">
          <Typography variant="body2" className="hidden md:block">
            {session?.user?.name}
          </Typography>
          
          <IconButton
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar 
              className="bg-primary-500 w-8 h-8 text-sm"
              alt={session?.user?.name || ''}
              src=""
            >
              {session?.user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}