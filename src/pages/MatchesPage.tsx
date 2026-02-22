import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Code2, Heart, Check, X, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService, connectionService } from '../services/api';
import type { User } from '../services/api';

interface Match {
  id: string;
  _id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  skills: string[];
}

interface Request {
  _id: string;
  fromUserId: User;
}

export function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [connections, setConnections] = useState<Match[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const [connectionsRes, requestsRes] = await Promise.all([
        userService.getConnections(),
        userService.getReceivedRequests(),
      ]);
      
      setConnections(connectionsRes.data.data.map((u: User) => ({
        id: u._id,
        _id: u._id,
        name: `${u.fname} ${u.lname}`,
        avatar: u.profileUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: u.skills?.[0] || 'Developer',
        lastMessage: 'Start a conversation',
        time: '',
        unread: 0,
        online: false,
        skills: u.skills || [],
      })));
      
      setRequests(requestsRes.data.data);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAccept = async (requestId: string) => {
    try {
      await connectionService.acceptRequest(requestId);
      await loadData();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await connectionService.rejectRequest(requestId);
      await loadData();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const filteredConnections = connections.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col">
      <header className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Matches</h1>
          <div className="flex gap-2">
            <button onClick={handleLogout} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'connections' 
                ? 'bg-[#8B5CF6] text-white' 
                : 'bg-white/10 text-gray-400'
            }`}
          >
            Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'requests' 
                ? 'bg-[#8B5CF6] text-white' 
                : 'bg-white/10 text-gray-400'
            }`}
          >
            Requests ({requests.length})
          </button>
        </div>
        
        {activeTab === 'connections' && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matches..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
            />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-[100px]">
        {activeTab === 'connections' ? (
          filteredConnections.length > 0 ? (
            filteredConnections.map((match, index) => (
              <motion.button
                key={match.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => navigate(`/chat/${match._id}`)}
                className="w-full glass-card p-4 flex items-start gap-4 hover:bg-white/10 transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden">
                    <img 
                      src={match.avatar} 
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold truncate">{match.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 truncate">{match.role}</p>
                  <div className="flex gap-1">
                    {match.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-gray-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No connections yet</p>
              <p className="text-gray-500 text-sm mt-2">Start swiping to find matches!</p>
            </div>
          )
        ) : (
          requests.length > 0 ? (
            requests.map((req, index) => (
              <motion.div
                key={req._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                className="w-full glass-card p-4 flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={req.fromUserId.profileUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'} 
                    alt={`${req.fromUserId.fname} ${req.fromUserId.lname}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {req.fromUserId.fname} {req.fromUserId.lname}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2 truncate">
                    {req.fromUserId.skills?.join(', ') || 'Developer'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(req._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No pending requests</p>
            </div>
          )
        )}
      </main>

      <nav className="flex items-center justify-around p-4 border-t border-white/10">
        {[
          { icon: Code2, active: false, label: 'Discover', path: '/discover' },
          { icon: Heart, active: true, label: 'Matches', path: '/matches' },
          { icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, active: false, label: 'Profile', path: '/profile' },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 p-2 ${
              item.active ? 'text-[#8B5CF6]' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
