import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, Search, CheckCircle2, Clock, FileCheck } from 'lucide-react';
import { bookingService } from '../../services';
import Layout from '../../components/layout/Layout';
import BookingTicketCard from '../../components/ticket/BookingTicketCard';
import { BookingHistorySkeleton } from '../../components/ui/SkeletonLoader';
import { NoBookingsYet } from '../../components/ui/EmptyState';

export default function MyTickets() {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings', statusFilter],
    queryFn: () => bookingService.myBookings({ status: statusFilter }),
    select: d => d.data,
  });

  const bookings = data?.data || [];

  const TABS = [
    { label: 'All Bookings',     value: '',               icon: Ticket },
    { label: 'Confirmed Passes', value: 'confirmed',      icon: CheckCircle2 },
    { label: 'Pending Payment',  value: 'pending',        icon: Clock },
    { label: 'Awaiting Review',  value: 'payment_review', icon: FileCheck },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium">

          {/* Page Header */}
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">My Account</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-3">
              My Digital Tickets
            </h1>
            <p className="text-text-secondary text-sm max-w-lg">
              Manage your upcoming concert passes, review order status, and access digital QR e-tickets.
            </p>
          </div>

          {/* Status Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-8 bg-card border border-border rounded-card p-2 shadow-card">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-text-primary shadow-sm font-semibold'
                      : 'text-muted hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ticket Grid */}
          {isLoading ? (
            <BookingHistorySkeleton />
          ) : bookings.length === 0 ? (
            <NoBookingsYet />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map(booking => (
                <BookingTicketCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
