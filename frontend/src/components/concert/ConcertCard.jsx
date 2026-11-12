import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { getConcertPoster } from '../../services/api';
import { formatCurrency } from '../../utils';

const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7' },
};

const ConcertCard = ({ concert, index = 0 }) => {
  const minPrice = concert.ticketCategories?.length
    ? Math.min(...concert.ticketCategories.map(c => parseFloat(c.price)))
    : 350000;

  const posterSrc = getConcertPoster(concert);
  const bandColor = BAND_COLORS[concert.artist_name] || { primary: '#2D6F73', accent: '#B89B5E' };

  const concertDate = new Date(concert.date);
  const day   = concertDate.getDate();
  const month = concertDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/concerts/${concert.slug}`} className="block h-full group">
        <div className="h-full bg-card border border-border rounded-card shadow-card transition-all duration-250 group-hover:-translate-y-1 group-hover:border-gold group-hover:shadow-card-hover overflow-hidden flex flex-col">

          {/* Concert Poster Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-surface flex-shrink-0">
            <img
              src={posterSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110"
            />
            <img
              src={posterSrc}
              alt={concert.title}
              className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
            {/* Date badge overlay */}
            <div
              className="absolute z-20 top-3 left-3 flex flex-col items-center justify-center w-12 h-12 rounded-md shadow-lg text-white"
              style={{ backgroundColor: bandColor.primary }}
            >
              <span className="text-base font-black font-display leading-none">{day}</span>
              <span className="text-[9px] font-mono font-bold tracking-wider">{month}</span>
            </div>

            {/* Featured badge */}
            {concert.is_featured && (
              <div className="absolute z-20 top-3 right-3 flex items-center gap-1 bg-accent text-[#0D1117] px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Star className="w-2.5 h-2.5" fill="currentColor" /> Featured
              </div>
            )}

            {/* Status bar */}
            <div
              className="absolute z-20 bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: bandColor.primary }}
            />
          </div>

          {/* Concert Info */}
          <div className="p-5 flex flex-col flex-1 gap-3">

            {/* Artist badge */}
            <span
              className="text-[10px] font-bold font-mono uppercase tracking-wider"
              style={{ color: bandColor.accent }}
            >
              {concert.artist_name || 'LIVE CONCERT'}
            </span>

            {/* Title */}
            <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2 -mt-1">
              {concert.title}
            </h3>

            {/* Venue */}
            {concert.venue && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{concert.venue.name}, {concert.venue.city}</span>
              </div>
            )}

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
              <div>
                <p className="text-[10px] text-muted font-mono uppercase">From</p>
                <p className="text-sm font-bold text-text-primary">{formatCurrency(minPrice)}</p>
              </div>
              <span
                className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
                style={{ color: bandColor.accent }}
              >
                Book <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ConcertCard;
