'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { Role } from '@/app/types/user';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    roles: [Role.ADMIN, Role.FIELD_OFFICER, Role.OFFICE_OFFICER],
  },
  {
    title: 'Transaksi',
    path: '/transactions',
    icon: <SwapHorizIcon />,
    roles: [Role.ADMIN, Role.FIELD_OFFICER],
  },
  {
    title: 'Dokumen',
    path: '/documents',
    icon: <DescriptionIcon />,
    roles: [Role.ADMIN, Role.OFFICE_OFFICER],
  },
  {
    title: 'Manajemen User',
    path: '/admin/users',
    icon: <PeopleIcon />,
    roles: [Role.ADMIN],
  },
  {
    title: 'Pengaturan',
    path: '/admin/settings',
    icon: <SettingsIcon />,
    roles: [Role.ADMIN],
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const userRole = session?.user?.role as Role;

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole as Role)
  );

  const drawerContent = (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary-600">Koperasi</h2>
        <p className="text-sm text-gray-500">Sistem Admin</p>
      </div>
      <Divider />
      <List>
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link href={item.path} key={item.path} passHref style={{ textDecoration: 'none' }}>
              <ListItem
                className={`${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <ListItemIcon
                  className={`${isActive ? 'text-primary-600' : 'text-gray-500'}`}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    className: `${isActive ? 'font-medium' : ''}`,
                  }}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={false} // This should be controlled by the state from Layout
          onClose={() => { }} // This should be handled by Layout
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256 },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop drawer */
        <Drawer
          variant="permanent"
          sx={{
            width: 256,
            flexShrink: 0,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256 },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}