import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SCLogo from '../../components/SCLogo';
import Input from '../../components/ui/Input';
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
    <div className="min-h-screen flex bg-background">

      {/* ══════════════════════════════════════════
          LEFT SIDE — Editorial Vinyl / Poster Graphic
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-graphite flex-col justify-between p-16">
        {/* Vinyl Grooves Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-vinyl-grooves pointer-events-none" />

        {/* Ambient bronze glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bronze/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <SCLogo size={32} />
            <span className="font-display font-black text-ivory tracking-[0.2em] text-sm uppercase group-hover:text-bronze transition-colors">
              StageCase
            </span>
          </Link>
        </div>

        {/* Center Quote / Art */}
        <div className="relative z-10 my-auto max-w-lg">
          <p className="text-[10px] text-bronze uppercase tracking-[0.3em] font-semibold mb-6 flex items-center gap-3">
            <span className="w-6 h-[1px] bg-bronze" />
            Crayon Case Tour Platform
          </p>
          <h2
            className="font-display font-black text-ivory leading-[0.92] tracking-tighter mb-8"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)' }}
          >
            BE PART OF THE LIVE SOUND.
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md font-sans">
            Access exclusive seating, priority ticket drops, and digital collectible tickets for Crayon Case performances nationwide.
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-8 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-muted">
          <span className="tracking-widest uppercase font-mono">EST. 2026</span>
          <span className="tracking-widest uppercase">INDONESIA TOUR</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT SIDE — Authentication Form
      ══════════════════════════════════════════ */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-between p-8 sm:p-14 bg-background border-l border-white/[0.06]">

        {/* Mobile Header */}
        <div className="lg:hidden mb-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <SCLogo size={32} />
            <span className="font-display font-bold text-xl text-ivory tracking-wider">StageCase</span>
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-[1px] bg-bronze" />
              <span className="text-[10px] text-bronze tracking-[0.2em] uppercase font-semibold">
                Sign In
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl text-ivory tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-text-secondary text-xs leading-relaxed">
              Enter your credentials to manage your tickets and bookings.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@domain.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <div>
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="text-text-muted hover:text-ivory transition-colors text-xs tracking-wider uppercase font-mono"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                }
              />
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-[11px] text-bronze hover:text-amber transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-xs font-bold tracking-[0.2em] uppercase mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-text-secondary">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-bronze font-semibold hover:text-amber transition-colors ml-1">
                Create one now →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8 text-[11px] text-text-muted">
          Protected by StageCase Auth • All rights reserved
        </div>
      </div>
    </div>
  );
}
