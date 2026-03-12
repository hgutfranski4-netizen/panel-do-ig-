import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartphoneIcon } from 'lucide-react';

interface AuthModalProps {
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  showAuth,
  setShowAuth,
  handleLogin,
  email,
  setEmail,
  password,
  setPassword
}) => {
  return (
    <AnimatePresence>
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuth(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass p-8 rounded-[40px] border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SmartphoneIcon className="text-white" />
              </div>
              <h2 className="text-2xl font-black">Welcome Back</h2>
              <p className="text-zinc-400">Login to manage your automation fleet.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20">
                Sign In
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-zinc-500">
              Don't have an account? <span className="text-orange-500 font-bold cursor-pointer">Start Free Trial</span>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
