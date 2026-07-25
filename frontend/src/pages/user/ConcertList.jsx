import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { concertService } from '../../services';
import { getImageUrl } from '../../services/api';
import { formatDateShort, formatCurrency } from '../../utils';
import Layout from '../../components/layout/Layout';
import ConcertCard from '../../components/concert/ConcertCard';

const CITIES = ['All', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Bali'];
const STATUSES = [
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: '',          label: 'All Shows' },
  { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed' },
];

export default function ConcertList() {
  const [search, setSearch] = useState('');
  const [city, setCity]     = useState('');
  const [status, setStatus] = useState('upcoming');
  const [page, setPage]     = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['concerts', { search, city, status, page }],
    queryFn: () => concertService.list({ search, city: city === 'All' ? '' : city, status, page, limit: 9 }),
    select: d => d.data,
    keepPreviousData: true,
  });

  const concerts   = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium">

          {/* ── Page Header ── */}
          <div className="mb-10 border-b border-white/[0.06] pb-8">
            <span className="badge-jade uppercase text-[10px] tracking-wider mb-2">Live Performances</span>
            <h1 className="page-title mt-1">Concert Schedule</h1>
            <p className="section-subheading">
              Browse upcoming live performances by Crayon Case. Select a city or date filter to locate your show.
            </p>
          </div>

          {/* ── Filter Bar ── */}
          <div className="card-flat mb-10 p-4 sm:p-6 bg-surface/90 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search input — 5 cols */}
              <div className="md:col-span-5 relative">
                <input
                  className="input-field pl-10"
                  placeholder="Search concert title or artist..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <svg className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status pills — 4 cols */}
              <div className="md:col-span-4 flex items-center gap-1 bg-bg-secondary p-1 rounded-xl border border-white/[0.06]">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { setStatus(s.value); setPage(1); }}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      status === s.value
                        ? 'bg-jade text-white font-semibold'
                        : 'text-text-secondary hover:text-ivory'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* City Select — 3 cols */}
              <div className="md:col-span-3">
                <select
                  className="input-field cursor-pointer capitalize"
                  value={city}
                  onChange={e => { setCity(e.target.value); setPage(1); }}
                >
                  {CITIES.map(c => (
                    <option key={c} value={c === 'All' ? '' : c} className="bg-surface text-ivory">
                      {c === '' || c === 'All' ? 'All Cities' : `City: ${c}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Concerts Grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-premium h-80 animate-pulse bg-surface p-6" />
              ))}
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center py-20 card-flat max-w-md mx-auto">
              <p className="text-3xl mb-3 opacity-30">🎵</p>
              <h3 className="font-display font-bold text-lg text-ivory mb-1">No Concerts Found</h3>
              <p className="text-xs text-text-secondary">Try clearing search keywords or city filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {concerts.map((concert, idx) => (
                <ConcertCard key={concert.id} concert={concert} index={idx} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-14 pt-8 border-t border-white/[0.06]">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-30"
              >
                ← Previous Page
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 text-xs font-semibold rounded-xl transition-colors ${
                      page === i + 1
                        ? 'bg-jade text-white font-bold'
                        : 'bg-surface text-text-secondary hover:text-ivory'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-30"
              >
                Next Page →
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
