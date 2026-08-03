import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Ticket, MapPin, Calendar, ArrowRight, Music, ChevronDown,
  Quote, CheckCircle2, HelpCircle, ChevronUp
} from 'lucide-react';
import { concertService } from '../services';
import { getImageUrl, getConcertPoster, ARTIST_COVERS } from '../services/api';
import { formatDateShort, formatCurrency, formatCountdown } from '../utils';
import HeroSection from '../components/home/HeroSection';
import FeaturedArtists from '../components/home/FeaturedArtists';
import Layout from '../components/layout/Layout';

/* ─── Band Color Map ─── */
const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7' },
};

/* ─── Default Concert Shows ─── */
const DEFAULT_SHOWS = [
  { id: 'c1', number: '01', title: "CRAYON CASE '26", subtitle: "LIVE AT ISTORA SENAYAN", artist_name: "Crayon Case", desc: "Experience the monumental live tour of Crayon Case. Featuring Catch Twenty-three!! EP tracks and single 'Surabaya' with immersive noise-pop visuals.", image: ARTIST_COVERS['Crayon Case'], date: "2026-11-15", location: "Istora Senayan, Jakarta", startingPrice: 350000, slug: "crayon-case-live-in-jakarta-2026" },
  { id: 'c2', number: '02', title: "REALITY CLUB TOUR", subtitle: "THE PALLAS JAKARTA", artist_name: "Reality Club", desc: "Dreamy nostalgic vibes and cinematic indie rock live at The Pallas. Featuring hits from 'Never Get Better' and 'Reality Club Presents...'.", image: ARTIST_COVERS['Reality Club'], date: "2026-09-12", location: "The Pallas, Jakarta", startingPrice: 450000, slug: "reality-club-city-lights-jakarta-2026" },
  { id: 'c3', number: '03', title: "THE MILO ACOUSTIC", subtitle: "THE KASABLANKA HALL", artist_name: "The Milo", desc: "Pioneers of Indonesian shoegaze bring warm acoustic-electric performances, featuring classics from 'Let Me Begin' and 'Photograph'.", image: ARTIST_COVERS['The Milo'], date: "2026-10-05", location: "Kasablanka Hall, Jakarta", startingPrice: 350000, slug: "the-milo-acoustic-jakarta-2026" },
  { id: 'c4', number: '04', title: "WAVE TO EARTH TOUR", subtitle: "PARKIR TIMUR SENAYAN", artist_name: "Wave to Earth", desc: "South Korean indie band Wave to Earth brings their peaceful oceanic atmosphere and rainy-day lo-fi vibes live in Jakarta.", image: ARTIST_COVERS['Wave to Earth'], date: "2026-11-08", location: "Parkir Timur Senayan, Jakarta", startingPrice: 500000, slug: "wave-to-earth-flaws-and-all-jakarta-2026" },
];

/* ─── Ticket Tiers ─── */
const TICKET_TIERS = [
  { name: 'VVIP', price: 'Rp 1.500.000', desc: 'Front row experience, soundcheck access & band meet pass.', perks: ['Front Row Seating', 'Artist Meet & Greet', 'Soundcheck Access', 'Exclusive Merch Bundle'] },
  { name: 'VIP', price: 'Rp 850.000', desc: 'Dedicated entrance, premium seating zone & merch bundle.', perks: ['Priority Seating', 'Fast Track Entry', 'VIP Merch Pack', 'Exclusive Lounge'] },
  { name: 'Tribune', price: 'Rp 500.000', desc: 'Numbered seating with elevated sightlines across the whole venue.', perks: ['Numbered Seats', 'Elevated View', 'Clear Sightlines', 'Easy Transit Access'] },
  { name: 'Festival', price: 'Rp 350.000', desc: 'Standing area closest to the stage. Feel the energy of live music.', perks: ['Floor Standing', 'Closest to Stage', 'Mobile QR Entry', 'General Admission'] },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { quote: "Hearing 'Gravits' and 'Surabaya' live in front of the main stage was an unforgettable experience. Crayon Case delivered!", name: 'Ariana D.', city: 'Jakarta', tier: 'VVIP' },
  { quote: "StageCase made securing tickets effortless. Clean interface, fast seat selection, zero hassle. Best booking platform I've used.", name: 'Bima R.', city: 'Bandung', tier: 'VIP' },
  { quote: "The live transition from 'Lyra Intro' to 'Neu Automobile' was pure genius. StageCase QR check-in took less than 10 seconds.", name: 'Clara M.', city: 'Surabaya', tier: 'Tribune' },
];

/* ─── FAQ ─── */
const FAQS = [
  { q: 'How do I receive my concert e-tickets?', a: 'Once your payment proof is submitted and verified, your digital QR code e-ticket will instantly be available under "My Tickets" and sent via email notification.' },
  { q: 'Can I pick my exact seats during booking?', a: 'Yes! StageCase features an interactive seat selection layout for seated categories where you can pick your preferred row and seat number.' },
  { q: 'What payment methods are supported?', a: 'We accept direct bank transfers (BCA, Mandiri) as well as GoPay and QRIS digital wallet payments.' },
  { q: 'Can I transfer or cancel my ticket reservation?', a: 'Ticket transfers are supported via your account profile up to 48 hours before the performance doors open.' },
];

export default function Landing() {
  const [currentShowIdx, setCurrentShowIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { data: concertsData } = useQuery({
    queryKey: ['upcoming-concerts'],
    queryFn: () => concertService.list({ limit: 6, status: 'upcoming' }),
    select: d => d.data.data,
  });

  const backendConcerts = concertsData || [];

  const featuredList = backendConcerts.length > 0
    ? backendConcerts.map((c, i) => ({
        id: c.id,
        number: `0${i + 1}`,
        title: c.title.toUpperCase(),
        subtitle: c.venue ? `${c.venue.name}, ${c.venue.city}`.toUpperCase() : 'LIVE TOUR 2026',
        artist_name: c.artist_name || '',
        desc: c.description || DEFAULT_SHOWS[i % DEFAULT_SHOWS.length]?.desc,
        image: getConcertPoster(c),
        date: c.date,
        location: c.venue ? `${c.venue.name}, ${c.venue.city}` : 'Jakarta, Indonesia',
        startingPrice: c.ticketCategories?.length ? Math.min(...c.ticketCategories.map(cat => parseFloat(cat.price))) : 350000,
        slug: c.slug,
      }))
    : DEFAULT_SHOWS;

  const activeShow = featuredList[currentShowIdx] || DEFAULT_SHOWS[0];

  useEffect(() => {
    if (!activeShow?.date) return;
    const interval = setInterval(() => setCountdown(formatCountdown(activeShow.date)), 1000);
    return () => clearInterval(interval);
  }, [activeShow]);

  const handleNext = () => setCurrentShowIdx(p => (p + 1) % featuredList.length);
  const handlePrev = () => setCurrentShowIdx(p => (p - 1 + featuredList.length) % featuredList.length);

  return (
    <Layout>
      <div className="min-h-screen bg-background text-text-primary flex flex-col">

      {/* ══ 1. HERO SECTION ══ */}
      <HeroSection
        featuredConcert={activeShow}
        featuredList={featuredList}
        currentShowIdx={currentShowIdx}
        onNext={handleNext}
        onPrev={handlePrev}
        countdown={countdown}
      />

      {/* ══ 2. FEATURED ARTISTS ══ */}
      <FeaturedArtists concerts={backendConcerts} />



      {/* ══ 4. UPCOMING TOUR DATES ══ */}
      <section className="py-20 bg-bg-secondary border-t border-border">
        <div className="container-premium">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Official Schedule</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Upcoming Tour Dates</h2>
            </div>
            <Link to="/concerts" className="btn-secondary text-xs py-2.5 px-5">
              View Full Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredList.slice(0, 3).map((show, idx) => {
              const bandColor = BAND_COLORS[show.artist_name] || { primary: '#2D6F73', accent: '#B89B5E' };
              return (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link to={`/concerts/${show.slug}`} className="group block h-full">
                    <div className="h-full bg-card border border-border rounded-card overflow-hidden shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-gold hover:shadow-card-hover">
                      
                      {/* Concert Image */}
                      <div className="aspect-video relative overflow-hidden bg-surface">
                        <img src={show.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" />
                        <img src={show.image} alt={show.title} className="relative z-10 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        <div 
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono uppercase tracking-wider"
                          style={{ backgroundColor: bandColor.primary, color: '#F3F4F6' }}
                        >
                          {formatDateShort(show.date)}
                        </div>
                      </div>

                      {/* Concert Info */}
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-xs font-mono mb-1" style={{ color: bandColor.accent }}>{show.artist_name}</p>
                          <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent transition-colors leading-tight">{show.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{show.location}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div>
                            <p className="text-[10px] text-muted font-mono uppercase">From</p>
                            <p className="text-sm font-bold text-text-primary">{formatCurrency(show.startingPrice)}</p>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2.5 transition-all">
                            <Ticket className="w-3.5 h-3.5" /> Get Tickets
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 5. TICKET TIERS ══ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container-premium">
          
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Seating Options</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Ticket Categories</h2>
            <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto">Choose your preferred seating tier for any upcoming live concert on the StageCase platform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TICKET_TIERS.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-card border border-border rounded-card p-6 shadow-card hover:-translate-y-1 hover:border-gold transition-all duration-250 flex flex-col"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-3 py-1 mb-3">
                    <Ticket className="w-3 h-3 text-primary" />
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{tier.name}</span>
                  </div>
                  <p className="text-2xl font-black font-display text-text-primary">{tier.price}</p>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">{tier.desc}</p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/concerts" className="btn-ghost text-xs py-2.5 text-center">
                  Select Category
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. TESTIMONIALS ══ */}
      <section className="py-20 bg-bg-secondary border-t border-border">
        <div className="container-premium">
          
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Social Proof</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">What Concertgoers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-card p-6 shadow-card flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-5 h-5 text-accent mb-3 opacity-80" />
                  <p className="text-xs text-text-secondary leading-relaxed italic mb-6">"{item.quote}"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{item.name}</p>
                    <p className="text-[11px] text-muted">{item.city}</p>
                  </div>
                  <span className="badge-gold">{item.tier}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. FAQ ══ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container-premium max-w-3xl">
          
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Help Center</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-card border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left p-5 text-sm font-medium text-text-primary hover:text-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-muted shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    {isOpen 
                      ? <ChevronUp className="w-4 h-4 text-muted shrink-0" /> 
                      : <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                    }
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  </Layout>
  );
}
