import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Calendar, Clock, MapPin, Ticket, Heart, ArrowLeft,
  Info, Building2, Mic2, Minus, Plus, CheckCircle2, AlertCircle
} from 'lucide-react';
import { concertService, favoriteService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import Layout from '../../components/layout/Layout';
import { getConcertPoster } from '../../services/api';
import { formatDate, formatTime, formatCurrency } from '../../utils';

const OFFICIAL_ARTIST_BIOS = {
  'Crayon Case': 'Crayon Case is an Indonesian indie band formed in 2023 in Surabaya, East Java, consisting of duo Aiden and fein. The band blends indie pop, noise pop, and dream pop with atmospheric shoegaze guitar textures. They released their debut EP Catch Twenty-three!! in 2024, followed by their single Surabaya in 2025.',
  'Reality Club': 'Reality Club is an Indonesian indie rock band formed in Jakarta in 2016 by siblings Fathia Izzati and Faiz Novascotia Saripudin, alongside Nugi Wicaksono and Era Patigo. Known for their catchy melodies, romantic lyrics, and cinematic arrangements, they have earned multiple AMI Award nominations and performed internationally across Asia and North America.',
  'The Milo': 'The Milo (also known as Themilo) is an Indonesian shoegaze and dream pop band formed in Bandung, West Java in 1996. Recognized as one of the pioneers of Indonesian shoegaze, the band combines ethereal vocals, melancholic lyrics, and heavily distorted, reverberated guitars. Their seminal releases include the debut album Let Me Begin (2003) and Photograph (2011).',
  'Wave to Earth': 'Wave to Earth is a South Korean indie band formed in Seoul in 2019, comprising Daniel Kim, Dong Q, and John Cha. Known for their DIY philosophy, atmospheric soundscapes, and blending of indie rock with soft jazz and lo-fi influences, the band creates a serene, oceanic listening experience.',
};

const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7' },
};

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

  /* ── Loading ── */
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-12 container-premium space-y-6">
          <div className="h-72 bg-card rounded-card border border-border animate-pulse" />
          <div className="h-8 bg-card rounded-md border border-border w-1/3 animate-pulse" />
          <div className="h-4 bg-card rounded border border-border w-2/3 animate-pulse" />
        </div>
      </Layout>
    );
  }

  /* ── Not Found ── */
  if (!concert) {
    return (
      <Layout>
        <div className="min-h-[75vh] bg-background flex items-center justify-center px-4">
          <div className="bg-card border border-border rounded-card p-12 max-w-sm w-full text-center shadow-card">
            <Ticket className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-text-primary mb-2">Concert Not Found</h2>
            <p className="text-xs text-text-secondary mb-6">This show listing may have expired or been removed.</p>
            <Link to="/concerts" className="btn-primary text-xs w-full justify-center">Browse Concerts</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const categories  = concert.ticketCategories || [];
  const isUpcoming  = concert.status === 'upcoming';
  const totalPrice  = selectedCategory ? parseFloat(selectedCategory.price) * quantity : 0;
  const bandColor   = BAND_COLORS[concert.artist_name] || { primary: '#2D6F73', accent: '#B89B5E' };

  const TABS = [
    { key: 'details', label: 'Event Details', icon: Info },
    { key: 'venue',   label: 'Venue',         icon: Building2 },
    { key: 'artist',  label: 'About Artist',  icon: Mic2 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">

        {/* ── Hero Banner ── */}
        <div className="relative min-h-[360px] sm:min-h-[440px] flex items-end overflow-hidden border-b border-border">
          {/* Poster background */}
          <img
            src={getConcertPoster(concert)}
            alt={concert.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />

          {/* Band color left stripe */}
          <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: bandColor.primary }} />

          {/* Overlay */}
          <div className="absolute inset-0 bg-background/70" />

          {/* Back link */}
          <div className="absolute top-6 left-0 right-0">
            <div className="container-premium">
              <Link
                to="/concerts"
                className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent transition-colors bg-card border border-border px-3 py-2 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Concerts
              </Link>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container-premium pb-10 pt-24">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${bandColor.primary}20`,
                    borderColor: `${bandColor.primary}50`,
                    color: bandColor.accent,
                  }}
                >
                  {concert.status}
                </span>
                {concert.is_featured && (
                  <span className="badge-gold">★ Featured Show</span>
                )}
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-text-primary leading-tight">
                {concert.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-sm text-text-secondary pt-1">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: bandColor.primary }} />
                  {formatDate(concert.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: bandColor.primary }} />
                  {formatTime(concert.time)} WIB
                </span>
                {concert.venue && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: bandColor.primary }} />
                    {concert.venue.name}, {concert.venue.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content + Booking Panel ── */}
        <div className="container-premium py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── Left Info Column (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Tab Navigation */}
              <div className="flex items-center gap-1 bg-bg-secondary border border-border rounded-md p-1">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === tab.key
                          ? 'bg-card text-text-primary shadow-sm font-semibold border border-border'
                          : 'text-muted hover:text-text-primary'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Quick info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Performance Date', value: formatDate(concert.date) },
                        { label: 'Show Time',         value: `${formatTime(concert.time)} WIB` },
                        { label: 'Artist / Band',     value: concert.artist_name || '—' },
                        { label: 'Venue Location',    value: concert.venue?.name || '—' },
                      ].map(item => (
                        <div key={item.label} className="bg-card border border-border rounded-md p-4">
                          <p className="text-[10px] text-muted uppercase font-mono tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    {concert.description && (
                      <div className="bg-card border border-border rounded-card p-6 space-y-3">
                        <h3 className="font-display font-bold text-base text-text-primary">Event Overview</h3>
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card border border-border rounded-card p-6 space-y-4"
                  >
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <Building2 className="w-5 h-5" style={{ color: bandColor.primary }} />
                      <h3 className="font-display font-bold text-lg text-text-primary">{concert.venue.name}</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Address',   value: concert.venue.address },
                        { label: 'City',      value: `${concert.venue.city}, ${concert.venue.province}` },
                        { label: 'Capacity',  value: concert.venue.capacity ? `${concert.venue.capacity.toLocaleString()} seats` : 'N/A' },
                      ].map(row => (
                        <div key={row.label} className="flex gap-3">
                          <span className="text-muted text-xs uppercase font-mono tracking-wider w-20 shrink-0 pt-0.5">{row.label}</span>
                          <span className="text-text-secondary">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'artist' && (
                  <motion.div
                    key="artist"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card border border-border rounded-card p-6 space-y-4"
                  >
                    {/* Artist color accent top bar */}
                    <div
                      className="h-1 rounded-full -mt-6 -mx-6 mb-4"
                      style={{ backgroundColor: bandColor.primary }}
                    />
                    <div className="flex items-center gap-3">
                      <Mic2 className="w-5 h-5" style={{ color: bandColor.primary }} />
                      <h3 className="font-display font-bold text-xl text-text-primary">
                        {concert.artist_name || 'Crayon Case'}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {concert.artist_bio || OFFICIAL_ARTIST_BIOS[concert.artist_name] || OFFICIAL_ARTIST_BIOS['Crayon Case']}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right Booking Panel (5 cols) ── */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 sticky top-6 space-y-6 shadow-card">

                {/* Panel Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="text-[10px] text-muted font-mono uppercase tracking-wider mb-1">Reservation</p>
                    <h3 className="font-display font-bold text-lg text-text-primary">Select Tickets</h3>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={() => favMutation.mutate()}
                      className={`p-2.5 rounded-md border transition-all cursor-pointer ${
                        isFav
                          ? 'border-danger bg-danger/10 text-danger'
                          : 'border-border text-muted hover:text-text-primary hover:border-border'
                      }`}
                      aria-label="Save to Favorites"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Ticket Categories */}
                {categories.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Ticket Tier</p>
                    {categories.map(cat => {
                      const isSoldOut  = cat.available === 0;
                      const isSelected = selectedCategory?.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => !isSoldOut && setSelectedCategory(cat)}
                          disabled={isSoldOut}
                          className={`w-full text-left p-4 rounded-md border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : isSoldOut
                              ? 'border-border opacity-40 cursor-not-allowed bg-surface/50'
                              : 'border-border hover:border-gold bg-surface/30 hover:bg-surface/50'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-text-primary text-sm">{cat.name}</p>
                              {cat.description && (
                                <p className="text-xs text-text-secondary mt-0.5 truncate">{cat.description}</p>
                              )}
                              <p className="text-[10px] text-muted mt-1 font-mono">
                                {isSoldOut ? '⚠ Sold Out' : `${cat.available} seats remaining`}
                              </p>
                            </div>
                            <p className="font-bold text-accent text-sm shrink-0">{formatCurrency(cat.price)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-surface rounded-md border border-border text-sm text-text-secondary">
                    <AlertCircle className="w-4 h-4 text-muted shrink-0" />
                    No ticket categories available for this show.
                  </div>
                )}

                {/* Quantity Stepper */}
                {selectedCategory && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Quantity</p>
                    <div className="flex items-center gap-3 bg-bg-secondary border border-border rounded-md p-1.5">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center font-bold text-text-primary text-base">{quantity}</div>
                      <button
                        onClick={() => setQuantity(q => Math.min(Math.min(selectedCategory.available, 10), q + 1))}
                        className="w-9 h-9 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Total Price */}
                {selectedCategory && (
                  <div className="flex items-center justify-between py-4 border-t border-b border-border">
                    <span className="text-sm text-muted uppercase font-mono tracking-wider">Total</span>
                    <span className="font-display font-black text-2xl text-accent">{formatCurrency(totalPrice)}</span>
                  </div>
                )}

                {/* CTA */}
                <div className="space-y-3">
                  <button
                    onClick={handleBook}
                    disabled={!selectedCategory || !isUpcoming}
                    className="btn-primary w-full py-3.5 text-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Ticket className="w-4 h-4" />
                    {!isUpcoming
                      ? 'Show Completed'
                      : !selectedCategory
                      ? 'Select a Tier First'
                      : 'Continue to Seat Selection'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-muted">
                      <Link to="/login" className="text-primary hover:text-accent hover:underline font-semibold transition-colors">
                        Sign in
                      </Link>{' '}to reserve tickets
                    </p>
                  )}

                  {selectedCategory && isUpcoming && (
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Secure checkout — no hidden fees
                    </div>
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
