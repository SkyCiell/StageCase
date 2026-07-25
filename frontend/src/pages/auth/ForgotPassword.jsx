import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services';
import SCLogo from '../../components/SCLogo';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-10">
          <SCLogo size={40} />
          <span className="font-display font-bold text-2xl text-ivory">StageCase</span>
        </div>

        {sent ? (
          <div className="glass p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="font-display font-bold text-2xl text-ivory mb-3">Check your inbox</h2>
            <p className="text-text-secondary text-sm mb-6">
              If an account exists for <span className="text-ivory font-medium">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="btn-primary block text-center">Back to Login</Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-display font-bold text-3xl text-ivory mb-2">Forgot password?</h2>
              <p className="text-text-secondary text-sm">Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button type="submit" loading={loading} fullWidth size="lg">
                Send Reset Link
              </Button>
            </form>
            <p className="text-center text-sm text-text-secondary mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-jade font-medium">Sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
