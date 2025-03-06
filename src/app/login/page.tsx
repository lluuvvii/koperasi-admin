'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        setError('Email atau password salah');
        setLoading(false);
        return;
      }
      
      router.push(callbackUrl);
    } catch (error) {
      setError('Terjadi kesalahan saat login');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Paper elevation={3} className="p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Typography variant="h4" component="h1" className="text-primary-600 font-bold">
            Koperasi Admin
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Masuk untuk mengelola data koperasi
          </Typography>
        </div>
        
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            loading={loading}
            className="mt-4"
          >
            Masuk
          </LoadingButton>
        </form>
      </Paper>
    </div>
  );
}