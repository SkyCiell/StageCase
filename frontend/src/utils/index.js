export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount && amount !== 0) return '–';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '–';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '–';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '–';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'WIB' : 'WIB';
  return `${h}:${m} ${ampm}`;
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '–';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const formatCountdown = (targetDate) => {
  if (!targetDate) return null;
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { expired: false, days, hours, minutes, seconds };
};

export const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const getStatusColor = (status) => {
  const map = {
    confirmed: 'success',
    approved: 'success',
    available: 'jade',
    pending: 'warning',
    waiting_payment: 'warning',
    payment_review: 'warning',
    submitted: 'warning',
    cancelled: 'error',
    expired: 'error',
    rejected: 'error',
    upcoming: 'jade',
    ongoing: 'gold',
    completed: 'text-secondary',
  };
  return map[status] || 'text-secondary';
};

export const getStatusLabel = (status) => {
  const map = {
    confirmed: 'Confirmed',
    approved: 'Approved',
    pending: 'Pending',
    waiting_payment: 'Waiting Payment',
    payment_review: 'Under Review',
    submitted: 'Submitted',
    cancelled: 'Cancelled',
    expired: 'Expired',
    rejected: 'Rejected',
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
    available: 'Available',
    booked: 'Booked',
    reserved: 'Reserved',
  };
  return map[status] || status;
};
