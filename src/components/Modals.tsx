import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SmartphoneIcon, 
  UserPlus, 
  Heart, 
  Eye, 
  MessageCircle, 
  Zap 
} from 'lucide-react';
import { platforms } from '../constants';

interface ModalsProps {
  showAddDeviceModal: boolean;
  setShowAddDeviceModal: (show: boolean) => void;
  handleAddDevice: (e: React.FormEvent) => void;
  newDeviceName: string;
  setNewDeviceName: (name: string) => void;
  newDevicePlatform: string;
  setNewDevicePlatform: (platform: string) => void;
  
  showAddAccountModal: boolean;
  setShowAddAccountModal: (show: boolean) => void;
  handleAddAccount: (e: React.FormEvent) => void;
  newAccountUser: string;
  setNewAccountUser: (user: string) => void;
  newAccountPlatform: string;
  setNewAccountPlatform: (platform: string) => void;
  
  showTaskModal: boolean;
  setShowTaskModal: (show: boolean) => void;
  selectedDevice: any;
  startTask: (deviceId: number, type: string, target: string) => void;

  showAddCampaignModal: boolean;
  setShowAddCampaignModal: (show: boolean) => void;
  handleAddCampaign: (e: React.FormEvent) => void;
  newCampaignName: string;
  setNewCampaignName: (name: string) => void;

  showAddProxyModal: boolean;
  setShowAddProxyModal: (show: boolean) => void;
  handleAddProxy: (e: React.FormEvent) => void;
  newProxyHost: string;
  setNewProxyHost: (host: string) => void;
  newProxyPort: string;
  setNewProxyPort: (port: string) => void;
  newProxyType: string;
  setNewProxyType: (type: string) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showAddDeviceModal,
  setShowAddDeviceModal,
  handleAddDevice,
  newDeviceName,
  setNewDeviceName,
  newDevicePlatform,
  setNewDevicePlatform,
  showAddAccountModal,
  setShowAddAccountModal,
  handleAddAccount,
  newAccountUser,
  setNewAccountUser,
  newAccountPlatform,
  setNewAccountPlatform,
  showTaskModal,
  setShowTaskModal,
  selectedDevice,
  startTask,
  showAddCampaignModal,
  setShowAddCampaignModal,
  handleAddCampaign,
  newCampaignName,
  setNewCampaignName,
  showAddProxyModal,
  setShowAddProxyModal,
  handleAddProxy,
  newProxyHost,
  setNewProxyHost,
  newProxyPort,
  setNewProxyPort,
  newProxyType,
  setNewProxyType
}) => {
  return (
    <AnimatePresence>
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddDeviceModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass p-8 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-black mb-6">Connect New Device</h2>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Device Name</label>
                <input type="text" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none" placeholder="e.g. Pixel 7 Pro" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Platform</label>
                <select value={newDevicePlatform} onChange={(e) => setNewDevicePlatform(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none">
                  {platforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl">Add Device</button>
            </form>
          </motion.div>
        </div>
      )}

      {showAddAccountModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddAccountModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass p-8 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-black mb-6">Register/Import Account</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Username/Handle</label>
                <input type="text" value={newAccountUser} onChange={(e) => setNewAccountUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none" placeholder="@username" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Platform</label>
                <select value={newAccountPlatform} onChange={(e) => setNewAccountPlatform(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none">
                  {platforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl">Create Account</button>
            </form>
          </motion.div>
        </div>
      )}

      {showAddCampaignModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddCampaignModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass p-8 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-black mb-6">New Campaign</h2>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Campaign Name</label>
                <input type="text" value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none" placeholder="e.g. Summer Outreach" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Platform</label>
                <select value={newAccountPlatform} onChange={(e) => setNewAccountPlatform(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none">
                  {platforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl">Create Campaign</button>
            </form>
          </motion.div>
        </div>
      )}

      {showAddProxyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddProxyModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass p-8 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-black mb-6">Add Proxy Server</h2>
            <form onSubmit={handleAddProxy} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Host / IP</label>
                  <input type="text" value={newProxyHost} onChange={(e) => setNewProxyHost(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none" placeholder="1.1.1.1" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Port</label>
                  <input type="text" value={newProxyPort} onChange={(e) => setNewProxyPort(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none" placeholder="8080" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Type</label>
                <select value={newProxyType} onChange={(e) => setNewProxyType(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 focus:border-orange-500 outline-none">
                  <option value="Mobile 4G">Mobile 4G</option>
                  <option value="Mobile 5G">Mobile 5G</option>
                  <option value="Residential">Residential</option>
                  <option value="Datacenter">Datacenter</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl">Add Proxy</button>
            </form>
          </motion.div>
        </div>
      )}

      {showTaskModal && selectedDevice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass p-8 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-black mb-2">New Task</h2>
            <p className="text-zinc-400 mb-6">Assigning to {selectedDevice.name}</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Follow Cycle', type: 'follow', icon: UserPlus },
                { icon: Heart, label: 'Like Posts', type: 'like' },
                { icon: Eye, label: 'View Stories', type: 'story' },
                { icon: MessageCircle, label: 'AI Comments', type: 'comment' },
                { icon: Zap, label: 'Mass Swipe', type: 'swipe' },
                { icon: SmartphoneIcon, label: 'Warm-up', type: 'warmup' },
              ].map((task) => (
                <button 
                  key={task.type}
                  onClick={() => startTask(selectedDevice.id, task.type, 'Target Audience #1')}
                  className="p-4 glass hover:bg-white/10 rounded-2xl flex flex-col items-center gap-2 transition-all"
                >
                  <task.icon className="text-orange-500" />
                  <span className="text-sm font-bold">{task.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
