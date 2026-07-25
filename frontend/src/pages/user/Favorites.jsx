import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { favoriteService } from '../../services';
import Layout from '../../components/layout/Layout';
import ConcertCard from '../../components/concert/ConcertCard';
import { ConcertCardSkeleton } from '../../components/ui/Skeleton';

export default function Favorites() {
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.list(),
    select: d => d.data.data,
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium">

          {/* Header */}
          <div className="border-b border-white/[0.06] pb-8 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-[1px] bg-bronze" />
              <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
                Saved Performances
              </span>
            </div>
            <h1
              className="font-display font-black text-ivory leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Favorite Shows
            </h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <ConcertCardSkeleton key={i} />)}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((fav, i) => (
                <ConcertCard key={fav.id} concert={fav.concert} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-white/[0.06] p-8 max-w-xl mx-auto">
              <p className="text-4xl mb-4 opacity-20">🖤</p>
              <h3 className="font-display font-bold text-xl text-ivory mb-2">No Saved Shows</h3>
              <p className="text-text-secondary text-xs mb-8">Click the heart icon on any concert page to save it here.</p>
              <Link to="/concerts" className="btn-primary px-8 py-3.5 text-xs tracking-wider">
                Browse Concerts
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
