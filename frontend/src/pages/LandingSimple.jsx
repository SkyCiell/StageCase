import { useQuery } from '@tanstack/react-query';
import { concertService } from '../services';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturedArtists from '../components/home/FeaturedArtists';
import ConcertCard from '../components/concert/ConcertCard';
import { ConcertGridSkeleton } from '../components/ui/SkeletonLoader';
import { NoConcertsFound } from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';
import { TicketStub } from '../components/ticket';
import { Link } from 'react-router-dom';

/**
 * Premium Landing Page
 * Clean, ticket-inspired layout
 */
export default function Landing() {
  // Fetch upcoming concerts
  const { data: concertsData, isLoading, error } = useQuery({
    queryKey: ['upcoming-concerts'],
    queryFn: () => concertService.list({ limit: 12, status: 'upcoming' }),
  });

  const concerts = concertsData?.data?.data || [];
  const featuredConcert = concerts[0]; // First concert as hero

  return (
    <div className="min-h-screen bg-background text-ivory">
      <Navbar />

      <PageTransition>
        {/* Hero Section */}
        {featuredConcert && <HeroSection featuredConcert={featuredConcert} />}

        {/* Featured Artists */}
        <FeaturedArtists concerts={concerts} />

        {/* Upcoming Concerts */}
        <section className="py-20 bg-graphite">
          <TicketStub label="Upcoming Concerts" accentColor="#E7B567" />

          <div className="container-premium mt-12">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-ivory mb-3 uppercase">
                  Upcoming Events
                </h2>
                <p className="text-text-secondary text-lg">
                  Secure your spot at Indonesia's best indie concerts
                </p>
              </div>

              <Link
                to="/concerts"
                className="px-6 py-3 border border-amber text-amber font-mono font-bold text-xs tracking-[0.2em] uppercase hover:bg-amber/10 transition-all"
              >
                View All →
              </Link>
            </div>

            {/* Concert Grid */}
            {isLoading ? (
              <ConcertGridSkeleton count={6} />
            ) : concerts.length === 0 ? (
              <NoConcertsFound />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {concerts.slice(0, 6).map((concert) => (
                  <ConcertCard key={concert.id} concert={concert} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why StageCase */}
        <section className="py-20 bg-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 15px)',
                 color: '#2D6F73'
               }}
          />

          <div className="container-premium relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-display font-black text-4xl sm:text-5xl text-ivory mb-4 uppercase">
                Premium Concert Experience
              </h2>
              <p className="text-text-secondary text-lg">
                Book with confidence. Verified tickets, instant delivery, seamless check-in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🎫',
                  title: 'Verified Tickets',
                  desc: 'Every ticket is authentic and verified. Digital QR passes sent instantly to your email.',
                  color: '#2D6F73'
                },
                {
                  icon: '⚡',
                  title: 'Instant Booking',
                  desc: 'Choose your seats, complete payment via Midtrans, and receive tickets within seconds.',
                  color: '#5B4A7A'
                },
                {
                  icon: '🔒',
                  title: 'Secure Payment',
                  desc: 'Protected transactions with Midtrans payment gateway. Multiple payment methods supported.',
                  color: '#6F8A58'
                }
              ].map((feature, i) => (
                <div key={i} className="boarding-pass-card p-8 text-center hover:scale-[1.02] transition-transform">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="font-display font-black text-xl text-ivory mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-6 h-[2px] bg-current opacity-30" style={{ color: feature.color }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-graphite to-black text-center">
          <div className="container-premium">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display font-black text-4xl sm:text-5xl text-ivory mb-6 uppercase">
                Ready to Experience
                <br />
                <span className="text-amber">Live Music?</span>
              </h2>

              <p className="text-text-secondary text-lg mb-10">
                Browse upcoming concerts and book your premium event pass today.
              </p>

              <Link
                to="/concerts"
                className="inline-block px-10 py-4 bg-amber text-black font-mono font-bold text-sm tracking-[0.2em] uppercase hover:bg-amber/90 transition-all"
              >
                Explore Concerts
              </Link>
            </div>
          </div>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
