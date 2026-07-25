import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { concertService, favoriteService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import Layout from '../../components/layout/Layout';
import { getImageUrl } from '../../services/api';
import { formatDate, formatTime, formatCurrency } from '../../utils';

export default function ConcertDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { setSelectedConcert, setSelectedCategories, reset } = useBooking();
  const navigate = useNavigate();

  const { data: concert, isLoading } = useQuery({
    queryKey: ['concert', slug],
    queryFn: () => concertService.getBySlug(slug),
    select: d => d.data.data,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const favMutation = useMutation({
    mutationFn: () => favoriteService.toggle(concert?.id),
    onSuccess: (data) => {
      setIsFav(data.data.data.favorited);
      toast.success(data.data.data.favorited ? 'Added to favorites' : 'Removed from favorites');
    },
    onError: () => toast.error('Please login to save favorites.'),
  });

  const handleBook = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!selectedCategory) return toast.error('Please select a ticket category.');
    reset();
    setSelectedConcert(concert);
    setSelectedCategories([{ category: selectedCategory, quantity }]);
    navigate('/booking/seat-selection');
  };

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background pt-28 pb-20 container-premium space-y-8">
          <div className="h-96 card-flat animate-pulse bg-surface" />
          <div className="h-10 bg-surface w-1/3 animate-pulse rounded-xl" />
        </div>
      </Layout>
    );
  }

  /* ── Not found state ── */
  if (!concert) {
    return (
      <Layout>
        <div className="min-h-[75vh] bg-background flex items-center justify-center container-premium text-center">
          <div className="card-flat p-12 max-w-md w-full">
            <p className="text-4xl mb-4">🎵</p>
            <h2 className="font-display font-bold text-2xl text-ivory mb-2">Concert Not Found</h2>
            <p className="text-xs text-text-secondary mb-6">The show listing may have expired or been removed.</p>
            <Link to="/concerts" className="btn-primary text-xs w-full text-center">
              Browse Concerts
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const categories = concert.ticketCategories || [];
  const isUpcoming = concert.status === 'upcoming';
  const totalPrice = selectedCategory ? parseFloat(selectedCategory.price) * quantity : 0;

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-24 pb-20">

        {/* ══════════════════════════════════════════
            HERO COVER BANNER
        ══════════════════════════════════════════ */}
        <div className="container-premium mb-12">
          <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-surface shadow-floating border border-white/[0.08] min-h-[420px] lg:min-h-[480px] flex flex-col justify-end p-6 sm:p-10 lg:p-12">
            
            {/* Poster Background */}
            {concert.poster ? (
              <img
                src={getImageUrl(concert.poster, 'posters')}
                alt={concert.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-75 saturate-90"
              />
            ) : (
              <div className="absolute inset-0 bg-[#343C4E]" />
            )}

            {/* Backdrop Overlay */}
            <div className="absolute inset-0 bg-[#343C4E]/80" />

            {/* Back link */}
            <Link
              to="/concerts"
              className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-white/[0.1] text-xs font-medium text-text-secondary hover:text-white transition-colors z-10"
            >
              ← All Concerts
            </Link>

            {/* Header Content */}
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`badge-jade uppercase text-[10px] ${isUpcoming ? '' : 'bg-gold/20 border-gold/40 text-gold-light'}`}>
                  {concert.status}
                </span>
                {concert.is_featured && (
                  <span className="badge-gold uppercase text-[10px]">
                    ★ Featured Show
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-ivory tracking-tight leading-tight">
                {concert.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-text-secondary pt-2">
                <span className="flex items-center gap-2">
                  <span>📅</span> {formatDate(concert.date)}
                </span>
                <span className="flex items-center gap-2">
                  <span>🕒</span> {formatTime(concert.time)} WIB
                </span>
                {concert.venue && (
                  <span className="flex items-center gap-2">
                    <span>📍</span> {concert.venue.name}, {concert.venue.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MAIN CONTENT & BOOKING PANEL
        ══════════════════════════════════════════ */}
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── Left Information Column (7 cols) ── */}
            <div className="lg:col-span-7 space-y-8">

              {/* Tab navigation pills */}
              <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-white/[0.08]">
                {['details', 'venue', 'artist'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-jade text-white font-semibold shadow-sm'
                        : 'text-text-secondary hover:text-ivory'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="card-flat grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-text-muted uppercase text-[10px] font-semibold mb-1">Performance Date</p>
                        <p className="font-semibold text-ivory text-sm">{formatDate(concert.date)}</p>
                      </div>
                      <div>
                        <p className="text-text-muted uppercase text-[10px] font-semibold mb-1">Show Time</p>
                        <p className="font-semibold text-ivory text-sm">{formatTime(concert.time)} WIB</p>
                      </div>
                      <div>
                        <p className="text-text-muted uppercase text-[10px] font-semibold mb-1">Artist / Band</p>
                        <p className="font-semibold text-ivory text-sm">{concert.artist_name || 'Crayon Case'}</p>
                      </div>
                      <div>
                        <p className="text-text-muted uppercase text-[10px] font-semibold mb-1">Venue Location</p>
                        <p className="font-semibold text-ivory text-sm">{concert.venue?.name || '—'}</p>
                      </div>
                    </div>

                    {concert.description && (
                      <div className="card-flat space-y-3">
                        <h3 className="font-display font-bold text-lg text-ivory">Event Overview</h3>
                        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                          {concert.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'venue' && concert.venue && (
                  <motion.div
                    key="venue"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="card-flat space-y-4"
                  >
                    <h3 className="font-display font-bold text-lg text-ivory">{concert.venue.name}</h3>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <p><strong className="text-ivory">Address:</strong> {concert.venue.address}</p>
                      <p><strong className="text-ivory">City:</strong> {concert.venue.city}, {concert.venue.province}</p>
                      <p><strong className="text-ivory">Total Capacity:</strong> {concert.venue.capacity ? `${concert.venue.capacity.toLocaleString()} seats` : 'N/A'}</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'artist' && (
                  <motion.div
                    key="artist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="card-flat space-y-4"
                  >
                    <h3 className="font-display font-bold text-2xl text-ivory">{concert.artist_name || 'Crayon Case'}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {concert.artist_bio || 'Crayon Case is an Indonesian indie band known for their rich melodic compositions, emotional songwriting, and explosive live performances.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right Booking Side Panel (5 cols) ── */}
            <div className="lg:col-span-5">
              <div className="card-premium p-6 sm:p-8 sticky top-28 space-y-6">

                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="badge-jade text-[9px] uppercase tracking-wider mb-1">Reservation</span>
                    <h3 className="font-display font-bold text-xl text-ivory">Select Tickets</h3>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={() => favMutation.mutate()}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isFav
                          ? 'border-gold text-gold bg-gold/10'
                          : 'border-white/[0.1] text-text-muted hover:text-ivory hover:border-white/[0.2]'
                      }`}
                      aria-label="Save Favorite"
                    >
                      <svg className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Category Options */}
                {categories.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Ticket Tier</p>
                    {categories.map(cat => {
                      const isSoldOut = cat.available === 0;
                      const isSelected = selectedCategory?.id === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => !isSoldOut && setSelectedCategory(cat)}
                          disabled={isSoldOut}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? 'border-jade bg-jade/15 shadow-sm'
                              : isSoldOut
                              ? 'border-white/[0.04] opacity-40 cursor-not-allowed bg-surface/50'
                              : 'border-white/[0.08] hover:border-white/[0.2] bg-surface-light/30'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-ivory text-sm">{cat.name}</p>
                              {cat.description && (
                                <p className="text-xs text-text-secondary mt-0.5">{cat.description}</p>
                              )}
                              <p className="text-[10px] text-text-muted mt-1">
                                {isSoldOut ? 'Sold Out' : `${cat.available} tickets left`}
                              </p>
                            </div>
                            <p className="font-bold text-gold text-sm">{formatCurrency(cat.price)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary">No ticket categories available for this show.</p>
                )}

                {/* Quantity Stepper */}
                {selectedCategory && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Quantity</p>
                    <div className="flex items-center bg-bg-secondary border border-white/[0.1] rounded-xl p-1">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-ivory hover:bg-white/[0.05] rounded-lg transition-colors text-lg"
                      >
                        −
                      </button>
                      <div className="flex-1 text-center font-bold text-ivory text-base">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(q => Math.min(Math.min(selectedCategory.available, 10), q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-ivory hover:bg-white/[0.05] rounded-lg transition-colors text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Pricing Subtotal */}
                {selectedCategory && (
                  <div className="py-4 border-t border-b border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase font-semibold">Total Price</span>
                    <span className="font-display font-bold text-gold text-2xl">{formatCurrency(totalPrice)}</span>
                  </div>
                )}

                {/* CTA button */}
                <div className="space-y-3">
                  <button
                    onClick={handleBook}
                    disabled={!selectedCategory || !isUpcoming}
                    className="w-full btn-primary py-4 text-sm"
                  >
                    {!isUpcoming ? 'Show Completed' : !selectedCategory ? 'Select A Tier' : 'Continue to Seat Selection'}
                  </button>
                  {!isAuthenticated && (
                    <p className="text-center text-xs text-text-muted">
                      Please <Link to="/login" className="text-jade-light hover:underline font-semibold">Sign In</Link> to reserve tickets.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
