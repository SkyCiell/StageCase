import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

/**
 * Cinematic Concert Card
 * Editorial-style poster card with asymmetric layout
 * NOT a generic rounded card in a grid
 */
export default function ConcertCard({ concert, index = 0, variant = 'poster' }) {
  const {
    id,
    title,
    artist,
    date,
    venue,
    poster_url,
    category,
    ticket_price_min,
    ticket_price_max,
    available_seats
  } = concert;

  const formattedDate = date ? format(new Date(date), 'MMM dd, yyyy') : '';
  const formattedTime = date ? format(new Date(date), 'HH:mm') : '';

  // Staggered animation delay
  const animationDelay = index * 0.1;

  if (variant === 'poster') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ 
          duration: 0.8, 
          delay: animationDelay,
          ease: [0.22, 0.61, 0.36, 1] 
        }}
      >
        <Link to={`/concerts/${id}`} className="block group">
          {/* Poster Image */}
          <div className="card-poster mb-6 relative">
            <div className="poster-image absolute inset-0">
              <img 
                src={poster_url} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gradient overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
            
            {/* Category badge */}
            {category && (
              <div className="absolute top-4 left-4 z-10">
                <span className="badge-bronze">{category}</span>
              </div>
            )}

            {/* Availability indicator */}
            {available_seats !== undefined && (
              <div className="absolute top-4 right-4 z-10">
                {available_seats > 0 ? (
                  <span className="badge-forest">
                    <TicketIcon className="w-3 h-3" />
                    {available_seats} left
                  </span>
                ) : (
                  <span className="badge-error">Sold Out</span>
                )}
              </div>
            )}

            {/* Content overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="headline-small text-ivory group-hover:text-bronze transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-base text-text-secondary font-medium">
                    {artist}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4" />
                    {venue}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price info below poster */}
          <div className="flex items-center justify-between px-2">
            <span className="text-label text-text-muted">Starting from</span>
            <span className="text-lg font-semibold text-amber">
              ${ticket_price_min?.toLocaleString()}
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'editorial') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ 
          duration: 1, 
          delay: animationDelay,
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="editorial-grid gap-0"
      >
        <Link to={`/concerts/${id}`} className="col-span-12 group">
          <div className="relative overflow-hidden">
            {/* Large image - takes more space */}
            <div className="card-editorial h-[60vh] md:h-[70vh] relative overflow-hidden clip-editorial">
              <img 
                src={poster_url} 
                alt={title}
                className="card-editorial-image absolute inset-0"
              />
              
              {/* Text overlay - asymmetric position */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
                <div className="max-w-3xl space-y-6">
                  {/* Category */}
                  {category && (
                    <span className="badge-bronze">{category}</span>
                  )}

                  {/* Title */}
                  <h2 className="headline-display text-ivory">
                    {title}
                  </h2>

                  {/* Artist */}
                  <p className="text-2xl md:text-3xl font-semibold text-bronze">
                    {artist}
                  </p>

                  {/* Event info */}
                  <div className="flex flex-wrap items-center gap-6 text-base text-ivory">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {formattedDate} · {formattedTime}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5" />
                      {venue}
                    </span>
                    <span className="flex items-center gap-2">
                      <TicketIcon className="w-5 h-5" />
                      From ${ticket_price_min?.toLocaleString()}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <button className="btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Compact variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay,
        ease: [0.22, 0.61, 0.36, 1] 
      }}
    >
      <Link 
        to={`/concerts/${id}`} 
        className="card-vinyl overflow-hidden group flex gap-6 p-6 hover:bg-surface-light"
      >
        {/* Album-style square image */}
        <div className="image-vinyl w-32 h-32 flex-shrink-0 relative overflow-hidden">
          <img 
            src={poster_url} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {category && (
              <span className="badge-minimal">{category}</span>
            )}
            <h3 className="headline-small text-ivory group-hover:text-bronze transition-colors truncate">
              {title}
            </h3>
            <p className="text-base text-text-secondary font-medium">
              {artist}
            </p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1 text-sm text-text-muted">
              <p className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                {formattedDate}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4" />
                {venue}
              </p>
            </div>
            <span className="text-lg font-semibold text-amber whitespace-nowrap">
              ${ticket_price_min?.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/**
 * Concert Grid Layout
 * Asymmetric editorial grid for concerts
 */
export function ConcertGrid({ concerts, variant = 'poster' }) {
  if (variant === 'poster') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {concerts?.map((concert, index) => (
          <ConcertCard 
            key={concert.id} 
            concert={concert} 
            index={index}
            variant="poster"
          />
        ))}
      </div>
    );
  }

  if (variant === 'editorial') {
    return (
      <div className="space-y-16">
        {concerts?.map((concert, index) => (
          <ConcertCard 
            key={concert.id} 
            concert={concert} 
            index={index}
            variant="editorial"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {concerts?.map((concert, index) => (
        <ConcertCard 
          key={concert.id} 
          concert={concert} 
          index={index}
          variant="compact"
        />
      ))}
    </div>
  );
}
