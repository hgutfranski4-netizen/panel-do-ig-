import React from 'react';
import { 
  SmartphoneIcon, 
  LayoutGrid, 
  Users, 
  Zap, 
  ShieldCheck,
  MessageCircle,
  Flame,
  Heart,
  Image,
  MessageSquare,
  UserPlus,
  MapPin,
  Settings,
  Server
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  selectedDevice: any;
  setSelectedDevice: (device: any) => void;
  devices: any[];
  fetchTasks: (deviceId: number) => void;
  user: any;
  setActiveTab: (tab: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  selectedDevice,
  setSelectedDevice,
  devices,
  fetchTasks,
  user,
  setActiveTab
}) => {
  return (
    <aside className="w-64 h-full bg-zinc-950 md:bg-transparent glass border-r border-white/5 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <SmartphoneIcon className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tighter">ONIMATOR</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('overview'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'overview' && !selectedDevice ? "bg-orange-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <LayoutGrid size={18} /> Dashboard
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('accounts'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'accounts' ? "bg-orange-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <Users size={18} /> Accounts
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('campaigns'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'campaigns' ? "bg-orange-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <Zap size={18} /> Campaigns
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('proxies'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'proxies' ? "bg-orange-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <ShieldCheck size={18} /> Proxies
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('emulators'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'emulators' ? "bg-orange-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <Server size={18} /> Emulators & Setup
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('settings'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'settings' ? "bg-orange-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <Settings size={18} /> Settings
        </button>

        <div className="pt-6 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Instagram</div>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('outreach'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'outreach' ? "bg-purple-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <MessageCircle size={18} /> Mass DM & Comments
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('ig-engagement'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'ig-engagement' ? "bg-purple-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <Heart size={18} /> Engagement
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('ig-content'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'ig-content' ? "bg-purple-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <Image size={18} /> Content & Posting
        </button>

        <div className="pt-6 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Tinder</div>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('dating'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'dating' ? "bg-rose-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <MapPin size={18} /> Swiping & Geo
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('tinder-chat'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'tinder-chat' ? "bg-rose-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <MessageSquare size={18} /> AI Chatting
        </button>
        <button 
          onClick={() => { setSelectedDevice(null); setActiveView('tinder-accounts'); }} 
          className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeView === 'tinder-accounts' ? "bg-rose-500 text-white" : "text-zinc-400 hover:bg-white/5")}
        >
          <UserPlus size={18} /> Auto Reg & Cloner
        </button>
        
        <div className="pt-6 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Active Devices</div>
        {devices.map(device => (
          <button 
            key={device.id} 
            onClick={() => { setSelectedDevice(device); fetchTasks(device.id); setActiveView('overview'); }}
            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all truncate", selectedDevice?.id === device.id ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/5")}
          >
            <div className={cn("w-2 h-2 rounded-full", device.status === 'online' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-zinc-600")} />
            {device.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
            {user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user.email}</p>
            <p className="text-xs text-zinc-500">Scale-out Plan</p>
          </div>
        </div>
        <button onClick={() => setActiveTab('landing')} className="w-full mt-2 px-4 py-2 text-xs text-zinc-500 hover:text-white transition-colors">Logout</button>
      </div>
    </aside>
  );
};
