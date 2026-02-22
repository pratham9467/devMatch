import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Edit3, Code2, Star, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';
import type { User } from '../services/api';

const experienceTimeline = [
  {
    role: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    period: '2022 - Present',
    description: 'Leading frontend architecture and mentoring junior developers.',
  },
  {
    role: 'Full Stack Developer',
    company: 'StartupXYZ',
    period: '2020 - 2022',
    description: 'Built the core product from scratch, scaled to 100k users.',
  },
  {
    role: 'Frontend Developer',
    company: 'WebAgency Co.',
    period: '2018 - 2020',
    description: 'Created responsive websites for various clients.',
  },
];

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    fname: '',
    lname: '',
    about: '',
    skills: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileService.getProfile();
        setProfile(response.data.data);
        const p = response.data.data;
        setEditForm({
          fname: p.fname || '',
          lname: p.lname || '',
          about: p.about || '',
          skills: p.skills?.join(', ') || '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const skillsArray = editForm.skills.split(',').map(s => s.trim()).filter(Boolean);
      await profileService.updateProfile({
        fname: editForm.fname,
        lname: editForm.lname,
        about: editForm.about,
        skills: skillsArray,
      });
      const response = await profileService.getProfile();
      setProfile(response.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

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

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <header className="relative">
        <div className="h-48 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent" />
        </div>
        
        <div className="relative px-4 -mt-20">
          <div className="flex items-end justify-between">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#0B0F19]">
                <img 
                  src={profile.profileUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'} 
                  alt={`${profile.fname} ${profile.lname}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <div className="flex gap-2 mb-4">
              <button onClick={handleLogout} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <LogOut className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-3 rounded-xl gradient-button flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 mb-20">
        {isEditing ? (
          <div className="glass-card p-4 space-y-4">
            <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                value={editForm.fname}
                onChange={(e) => setEditForm({ ...editForm, fname: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                value={editForm.lname}
                onChange={(e) => setEditForm({ ...editForm, lname: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">About</label>
              <textarea
                value={editForm.about}
                onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                value={editForm.skills}
                onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                placeholder="React, TypeScript, Node.js"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </div>
            <button onClick={handleSave} className="w-full py-3 gradient-button rounded-xl">
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{profile.fname} {profile.lname}</h1>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Location not set</span>
              </div>
            </div>

            <div className="glass-card p-4">
              <h2 className="text-lg font-semibold text-white mb-3">About</h2>
              <p className="text-gray-300 leading-relaxed">{profile.about || 'No bio added yet'}</p>
            </div>

            <div className="glass-card p-4">
              <h2 className="text-lg font-semibold text-white mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="skill-tag text-gray-300"
                  >
                    {skill}
                  </motion.span>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {!isEditing && (
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Experience</h2>
            <div className="space-y-4">
              {experienceTimeline.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative pl-6 border-l-2 border-[#8B5CF6]/30"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#8B5CF6]" />
                  <div className="text-sm text-[#8B5CF6] mb-1">{exp.period}</div>
                  <div className="text-white font-medium">{exp.role}</div>
                  <div className="text-gray-400 text-sm mb-1">{exp.company}</div>
                  <p className="text-gray-500 text-sm">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0B0F19]/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around p-4">
          {[
            { icon: Code2, active: false, label: 'Discover', path: '/discover' },
            { icon: Star, active: false, label: 'Matches', path: '/matches' },
            { icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, active: true, label: 'Profile', path: '/profile' },
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
        </div>
      </nav>
    </div>
  );
}
