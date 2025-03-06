'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Components
import Layout from '@/app/components/layouts/Layout';
import { TransactionStatus } from '@/app/types/transaction';

// Mock data - would be replaced with actual API calls
const transactionsData = [
  {
    _id: '1',
    memberID: { _id: '101', name: 'Budi Santoso', idNumber: 'KTP-12345' },
    amount: 5000000,
    purpose: 'Modal Usaha',
    date: new Date('2023-01-15'),
    dueDate: new Date('2023-07-15'),
    status: TransactionStatus.APPROVED,
    interestRate: 1.5,
    createdBy: { _id: '201', name: 'Admin' },
    createdAt: new Date('2023-01-10'),
  },
  {
    _id: '2',
    memberID: { _id: '102', name: 'Siti Rahayu', idNumber: 'KTP-67890' },
    amount: 3000000,
    purpose: 'Pendidikan',
    date: new Date('2023-02-20'),
    dueDate: new Date('2023-08-20'),
    status: TransactionStatus.PENDING,
    interestRate: 1.0,
    createdBy: { _id: '202', name: 'Petugas Lapangan' },
    createdAt: new Date('2023-02-15'),
  },
  {
    _id: '3',
    memberID: { _id: '103', name: 'Ahmad Hidayat', idNumber: 'KTP-45678' },
    amount: 7500000,
    purpose: 'Renovasi Rumah',
    date: new Date('2023-03-05'),
    dueDate: new Date('2023-09-05'),
    status: TransactionStatus.REJECTED,
    interestRate: 2.0,
    createdBy: { _id: '201', name: 'Admin' },
    createdAt: new Date('2023-03-01'),
  },
];

const membersData = [
  { _id: '101', name: 'Budi Santoso', idNumber: 'KTP-12345' },
  { _id: '102', name: 'Siti Rahayu', idNumber: 'KTP-67890' },
  { _id: '103', name: 'Ahmad Hidayat', idNumber: 'KTP-45678' },
  { _id: '104', name: 'Dewi Lestari', idNumber: 'KTP-98765' },
];

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState(transactionsData);
  const [members, setMembers] = useState(membersData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [formData, setFormData] = useState({
    memberID: '',
    amount: '',
    purpose: '',
    date: dayjs(),
    dueDate: dayjs().add(6, 'month'),
    status: TransactionStatus.PENDING,
    interestRate: '1.5',
  });

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Fetch transactions and members data
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setCurrentTransaction(transaction);
      setFormData({
        memberID: transaction.memberID._id,
        amount: transaction.amount.toString(),
        purpose: transaction.purpose,
        date: dayjs(transaction.date),
        dueDate: dayjs(transaction.dueDate),
        status: transaction.status,
        interestRate: transaction.interestRate.toString(),
      });
    } else {
      setCurrentTransaction(null);
      setFormData({
        memberID: '',
        amount: '',
        purpose: '',
        date: dayjs(),
        dueDate: dayjs().add(6, 'month'),
        status: TransactionStatus.PENDING,
        interestRate: '1.5',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call your API to save the transaction
    console.log('Saving transaction:', formData);

    // Mock implementation
    if (currentTransaction) {
      // Update existing transaction
      const updatedTransactions = transactions.map(t =>
        t._id === currentTransaction._id ? {
          ...t,
          memberID: members.find(m => m._id === formData.memberID),
          amount: parseFloat(formData.amount),
          purpose: formData.purpose,
          date: formData.date.toDate(),
          dueDate: formData.dueDate.toDate(),
          status: formData.status,
          interestRate: parseFloat(formData.interestRate),
        } : t
      );
      setTransactions(updatedTransactions);
    } else {
      // Add new transaction
      const newTransaction = {
        _id: Date.now().toString(),
        memberID: members.find(m => m._id === formData.memberID),
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        date: formData.date.toDate(),
        dueDate: formData.dueDate.toDate(),
        status: formData.status,
        interestRate: parseFloat(formData.interestRate),
        createdBy: { _id: session?.user?.id, name: session?.user?.name },
        createdAt: new Date(),
      };
      setTransactions([...transactions, newTransaction]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    // Here you would call your API to delete the transaction
    console.log('Deleting transaction:', id);

    // Mock implementation
    setTransactions(transactions.filter(t => t._id !== id));
  };

  // Filter transactions based on search term and status filter
  const filteredTransactions = transactions.filter(transaction => {
    const memberName = transaction.memberID.name.toLowerCase();
    const purpose = transaction.purpose.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (memberName.includes(search) || purpose.includes(search)) &&
      (filterStatus === '' || transaction.status === filterStatus);
  });

  // Get current page of transactions
  const currentTransactions = filteredTransactions
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Typography variant="h4" component="h1" className="font-bold">
            Transaksi Pinjaman
          </Typography>
          <Typography variant="body1" className="text-gray-500">
            Kelola semua transaksi pinjaman
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Tambah Transaksi
        </Button>
      </div>

      {/* Filters */}
      <Paper className="p-4 mb-6">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cari transaksi"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Filter status"
              variant="outlined"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Semua Status</MenuItem>
              <MenuItem value={TransactionStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={TransactionStatus.APPROVED}>Disetujui</MenuItem>
              <MenuItem value={TransactionStatus.REJECTED}>Ditolak</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>ID</TableCell>
                <TableCell>Anggota</TableCell>
                <TableCell>Jumlah (Rp)</TableCell>
                <TableCell>Tujuan</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Jatuh Tempo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction._id}</TableCell>
                  <TableCell>
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {transaction.memberID.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {transaction.memberID.idNumber}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID').format(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.purpose}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.dueDate).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        transaction.status === TransactionStatus.PENDING
                          ? 'Pending'
                          : transaction.status === TransactionStatus.APPROVED
                            ? 'Disetujui'
                            : 'Ditolak'
                      }
                      className={
                        transaction.status === TransactionStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : transaction.status === TransactionStatus.APPROVED
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(transaction)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(transaction._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {currentTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Tidak ada transaksi yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman"
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Transaction Form Dialog */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Anggota"
                    name="memberID"
                    value={formData.memberID}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                  >
                    {members.map((member) => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.name} ({member.idNumber})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Jumlah Pinjaman (Rp)"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tujuan Pinjaman"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Tanggal Pinjaman"
                    value={formData.date}
                    onChange={(date) => handleDateChange('date', date)}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Tanggal Jatuh Tempo"
                    value={formData.dueDate}
                    onChange={(date) => handleDateChange('dueDate', date)}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bunga (%)"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                  >
                    <MenuItem value={TransactionStatus.PENDING}>Pending</MenuItem>
                    <MenuItem value={TransactionStatus.APPROVED}>Disetujui</MenuItem>
                    <MenuItem value={TransactionStatus.REJECTED}>Ditolak</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Batal</Button>
              <Button type="submit" variant="contained" color="primary">
                Simpan
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </LocalizationProvider>
    </Layout>
  );
}