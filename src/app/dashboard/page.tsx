'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Grid, Paper, Typography, Box, Chip } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import PaymentsIcon from '@mui/icons-material/Payments';
import DescriptionIcon from '@mui/icons-material/Description';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Components
import Layout from '@/app/components/layouts/Layout';

// Mock data - would be replaced with actual API calls
const transactionData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
];

const statusData = [
  { name: 'Pending', value: 30 },
  { name: 'Approved', value: 60 },
  { name: 'Rejected', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [summaryData, setSummaryData] = useState({
    totalTransactions: 125,
    totalMembers: 87,
    totalLoans: 'Rp 450.000.000',
    totalPayments: 'Rp 210.000.000',
  });

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Fetch summary data, transactions by month, and status distribution
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-500">
          Selamat datang, {session?.user?.name}
        </Typography>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-2">
              <Box className="bg-blue-100 p-2 rounded-full mr-3">
                <AttachMoneyIcon className="text-blue-500" />
              </Box>
              <Typography variant="subtitle2" className="text-gray-500">
                Total Pinjaman
              </Typography>
            </div>
            <Typography variant="h5" className="font-bold mt-1">
              {summaryData.totalLoans}
            </Typography>
            <Chip
              label="+12% dari bulan lalu"
              size="small"
              className="mt-2 bg-green-100 text-green-700 w-fit"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-2">
              <Box className="bg-green-100 p-2 rounded-full mr-3">
                <PaymentsIcon className="text-green-500" />
              </Box>
              <Typography variant="subtitle2" className="text-gray-500">
                Total Pembayaran
              </Typography>
            </div>
            <Typography variant="h5" className="font-bold mt-1">
              {summaryData.totalPayments}
            </Typography>
            <Chip
              label="+8% dari bulan lalu"
              size="small"
              className="mt-2 bg-green-100 text-green-700 w-fit"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-2">
              <Box className="bg-purple-100 p-2 rounded-full mr-3">
                <DescriptionIcon className="text-purple-500" />
              </Box>
              <Typography variant="subtitle2" className="text-gray-500">
                Total Transaksi
              </Typography>
            </div>
            <Typography variant="h5" className="font-bold mt-1">
              {summaryData.totalTransactions}
            </Typography>
            <Chip
              label="+5% dari bulan lalu"
              size="small"
              className="mt-2 bg-green-100 text-green-700 w-fit"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-2">
              <Box className="bg-orange-100 p-2 rounded-full mr-3">
                <GroupIcon className="text-orange-500" />
              </Box>
              <Typography variant="subtitle2" className="text-gray-500">
                Total Anggota
              </Typography>
            </div>
            <Typography variant="h5" className="font-bold mt-1">
              {summaryData.totalMembers}
            </Typography>
            <Chip
              label="+3 anggota baru"
              size="small"
              className="mt-2 bg-green-100 text-green-700 w-fit"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className="p-4 h-full">
            <Typography variant="h6" className="mb-4">
              Transaksi per Bulan
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={transactionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0ea5e9"
                  activeDot={{ r: 8 }}
                  name="Jumlah (Rp)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="p-4 h-full">
            <Typography variant="h6" className="mb-4">
              Status Pinjaman
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}