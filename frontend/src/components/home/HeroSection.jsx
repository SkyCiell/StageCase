import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ticket, MapPin, Calendar, ArrowRight, Zap, Star } from 'lucide-react';
import { formatCurrency } from '../../utils';

const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B', bg: '#0E2426' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2', bg: '#1A1228' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A', bg: '#151F14' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7', bg: '#101C28' },
};

/**
 * Premium Hero Section
 * Featured concert spotlight with countdown, CTA, navigation
 */
export default function HeroSection({ 
  featuredConcert,
  featuredList = [],
  currentShowIdx = 0,
  onNext,
  onPrev,
  countdown,
}) {
  if (!featuredConcert) return null;

  const artistName = featuredConcert.artist_name || 'LIVE CONCERT';
  const bandColor = BAND_COLORS[artistName] || { primary: '#2D6F73', accent: '#B89B5E' };

  return (
    <section
      className="relative w-full min-h-[92vh] flex items-center overflow-hidden border-b border-border"
      style={{
        backgroundColor: bandColor.bg,
        transition: 'background-color 0.6s ease',
      }}
    >

      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-background/60 pointer-events-none" />

      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${bandColor.primary}80 1px, transparent 1px), linear-gradient(90deg, ${bandColor.primary}80 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ 
          backgroundColor: bandColor.primary,
          transition: 'background-color 0.5s ease',
        }}
      />

      <div className="container-premium w-full py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Hero Text Content */}
          <div className="space-y-8">

            {/* Event Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono border"
                style={{ 
                  backgroundColor: `${bandColor.primary}20`, 
                  borderColor: `${bandColor.primary}50`,
                  color: bandColor.accent
                }}
              >
                <Zap className="w-3 h-3" />
                Now Booking — Premium Live Event
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-text-primary leading-none tracking-tight">
                {featuredConcert.title}
              </h1>
              <p className="text-xl font-medium font-mono" style={{ color: bandColor.accent }}>
                {artistName}
              </p>
            </motion.div>

            {/* Description */}
            {featuredConcert.desc && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-text-secondary text-base leading-relaxed max-w-lg"
              >
                {featuredConcert.desc}
              </motion.p>
            )}

            {/* Event Meta Cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-wrap gap-4"
            >
              {featuredConcert.date && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-md">
                  <Calendar className="w-4 h-4" style={{ color: bandColor.primary }} />
                  <div>
                    <p className="text-[10px] text-muted font-mono uppercase tracking-wider">Date</p>
                    <p className="text-xs font-semibold text-text-primary">
                      {new Date(featuredConcert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
              {featuredConcert.location && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-md">
                  <MapPin className="w-4 h-4" style={{ color: bandColor.primary }} />
                  <div>
                    <p className="text-[10px] text-muted font-mono uppercase tracking-wider">Venue</p>
                    <p className="text-xs font-semibold text-text-primary">{featuredConcert.location}</p>
                  </div>
                </div>
              )}
              {featuredConcert.startingPrice && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-md">
                  <Ticket className="w-4 h-4" style={{ color: bandColor.primary }} />
                  <div>
                    <p className="text-[10px] text-muted font-mono uppercase tracking-wider">From</p>
                    <p className="text-xs font-semibold text-text-primary">{formatCurrency(featuredConcert.startingPrice)}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Countdown */}
            {countdown && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center gap-1"
              >
                {[
                  { label: 'Days',    value: countdown.days    },
                  { label: 'Hours',   value: countdown.hours   },
                  { label: 'Minutes', value: countdown.minutes },
                  { label: 'Seconds', value: countdown.seconds },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <div className="text-center px-3 py-2 bg-card border border-border rounded-md min-w-[56px]">
                      <p className="text-xl font-black font-mono text-text-primary">
                        {String(unit.value).padStart(2, '0')}
                      </p>
                      <p className="text-[9px] text-muted font-mono uppercase tracking-wider">{unit.label}</p>
                    </div>
                    {i < 3 && <span className="text-muted font-bold text-lg">:</span>}
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to={`/concerts/${featuredConcert.slug}`}
                className="btn-primary px-8 py-3.5 text-sm font-semibold"
              >
                <Ticket className="w-4 h-4" />
                Book Tickets
              </Link>
              <Link
                to="/concerts"
                className="btn-secondary px-8 py-3.5 text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                View All Events
              </Link>
            </motion.div>

            {/* Navigation Indicator */}
            {featuredList.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center gap-4 pt-2"
              >
                <button
                  onClick={onPrev}
                  className="btn-ghost py-1.5 px-3 text-xs"
                >
                  ← Prev
                </button>
                <div className="flex gap-1.5">
                  {featuredList.map((_, i) => (
                    <span
                      key={i}
                      className="block h-1 rounded-full transition-all duration-250"
                      style={{
                        width: i === currentShowIdx ? '24px' : '8px',
                        backgroundColor: i === currentShowIdx ? bandColor.primary : '#30363D',
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={onNext}
                  className="btn-ghost py-1.5 px-3 text-xs"
                >
                  Next →
                </button>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Featured Concert Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[3/4] max-h-[600px] rounded-card overflow-hidden border-2 shadow-modal"
              style={{ borderColor: `${bandColor.primary}50` }}
            >
              <img
                key={featuredConcert.id + '-bg'}
                src={featuredConcert.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
              />
              <img
                key={featuredConcert.id}
                src={featuredConcert.image}
                alt={featuredConcert.title}
                className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay info panel */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-card/95 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1">Tickets from</p>
                    <p className="text-2xl font-black font-display text-text-primary">
                      {formatCurrency(featuredConcert.startingPrice)}
                    </p>
                  </div>
                  <Link
                    to={`/concerts/${featuredConcert.slug}`}
                    className="btn-primary py-2.5 px-5 text-xs"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    Get Tickets
                  </Link>
                </div>
              </div>

              {/* Artist label badge */}
              <div 
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono"
                style={{ backgroundColor: bandColor.primary, color: '#F3F4F6' }}
              >
                <Star className="w-3 h-3" />
                {artistName} — Live 2026
              </div>
            </div>

            {/* Decorative dashed lines */}
            <div 
              className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-dashed rounded-md opacity-30"
              style={{ borderColor: bandColor.accent }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
