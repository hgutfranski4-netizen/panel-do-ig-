import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  SmartphoneIcon, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Bot 
} from 'lucide-react';
import { platforms } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LandingPageProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setShowAuth: (show: boolean) => void;
  activePlatform: any;
  setActivePlatform: (platform: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  setShowAuth,
  activePlatform,
  setActivePlatform
}) => {
  return (
    <div className="min-h-screen bg-brand-dark selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <SmartphoneIcon className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">ONIMATOR</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#platforms" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Platforms</a>
              <a href="#safety" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Safety</a>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all"
              >
                Get Started
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-400">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden glass border-t border-white/5 p-4 flex flex-col gap-4"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Features</a>
              <a href="#platforms" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Platforms</a>
              <a href="#safety" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Safety</a>
              <button 
                onClick={() => { setShowAuth(true); setIsMenuOpen(false); }}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} /> The Future of Social Automation
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              Scale Your Presence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">On Real Devices</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Onimator offers the most complete automation suite for Instagram and Tinder. 
              Protect your accounts with human-like behavior.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setShowAuth(true)}
                className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
              >
                Start Growing Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Device Mockup / Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative max-w-4xl mx-auto"
          >
            <div className="aspect-video glass rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 p-2 relative">
              <div className="w-full h-full bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 flex flex-col gap-6 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Header */}
                <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex gap-4">
                    <div className="w-32 h-8 bg-white/5 rounded-lg" />
                    <div className="w-24 h-8 bg-white/5 rounded-lg" />
                    <div className="w-24 h-8 bg-white/5 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-8 bg-white/5 rounded-lg" />
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">
                      <Zap size={20} />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 grid grid-cols-3 gap-6 flex-1">
                  <div className="col-span-2 bg-white/[0.02] rounded-xl border border-white/5 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="w-48 h-6 bg-white/10 rounded-md" />
                      <div className="flex gap-2">
                        <div className="w-16 h-6 bg-white/5 rounded-md" />
                        <div className="w-16 h-6 bg-white/5 rounded-md" />
                      </div>
                    </div>
                    <div className="flex-1 mt-4 bg-gradient-to-t from-orange-500/10 to-transparent rounded-lg border-b-2 border-orange-500 relative">
                      <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,90 L10,85 L20,60 L30,65 L40,40 L50,50 L60,20 L70,30 L80,10 L90,15 L100,5" fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-6 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px]" />
                      <div className="w-24 h-4 bg-white/10 rounded-md mb-4 relative z-10" />
                      <div className="text-5xl font-black text-white mb-2 relative z-10">99.9%</div>
                      <div className="text-sm text-green-500 font-bold relative z-10">+0.1% uptime</div>
                    </div>
                    <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-6 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px]" />
                      <div className="w-32 h-4 bg-white/10 rounded-md mb-4 relative z-10" />
                      <div className="text-5xl font-black text-white mb-2 relative z-10">14,205</div>
                      <div className="text-sm text-orange-500 font-bold relative z-10">Active Automations</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="glass p-6 rounded-3xl flex items-center gap-6 shadow-2xl backdrop-blur-xl border-white/20 pointer-events-auto">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                       <CheckCircle2 size={32} />
                    </div>
                    <div className="text-left">
                       <p className="font-black text-2xl text-white mb-1">Campaign Active</p>
                       <p className="text-zinc-300 font-medium">1,240 actions completed today</p>
                    </div>
                 </div>
              </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <ShieldCheck />
                </div>
                <div className="text-left">
                  <p className="text-xs text-zinc-400 font-medium">Account Safety</p>
                  <p className="text-sm font-bold">100% Human-like</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platforms Selector */}
      <section id="platforms" className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Multi-Platform Mastery</h2>
            <p className="text-zinc-400">One tool to rule all your social channels.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border",
                  activePlatform.id === platform.id 
                    ? "bg-white text-black border-white" 
                    : "glass text-zinc-400 border-white/5 hover:border-white/20"
                )}
              >
                <platform.icon size={20} />
                {platform.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-8">
                <div>
                  <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br mb-6 flex items-center justify-center text-white", activePlatform.color)}>
                    <activePlatform.icon size={32} />
                  </div>
                  <h3 className="text-4xl font-black mb-4">{activePlatform.name} Automation</h3>
                  <p className="text-xl text-zinc-400 leading-relaxed">
                    {activePlatform.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {activePlatform.features.map((feature: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl glass hover:bg-white/10 transition-colors">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <feature.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{feature.title}</h4>
                        <p className="text-sm text-zinc-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform">
                  Explore {activePlatform.name} Features
                </button>
              </div>

              <div className="relative">
                <div className={cn("absolute inset-0 bg-gradient-to-br blur-[100px] opacity-20 -z-10", activePlatform.color)} />
                <div className="aspect-square glass rounded-[40px] overflow-hidden relative group">
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent" />
                   <div className="absolute inset-0 flex items-center justify-center p-8">
                       <div className="text-center space-y-4 relative z-10">
                          <activePlatform.icon size={120} className="mx-auto text-white drop-shadow-2xl" />
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-white/20 rounded-full mx-auto backdrop-blur-md" />
                            <div className="h-4 w-32 bg-white/20 rounded-full mx-auto backdrop-blur-md" />
                            <div className="h-4 w-40 bg-white/20 rounded-full mx-auto backdrop-blur-md" />
                          </div>
                       </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Safety / Real Devices Section */}
      <section id="safety" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-[48px] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[100px] -z-10" />
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                  Real Android Devices. <br />
                  <span className="text-orange-500">Zero Emulators.</span>
                </h2>
                <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
                  Most bots use emulators or browser scripts that are easily detected. 
                  Onimator runs on real Android hardware, ensuring every action—from scrolling to liking—looks 100% natural to platform algorithms.
                </p>
                
                <ul className="space-y-6">
                  {[
                    "Human-like timings and randomized actions",
                    "Real device fingerprints and hardware IDs",
                    "Safe and reliable growth cycles",
                    "No risky browser-based automation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-[3/4] glass rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] group-hover:bg-orange-500/20 transition-colors" />
                    <div className="relative z-10">
                      <SmartphoneIcon className="text-orange-500 mb-4" size={32} />
                      <p className="font-bold text-lg">Real Hardware</p>
                      <p className="text-sm text-zinc-400 mt-1">Physical Android devices</p>
                    </div>
                  </div>
                  <div className="aspect-[3/4] glass rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] group-hover:bg-blue-500/20 transition-colors" />
                    <div className="relative z-10">
                      <Users className="text-blue-500 mb-4" size={32} />
                      <p className="font-bold text-lg">Safe Growth</p>
                      <p className="text-sm text-zinc-400 mt-1">Trusted by algorithms</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-[3/4] glass rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[40px] group-hover:bg-green-500/20 transition-colors" />
                    <div className="relative z-10">
                      <ShieldCheck className="text-green-500 mb-4" size={32} />
                      <p className="font-bold text-lg">Anti-Ban</p>
                      <p className="text-sm text-zinc-400 mt-1">Advanced protection</p>
                    </div>
                  </div>
                  <div className="aspect-[3/4] glass rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] group-hover:bg-purple-500/20 transition-colors" />
                    <div className="relative z-10">
                      <Bot className="text-purple-500 mb-4" size={32} />
                      <p className="font-bold text-lg">AI Powered</p>
                      <p className="text-sm text-zinc-400 mt-1">Smart engagement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Scale?</h2>
          <p className="text-xl text-zinc-400 mb-12">
            Join thousands of creators and agencies who trust Onimator for their social growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full sm:w-auto px-12 py-6 bg-orange-500 hover:bg-orange-600 text-white text-xl font-black rounded-3xl transition-all shadow-2xl shadow-orange-500/20"
            >
              Get Started Now
            </button>
            <button className="w-full sm:w-auto px-12 py-6 glass hover:bg-white/10 text-xl font-black rounded-3xl transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <SmartphoneIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tighter">ONIMATOR</span>
              </div>
              <p className="text-zinc-500 max-w-sm leading-relaxed">
                The most advanced social automation suite running on real devices. 
                Built for creators, agencies, and businesses who need to scale safely.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Platforms</h4>
              <ul className="space-y-4 text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tinder</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
            <p>© 2026 Onimator Automation Suite. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Telegram</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
