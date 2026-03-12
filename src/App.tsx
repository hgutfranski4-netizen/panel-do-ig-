import React, { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { platforms } from './constants';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Modals } from './components/Modals';

export default function App() {
  const [activePlatform, setActivePlatform] = useState(platforms[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [devices, setDevices] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [proxies, setProxies] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard'>('landing');
  const [activeView, setActiveView] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [emulators, setEmulators] = useState<any[]>([]);
  const [deviceTasks, setDeviceTasks] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [showAddProxyModal, setShowAddProxyModal] = useState(false);
  
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDevicePlatform, setNewDevicePlatform] = useState(platforms[0].name);
  const [newAccountUser, setNewAccountUser] = useState('');
  const [newAccountPlatform, setNewAccountPlatform] = useState(platforms[0].name);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newProxyHost, setNewProxyHost] = useState('');
  const [newProxyPort, setNewProxyPort] = useState('');
  const [newProxyType, setNewProxyType] = useState('Mobile 4G');

  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(c => {
        if (c.status === 'active') {
          const current = c.current_count || 0;
          const target = c.target_count || 1000;
          if (current < target) {
            return { ...c, current_count: current + Math.floor(Math.random() * 5) + 1 };
          }
        }
        return c;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = { id: 1, email: email || 'admin@onimator.com' };
    setUser(mockUser);
    setShowAuth(false);
    setActiveTab('dashboard');
    refreshData(mockUser.id);
  };

  const refreshData = (userId: number) => {
    fetchDevices(userId);
    fetchAccounts(userId);
    fetchCampaigns(userId);
    fetchProxies(userId);
    fetchEmulators(userId);
  };

  const fetchDevices = async (userId: number) => {
    try {
      const res = await fetch(`/api/devices?userId=${userId}`);
      setDevices(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAccounts = async (userId: number) => {
    try {
      const res = await fetch(`/api/accounts?userId=${userId}`);
      setAccounts(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCampaigns = async (userId: number) => {
    try {
      const res = await fetch(`/api/campaigns?userId=${userId}`);
      setCampaigns(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProxies = async (userId: number) => {
    try {
      const res = await fetch(`/api/proxies?userId=${userId}`);
      setProxies(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmulators = async (userId: number) => {
    try {
      const res = await fetch(`/api/emulators?userId=${userId}`);
      setEmulators(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async (deviceId: number) => {
    try {
      const res = await fetch(`/api/tasks?deviceId=${deviceId}`);
      setDeviceTasks(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newDevice = {
      id: Date.now(),
      name: newDeviceName || `Device ${devices.length + 1}`,
      platform: newDevicePlatform,
      status: 'online',
      battery: 100
    };
    setDevices([...devices, newDevice]);
    setShowAddDeviceModal(false);
    setNewDeviceName('');
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newAccount = {
      id: Date.now(),
      username: newAccountUser,
      platform: newAccountPlatform,
      premium_status: 'Premium',
      status: 'Active',
      device_id: devices[0]?.id
    };
    setAccounts([...accounts, newAccount]);
    setShowAddAccountModal(false);
    setNewAccountUser('');
  };

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newCampaign = {
      id: Date.now(),
      name: newCampaignName,
      platform: newAccountPlatform,
      target_count: 3500,
      current_count: 0,
      status: 'active'
    };
    setCampaigns([...campaigns, newCampaign]);
    setShowAddCampaignModal(false);
    setNewCampaignName('');
  };

  const handleAddProxy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newProxy = {
      id: Date.now(),
      host: newProxyHost,
      port: parseInt(newProxyPort) || 8080,
      type: newProxyType,
      status: 'Active'
    };
    setProxies([...proxies, newProxy]);
    setShowAddProxyModal(false);
    setNewProxyHost('');
    setNewProxyPort('');
  };

  const toggleCampaign = async (campaignId: number) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
      }
      return c;
    }));
  };

  const deleteAccount = async (id: number) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const deleteCampaign = async (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const startTask = async (deviceId: number, type: string, target: string) => {
    const newTask = {
      id: Date.now(),
      type,
      target,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    if (selectedDevice?.id === deviceId) {
      setDeviceTasks([newTask, ...deviceTasks]);
    }
    setShowTaskModal(false);
    
    setTimeout(() => {
      if (selectedDevice?.id === deviceId) {
        setDeviceTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'completed' } : t));
      }
    }, 3000);
  };

  const deleteDevice = async (deviceId: number) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    if (selectedDevice?.id === deviceId) setSelectedDevice(null);
  };

  if (activeTab === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row overflow-hidden">
        <Modals 
          showAddDeviceModal={showAddDeviceModal}
          setShowAddDeviceModal={setShowAddDeviceModal}
          handleAddDevice={handleAddDevice}
          newDeviceName={newDeviceName}
          setNewDeviceName={setNewDeviceName}
          newDevicePlatform={newDevicePlatform}
          setNewDevicePlatform={setNewDevicePlatform}
          showAddAccountModal={showAddAccountModal}
          setShowAddAccountModal={setShowAddAccountModal}
          handleAddAccount={handleAddAccount}
          newAccountUser={newAccountUser}
          setNewAccountUser={setNewAccountUser}
          newAccountPlatform={newAccountPlatform}
          setNewAccountPlatform={setNewAccountPlatform}
          showTaskModal={showTaskModal}
          setShowTaskModal={setShowTaskModal}
          selectedDevice={selectedDevice}
          startTask={startTask}
          showAddCampaignModal={showAddCampaignModal}
          setShowAddCampaignModal={setShowAddCampaignModal}
          handleAddCampaign={handleAddCampaign}
          newCampaignName={newCampaignName}
          setNewCampaignName={setNewCampaignName}
          showAddProxyModal={showAddProxyModal}
          setShowAddProxyModal={setShowAddProxyModal}
          handleAddProxy={handleAddProxy}
          newProxyHost={newProxyHost}
          setNewProxyHost={setNewProxyHost}
          newProxyPort={newProxyPort}
          setNewProxyPort={setNewProxyPort}
          newProxyType={newProxyType}
          setNewProxyType={setNewProxyType}
        />

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            activeView={activeView}
            setActiveView={(view) => { setActiveView(view); setIsMobileMenuOpen(false); }}
            selectedDevice={selectedDevice}
            setSelectedDevice={(device) => { setSelectedDevice(device); setIsMobileMenuOpen(false); }}
            devices={devices}
            fetchTasks={fetchTasks}
            user={user}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 bg-zinc-950/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                className="md:hidden text-zinc-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:inline-block truncate max-w-[120px]">{user.email}</span>
              <span className="px-2 py-1 md:px-3 md:py-1 bg-white/10 text-[10px] md:text-xs font-bold rounded-full border border-white/5 text-zinc-300 whitespace-nowrap">Scale-out Plan</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Bell size={18} />
              </button>
              <button onClick={() => { setUser(null); setActiveTab('landing'); }} className="text-zinc-400 hover:text-white transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          <Dashboard 
            activeView={activeView}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            devices={devices}
            accounts={accounts}
            campaigns={campaigns}
            proxies={proxies}
            emulators={emulators}
            setEmulators={setEmulators}
            fetchTasks={fetchTasks}
            setShowAddDeviceModal={setShowAddDeviceModal}
            setShowAddAccountModal={setShowAddAccountModal}
            setShowAddCampaignModal={setShowAddCampaignModal}
            setShowAddProxyModal={setShowAddProxyModal}
            setShowTaskModal={setShowTaskModal}
            toggleCampaign={toggleCampaign}
            deleteDevice={deleteDevice}
            deleteAccount={deleteAccount}
            deleteCampaign={deleteCampaign}
            deviceTasks={deviceTasks}
          />

          {/* Activate Windows Watermark */}
          <div className="absolute bottom-8 right-8 text-white/20 text-sm font-medium pointer-events-none select-none z-50 text-right">
            <p className="text-xl">Activate Windows</p>
            <p className="text-xs">Go to Settings to activate Windows.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthModal 
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        handleLogin={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <LandingPage 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setShowAuth={setShowAuth}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
      />
    </>
  );
}
