import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services';
import Layout from '../../components/layout/Layout';
import { formatRelativeTime } from '../../utils';

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.list(),
    select: d => d.data.data,
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium max-w-3xl">

          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 border-b border-white/[0.06] pb-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-[1px] bg-bronze" />
                <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
                  Personal Inbox
                </span>
              </div>
              <h1
                className="font-display font-black text-ivory leading-none tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                Notifications
              </h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-xs text-bronze hover:text-amber tracking-wider uppercase font-semibold transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-xs text-text-muted font-mono tracking-widest uppercase">
              Loading Inbox...
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`border p-6 transition-all duration-300 relative ${
                    !n.is_read
                      ? 'border-bronze/50 bg-bronze/5'
                      : 'border-white/[0.06] bg-surface'
                  }`}
                >
                  {!n.is_read && (
                    <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-bronze" />
                  )}
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-display font-bold text-ivory text-base tracking-tight">{n.title}</h4>
                    <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">{formatRelativeTime(n.created_at)}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed font-sans">{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-white/[0.06] p-8 max-w-xl mx-auto">
              <p className="text-4xl mb-4 opacity-20">🔔</p>
              <h3 className="font-display font-bold text-xl text-ivory mb-2">Inbox Empty</h3>
              <p className="text-text-secondary text-xs">You have no unread notifications or activity alerts.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
