import { 
  Instagram, 
  MessageSquare, 
  Smartphone, 
  Users, 
  Heart, 
  Eye, 
  Play, 
  Share2, 
  MessageCircle, 
  Bot, 
  Zap, 
  ShieldCheck, 
  SmartphoneIcon,
  Cpu,
  Globe,
  Flame,
  UserPlus,
  UserMinus,
  LayoutGrid,
  Send
} from 'lucide-react';

export const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'from-purple-500 to-pink-500',
    description: 'The most complete Instagram automation suite on real devices.',
    features: [
      { icon: MessageCircle, title: 'Auto-Comment', desc: 'Scrape followers and automatically comment on their posts.' },
      { icon: Bot, title: 'Mass DM', desc: 'Send direct messages to scraped lists of targeted users.' },
      { icon: UserPlus, title: 'Follow / Unfollow', desc: 'Build and engage with targeted users.' },
      { icon: Heart, title: 'Likes', desc: 'Boost engagement on posts automatically.' },
      { icon: Eye, title: 'Story Viewer', desc: 'Watch stories at scale to increase follow-back.' },
      { icon: Play, title: 'Reels Watcher', desc: 'Scroll through reels naturally, just like a real user.' },
      { icon: LayoutGrid, title: 'Posting', desc: 'Publish reels, stories, and wall posts on schedule.' },
      { icon: Share2, title: 'Repost & Share', desc: 'Distribute content across accounts seamlessly.' },
    ]
  },
  {
    id: 'tinder',
    name: 'Tinder',
    icon: Flame,
    color: 'from-rose-500 to-orange-500',
    description: 'Revolutionize your OnlyFans outreach with advanced Tinder automation.',
    features: [
      { icon: UserPlus, title: 'Auto Registration', desc: 'Automatically create and verify new accounts.' },
      { icon: Zap, title: 'Auto Swipe', desc: 'Smart auto-swiping with human-like delays and logic.' },
      { icon: Globe, title: 'Geo-Spoofing', desc: 'Change GPS location dynamically to match globally.' },
      { icon: Bot, title: 'AI Chatting', desc: 'Drive traffic to your OnlyFans profile with ease.' },
      { icon: Cpu, title: 'App Cloner Support', desc: 'Automation for both phones and emulators.' },
    ]
  }
];
