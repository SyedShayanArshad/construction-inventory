export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ur-PK', { 
      style: 'currency', 
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };
