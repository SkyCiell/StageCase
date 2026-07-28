import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SCLogo from '../../components/SCLogo';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields.');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}! 🎵`);
      navigate(user.role === 'admin' ? '/admin' : '/concerts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-text-primary">

      {/* ── LEFT SIDE — Editorial Graphic ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-bg-secondary flex-col justify-between p-16 border-r border-border">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <SCLogo size={34} />
            <span className="font-display font-bold text-text-primary tracking-wide text-base group-hover:text-accent transition-colors">
              StageCase
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-4">
          <span className="badge-jade text-[10px] uppercase tracking-wider">
            Live Concert Booking Platform
          </span>
          <h2 className="font-display font-bold text-4xl xl:text-5xl text-text-primary leading-tight">
            BE PART OF THE LIVE SOUND EXPERIENCE.
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md">
            Access exclusive seating, priority ticket drops, and digital QR passes for Crayon Case, Reality Club, The Milo, and Wave to Earth.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-border flex items-center justify-between text-xs text-muted font-mono">
          <span>EST. 2026</span>
          <span className="text-accent">INDONESIA TOUR</span>
        </div>
      </div>

      {/* ── RIGHT SIDE — Authentication Form ── */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-between p-8 sm:p-12 bg-background">
        
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-3">
            <SCLogo size={32} />
            <span className="font-display font-bold text-lg text-text-primary">StageCase</span>
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm mx-auto space-y-6">
          <div>
            <span className="badge-gold text-[10px] uppercase tracking-wider mb-2">Member Portal</span>
            <h1 className="font-display font-bold text-3xl text-text-primary">Welcome back</h1>
            <p className="text-text-secondary text-xs mt-1">Enter your credentials to manage your tickets and bookings.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input-premium pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="input-premium pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-semibold justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 border-t border-border text-center">
            <p className="text-xs text-text-secondary">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-accent font-semibold hover:underline ml-1">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center pt-8 text-[11px] text-muted font-mono">
          Protected by StageCase Auth • All rights reserved
        </div>
      </div>
    </div>
  );
}
