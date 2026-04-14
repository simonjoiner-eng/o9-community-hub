import React, { useState, useEffect } from 'react';
import { 
  Home, UserPlus, Calendar, ThumbsUp, Users, ExternalLink, MessageSquare, Menu, X, ChevronRight, CheckCircle2, Loader2, Clock, Info, Building2, MapPin, Globe, Award, Send, CheckSquare, Filter, Boxes, FileText, Video, FileArchive, Search, BookOpen, Bookmark, BookmarkCheck, Zap, Cpu, Plus, Trash2, Database, ShieldCheck
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, updateDoc, deleteDoc, increment, addDoc } from 'firebase/firestore';

// --- Production Configuration ---
// Refined helper to safely access environment variables without breaking ES2015 targets
const getFirebaseConfig = () => {
  // 1. Safe check for Vite/Netlify Environment Variables
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_CONFIG) {
      return JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
    }
  } catch (e) {
    // Fallback if import.meta is restricted or undefined
  }

  // 2. Fallback for internal previewer tool
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    return JSON.parse(__firebase_config);
  }
  return null; 
};

const getAppId = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_ID) {
      return import.meta.env.VITE_APP_ID;
    }
  } catch (e) {
    // Fallback if import.meta is restricted
  }
  
  if (typeof __app_id !== 'undefined') return __app_id;
  return 'community-hub-default';
};

const firebaseConfig = getFirebaseConfig();
const appId = getAppId();

// Initialize Firebase only if config exists to prevent blank-page crashes
let app, auth, db;
if (firebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

// --- Constants ---
const SOLUTION_AREAS = [
  "Demand Planning", "Supply Planning", "MEIO", "Financial Planning", "Retail Planning", "S&OP / IBP", "Inventory Optimization"
];

const INDUSTRIES = [
  "Consumer Products", "Supplier Manufacturing", "Retail & Apparel", "Consumer Electronics", "Discrete Manufacturing"
];

const RESOURCE_TYPES = ["Document", "PDF", "Video", "Presentation"];

// --- Initial Data Seeds ---
const INITIAL_VOTES = [
  { id: "v1", title: "Agentic AI in Demand Planning", description: "Utilize autonomous agents to handle routine forecast adjustments and driver selection.", count: 42, dateSubmitted: "2024-02-10", status: "In Progress", benefit: "Reduces manual intervention for high-volume items.", releaseDate: "Aug 2025", submittedBy: "o9 Product Team", solutionArea: "Demand Planning" },
  { id: "v2", title: "ABRS / CDRS Framework", description: "Advanced Buffer replenishment and Capacity-driven replenishment strategies integration.", count: 35, dateSubmitted: "2024-01-15", status: "Accepted", benefit: "Better alignment between stock needs and production constraints.", releaseDate: "Dec 2024", submittedBy: "Sarah Chen", solutionArea: "Supply Planning" },
  { id: "v3", title: "Touchless & Forecast Value Add", description: "New analytics dashboard to track statistical model performance vs. human overrides.", count: 28, dateSubmitted: "2024-03-05", status: "Planned", benefit: "Identify where human input actually improves accuracy.", releaseDate: "Nov 2025", submittedBy: "Alex Johnson", solutionArea: "Demand Planning" }
];

const INITIAL_EVENTS = [
  { id: "e1", title: "DP Release & Roadmap Deep Dive", date: "2024-02-14", time: "10:00 AM EST", location: "Global Online Session", area: "Demand Planning", description: "Monthly User Community Sync - Second Wednesday." },
  { id: "e2", title: "Resideo Discussion & Case Study", date: "2024-04-10", time: "10:00 AM EST", location: "Global Online Session", area: "Community Spotlight", description: "Client spotlight on implementation successes and failures." }
];

const INITIAL_RESOURCES = [
  { id: "r1", title: "Demand Planning Masterclass", type: "Video", area: "Demand Planning", description: "End-to-end training on statistical forecasting and market intelligence integration." },
  { id: "r2", title: "MEIO Implementation Guide", type: "PDF", area: "MEIO", description: "Technical documentation for setting up multi-echelon buffer positioning." }
];

const MEMBERS = [
  { name: "Alex Johnson", role: "Demand Planning Lead", industry: "Consumer Products", company: "Kraft Heinz", location: "Chicago, IL", status: "Gold", ideasSubmitted: 14, solutionArea: "Demand Planning" },
  { name: "Sarah Chen", role: "Technical Director", industry: "Consumer Electronics", company: "Resideo", location: "San Francisco, CA", status: "Gold", ideasSubmitted: 9, solutionArea: "Supply Planning" },
  { name: "Marcus Smith", role: "S&OP Expert", industry: "Retail & Apparel", company: "LEGO", location: "Billund, DK", status: "Silver", ideasSubmitted: 4, solutionArea: "S&OP / IBP" },
  { name: "Elena Rodriguez", role: "Planning Manager", industry: "Supplier Manufacturing", company: "WestRock", location: "Atlanta, GA", status: "Bronze", ideasSubmitted: 2, solutionArea: "MEIO" }
];

// --- Sub-Components ---

const LandingPage = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center text-center py-24 px-4 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="relative z-10 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-cyan-500/20 mb-8">
        <ShieldCheck size={14} /> Official DP User Community Hub
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
        THE PLANNING <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-pulse">TOWN SQUARE.</span>
      </h1>
      <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
        Silo-breaking meeting point between clients and o9. Educate yourself, interact with peers, and signal the future of our product roadmap.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-cyan-400 mb-3"><BookOpen size={24}/></div>
          <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Passive Knowledge</h3>
          <p className="text-slate-500 text-sm">Educate yourself about platform capabilities and best practices.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-blue-400 mb-3"><Users size={24}/></div>
          <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Active Knowledge</h3>
          <p className="text-slate-500 text-sm">Interact with o9 representatives and peers in a safe space.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-purple-400 mb-3"><Zap size={24}/></div>
          <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Knowledge Back</h3>
          <p className="text-slate-500 text-sm">Signal the future. Influence the roadmap through community voting.</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <button onClick={() => onNavigate('signup')} className="bg-cyan-500 text-black px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg hover:scale-105">Join Community</button>
        <button onClick={() => onNavigate('events')} className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">View Schedule</button>
      </div>
    </div>
  </div>
);

const SignupPage = ({ user }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', interest: SOLUTION_AREAS[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const userDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'info');
      await setDoc(userDoc, { ...formData, signupDate: new Date().toISOString() });
      setSubmitted(true);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="max-w-md mx-auto text-center py-24 px-6">
      <div className="bg-cyan-500/20 text-cyan-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/50"><CheckCircle2 size={40} /></div>
      <h2 className="text-4xl font-black text-white mb-4 uppercase">Profile Connected</h2>
      <button onClick={() => setSubmitted(false)} className="text-cyan-400 font-bold hover:underline">Manage Settings</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl text-left">
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Verified Registration</h2>
        <p className="text-slate-400 mb-10 text-sm">Welcome planners, managers, and executives.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input required className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white outline-none focus:border-cyan-500" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input required type="email" className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white outline-none focus:border-cyan-500" placeholder="Corporate Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <select className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white outline-none appearance-none" onChange={(e) => setFormData({...formData, interest: e.target.value})}>
            {SOLUTION_AREAS.map(area => <option key={area} className="bg-slate-900">{area}</option>)}
          </select>
          <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading && <Loader2 className="animate-spin" />}
            Authorize Access
          </button>
        </form>
      </div>
    </div>
  );
};

const SchedulePage = ({ events, sandbox }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: 'Global Online Session', description: '' });

  const addEvent = async () => {
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'events'), form);
      setShowAdd(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="text-left">
          <h2 className="text-4xl font-black text-white uppercase mb-2 tracking-tighter">Sync Schedule</h2>
          <p className="text-slate-400">Meetings held on the <strong>second Wednesday</strong> of every month at 10 AM EST.</p>
        </div>
        {sandbox && (
          <button onClick={() => setShowAdd(!showAdd)} className="bg-cyan-500 text-black px-6 py-2 rounded-full font-black text-xs uppercase flex items-center gap-2">
            <Plus size={16} /> Add Test Sync
          </button>
        )}
      </div>

      {showAdd && (
        <div className="mb-10 p-8 bg-white/5 border border-cyan-500/30 rounded-3xl space-y-4 text-left animate-in fade-in slide-in-from-top-4">
          <input className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
          <div className="flex gap-4">
            <input type="date" className="flex-1 bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" onChange={e => setForm({...form, date: e.target.value})} />
            <input className="flex-1 bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Time (10:00 AM EST)" onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <button onClick={addEvent} className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold w-full uppercase tracking-widest">Commit Sync to Cloud</button>
        </div>
      )}

      <div className="space-y-6">
        {events.map(event => (
          <div key={event.id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-8 text-left">
              <div className="bg-cyan-500 text-black p-4 rounded-2xl min-w-[100px] text-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <div className="text-[10px] font-black uppercase opacity-60 mb-1">{new Date(event.date || Date.now()).toLocaleString('default', { month: 'short' })}</div>
                <div className="text-3xl font-black leading-none">{new Date(event.date || Date.now()).getDate()}</div>
              </div>
              <div>
                <h3 className="font-black text-2xl text-white group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                <p className="text-slate-400 font-medium text-sm mt-1">{event.description}</p>
                <div className="flex gap-4 mt-3">
                  <span className="text-slate-500 text-xs flex items-center gap-1"><Clock size={14}/> {event.time}</span>
                  <span className="text-slate-500 text-xs flex items-center gap-1"><Globe size={14}/> {event.location}</span>
                </div>
              </div>
            </div>
            <button className="mt-6 md:mt-0 px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-cyan-500 hover:text-black transition-all border border-white/5">RSVP</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const VotingPage = ({ user, ideas, sandbox }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', solutionArea: SOLUTION_AREAS[0], count: 0 });

  const handleVote = async (id) => {
    if (!user) return;
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'votes', id), { count: increment(1) }); } catch (err) { console.error(err); }
  };

  const addIdea = async () => {
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'votes'), {
        ...form,
        submittedBy: "Sandbox User",
        dateSubmitted: new Date().toISOString(),
        status: "In Review",
        benefit: "Capability enhancement",
        releaseDate: "TBD"
      });
      setShowAdd(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div className="text-left">
          <h2 className="text-4xl font-black text-white uppercase mb-2 tracking-tighter">Roadmap Innovation</h2>
          <p className="text-slate-400">Crowdsourcing the next generation of Digital Brain capabilities.</p>
        </div>
        {sandbox && (
          <button onClick={() => setShowAdd(!showAdd)} className="bg-cyan-500 text-black px-6 py-2 rounded-full font-black text-xs uppercase flex items-center gap-2">
            <Plus size={16} /> Add Test Idea
          </button>
        )}
      </div>

      {showAdd && (
        <div className="mb-10 p-8 bg-white/5 border border-cyan-500/30 rounded-3xl space-y-4 text-left animate-in fade-in slide-in-from-top-4">
          <input className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Idea Title" onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
          <select className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" onChange={e => setForm({...form, solutionArea: e.target.value})}>
            {SOLUTION_AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
          <button onClick={addIdea} className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold w-full uppercase tracking-widest">Broadcast to Roadmap</button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col group text-left transition-all hover:bg-white/10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">{idea.solutionArea}</span>
              <div className="bg-cyan-500/10 text-cyan-400 font-black px-3 py-1 rounded-full text-sm">{idea.count}</div>
            </div>
            <h3 className="font-black text-xl text-white mb-4 group-hover:text-cyan-400 transition-colors">{idea.title}</h3>
            <p className="text-slate-400 text-sm mb-10 flex-grow leading-relaxed line-clamp-4">{idea.description}</p>
            <button onClick={() => handleVote(idea.id)} className="w-full py-4 bg-cyan-500/10 text-cyan-400 rounded-2xl font-black uppercase text-xs border border-cyan-500/20 hover:bg-cyan-500 hover:text-black transition-all">Support Feature</button>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-left">
        <div className="px-8 py-6 border-b border-white/5 bg-white/2"><h3 className="font-black text-white uppercase tracking-widest flex items-center gap-3"><Zap size={20} className="text-cyan-400" /> Technical Backlog</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase text-slate-500 font-black tracking-widest"><th className="px-8 py-6">Capability Node</th><th className="px-8 py-6">Status</th><th className="px-8 py-6">Release Target</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ideas.map((idea) => (
                <tr key={idea.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-white text-lg">{idea.title}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">By {idea.submittedBy}</div>
                  </td>
                  <td className="px-8 py-6"><span className="px-3 py-1 rounded-full text-[10px] font-black uppercase border border-white/10 text-slate-400">{idea.status}</span></td>
                  <td className="px-8 py-6 text-sm font-black text-white">{idea.releaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MembersPage = () => (
  <div className="max-w-7xl mx-auto py-20 px-6">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
      <div>
        <h2 className="text-4xl font-black text-white uppercase mb-2 tracking-tighter">Expert Network</h2>
        <p className="text-slate-400">Connecting planners from across the global ecosystem.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map(ind => <span key={ind} className="bg-white/5 text-slate-500 text-[9px] font-black uppercase px-3 py-1.5 rounded-full border border-white/5">{ind}</span>)}
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {MEMBERS.map((member, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center hover:bg-white/10 transition-all relative overflow-hidden group">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}&mouth=smile`} className="w-24 h-24 rounded-2xl mx-auto border-2 border-white/10 group-hover:border-cyan-500 transition-all mb-6 relative z-10" />
          <h3 className="font-black text-2xl text-white mb-1">{member.name}</h3>
          <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">{member.industry}</p>
          <div className="space-y-4 text-left border-t border-white/5 pt-6 text-sm text-slate-300">
            <div className="flex items-center gap-4"><Building2 size={16} className="text-slate-500" /> <strong>{member.company}</strong></div>
            <div className="flex items-center gap-4"><MapPin size={16} className="text-slate-500" /> {member.location}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LinksPage = ({ resources, sandbox }) => {
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', area: SOLUTION_AREAS[0], type: 'PDF' });

  const addResource = async () => {
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'resources'), form);
      setShowAdd(false);
    } catch (err) { console.error(err); }
  };

  const filtered = filter === 'All' ? resources : resources.filter(r => r.area === filter);

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
        <div>
          <h2 className="text-4xl font-black text-white uppercase mb-2 tracking-tighter">Technical Assets</h2>
          <p className="text-slate-400">Passive knowledge center for guides and roadmaps.</p>
        </div>
        {sandbox && (
          <button onClick={() => setShowAdd(!showAdd)} className="bg-cyan-500 text-black px-6 py-2 rounded-full font-black text-xs uppercase flex items-center gap-2">
            <Plus size={16} /> Add Test Asset
          </button>
        )}
      </div>

      {showAdd && (
        <div className="mb-10 p-8 bg-white/5 border border-cyan-500/30 rounded-3xl space-y-4 text-left animate-in fade-in slide-in-from-top-4">
          <input className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
          <div className="flex gap-4">
            <select className="flex-1 bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" onChange={e => setForm({...form, area: e.target.value})}>{SOLUTION_AREAS.map(a => <option key={a}>{a}</option>)}</select>
            <select className="flex-1 bg-black/50 p-3 border border-white/10 rounded-xl text-white outline-none" onChange={e => setForm({...form, type: e.target.value})}>{RESOURCE_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <button onClick={addResource} className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold w-full uppercase tracking-widest">Commit Asset</button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        <div className="space-y-3 text-left">
          <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-6">Expertise Nodes</h3>
          {['All', ...SOLUTION_AREAS].map(area => (
            <button key={area} onClick={() => setFilter(area)} className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === area ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-slate-500 border border-transparent hover:bg-white/5'}`}>{area}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map(res => (
            <div key={res.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all text-left">
              <div className="bg-cyan-500/10 p-3 rounded-2xl text-cyan-400 border border-cyan-500/20 w-max mb-6">
                {res.type === 'Video' ? <Video size={24} /> : <FileText size={24} />}
              </div>
              <h4 className="text-2xl font-black text-white mb-2 leading-tight">{res.title}</h4>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">{res.area}</p>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-3">{res.description}</p>
              <button className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300">Access Node <ExternalLink size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [sandboxMode, setSandboxMode] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (!auth) return; // Guard for missing config
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
        else await signInAnonymously(auth);
      } catch (err) { console.error("Auth init failed:", err); }
    };
    initAuth();
    const unsubscribe = auth ? onAuthStateChanged(auth, setUser) : () => {};
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    
    // Sync Ideas
    const ideasCol = collection(db, 'artifacts', appId, 'public', 'data', 'votes');
    const unsubIdeas = onSnapshot(ideasCol, (s) => {
      if (s.empty) INITIAL_VOTES.forEach(v => setDoc(doc(ideasCol, v.id), v));
      else setIdeas(s.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => b.count - a.count));
    }, (err) => console.error("Firestore sync error:", err));

    // Sync Resources
    const resCol = collection(db, 'artifacts', appId, 'public', 'data', 'resources');
    const unsubRes = onSnapshot(resCol, (s) => {
      if (s.empty) INITIAL_RESOURCES.forEach(r => setDoc(doc(resCol, r.id), r));
      else setResources(s.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (err) => console.error("Firestore sync error:", err));

    // Sync Events
    const eventsCol = collection(db, 'artifacts', appId, 'public', 'data', 'events');
    const unsubEvents = onSnapshot(eventsCol, (s) => {
      if (s.empty) INITIAL_EVENTS.forEach(e => setDoc(doc(eventsCol, e.id), e));
      else setEvents(s.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => new Date(a.date) - new Date(b.date)));
    }, (err) => console.error("Firestore sync error:", err));

    return () => { unsubIdeas(); unsubRes(); unsubEvents(); };
  }, [user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage onNavigate={setCurrentPage} user={user} />;
      case 'signup': return <SignupPage user={user} />;
      case 'events': return <SchedulePage events={events} sandbox={sandboxMode} />;
      case 'voting': return <VotingPage user={user} ideas={ideas} sandbox={sandboxMode} />;
      case 'members': return <MembersPage />;
      case 'links': return <LinksPage resources={resources} sandbox={sandboxMode} />;
      default: return <LandingPage onNavigate={setCurrentPage} user={user} />;
    }
  };

  const navItems = [
    { id: 'landing', label: 'Town Square', icon: Home },
    { id: 'signup', label: 'Onboard', icon: UserPlus },
    { id: 'events', label: 'Syncs', icon: Calendar },
    { id: 'voting', label: 'Roadmap', icon: ThumbsUp },
    { id: 'members', label: 'Experts', icon: Users },
    { id: 'links', label: 'Assets', icon: BookOpen },
  ];

  // Failure guard UI if config is missing
  if (!firebaseConfig) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-10 text-center">
        <Database size={64} className="text-red-400 mb-6" />
        <h1 className="text-3xl font-black mb-4">Configuration Missing</h1>
        <p className="text-slate-400 max-w-md">The platform cannot reach the Digital Brain. Please ensure <strong>VITE_FIREBASE_CONFIG</strong> is set in your Netlify Environment Variables.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-400">
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 h-24 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div onClick={() => setCurrentPage('landing')} className="flex items-center gap-4 cursor-pointer group transition-all text-left">
            <div className="w-12 h-12 bg-white flex items-center justify-center text-black font-black text-2xl rounded-2xl group-hover:bg-cyan-500 transition-colors">o9</div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-white tracking-tighter leading-none">SOLUTIONS</span>
              <span className="text-[10px] font-black text-cyan-400 tracking-[0.4em] mt-1 uppercase leading-none">Community Hub</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === item.id ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{item.label}</button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 min-h-[80vh]">
        {!user ? <div className="h-[80vh] flex flex-col items-center justify-center text-cyan-500 animate-pulse uppercase tracking-[0.5em] font-black"><Cpu size={48} className="mb-6" /> Syncing Digital Brain...</div> : renderPage()}
      </main>

      <footer className="py-20 px-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-2 text-left">
            <div className="text-slate-500 text-xs tracking-widest uppercase font-black">© 2024 o9 SOLUTIONS INC.</div>
            <div className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Confidential & Proprietary • Town Square Prototype</div>
          </div>
          <button onClick={() => setSandboxMode(!sandboxMode)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[10px] font-black uppercase ${sandboxMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-white/5 text-slate-500 border-white/5'}`}>
            <Database size={14} /> {sandboxMode ? 'Admin Portal Active' : 'Enter Admin Sandbox'}
          </button>
        </div>
      </footer>
    </div>
  );
}