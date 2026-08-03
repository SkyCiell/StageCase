import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Music, Calendar } from 'lucide-react';
import { ARTIST_COVERS } from '../../services/api';

const ARTISTS = [
  {
    name: 'Crayon Case',
    primary: '#2D6F73',
    accent: '#D6B46B',
    genre: 'Indie Pop · Noise Pop · Shoegaze',
    origin: 'Surabaya, East Java',
    bio: 'Surabaya indie duo Aiden and fein blending noise-pop and shoegaze guitar textures.',
    slug: '/concerts?artist=Crayon+Case',
    image: ARTIST_COVERS['Crayon Case'],
  },
  {
    name: 'Reality Club',
    primary: '#5D4E89',
    accent: '#D8C5A2',
    genre: 'Indie Rock · Indie Pop',
    origin: 'Jakarta, DKI Jakarta',
    bio: 'Indie rock band formed in Jakarta known for romantic lyrics and cinematic string arrangements.',
    slug: '/concerts?artist=Reality+Club',
    image: ARTIST_COVERS['Reality Club'],
  },
  {
    name: 'The Milo',
    primary: '#6E8B6B',
    accent: '#C9A46A',
    genre: 'Shoegaze · Dream Pop',
    origin: 'Bandung, West Java',
    bio: 'Pioneers of Indonesian shoegaze since 1996, creating wall-of-sound guitar distortion and dream pop.',
    slug: '/concerts?artist=The+Milo',
    image: ARTIST_COVERS['The Milo'],
  },
  {
    name: 'Wave to Earth',
    primary: '#4F6D8C',
    accent: '#BFCFD7',
    genre: 'Indie Rock · Jazz Pop · Lo-Fi',
    origin: 'Seoul, South Korea',
    bio: 'South Korean indie trio delivering serene, oceanic lo-fi soundscapes and soft jazz hooks.',
    slug: '/concerts?artist=Wave+to+Earth',
    image: ARTIST_COVERS['Wave to Earth'],
  },
];

/**
 * FeaturedArtists — 2-column artist card grid with band color accents
 */
export default function FeaturedArtists({ concerts = [] }) {
  return (
    <section className="py-20 bg-bg-secondary border-t border-border">
      <div className="container-premium">

        {/* Section Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">On Stage</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
              Featured Artists
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg">
              Discover premium concert experiences from Indonesia's finest indie artists and international acts.
            </p>
          </div>
          <Link to="/concerts" className="hidden md:flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent transition-colors">
            View All Concerts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Artist Cards 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTISTS.map((artist, index) => {
            const artistConcerts = concerts?.filter(c => c.artist_name === artist.name) || [];
            const upcomingConcert = artistConcerts[0];

            return (
              <motion.div
                key={artist.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Link
                  to={upcomingConcert ? `/concerts/${upcomingConcert.slug}` : artist.slug}
                  className="group block h-full"
                >
                  <div className="h-full bg-card border border-border rounded-card p-6 shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-gold hover:shadow-card-hover relative overflow-hidden">

                    {/* Top left color accent stripe */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-card"
                      style={{ backgroundColor: artist.primary }}
                    />

                    {/* Artist Badge & Name */}
                    <div className="flex items-start justify-between mb-4 pt-2">
                      <div className="flex-1 min-w-0">
                        <span 
                          className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider mb-3 border"
                          style={{ 
                            backgroundColor: `${artist.primary}20`, 
                            borderColor: `${artist.primary}40`,
                            color: artist.accent
                          }}
                        >
                          Artist Pass
                        </span>
                        <h3 className="font-display font-bold text-xl text-text-primary group-hover:text-accent transition-colors">
                          {artist.name}
                        </h3>
                      </div>

                      {/* Decorative dot pattern */}
                      <div className="grid grid-cols-4 gap-1 opacity-20 pt-1 shrink-0">
                        {[...Array(12)].map((_, i) => (
                          <span 
                            key={i} 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: artist.primary }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Genre & Origin */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Music className="w-3.5 h-3.5 text-muted" />
                        <span>{artist.genre}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <MapPin className="w-3.5 h-3.5 text-muted" />
                        <span>{artist.origin}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-text-secondary leading-relaxed mb-6 line-clamp-2">
                      {artist.bio}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex gap-2 mb-6">
                      <div 
                        className="flex-1 h-10 rounded-md opacity-80"
                        style={{ backgroundColor: artist.primary }}
                      />
                      <div 
                        className="flex-1 h-10 rounded-md opacity-60"
                        style={{ backgroundColor: artist.accent }}
                      />
                    </div>

                    {/* Concert count & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="w-3.5 h-3.5 text-muted" />
                        <span>
                          <strong className="text-text-primary font-semibold">{artistConcerts.length}</strong> Upcoming Shows
                        </span>
                      </div>
                      <span 
                        className="flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2.5"
                        style={{ color: artist.accent }}
                      >
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/concerts" className="btn-secondary text-sm px-8 py-3">
            View All Concerts <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
