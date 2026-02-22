import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Heart, MapPin, Briefcase, Code2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { connectionService, userService } from '../services/api';
import type { User } from '../services/api';

interface Developer {
  id: string;
  _id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  experience: string;
  skills: string[];
  bio: string;
}

function SwipeCard({ 
  developer, 
  onSwipeLeft, 
  onSwipeRight,
}: {
  developer: Developer;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  const superLikeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      onSwipeLeft();
    } else if (e.key === 'ArrowRight') {
      onSwipeRight();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Swipe card for ${developer.name}. Left arrow to pass, right arrow to like`}
      className="absolute inset-0 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
      whileTap={{ scale: 1.02 }}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden relative">
        <img
          src={developer.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'}
          alt={developer.name}
          width={400}
          height={600}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        <motion.div 
          style={{ opacity: superLikeOpacity }}
          className="absolute top-8 left-8 px-4 py-2 bg-green-500 rounded-full border-4 border-white"
        >
          <span className="text-white font-bold text-xl">SUPER</span>
        </motion.div>
        
        <motion.div 
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 px-4 py-2 bg-red-500 rounded-full border-4 border-white"
        >
          <span className="text-white font-bold text-xl">NOPE</span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#8B5CF6] rounded-full text-xs font-medium text-white">
              Lv.1
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-1">{developer.name}</h2>
          
          <div className="flex items-center gap-2 text-gray-300 mb-3">
            <Briefcase className="w-4 h-4" />
            <span>{developer.role || 'Developer'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{developer.location || 'Unknown'} • {developer.experience || '0 years'}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {developer.skills?.map((skill) => (
              <span key={skill} className="skill-tag text-gray-300">
                {skill}
              </span>
            ))}
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2">{developer.bio || 'No bio available'}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function DiscoverPage() {
  const [feed, setFeed] = useState<Developer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<'left' | 'right' | 'super' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadFeed = useCallback(async () => {
    try {
      const response = await userService.getFeed();
      const users = response.data.data.map((u: User) => ({
        id: u._id,
        _id: u._id,
        name: `${u.fname} ${u.lname}`,
        avatar: u.profileUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        role: u.skills?.[0] || 'Developer',
        location: 'Unknown',
        experience: `${u.age || 0} years`,
        skills: u.skills || [],
        bio: u.about || '',
      }));
      setFeed(users);
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleSwipeLeft = async () => {
    const currentUser = feed[currentIndex];
    if (!currentUser) return;
    
    try {
      await connectionService.sendPass(currentUser._id);
    } catch (err) {
      console.error('Failed to pass:', err);
    }
    
    setLastSwipe('left');
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setLastSwipe(null);
    }, 300);
  };

  const handleSwipeRight = async () => {
    const currentUser = feed[currentIndex];
    if (!currentUser) return;
    
    try {
      await connectionService.sendLike(currentUser._id);
    } catch (err) {
      console.error('Failed to like:', err);
    }
    
    setLastSwipe('right');
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setLastSwipe(null);
    }, 300);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const currentDeveloper = feed[currentIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentDeveloper) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DevMatch</span>
          </div>
          <button onClick={handleLogout} aria-label="Logout" className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5 text-white" aria-hidden="true" />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No more developers to discover</p>
            <button 
              onClick={loadFeed}
              className="px-6 py-3 gradient-button rounded-xl"
            >
              Refresh Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">DevMatch</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <LogOut className="w-5 h-5 text-white" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 pb-[100px]">
        <div className="relative w-full max-w-sm h-[480px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentDeveloper.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={
                lastSwipe === 'left' 
                  ? { x: -500, opacity: 0 }
                  : lastSwipe === 'right'
                  ? { x: 500, opacity: 0 }
                  : { y: -500, opacity: 0 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <SwipeCard
                developer={currentDeveloper}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwipeLeft}
              onKeyDown={(e) => e.key === 'Enter' && handleSwipeLeft()}
              aria-label="Pass - skip this developer"
              className="w-14 h-14 rounded-full bg-white/10 border-2 border-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <X className="w-7 h-7 text-red-500" aria-hidden="true" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwipeRight}
              onKeyDown={(e) => e.key === 'Enter' && handleSwipeRight()}
              aria-label="Like - connect with this developer"
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
            >
              <Heart className="w-7 h-7 text-white" fill="white" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </main>

      <nav className="flex items-center justify-around p-4 border-t border-white/10">
        {[
          { icon: Code2, active: true, label: 'Discover', path: '/discover' },
          { icon: Heart, active: false, label: 'Matches', path: '/matches' },
          { icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, active: false, label: 'Profile', path: '/profile' },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
            aria-label={item.label}
            aria-current={item.active ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 p-2 ${
              item.active ? 'text-[#8B5CF6]' : 'text-gray-500'
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg`}
          >
            <item.icon className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
