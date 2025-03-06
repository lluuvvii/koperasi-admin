'use client';

import { useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { DocumentType } from '@/app/types/document';
import { formatDate } from '@/app/lib/utils';
import { useDocuments } from '@/app/hooks/useDocuments';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DocumentsPage() {
  const { data: session } = useSession();
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | ''>('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Fetch documents data using a custom hook
  const {
    documents,
    isLoading,
    isError,
    refetch,
  } = useDocuments({
    type: filterType || undefined,
    search: searchQuery,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const filteredDocuments = documents || [];

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Set filter type based on tab
    if (newValue === 0) {
      setFilterType('');
    } else if (newValue === 1) {
      setFilterType(DocumentType.LOAN_AGREEMENT);
    } else if (newValue === 2) {
      setFilterType(DocumentType.PAYMENT_RECEIPT);
    } else if (newValue === 3) {
      setFilterType(DocumentType.MEMBER_REGISTRATION);
    }
  };

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle document preview
  const handlePreviewDocument = (document: any) => {
    setSelectedDocument(document);
    setPreviewDialogOpen(true);
  };

  // Handle print document
  const handlePrintDocument = (document: any) => {
    // Implement print functionality here
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #0ea5e9; }
              .header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
              .document-info { margin-bottom: 20px; }
              .document-info p { margin: 5px 0; }
              .document-content { border: 1px solid #ddd; padding: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Koperasi - Dokumen ${document.type}</h1>
            </div>
            <div class="document-info">
              <p><strong>Dokumen ID:</strong> ${document._id}</p>
              <p><strong>Tipe:</strong> ${document.type}</p>
              <p><strong>Tanggal:</strong> ${formatDate(document.generatedAt)}</p>
              <p><strong>Dibuat oleh:</strong> ${document.generatedBy?.name || 'Unknown'}</p>
            </div>
            <div class="document-content">
              <pre>${JSON.stringify(document.data, null, 2)}</pre>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Handle filter dialog
  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilter = () => {
    refetch();
    setFilterDialogOpen(false);
  };

  const handleClearFilter = () => {
    setDateRange({
      startDate: '',
      endDate: '',
    });
    setFilterType('');
    setSearchQuery('');
    setFilterDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" gutterBottom className="text-primary-600 font-bold">
        Manajemen Dokumen
      </Typography>

      <Paper className="p-4 mb-6">
        <Grid container spacing={2} alignItems="center" className="mb-4">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6} className="flex justify-end">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilterDialog}
              className="mr-2"
            >
              Filter
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="document tabs">
            <Tab label="Semua Dokumen" />
            <Tab label="Perjanjian Pinjaman" />
            <Tab label="Kwitansi Pembayaran" />
            <Tab label="Pendaftaran Anggota" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DocumentTable 
            documents={filteredDocuments}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handlePreviewDocument={handlePreviewDocument}
            handlePrintDocument={handlePrintDocument}
            isLoading={isLoading}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <DocumentTable 
            documents={filteredDocuments}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handlePreviewDocument={handlePreviewDocument}
            handlePrintDocument={handlePrintDocument}
            isLoading={isLoading}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <DocumentTable 
            documents={filteredDocuments}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handlePreviewDocument={handlePreviewDocument}
            handlePrintDocument={handlePrintDocument}
            isLoading={isLoading}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <DocumentTable 
            documents={filteredDocuments}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handlePreviewDocument={handlePreviewDocument}
            handlePrintDocument={handlePrintDocument}
            isLoading={isLoading}
          />
        </TabPanel>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Preview Dokumen
          <IconButton
            aria-label="print"
            onClick={() => handlePrintDocument(selectedDocument)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <PrintIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Typography variant="subtitle1" gutterBottom>
                  <strong>ID Dokumen:</strong> {selectedDocument._id}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Tipe:</strong> {selectedDocument.type}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Tanggal Dibuat:</strong> {formatDate(selectedDocument.generatedAt)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Dibuat Oleh:</strong> {selectedDocument.generatedBy?.name || 'Unknown'}
                </Typography>
              </div>
              
              <Typography variant="h6" gutterBottom>
                Isi Dokumen
              </Typography>
              
              <Paper elevation={0} className="p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedDocument.data, null, 2)}
                </pre>
              </Paper>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Tutup</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handlePrintDocument(selectedDocument)}
            startIcon={<PrintIcon />}
          >
            Cetak
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Dokumen</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Tipe Dokumen"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as DocumentType | '')}
                margin="normal"
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value={DocumentType.LOAN_AGREEMENT}>Perjanjian Pinjaman</MenuItem>
                <MenuItem value={DocumentType.PAYMENT_RECEIPT}>Kwitansi Pembayaran</MenuItem>
                <MenuItem value={DocumentType.MEMBER_REGISTRATION}>Pendaftaran Anggota</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tanggal Mulai"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tanggal Akhir"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilter} color="inherit">
            Reset
          </Button>
          <Button onClick={handleCloseFilterDialog} color="inherit">
            Batal
          </Button>
          <Button onClick={handleApplyFilter} variant="contained" color="primary">
            Terapkan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Component for Document Table
function DocumentTable({ 
  documents, 
  page, 
  rowsPerPage, 
  handleChangePage, 
  handleChangeRowsPerPage, 
  handlePreviewDocument, 
  handlePrintDocument,
  isLoading
}: { 
  documents: any[],
  page: number, 
  rowsPerPage: number, 
  handleChangePage: (event: unknown, newPage: number) => void,
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handlePreviewDocument: (document: any) => void,
  handlePrintDocument: (document: any) => void,
  isLoading: boolean
}) {
  return (
    <div>
      <TableContainer>
        <Table aria-label="document table">
          <TableHead>
            <TableRow>
              <TableCell>ID Dokumen</TableCell>
              <TableCell>Tipe</TableCell>
              <TableCell>Tanggal Dibuat</TableCell>
              <TableCell>Dibuat Oleh</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8">
                  Tidak ada dokumen ditemukan
                </TableCell>
              </TableRow>
            ) : (
              documents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((document) => (
                  <TableRow key={document._id}>
                    <TableCell component="th" scope="row">
                      {document._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {document.type === DocumentType.LOAN_AGREEMENT && 'Perjanjian Pinjaman'}
                      {document.type === DocumentType.PAYMENT_RECEIPT && 'Kwitansi Pembayaran'}
                      {document.type === DocumentType.MEMBER_REGISTRATION && 'Pendaftaran Anggota'}
                    </TableCell>
                    <TableCell>{formatDate(document.generatedAt)}</TableCell>
                    <TableCell>{document.generatedBy?.name || 'Unknown'}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        aria-label="preview" 
                        onClick={() => handlePreviewDocument(document)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        aria-label="print" 
                        onClick={() => handlePrintDocument(document)}
                        size="small"
                      >
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={documents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Baris per halaman:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
      />
    </div>
  );
}