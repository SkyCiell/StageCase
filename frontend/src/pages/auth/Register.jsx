import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SCLogo from '../../components/SCLogo';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all required fields.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success(`Welcome to StageCase, ${user.name}! 🎵`);
      navigate('/concerts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* ══════════════════════════════════════════
          LEFT SIDE — Editorial Poster / Vinyl Graphic
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-graphite flex-col justify-between p-16">
        {/* Vinyl Grooves Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-vinyl-grooves pointer-events-none" />

        {/* Ambient bronze glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-bronze/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-12 w-72 h-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

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
            Join The Audience
          </p>
          <h2
            className="font-display font-black text-ivory leading-[0.92] tracking-tighter mb-8"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)' }}
          >
            NEVER MISS A LIVE SHOW.
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md font-sans">
            Create an account to gain instant access to presales, personalized tour notifications, and seamless e-ticketing.
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-8 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-muted">
          <span className="tracking-widest uppercase font-mono">JOIN 50,000+ FANS</span>
          <span className="tracking-widest uppercase">FREE REGISTRATION</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT SIDE — Registration Form
      ══════════════════════════════════════════ */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-between p-8 sm:p-14 bg-background border-l border-white/[0.06] overflow-y-auto">

        {/* Mobile Header */}
        <div className="lg:hidden mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <SCLogo size={32} />
            <span className="font-display font-bold text-xl text-ivory tracking-wider">StageCase</span>
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-[1px] bg-bronze" />
              <span className="text-[10px] text-bronze tracking-[0.2em] uppercase font-semibold">
                Register
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl text-ivory tracking-tight mb-2">
              Create account
            </h1>
            <p className="text-text-secondary text-xs leading-relaxed">
              Fill in your details below to set up your StageCase profile.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              name="name"
              placeholder="e.g. Maya Lin"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address *"
              name="email"
              type="email"
              placeholder="name@domain.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+62 812 3456 7890"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              label="Password *"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirm Password *"
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              error={form.confirmPassword && form.password !== form.confirmPassword ? 'Passwords do not match' : ''}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-xs font-bold tracking-[0.2em] uppercase mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-[11px] text-text-muted text-center leading-relaxed">
            By registering, you agree to our{' '}
            <a href="#" className="text-bronze hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-bronze hover:underline">Privacy Policy</a>.
          </p>

          {/* Sign In Link */}
          <div className="pt-5 border-t border-white/[0.06] text-center">
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-bronze font-semibold hover:text-amber transition-colors ml-1">
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-6 text-[11px] text-text-muted">
          Protected by StageCase Auth • All rights reserved
        </div>
      </div>
    </div>
  );
}
