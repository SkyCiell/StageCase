import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { concertService } from '../../services';
import Layout from '../../components/layout/Layout';
import ConcertCard from '../../components/concert/ConcertCard';
import { ConcertGridSkeleton } from '../../components/ui/SkeletonLoader';
import { NoConcertsFound } from '../../components/ui/EmptyState';

const CITIES   = ['All', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Bali'];
const STATUSES = [
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: '',          label: 'All Shows' },
  { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed' },
];

export default function ConcertList() {
  const [search, setSearch] = useState('');
  const [city,   setCity]   = useState('');
  const [status, setStatus] = useState('upcoming');
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['concerts', { search, city, status, page }],
    queryFn: () => concertService.list({ search, city: city === 'All' ? '' : city, status, page, limit: 9 }),
    select: d => d.data,
    keepPreviousData: true,
  });

  const concerts   = data?.data || [];
  const pagination = data?.pagination;

  const hasFilters = search || city || status !== 'upcoming';
  const resetFilters = () => { setSearch(''); setCity(''); setStatus('upcoming'); setPage(1); };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium">

          {/* Page Header */}
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">All Events</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-3">
              Browse Concerts
            </h1>
            <p className="text-text-secondary max-w-xl">
              Discover upcoming live performances. Filter by city, status, or search for your favourite artist.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-card border border-border rounded-card p-5 mb-8 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

              {/* Search Input */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  className="input-premium pl-10"
                  placeholder="Search concerts or artists..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              {/* Status Tabs */}
              <div className="md:col-span-4 flex gap-1.5 bg-bg-secondary border border-border rounded-md p-1">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { setStatus(s.value); setPage(1); }}
                    className={`flex-1 py-2 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                      status === s.value
                        ? 'bg-primary text-text-primary shadow-sm'
                        : 'text-muted hover:text-text-primary'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* City Select */}
              <div className="md:col-span-3 relative">
                <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  className="input-premium pl-10 appearance-none cursor-pointer"
                  value={city}
                  onChange={e => { setCity(e.target.value); setPage(1); }}
                >
                  {CITIES.map(c => (
                    <option key={c} value={c === 'All' ? '' : c} className="bg-card text-text-primary">
                      {c === '' || c === 'All' ? 'All Cities' : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters indicator */}
            {hasFilters && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
                  <span className="text-xs text-muted">Active filters:</span>
                  {search && <span className="badge-jade">"{search}"</span>}
                  {city && city !== 'All' && <span className="badge-jade">{city}</span>}
                  {status && <span className="badge-jade">{status}</span>}
                </div>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          {!isLoading && concerts.length > 0 && (
            <p className="text-xs text-muted font-mono mb-6">
              Showing <strong className="text-text-primary">{concerts.length}</strong> of{' '}
              <strong className="text-text-primary">{pagination?.total || concerts.length}</strong> concerts
            </p>
          )}

          {/* Concert Grid */}
          {isLoading ? (
            <ConcertGridSkeleton count={9} />
          ) : concerts.length === 0 ? (
            <NoConcertsFound onReset={resetFilters} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerts.map((concert, idx) => (
                <ConcertCard key={concert.id} concert={concert} index={idx} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="btn-secondary text-xs py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        page === pageNum
                          ? 'bg-primary text-text-primary'
                          : 'bg-card border border-border text-muted hover:text-text-primary hover:border-gold'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNext}
                className="btn-secondary text-xs py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
