import { useState, type FormEvent } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (await login(password)) {
        window.location.reload(); // Refresh to update ProtectedRoute state
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7f3] p-4">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-40" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] sm:p-12"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#101810] text-white shadow-xl shadow-black/10">
            <Lock size={28} />
          </div>
          
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-[#101410]">
            Admin Access
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-black/50">
            Secure gateway for CMR Studio management.<br />
            Please enter your administrative password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`h-14 w-full rounded-2xl border bg-[#f9faf8] px-5 py-4 text-center text-lg outline-none transition-all placeholder:text-black/25 ${
                error 
                  ? 'border-red-200 bg-red-50 text-red-900 ring-4 ring-red-100' 
                  : 'border-black/5 focus:border-[#91c642] focus:bg-white focus:ring-4 focus:ring-[#91c642]/10'
              }`}
              autoFocus
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-7 left-0 right-0 text-center text-xs font-semibold text-red-500"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group mt-12 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#101810] text-lg font-bold text-white transition-all hover:bg-black active:scale-[0.98]"
          >
            {submitting ? 'Authenticating...' : 'Authenticate'}
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2 border-t border-black/5 pt-8">
          <ShieldCheck size={16} className="text-[#6f9d24]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f9d24]">
            Encrypted Session
          </span>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed -left-20 -top-20 h-96 w-96 rounded-full bg-[#91c642]/10 blur-[100px]" />
      <div className="fixed -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#101810]/5 blur-[100px]" />
    </div>
  );
}
