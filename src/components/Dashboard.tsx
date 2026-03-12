import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SmartphoneIcon, 
  UserPlus, 
  UserMinus,
  Users, 
  Zap, 
  ShieldCheck, 
  Globe, 
  ArrowRight, 
  Heart, 
  Eye, 
  MessageCircle,
  Bot,
  ListPlus,
  Send,
  MapPin,
  Flame,
  Phone,
  RefreshCw,
  Image,
  Calendar,
  Share2,
  MessageSquare,
  Settings,
  Copy,
  Server,
  Play,
  Square,
  Download,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from '@google/genai';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  activeView: string;
  selectedDevice: any;
  setSelectedDevice: (device: any) => void;
  devices: any[];
  accounts: any[];
  campaigns: any[];
  proxies: any[];
  emulators: any[];
  setEmulators: (emulators: any[]) => void;
  fetchTasks: (deviceId: number) => void;
  setShowAddDeviceModal: (show: boolean) => void;
  setShowAddAccountModal: (show: boolean) => void;
  setShowAddCampaignModal: (show: boolean) => void;
  setShowAddProxyModal: (show: boolean) => void;
  setShowTaskModal: (show: boolean) => void;
  toggleCampaign: (id: number) => void;
  deleteDevice: (id: number) => void;
  deleteAccount: (id: number) => void;
  deleteCampaign: (id: number) => void;
  deviceTasks: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeView,
  selectedDevice,
  setSelectedDevice,
  devices,
  accounts,
  campaigns,
  proxies,
  emulators,
  setEmulators,
  fetchTasks,
  setShowAddDeviceModal,
  setShowAddAccountModal,
  setShowAddCampaignModal,
  setShowAddProxyModal,
  setShowTaskModal,
  toggleCampaign,
  deleteDevice,
  deleteAccount,
  deleteCampaign,
  deviceTasks
}) => {
  const [outreachTargets, setOutreachTargets] = React.useState([
    { id: 1, username: '@cristiano', type: 'followers', status: 'Scraping...', count: 1250 },
    { id: 2, username: '@nike', type: 'following', status: 'Completed', count: 450 }
  ]);
  const [newTarget, setNewTarget] = React.useState('');
  const [targetType, setTargetType] = React.useState('followers');
  const [commentTemplate, setCommentTemplate] = React.useState('Love this! 🔥\nGreat post! 🙌\nAmazing content! 💯');
  const [dmTemplate, setDmTemplate] = React.useState('Hey {username}, love your profile! Would you be interested in a collaboration?');
  const [swipeSettings, setSwipeSettings] = React.useState({ rightSwipePercent: 80, delay: 3, location: 'Los Angeles, CA' });
  const [creatorSettings, setCreatorSettings] = React.useState({ phoneApi: 'smspool', bioTemplate: 'Hey there! Add my snap: {snap}' });
  
  const [isOutreachRunning, setIsOutreachRunning] = React.useState(false);
  const [outreachLogs, setOutreachLogs] = React.useState<string[]>([]);
  const outreachIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isCheckingProxies, setIsCheckingProxies] = React.useState(false);
  const [rebootingDevices, setRebootingDevices] = React.useState<number[]>([]);
  const [isIgConnected, setIsIgConnected] = React.useState(false);
  const [connectedIgAccount, setConnectedIgAccount] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Check if already connected on mount
    fetch('/api/instagram/status')
      .then(res => res.json())
      .then(data => {
        if (data.connected && data.username) {
          setIsIgConnected(true);
          setConnectedIgAccount(data.username);
        }
      })
      .catch(err => console.error('Failed to check IG status:', err));
  }, []);
  const [isIgConnecting, setIsIgConnecting] = React.useState(false);
  const [igEngagementRunning, setIgEngagementRunning] = React.useState({
    reels: false,
    story: false,
    follow: false
  });
  const [followTarget, setFollowTarget] = React.useState('');
  
  const [showIgLoginModal, setShowIgLoginModal] = React.useState(false);
  const [igUsername, setIgUsername] = React.useState('');
  const [igPassword, setIgPassword] = React.useState('');
  const [igLoginError, setIgLoginError] = React.useState('');
  
  const [setupEmulator, setSetupEmulator] = React.useState<any | null>(null);
  const [setupStep, setSetupStep] = React.useState(0);
  const [showSetupModal, setShowSetupModal] = React.useState(false);
  
  const [settings, setSettings] = React.useState({
    INSTAGRAM_CLIENT_ID: '',
    INSTAGRAM_CLIENT_SECRET: '',
    SMS_API_KEY: '',
    IG_STAT_FOLLOWED: '0',
    IG_STAT_UNFOLLOWED: '0',
    IG_STAT_DMS_SENT: '0'
  });

  const [isGeneratingAI, setIsGeneratingAI] = React.useState({
    comment: false,
    dm: false
  });

  const generateWithAI = async (type: 'comment' | 'dm') => {
    setIsGeneratingAI(prev => ({ ...prev, [type]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      let prompt = '';
      if (type === 'comment') {
        prompt = "Generate 5 short, engaging, and natural-sounding Instagram comments for a lifestyle or fashion post. Return them separated by newlines, no numbers or bullet points, just the text. Example: Love this vibe! 🔥\nSo aesthetic ✨";
      } else {
        prompt = "Generate a short, friendly, and non-spammy Instagram Direct Message template for outreach. It should include the placeholder {username} to personalize it. Keep it under 2 sentences. Example: Hey {username}, love your recent posts! Would love to connect and chat about collabs.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || '';
      
      if (type === 'comment') {
        setCommentTemplate(text.trim());
      } else {
        setDmTemplate(text.trim());
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate text with AI. Please check your API key or try again later.");
    } finally {
      setIsGeneratingAI(prev => ({ ...prev, [type]: false }));
    }
  };
  const [isSavingSettings, setIsSavingSettings] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (igEngagementRunning.follow) {
      interval = setInterval(async () => {
        const isFollow = Math.random() > 0.3; // 70% chance to follow, 30% to unfollow
        const key = isFollow ? 'IG_STAT_FOLLOWED' : 'IG_STAT_UNFOLLOWED';
        const action = isFollow ? 'follow' : 'unfollow';
        
        try {
          // Call the backend to perform the actual action
          const res = await fetch('/api/instagram/action/follow-unfollow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetUsername: followTarget, action })
          });
          
          if (res.ok) {
            // Update local state
            setSettings(prev => ({
              ...prev,
              [key]: (parseInt(prev[key as keyof typeof prev] || '0') + 1).toString()
            }));

            // Persist stats to backend
            fetch('/api/settings/increment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key, amount: 1 })
            }).catch(err => console.error('Failed to update stats:', err));
          } else {
            const errorData = await res.json();
            console.error(`Failed to ${action}:`, errorData.error);
          }
        } catch (err) {
          console.error(`Error performing ${action}:`, err);
        }

      }, 10000); // Every 10 seconds to avoid rate limits
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [igEngagementRunning.follow, followTarget]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        });
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (outreachIntervalRef.current) clearInterval(outreachIntervalRef.current);
    };
  }, []);

  const startAutoSetup = (emulator: any) => {
    setSetupEmulator(emulator);
    setSetupStep(0);
    setShowSetupModal(true);
    
    const eventSource = new EventSource(`/api/emulators/${emulator.id}/setup`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSetupStep(data.step);
      
      if (data.step >= 6 || data.status === 'error') {
        eventSource.close();
        if (data.status !== 'error') {
          setTimeout(() => {
            setShowSetupModal(false);
            setEmulators(emulators.map(e => e.id === emulator.id ? { ...e, apps: ['Instagram', 'Tinder'] } : e));
          }, 2000);
        }
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setSetupStep(0);
      alert("Failed to connect to setup service.");
    };
  };

  const handleStartOutreach = async () => {
    if (isOutreachRunning) {
      setIsOutreachRunning(false);
      if (outreachIntervalRef.current) clearInterval(outreachIntervalRef.current);
      setOutreachLogs(prev => [...prev, '[System] Outreach stopped.']);
      return;
    }

    const pendingTarget = outreachTargets.find(t => t.status !== 'Completed');
    if (!pendingTarget) {
      alert("Please add a target to start the campaign.");
      return;
    }

    if (!isIgConnected) {
      alert("Please connect your Instagram account first.");
      return;
    }

    setIsOutreachRunning(true);
    setOutreachLogs([
      '[System] Initializing Mass DM engine...',
      '[API] Authenticating with Instagram...',
      `[API] Auth successful. Loading target list for ${pendingTarget.username}...`
    ]);

    try {
      const response = await fetch('/api/instagram/mass-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUsername: pendingTarget.username,
          dmTemplate: dmTemplate,
          count: 5 // Limit to 5 for safety/demo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start campaign');
      }

      setOutreachLogs(prev => [...prev, `[System] ${data.message}`]);

      // Simulate the logs for the returned targets
      if (data.targets && data.targets.length > 0) {
        let i = 0;
        outreachIntervalRef.current = setInterval(() => {
          if (i >= data.targets.length) {
            if (outreachIntervalRef.current) clearInterval(outreachIntervalRef.current);
            setIsOutreachRunning(false);
            setOutreachLogs(prev => [...prev, `[System] Campaign for ${pendingTarget.username} completed.`]);
            
            // Mark target as completed
            setOutreachTargets(prev => prev.map(t => 
              t.id === pendingTarget.id ? { ...t, status: 'Completed', count: data.targets.length } : t
            ));
            return;
          }
          
          const targetUser = data.targets[i];
          setOutreachLogs(prevLogs => {
            const newLogs = [...prevLogs, `[${new Date().toLocaleTimeString()}] [DM] Sent message to @${targetUser}`];
            return newLogs.slice(-8);
          });
          
          // Update count
          setOutreachTargets(prev => prev.map(t => 
            t.id === pendingTarget.id ? { ...t, count: i + 1, status: 'Sending...' } : t
          ));
          
          setSettings(prev => ({
            ...prev,
            IG_STAT_DMS_SENT: (parseInt(prev.IG_STAT_DMS_SENT || '0') + 1).toString()
          }));
          
          i++;
        }, 4000); // 4 seconds between logs to match backend delay
      } else {
        setIsOutreachRunning(false);
        setOutreachLogs(prev => [...prev, `[System] No targets found.`]);
      }

    } catch (error: any) {
      console.error("Outreach error:", error);
      setOutreachLogs(prev => [...prev, `[Error] ${error.message}`]);
      setIsOutreachRunning(false);
    }
  };

  const handleCheckProxies = () => {
    if (isCheckingProxies) return;
    setIsCheckingProxies(true);
    setTimeout(() => setIsCheckingProxies(false), 3000);
  };

  const handleReboot = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setRebootingDevices(prev => [...prev, id]);
    setTimeout(() => setRebootingDevices(prev => prev.filter(dId => dId !== id)), 5000);
  };

  const [isGeneratingAccount, setIsGeneratingAccount] = React.useState(false);
  const [generationLogs, setGenerationLogs] = React.useState<string[]>([]);
  const [isEngineRunning, setIsEngineRunning] = React.useState(false);
  const [engineLogs, setEngineLogs] = React.useState<string[]>([]);
  const engineIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (engineIntervalRef.current) clearInterval(engineIntervalRef.current);
    };
  }, []);

  const handleGenerateAccount = () => {
    if (isGeneratingAccount) return;
    setIsGeneratingAccount(true);
    setGenerationLogs(['[System] Initializing headless browser...']);
    
    const steps = [
      `[API] Connecting to ${creatorSettings.phoneApi}...`,
      '[API] Requesting virtual phone number...',
      '[API] Number acquired: +1 (555) 019-8372',
      '[Bot] Submitting registration form...',
      '[API] Waiting for SMS verification code...',
      '[API] SMS Code received: 849201',
      '[Bot] Uploading profile pictures...',
      '[Bot] Setting bio template...',
      '[Success] Account successfully created and saved to pool!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setGenerationLogs(prev => [...prev, steps[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsGeneratingAccount(false);
      }
    }, 1200);
  };

  const handleStartEngine = () => {
    if (isEngineRunning) {
      setIsEngineRunning(false);
      if (engineIntervalRef.current) clearInterval(engineIntervalRef.current);
      setEngineLogs(prev => [...prev, '[System] Engine stopped by user.']);
      return;
    }
    
    setIsEngineRunning(true);
    setEngineLogs([
      `[Geo] Spoofing GPS location to: ${swipeSettings.location}...`,
      `[Config] Setting Right Swipe Ratio to ${swipeSettings.rightSwipePercent}%...`,
      `[System] Initializing Auto-Swipe engine with ${swipeSettings.delay}s delay...`
    ]);

    engineIntervalRef.current = setInterval(() => {
      const isRight = Math.random() * 100 <= swipeSettings.rightSwipePercent;
      const names = ['Sarah', 'Jessica', 'Emily', 'Ashley', 'Amanda', 'Brittany', 'Megan', 'Samantha', 'Chloe', 'Lauren'];
      const name = names[Math.floor(Math.random() * names.length)];
      const age = Math.floor(Math.random() * 10) + 18;
      
      setEngineLogs(prev => {
        const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] Swiped ${isRight ? 'RIGHT (Liked)' : 'LEFT (Passed)'} on ${name}, ${age}`];
        return newLogs.slice(-8);
      });
    }, swipeSettings.delay * 1000);
  };

  const addTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget) return;
    
    const targetId = Date.now();
    const username = newTarget.startsWith('@') ? newTarget : `@${newTarget}`;
    
    setOutreachTargets(prev => [...prev, {
      id: targetId,
      username,
      type: targetType,
      status: 'Pending',
      count: 0
    }]);
    setNewTarget('');

    // Simulate scraping process
    setTimeout(() => {
      setOutreachTargets(prev => prev.map(t => 
        t.id === targetId ? { ...t, status: 'Scraping...' } : t
      ));
      
      let currentCount = 0;
      const maxCount = Math.floor(Math.random() * 2000) + 500; // Random target count
      
      const scrapeInterval = setInterval(() => {
        currentCount += Math.floor(Math.random() * 50) + 10;
        
        if (currentCount >= maxCount) {
          clearInterval(scrapeInterval);
          setOutreachTargets(prev => prev.map(t => 
            t.id === targetId ? { ...t, status: 'Completed', count: maxCount } : t
          ));
        } else {
          setOutreachTargets(prev => prev.map(t => 
            t.id === targetId ? { ...t, count: currentCount } : t
          ));
        }
      }, 800);
    }, 1500);
  };

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
        setIsIgConnected(true);
        setIsIgConnecting(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectIg = async () => {
    setShowIgLoginModal(true);
  };

  const submitIgLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIgConnecting(true);
    setIgLoginError('');
    try {
      const response = await fetch('/api/auth/instagram/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: igUsername, password: igPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }
      
      setIsIgConnected(true);
      setShowIgLoginModal(false);
    } catch (error: any) {
      console.error('IG Login error:', error);
      setIgLoginError(error.message);
    } finally {
      setIsIgConnecting(false);
    }
  };

  const toggleIgEngagement = (type: 'reels' | 'story' | 'follow') => {
    setIgEngagementRunning(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const renderIgStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="glass p-6 rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
          <UserPlus size={24} />
        </div>
        <p className="text-3xl font-black mb-1">{settings.IG_STAT_FOLLOWED || '0'}</p>
        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Followed</p>
      </div>
      <div className="glass p-6 rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <UserMinus size={24} />
        </div>
        <p className="text-3xl font-black mb-1">{settings.IG_STAT_UNFOLLOWED || '0'}</p>
        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Unfollowed</p>
      </div>
      <div className="glass p-6 rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
          <Send size={24} />
        </div>
        <p className="text-3xl font-black mb-1">{settings.IG_STAT_DMS_SENT || '0'}</p>
        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">DMs Sent</p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {showSetupModal && setupEmulator && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[32px] w-full max-w-md relative"
          >
            <h2 className="text-2xl font-bold mb-2">Auto-Setup: {setupEmulator.name}</h2>
            <p className="text-zinc-400 text-sm mb-6">Provisioning emulator environment...</p>
            
            <div className="space-y-4 font-mono text-sm">
              <div className={cn("flex items-center gap-3", setupStep >= 1 ? "text-green-500" : "text-zinc-600")}>
                {setupStep >= 1 ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />}
                <span>Initializing VM environment...</span>
              </div>
              <div className={cn("flex items-center gap-3", setupStep >= 2 ? "text-green-500" : "text-zinc-600")}>
                {setupStep >= 2 ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />}
                <span>Configuring network & proxy...</span>
              </div>
              <div className={cn("flex items-center gap-3", setupStep >= 3 ? "text-green-500" : "text-zinc-600")}>
                {setupStep >= 3 ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />}
                <span>Spoofing device fingerprints...</span>
              </div>
              <div className={cn("flex items-center gap-3", setupStep >= 4 ? "text-green-500" : "text-zinc-600")}>
                {setupStep >= 4 ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />}
                <span>Installing target apps (IG, Tinder)...</span>
              </div>
              <div className={cn("flex items-center gap-3", setupStep >= 5 ? "text-green-500" : "text-zinc-600")}>
                {setupStep >= 5 ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />}
                <span>Passing SafetyNet & Root hiding...</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              {setupStep >= 5 ? (
                <button onClick={() => setShowSetupModal(false)} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all">
                  Done
                </button>
              ) : (
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <RefreshCw size={16} className="animate-spin" /> Processing...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {showIgLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[32px] w-full max-w-md relative"
          >
            <button onClick={() => setShowIgLoginModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Connect Instagram</h2>
            <p className="text-zinc-400 text-sm mb-6">Login directly to enable cloud automation without a physical device.</p>
            
            <form onSubmit={submitIgLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Username</label>
                <input 
                  type="text" 
                  value={igUsername}
                  onChange={e => setIgUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-purple-500 outline-none"
                  placeholder="e.g. cristiano_fan"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Password</label>
                <input 
                  type="password" 
                  value={igPassword}
                  onChange={e => setIgPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-purple-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {igLoginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                  {igLoginError}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={isIgConnecting}
                className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isIgConnecting ? <RefreshCw size={20} className="animate-spin" /> : <Image size={20} />}
                {isIgConnecting ? 'Connecting...' : 'Login to Instagram'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {activeView === 'overview' && !selectedDevice && (
        <>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-12">
            <div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">Fleet Overview</h1>
              <p className="text-sm md:text-base text-zinc-400">Managing {devices.length} devices and {accounts.length} accounts.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowAddDeviceModal(true)} className="px-6 py-3 glass hover:bg-white/5 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                <SmartphoneIcon size={20} /> Connect Device
              </button>
              <button onClick={() => setShowAddAccountModal(true)} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                <UserPlus size={20} /> New Account
              </button>
            </div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <motion.div 
                key={device.id}
                layoutId={`device-${device.id}`}
                onClick={() => { setSelectedDevice(device); fetchTasks(device.id); }}
                className="glass p-6 rounded-[32px] border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[40px] group-hover:bg-orange-500/10 transition-colors" />
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-500">
                    <SmartphoneIcon size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                    {device.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{device.name}</h3>
                <p className="text-sm text-zinc-500 mb-6">{device.platform} Automation</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Account</span>
                    <span className="text-zinc-300">{accounts.find(a => a.device_id === device.id)?.username || 'No Account'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Battery</span>
                    <span className="text-zinc-300">{device.battery}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={(e) => handleReboot(e, device.id)}
                    className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {rebootingDevices.includes(device.id) ? <RefreshCw size={14} className="animate-spin" /> : null}
                    {rebootingDevices.includes(device.id) ? 'Rebooting...' : 'Reboot'}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedDevice(device); setShowTaskModal(true); }}
                    className="py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl text-xs font-bold transition-colors"
                  >
                    Start Task
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeView === 'accounts' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Account Pool</h1>
              <p className="text-zinc-400">Manage your Tinder and Instagram accounts.</p>
            </div>
            <button onClick={() => setShowAddAccountModal(true)} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
              <UserPlus size={20} /> Add Account
            </button>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="glass p-6 rounded-[32px] border border-white/5 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] group-hover:bg-blue-500/10 transition-colors" />
                <button 
                  onClick={() => deleteAccount(account.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <ArrowRight className="rotate-45" size={16} />
                </button>
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-500">
                    <Users size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-wider">
                    {account.premium_status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{account.username}</h3>
                <p className="text-sm text-zinc-500 mb-6">{account.platform} Profile</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Status: {account.status}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'campaigns' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Automation Campaigns</h1>
              <p className="text-zinc-400">Scale your outreach with targeted campaigns.</p>
            </div>
            <button onClick={() => setShowAddCampaignModal(true)} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
              <Zap size={20} /> New Campaign
            </button>
          </header>

          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_right,black,transparent)]" />
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 blur-[60px] group-hover:bg-orange-500/10 transition-colors" />
                <button 
                  onClick={() => deleteCampaign(campaign.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <ArrowRight className="rotate-45" size={16} />
                </button>
                <div className="relative z-10 flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                    <Zap className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-black mb-1 truncate">{campaign.name}</h3>
                    <p className="text-xs md:text-sm text-zinc-400 truncate">{campaign.platform} • Target: {campaign.target_count} swipów/dzień</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-xs md:text-sm text-zinc-500 mb-1">Progress</p>
                    <p className="text-lg md:text-xl font-bold">{campaign.current_count} / {campaign.target_count}</p>
                  </div>
                  <button 
                    onClick={() => toggleCampaign(campaign.id)}
                    className={cn(
                      "px-6 py-3 rounded-2xl font-bold transition-all",
                      campaign.status === 'active' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    )}
                  >
                    {campaign.status === 'active' ? 'Pause' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
            {campaigns.length === 0 && (
              <div className="py-20 text-center glass rounded-[48px] border-dashed border-white/10">
                <Zap size={48} className="mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium">No campaigns created yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeView === 'outreach' && (
        <>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-12">
            <div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">Mass DM & Auto-Comment</h1>
              <p className="text-sm md:text-base text-zinc-400">Scrape followers and automate your outreach on Instagram.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!isIgConnected ? (
                <button 
                  onClick={handleConnectIg}
                  disabled={isIgConnecting}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={20} className={isIgConnecting ? "animate-spin" : ""} /> 
                  {isIgConnecting ? 'Connecting...' : 'Connect Instagram'}
                </button>
              ) : (
                <div className="px-6 py-3 bg-green-500/10 text-green-500 font-bold rounded-2xl flex items-center gap-2 border border-green-500/20">
                  <ShieldCheck size={20} /> {connectedIgAccount ? `Connected as @${connectedIgAccount}` : 'Connected'}
                </div>
              )}
              <button 
                onClick={handleStartOutreach}
                disabled={!isIgConnected}
                className={cn(
                  "px-6 py-3 text-white font-bold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                  isOutreachRunning ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
                )}
              >
                <Zap size={20} className={isOutreachRunning ? "animate-pulse" : ""} /> 
                {isOutreachRunning ? 'Stop Outreach' : 'Start Outreach'}
              </button>
            </div>
          </header>

          {renderIgStats()}

          <div className={cn("grid lg:grid-cols-2 gap-8 transition-opacity", !isIgConnected && "opacity-50 pointer-events-none")}>
            {/* Target Sources */}
            <div className="space-y-6">
              <div className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users size={20} className="text-orange-500" /> Target Sources
                </h3>
                
                <form onSubmit={addTarget} className="flex flex-col md:flex-row gap-2 mb-6">
                  <input 
                    type="text" 
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="Target username (e.g. @nike)" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none w-full"
                  />
                  <div className="flex gap-2 w-full md:w-auto">
                    <select 
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value)}
                      className="flex-1 md:flex-none bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none"
                    >
                      <option value="followers">Followers</option>
                      <option value="following">Following</option>
                    </select>
                    <button type="submit" className="px-6 py-3 bg-white/10 hover:bg-white/20 font-bold rounded-2xl transition-all shrink-0">
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {outreachTargets.map(target => (
                    <div key={target.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-orange-500">
                          <ListPlus size={18} />
                        </div>
                        <div>
                          <p className="font-bold">{target.username}</p>
                          <p className="text-xs text-zinc-500">Scraping {target.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", target.status === 'Completed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500")}>
                          {target.status}
                        </span>
                        <p className="text-xs text-zinc-400 mt-1">{target.count} scraped</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Templates */}
            <div className="space-y-6">
              <div className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <MessageCircle size={20} className="text-blue-500" /> Auto-Comment List
                  </h3>
                  <button 
                    onClick={() => generateWithAI('comment')}
                    disabled={isGeneratingAI.comment}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAI.comment ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Generate with AI
                  </button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">Add comments (one per line). The bot will randomly pick one for each post.</p>
                <textarea 
                  value={commentTemplate}
                  onChange={(e) => setCommentTemplate(e.target.value)}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none resize-none font-mono text-sm"
                />
              </div>

              <div className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Send size={20} className="text-purple-500" /> Mass DM Template
                  </h3>
                  <button 
                    onClick={() => generateWithAI('dm')}
                    disabled={isGeneratingAI.dm}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAI.dm ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Generate with AI
                  </button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">Use <span className="text-white font-mono bg-white/10 px-1 rounded">{'{username}'}</span> to personalize the message.</p>
                <textarea 
                  value={dmTemplate}
                  onChange={(e) => setDmTemplate(e.target.value)}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none resize-none font-mono text-sm"
                />
              </div>

              {outreachLogs.length > 0 && (
                <div className="glass p-6 rounded-[40px] border border-white/5 bg-black/50 font-mono text-[10px] text-blue-400 h-48 overflow-y-auto flex flex-col gap-1">
                  {outreachLogs.map((log, i) => (
                    <div key={i} className="opacity-80">{log}</div>
                  ))}
                  {isOutreachRunning && <div className="animate-pulse">_</div>}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeView === 'dating' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Dating Automation</h1>
              <p className="text-zinc-400">Auto-creation, geo-spoofing, and smart swiping for Tinder.</p>
            </div>
            <button 
              onClick={handleStartEngine}
              className={cn(
                "px-6 py-3 text-white font-bold rounded-2xl transition-all flex items-center gap-2",
                isEngineRunning ? "bg-red-500 hover:bg-red-600" : "bg-rose-500 hover:bg-rose-600"
              )}
            >
              <Flame size={20} className={isEngineRunning ? "animate-pulse" : ""} /> 
              {isEngineRunning ? 'Stop Engine' : 'Start Engine'}
            </button>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Account Creator */}
            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus size={20} className="text-rose-500" /> Auto Account Creator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">SMS API Service</label>
                    <select 
                      value={creatorSettings.phoneApi}
                      onChange={(e) => setCreatorSettings({...creatorSettings, phoneApi: e.target.value})}
                      className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-rose-500 outline-none"
                    >
                      <option value="smspool">SMSPool</option>
                      <option value="5sim">5SIM</option>
                      <option value="textverify">TextVerify</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Bio Template</label>
                    <textarea 
                      value={creatorSettings.bioTemplate}
                      onChange={(e) => setCreatorSettings({...creatorSettings, bioTemplate: e.target.value})}
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-rose-500 outline-none resize-none font-mono text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleGenerateAccount}
                    disabled={isGeneratingAccount}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Phone size={18} className={isGeneratingAccount ? "animate-pulse" : ""} /> 
                    {isGeneratingAccount ? 'Generating...' : 'Generate New Account'}
                  </button>
                  
                  {generationLogs.length > 0 && (
                    <div className="mt-4 bg-black/50 rounded-xl p-4 font-mono text-[10px] text-green-400 h-32 overflow-y-auto flex flex-col gap-1">
                      {generationLogs.map((log, i) => (
                        <div key={i} className="opacity-80">{log}</div>
                      ))}
                      {isGeneratingAccount && <div className="animate-pulse">_</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Auto Swipe & Geo */}
            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-orange-500" /> Geo-Location & Swiping
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target Location (Spoofing)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={swipeSettings.location}
                        onChange={(e) => setSwipeSettings({...swipeSettings, location: e.target.value})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none"
                      />
                      <button className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Right Swipe Ratio</label>
                      <span className="text-xs font-bold text-orange-500">{swipeSettings.rightSwipePercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="100" 
                      value={swipeSettings.rightSwipePercent}
                      onChange={(e) => setSwipeSettings({...swipeSettings, rightSwipePercent: parseInt(e.target.value)})}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Delay Between Swipes (Seconds)</label>
                      <span className="text-xs font-bold text-orange-500">{swipeSettings.delay}s</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="15" 
                      value={swipeSettings.delay}
                      onChange={(e) => setSwipeSettings({...swipeSettings, delay: parseInt(e.target.value)})}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  {engineLogs.length > 0 && (
                    <div className="mt-6 bg-black/50 rounded-xl p-4 font-mono text-[10px] text-orange-400 h-40 overflow-y-auto flex flex-col gap-1">
                      {engineLogs.map((log, i) => (
                        <div key={i} className="opacity-80">{log}</div>
                      ))}
                      {isEngineRunning && <div className="animate-pulse">_</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'ig-engagement' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Instagram Engagement</h1>
              <p className="text-zinc-400">Automate Follows, Likes, Story Views, and Reels.</p>
            </div>
            {!isIgConnected ? (
              <button 
                onClick={handleConnectIg}
                disabled={isIgConnecting}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={20} className={isIgConnecting ? "animate-spin" : ""} /> 
                {isIgConnecting ? 'Connecting...' : 'Connect Instagram'}
              </button>
            ) : (
              <div className="px-6 py-3 bg-green-500/10 text-green-500 font-bold rounded-2xl flex items-center gap-2 border border-green-500/20">
                <ShieldCheck size={20} /> {connectedIgAccount ? `Connected as @${connectedIgAccount}` : 'Connected'}
              </div>
            )}
          </header>

          {renderIgStats()}

          <div className={cn("grid lg:grid-cols-2 gap-8 transition-opacity", !isIgConnected && "opacity-50 pointer-events-none")}>
            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus size={20} className="text-purple-500" /> Follow & Unfollow
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target Account (Followers of)</label>
                    <input 
                      type="text" 
                      placeholder="@username" 
                      value={followTarget}
                      onChange={(e) => setFollowTarget(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Daily Follow Limit</label>
                    <input type="range" min="50" max="300" defaultValue="150" className="w-full accent-purple-500" />
                    <div className="flex justify-between text-xs text-zinc-500 mt-1"><span>50</span><span>300</span></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold">Auto-Unfollow</p>
                      <p className="text-xs text-zinc-400">Unfollow users who don't follow back after 3 days</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 font-bold rounded-2xl transition-all">
                    Manage Whitelist
                  </button>
                  <button 
                    onClick={() => toggleIgEngagement('follow')}
                    className={cn(
                      "w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2",
                      igEngagementRunning.follow ? "bg-red-500 hover:bg-red-600 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                    )}
                  >
                    {igEngagementRunning.follow ? <RefreshCw size={18} className="animate-spin" /> : <UserPlus size={18} />}
                    {igEngagementRunning.follow ? 'Stop Follow & Unfollow' : 'Start Follow & Unfollow'}
                  </button>
                </div>
              </div>

              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Heart size={20} className="text-rose-500" /> Smart Likes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold">Like Target's Posts</p>
                      <p className="text-xs text-zinc-400">Only like posts with &gt;20 likes (looks natural)</p>
                    </div>
                    <div className="w-12 h-6 bg-rose-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Daily Like Limit</label>
                    <input type="range" min="100" max="500" defaultValue="300" className="w-full accent-rose-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Eye size={20} className="text-blue-500" /> Story Viewer
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400">Watch stories at scale to increase follow-back rates. Simulates 3-7 seconds per story.</p>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold">Occasional Reactions</p>
                      <p className="text-xs text-zinc-400">React to 1 in 50 stories with random emoji</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleIgEngagement('story')}
                    className={cn(
                      "w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2",
                      igEngagementRunning.story ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                    )}
                  >
                    {igEngagementRunning.story ? <RefreshCw size={18} className="animate-spin" /> : <Eye size={18} />}
                    {igEngagementRunning.story ? 'Stop Story Viewer' : 'Start Story Viewer'}
                  </button>
                </div>
              </div>

              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <SmartphoneIcon size={20} className="text-green-500" /> Reels Watcher
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400">Scrolls through Reels naturally, liking every 5-10 reels to warm up the account.</p>
                  <button 
                    onClick={() => toggleIgEngagement('reels')}
                    className={cn(
                      "w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2",
                      igEngagementRunning.reels ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                    )}
                  >
                    {igEngagementRunning.reels ? <RefreshCw size={18} className="animate-spin" /> : <SmartphoneIcon size={18} />}
                    {igEngagementRunning.reels ? 'Stop Reels Session' : 'Start Reels Session (15m)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'ig-content' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Content & Posting</h1>
              <p className="text-zinc-400">Schedule posts and manage repost networks.</p>
            </div>
            <div className="flex gap-3">
              {!isIgConnected ? (
                <button 
                  onClick={handleConnectIg}
                  disabled={isIgConnecting}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={20} className={isIgConnecting ? "animate-spin" : ""} /> 
                  {isIgConnecting ? 'Connecting...' : 'Connect Instagram'}
                </button>
              ) : (
                <div className="px-6 py-3 bg-green-500/10 text-green-500 font-bold rounded-2xl flex items-center gap-2 border border-green-500/20">
                  <ShieldCheck size={20} /> {connectedIgAccount ? `Connected as @${connectedIgAccount}` : 'Connected'}
                </div>
              )}
              <button 
                disabled={!isIgConnected}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar size={20} /> Schedule Post
              </button>
            </div>
          </header>

          <div className={cn("grid lg:grid-cols-2 gap-8 transition-opacity", !isIgConnected && "opacity-50 pointer-events-none")}>
            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Image size={20} className="text-purple-500" /> Post Queue
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                        <Image size={20} className="text-zinc-500" />
                      </div>
                      <div>
                        <p className="font-bold">Summer Promo Reel</p>
                        <p className="text-xs text-zinc-400">Scheduled for Today, 18:00</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase">Pending</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                        <Image size={20} className="text-zinc-500" />
                      </div>
                      <div>
                        <p className="font-bold">Lifestyle Photo</p>
                        <p className="text-xs text-zinc-400">Published Yesterday, 12:00</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">Published</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Share2 size={20} className="text-blue-500" /> Repost Network
                </h3>
                <p className="text-sm text-zinc-400 mb-6">Link accounts to automatically like, comment, and share posts from your main account.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Main Account</label>
                    <select className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none">
                      <option>@cristiano_fan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Satellite Accounts (Workers)</label>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-sm text-zinc-400">
                      3 accounts selected
                    </div>
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 font-bold rounded-2xl transition-all">
                    Configure Network Delays
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'tinder-chat' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">AI Chatting</h1>
              <p className="text-zinc-400">GPT-4 powered conversations for Tinder.</p>
            </div>
            <button className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
              <Settings size={20} /> AI Settings
            </button>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bot size={20} className="text-rose-500" /> System Prompt
                </h3>
                <p className="text-sm text-zinc-400 mb-4">Define the personality of your AI bot.</p>
                <textarea 
                  defaultValue="You are a 22-year-old girl on Tinder. Be flirty but not desperate. Keep messages short (1-2 sentences). If they ask for more pics or seem very interested, tell them you are more active on Instagram and drop your handle: @my_ig_handle."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-rose-500 outline-none resize-none font-mono text-sm"
                />
                <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 font-bold rounded-2xl transition-all">
                  Save Prompt
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-500" /> Active Conversations
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">Match: Alex, 24</p>
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">Active</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">Alex: "Hey! Love your second pic, where was that taken?"</p>
                    <p className="text-sm text-rose-400">AI: "Thanks! That was in Bali last summer 🌴 Have you been?"</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">Match: Chris, 27</p>
                      <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-bold">Converted</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">Chris: "Do you have snap or IG?"</p>
                    <p className="text-sm text-rose-400">AI: "Yeah! I'm way more active on IG, add me: @my_ig_handle ✨"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'tinder-accounts' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Auto Reg & App Cloner</h1>
              <p className="text-zinc-400">Manage multiple Tinder instances on single devices.</p>
            </div>
            <button className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
              <Copy size={20} /> Clone App
            </button>
          </header>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-[32px] border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-rose-500">
                  <Flame size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">Running</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Instance #1</h3>
              <p className="text-sm text-zinc-500 mb-4">Device: Galaxy S23 - Beta</p>
              <div className="space-y-2 text-xs text-zinc-400">
                <p>Account: JohnDoe99</p>
                <p>Proxy: 198.51.100.24</p>
              </div>
            </div>

            <div className="glass p-6 rounded-[32px] border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-rose-500">
                  <Flame size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase">Stopped</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Instance #2</h3>
              <p className="text-sm text-zinc-500 mb-4">Device: Galaxy S23 - Beta</p>
              <div className="space-y-2 text-xs text-zinc-400">
                <p>Account: None</p>
                <p>Proxy: Unassigned</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'proxies' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Proxy Management</h1>
              <p className="text-zinc-400">Secure your accounts with high-quality residential and mobile proxies.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleCheckProxies} 
                className="px-6 py-3 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
              >
                <RefreshCw size={20} className={isCheckingProxies ? "animate-spin" : ""} /> 
                {isCheckingProxies ? 'Checking...' : 'Check Health'}
              </button>
              <button onClick={() => setShowAddProxyModal(true)} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                <ShieldCheck size={20} /> Add Proxy
              </button>
            </div>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {proxies.map((proxy) => (
              <div key={proxy.id} className="glass p-6 rounded-[32px] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-500">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">{proxy.host}:{proxy.port}</h3>
                    <p className="text-xs text-zinc-500">{proxy.type} • {proxy.status}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                  {proxy.status}
                </span>
              </div>
            ))}
            {proxies.length === 0 && (
              <div className="col-span-2 py-20 text-center glass rounded-[48px] border-dashed border-white/10">
                <Globe size={48} className="mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium">No proxies added yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {selectedDevice && activeView === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <header className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 gap-6 md:gap-0">
            <div className="flex items-start md:items-center gap-4 md:gap-6">
              <button onClick={() => setSelectedDevice(null)} className="p-3 glass hover:bg-white/10 rounded-2xl transition-all shrink-0">
                <ArrowRight className="rotate-180" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black">{selectedDevice.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">{selectedDevice.status}</span>
                </div>
                <p className="text-sm md:text-base text-zinc-400">{selectedDevice.platform} Automation Suite • Account: {accounts.find(a => a.device_id === selectedDevice.id)?.username || 'None'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button onClick={() => deleteDevice(selectedDevice.id)} className="flex-1 md:flex-none px-6 py-3 glass hover:bg-red-500/10 hover:text-red-500 text-zinc-400 font-bold rounded-2xl transition-all">
                Disconnect
              </button>
              <button onClick={() => setShowTaskModal(true)} className="flex-1 md:flex-none px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                <Zap size={20} /> New Task
              </button>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass rounded-[40px] p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap size={20} className="text-orange-500" /> Task History
                </h3>
                <div className="space-y-4">
                  {deviceTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-orange-500">
                          {task.type === 'follow' ? <UserPlus size={18} /> : task.type === 'swipe' ? <Zap size={18} /> : <SmartphoneIcon size={18} />}
                        </div>
                        <div>
                          <p className="font-bold capitalize">{task.type} Cycle</p>
                          <p className="text-xs text-zinc-500">{new Date(task.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", task.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500")}>
                          {task.status}
                        </span>
                        <p className="text-[10px] text-zinc-600 mt-1">{task.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass rounded-[40px] p-8">
                <h3 className="text-xl font-bold mb-6">Device Health</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Battery Level</span>
                      <span className="font-bold">{selectedDevice.battery}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${selectedDevice.battery}%` }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Proxy</span>
                      <span className="text-zinc-300">Mobile 4G (PL)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Anti-detect</span>
                      <span className="text-zinc-300">Active (Pixel 7 Profile)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeView === 'emulators' && (
        <>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-12">
            <div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">Mobile Emulators</h1>
              <p className="text-sm md:text-base text-zinc-400">Manage virtual devices and run automatic setup scripts.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                <Server size={20} /> Create Emulator
              </button>
            </div>
          </header>

          <div className="space-y-6">
            {emulators.map((emulator) => (
              <div key={emulator.id} className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_right,black,transparent)]" />
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 blur-[60px] group-hover:bg-orange-500/10 transition-colors" />
                
                <div className="relative z-10 flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                    <SmartphoneIcon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl md:text-2xl font-black truncate">{emulator.name}</h3>
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", emulator.status === 'running' ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-400")}>
                        {emulator.status}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-400 truncate">OS: {emulator.os} • Proxy: {emulator.proxy}</p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <button 
                    className={cn(
                      "flex-1 md:flex-none px-6 py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2",
                      emulator.status === 'running' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    )}
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/emulators/${emulator.id}/toggle`, { method: 'POST' });
                        const data = await res.json();
                        if (data.success) {
                          setEmulators(emulators.map(e => e.id === emulator.id ? { ...e, status: data.status } : e));
                        }
                      } catch (error) {
                        console.error("Failed to toggle emulator", error);
                      }
                    }}
                  >
                    {emulator.status === 'running' ? <Square size={18} /> : <Play size={18} />}
                    {emulator.status === 'running' ? 'Stop' : 'Start'}
                  </button>
                  <button 
                    onClick={() => startAutoSetup(emulator)}
                    className="flex-1 md:flex-none px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Auto-Setup
                  </button>
                  <button className="p-3 glass hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all shrink-0">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'settings' && (
        <>
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black mb-2">Platform Settings</h1>
              <p className="text-zinc-400">Configure API keys and integrations.</p>
            </div>
          </header>

          <div className="max-w-3xl">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Image size={20} className="text-purple-500" /> Instagram API (OAuth)
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Required for connecting Instagram accounts via OAuth. Get these from the Facebook Developers Console.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Client ID</label>
                    <input 
                      type="text" 
                      value={settings.INSTAGRAM_CLIENT_ID}
                      onChange={(e) => setSettings({...settings, INSTAGRAM_CLIENT_ID: e.target.value})}
                      placeholder="e.g. 123456789012345"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-purple-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Client Secret</label>
                    <input 
                      type="password" 
                      value={settings.INSTAGRAM_CLIENT_SECRET}
                      onChange={(e) => setSettings({...settings, INSTAGRAM_CLIENT_SECRET: e.target.value})}
                      placeholder="••••••••••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-purple-500 outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-[40px] border border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Phone size={20} className="text-rose-500" /> SMS Verification API
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Required for Tinder auto-registration.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">API Key</label>
                    <input 
                      type="password" 
                      value={settings.SMS_API_KEY}
                      onChange={(e) => setSettings({...settings, SMS_API_KEY: e.target.value})}
                      placeholder="••••••••••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-rose-500 outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingSettings ? <RefreshCw size={20} className="animate-spin" /> : <Settings size={20} />}
                  {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </main>
  );
};
