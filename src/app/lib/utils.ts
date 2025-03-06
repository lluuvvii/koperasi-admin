export function formatDate(dateString: string | Date): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}