import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
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
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium max-w-3xl">

          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 border-b border-border pb-6 mb-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Personal Inbox</p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
                Notifications
              </h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer text-accent hover:text-accent"
              >
                <CheckCheck className="w-4 h-4" /> Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-xs text-muted font-mono tracking-widest uppercase">
              Loading Notifications...
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`bg-card border p-5 rounded-card shadow-card transition-all duration-200 ${
                    !n.is_read
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-display font-bold text-text-primary text-sm">{n.title}</h4>
                    <span className="text-[10px] text-muted font-mono shrink-0">{formatRelativeTime(n.created_at)}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed font-sans">{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-card text-center p-12 max-w-md mx-auto shadow-card space-y-3">
              <Bell className="w-10 h-10 text-muted mx-auto" />
              <h3 className="font-display font-bold text-lg text-text-primary">Inbox Empty</h3>
              <p className="text-xs text-text-secondary">You have no unread notifications or tour activity alerts.</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
