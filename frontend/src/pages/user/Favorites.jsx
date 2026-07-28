import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';
import { favoriteService } from '../../services';
import Layout from '../../components/layout/Layout';
import ConcertCard from '../../components/concert/ConcertCard';
import { ConcertGridSkeleton } from '../../components/ui/SkeletonLoader';

export default function Favorites() {
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.list(),
    select: d => d.data.data,
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Saved Shows</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-3">
              Favorite Concerts
            </h1>
            <p className="text-text-secondary text-sm max-w-lg">
              Your personal watchlist of saved live concert performances and upcoming tour dates.
            </p>
          </div>

          {isLoading ? (
            <ConcertGridSkeleton count={3} />
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav, i) => (
                <ConcertCard key={fav.id} concert={fav.concert} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-card text-center p-12 max-w-md mx-auto shadow-card space-y-4">
              <Heart className="w-12 h-12 text-muted mx-auto" />
              <h3 className="font-display font-bold text-xl text-text-primary">No Saved Shows Yet</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Click the heart icon on any concert page to save upcoming live shows to your watchlist.
              </p>
              <Link to="/concerts" className="btn-primary text-xs py-3 px-6 justify-center inline-flex">
                <Compass className="w-4 h-4" /> Explore Concerts
              </Link>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
