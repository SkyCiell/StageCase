import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SCLogo from '../../components/SCLogo';
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
            Join The Audience
          </span>
          <h2 className="font-display font-bold text-4xl xl:text-5xl text-text-primary leading-tight">
            NEVER MISS A LIVE CONCERT PERFORMANCE.
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md">
            Create an account to gain instant access to presales, personalized tour notifications, and seamless e-ticketing.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-border flex items-center justify-between text-xs text-muted font-mono">
          <span>JOIN 50,000+ FANS</span>
          <span className="text-accent">FREE REGISTRATION</span>
        </div>
      </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-between p-8 sm:p-12 bg-background overflow-y-auto">
        
        <div className="lg:hidden mb-6">
          <Link to="/" className="flex items-center gap-3">
            <SCLogo size={32} />
            <span className="font-display font-bold text-lg text-text-primary">StageCase</span>
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm mx-auto space-y-5">
          <div>
            <span className="badge-gold text-[10px] uppercase tracking-wider mb-2">Create Account</span>
            <h1 className="font-display font-bold text-3xl text-text-primary">Join StageCase</h1>
            <p className="text-text-secondary text-xs mt-1">Get started to book tickets and explore live music shows.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="input-premium pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-premium pl-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="input-premium pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-premium pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-semibold justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center">
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center pt-6 text-[11px] text-muted font-mono">
          Protected by StageCase Auth • All rights reserved
        </div>
      </div>
    </div>
  );
}
