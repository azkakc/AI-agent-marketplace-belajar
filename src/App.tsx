import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Search, 
  LayoutDashboard, 
  PlusCircle, 
  TrendingUp, 
  Wallet,
  Menu,
  X,
  ArrowRight,
  Star,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { auth, loginWithGoogle, db, OperationType, handleFirestoreError } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
  setDoc
} from 'firebase/firestore';
import { cn } from './lib/utils';
import { Agent, UserProfile, Deployment, Transaction } from './types';
import { ai, MODELS } from './lib/gemini';

// --- Components ---

const Navbar = ({ user, onLogin }: { user: User | null; onLogin: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border-dim px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-end">
        <Link to="/" className="flex flex-col group">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            Nexus<span className="text-accent">.</span>
          </h1>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-muted">Agent System v1.0</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
          <Link to="/marketplace" className="hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1">Marketplace</Link>
          <Link to="/build" className="hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1">Build Agent</Link>
          {user && <Link to="/dashboard" className="hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1">Dashboard</Link>}
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[11px] font-bold text-text-main leading-none uppercase tracking-wider">{user.displayName}</span>
                <span className="text-[9px] text-accent font-mono uppercase tracking-tighter decoration-accent underline">0xAuth..Verified</span>
              </div>
              <button 
                onClick={() => signOut(auth)}
                className="w-10 h-10 rounded-full border border-border-dim flex items-center justify-center hover:bg-accent/10 transition-colors"
                title="Log Out"
                id="logout-btn"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <LogOut size={16} className="text-text-muted" />
                )}
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="px-8 py-3 bg-text-main text-surface text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              id="login-btn"
            >
              Initialize Session
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-surface border-t border-border-dim py-20 px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-[0.3em] text-text-muted uppercase">
      <div className="flex gap-12 mb-8 md:mb-0">
        <span>Term_01: Autonomous</span>
        <span>Term_02: Verified</span>
        <span>Term_03: Machine_Economy</span>
      </div>
      <div className="text-right">
        Designed by Nexus Systems Architect // 2026 Blueprint
      </div>
    </div>
  </footer>
);

// --- Views ---

const LandingPage = () => {
  return (
    <div className="bg-surface text-text-main selection:bg-accent selection:text-surface">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="text-[11px] font-mono text-accent block mb-8 uppercase tracking-[0.4em] underline decoration-accent decoration-2 underline-offset-8">
              Section 00 // The Agentic Era
            </span>
            <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter uppercase mb-12 text-center">
              Nexus<span className="text-accent">.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-text-muted max-w-3xl mx-auto mb-16 font-medium uppercase tracking-tight">
              Buy, sell, and deploy autonomous intelligence that operates beyond human constraints.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl">
              <Link 
                to="/marketplace" 
                className="flex-1 py-6 bg-text-main text-surface font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent transition-colors"
                id="explore-cta"
              >
                Enter Marketplace <ArrowRight size={20} />
              </Link>
              <Link 
                to="/build" 
                className="flex-1 py-6 border-4 border-border-dim text-text-main font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:border-accent transition-colors"
                id="create-agent-cta"
              >
                Build Architecture
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Global Volume Stats */}
        <div className="absolute bottom-16 left-8 right-8 flex justify-between items-end border-t border-border-dim pt-8">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em]">Network Velocity</span>
            <span className="text-5xl font-black tracking-tighter">0.024 MS</span>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mb-2 text-right">
              Market Cap Tier // High<br/>
              Status: Operational
            </p>
            <div className="text-[42px] font-bold leading-none tracking-tighter">$12.4M <span className="text-[14px] text-text-muted uppercase tracking-widest font-mono">Total Vol</span></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Core Components</h2>
            <span className="font-mono text-[11px] text-accent uppercase tracking-widest">Protocol v4.2.0 →</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                tag: "COMPONENT_01",
                title: "Architect", 
                desc: "Low-code orchestration for V8-sandboxed LLM environments." 
              },
              { 
                tag: "COMPONENT_02",
                title: "Registry", 
                desc: "Verified machine identities with cryptographic safety guards." 
              },
              { 
                tag: "COMPONENT_03",
                title: "Settlement", 
                desc: "Instant machine-to-machine payments across parallel chains." 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-subsurface border-2 border-border-dim p-12 flex flex-col gap-6 hover:border-accent transition-colors group h-[320px] justify-between">
                <div>
                  <span className="text-[10px] font-mono text-accent block mb-2 underline tracking-widest">{feature.tag}</span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{feature.title}</h3>
                </div>
                <p className="text-text-muted text-sm leading-relaxed font-medium uppercase tracking-tight">{feature.desc}</p>
                <div className="h-1 w-12 bg-border-dim group-hover:bg-accent group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Marketplace = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const q = query(collection(db, "agents"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pt-40 pb-20 px-8 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-12 border-b-4 border-border-dim pb-12">
          <div className="max-w-2xl">
            <h2 className="text-[11px] font-mono text-accent uppercase tracking-[0.4em] mb-4 underline decoration-2 underline-offset-4 decoration-accent">Section 01 // Registry</h2>
            <h1 className="text-7xl sm:text-[6rem] font-black tracking-tighter uppercase leading-[0.85]">Agentic Marketplace</h1>
          </div>
          <div className="relative w-full md:w-96">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-accent font-mono text-xs">Search_</span>
            <input 
              type="text" 
              placeholder="Query protocol..."
              autoFocus
              className="w-full bg-subsurface border-2 border-border-dim px-20 py-5 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="marketplace-search"
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-96 bg-subsurface animate-pulse border-2 border-border-dim" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.length > 0 ? filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-subsurface border-2 border-border-dim flex flex-col hover:border-accent transition-all"
              >
                <Link to={`/agent/${agent.id}`} className="flex flex-col h-full">
                  <div className="aspect-[16/10] bg-surface relative overflow-hidden p-8 border-b-2 border-border-dim group-hover:border-accent transition-colors">
                    <img 
                      src={agent.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`} 
                      alt={agent.name}
                      className="w-full h-full object-contain grayscale brightness-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute top-6 left-6 text-[10px] font-mono font-bold uppercase tracking-widest text-accent bg-surface border border-accent/20 px-3 py-1">
                      [ {agent.category} ]
                    </div>
                  </div>
                  <div className="p-10 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors leading-none">{agent.name}</h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-accent font-mono">{(agent.rating || 5).toFixed(1)}</div>
                          <div className="text-[9px] text-text-muted uppercase font-mono tracking-widest">Score_</div>
                        </div>
                      </div>
                      <p className="text-text-muted text-sm font-medium uppercase tracking-tight line-clamp-2 mb-8 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-end border-t border-border-dim pt-8 group-hover:border-accent/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-mono mb-1">Pricing Tier</span>
                        <span className="text-3xl font-black tracking-tighter">${agent.price}</span>
                      </div>
                      <span className="bg-white text-black text-[11px] font-black px-6 py-3 uppercase tracking-widest group-hover:bg-accent transition-colors">
                        Deploy
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full py-40 text-center flex flex-col items-center gap-6 border-2 border-dashed border-border-dim bg-subsurface">
                <Bot size={64} className="text-text-muted/20" />
                <p className="uppercase tracking-[0.4em] font-black text-text-muted">No Intelligence Detected</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "agents", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAgent({ id: docSnap.id, ...docSnap.data() } as Agent);
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);

  const handlePurchase = async () => {
    if (!auth.currentUser) return loginWithGoogle();
    if (!agent) return;
    
    setBuying(true);
    try {
      const deploymentData = {
        userId: auth.currentUser.uid,
        agentId: agent.id,
        agentName: agent.name,
        status: 'active',
        lastRun: serverTimestamp(),
        purchasedAt: serverTimestamp()
      };
      
      const deploymentRef = await addDoc(collection(db, "deployments"), deploymentData);
      
      await addDoc(collection(db, "transactions"), {
        buyerId: auth.currentUser.uid,
        sellerId: agent.creatorId,
        agentId: agent.id,
        amount: agent.price,
        timestamp: serverTimestamp(),
        deploymentId: deploymentRef.id
      });

      await updateDoc(doc(db, "agents", agent.id), {
        salesCount: (agent.salesCount || 0) + 1
      });

      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `agents/${agent.id}/purchase`);
    } finally {
      setBuying(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-surface flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-7xl h-1 bg-border-dim overflow-hidden relative">
        <motion.div 
          className="absolute inset-0 bg-accent w-1/3"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <span className="mt-8 text-[11px] font-mono text-text-muted uppercase tracking-[0.4em]">Decrypting Agent Blueprint...</span>
    </div>
  );

  if (!agent) return <div className="pt-40 text-center uppercase tracking-widest opacity-40 font-black text-5xl">404 // Agent Protocol Void</div>;

  return (
    <div className="min-h-screen bg-surface text-text-main">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-screen">
        {/* Visual Sidebar */}
        <div className="lg:col-span-5 relative bg-subsurface flex items-center justify-center p-12 lg:p-24 overflow-hidden border-r-4 border-border-dim">
          <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md aspect-square bg-surface border-4 border-border-dim p-12 group"
          >
            <img 
              src={agent.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`} 
              alt={agent.name}
              className="w-full h-full object-contain grayscale brightness-125 group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-6 right-6 font-mono text-[9px] text-text-muted uppercase tracking-widest">
              Render_v1.0.4
            </div>
          </motion.div>
          <div className="absolute top-12 left-12 flex flex-col gap-2">
            <span className="text-[10px] font-mono text-accent uppercase tracking-[0.4em] underline decoration-accent decoration-2 underline-offset-4">01 // Visual_ID</span>
            <span className="text-xl font-bold font-mono tracking-tighter">{agent.id.slice(0, 16)}</span>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:col-span-7 p-12 lg:p-32 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-6 mb-12">
              <span className="text-[11px] font-mono text-accent uppercase tracking-[0.4em] underline decoration-accent decoration-2 underline-offset-8">
                Section 02 // Specifications
              </span>
              <div className="h-px flex-grow bg-border-dim" />
            </div>

            <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.8] mb-12">
              {agent.name}<span className="text-accent">_</span>
            </h1>

            <div className="flex flex-wrap items-center gap-12 mb-16 px-8 py-6 border-l-4 border-accent bg-subsurface">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono leading-none mb-2">Category_</span>
                <span className="text-xl font-black uppercase tracking-tight">{agent.category}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono leading-none mb-2">Creator_</span>
                <span className="text-xl font-black uppercase tracking-tight">{agent.creatorName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono leading-none mb-2">Efficiency_</span>
                <span className="text-xl font-black uppercase tracking-tight text-accent">Tier Alpha</span>
              </div>
            </div>

            <p className="text-2xl text-text-muted leading-tight uppercase tracking-tight font-bold mb-16">
              {agent.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 border-t border-border-dim pt-12">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Protocol Capabilities //</span>
                <ul className="space-y-2">
                  {agent.capabilities?.map((cap, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-text-main">
                      <div className="w-2 h-2 bg-accent" /> {cap}
                    </li>
                  )) || <li className="text-xs text-text-muted">No explicit capabilities detected</li>}
                </ul>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Performance Metrics //</span>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tighter">{(agent.rating || 5.0).toFixed(1)}</span>
                  <span className="text-sm font-mono text-accent uppercase mb-2">System_Score</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-6">
              <button 
                onClick={handlePurchase}
                disabled={buying}
                className={cn(
                  "flex-grow px-12 py-8 text-xl font-black uppercase tracking-widest flex items-center justify-center gap-6 transition-all",
                  buying ? "bg-subsurface text-text-muted cursor-not-allowed border-2 border-border-dim" : "bg-text-main text-surface hover:bg-accent hover:scale-[1.02] active:scale-95"
                )}
                id="purchase-btn"
              >
                {buying ? "Provisioning..." : `Deploy Intelligence // $${agent.price}`}
                {!buying && <ArrowRight size={24} />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User | null }) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [myAgents, setMyAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'deployments' | 'creations'>('deployments');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const dq = query(collection(db, "deployments"), where("userId", "==", user.uid));
        const dSnap = await getDocs(dq);
        setDeployments(dSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deployment)));

        const aq = query(collection(db, "agents"), where("creatorId", "==", user.uid));
        const aSnap = await getDocs(aq);
        setMyAgents(aSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent)));
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user) return <div className="pt-40 text-center uppercase tracking-widest opacity-40 font-black text-2xl">Unauthorized Access // Session Null</div>;

  return (
    <div className="pt-40 pb-20 min-h-screen bg-surface">
      <header className="px-8 mb-20 border-l-8 border-accent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div>
            <h2 className="text-[11px] font-mono text-accent uppercase tracking-[0.4em] mb-4 underline decoration-2 underline-offset-4 decoration-accent">Section 03 // Command</h2>
            <h1 className="text-7xl sm:text-8xl font-black tracking-tighter uppercase italic leading-none">Architect Panel</h1>
          </div>
          <div className="bg-subsurface border-2 border-border-dim p-1 flex gap-2">
            <button 
              onClick={() => setView('deployments')}
              className={cn(
                "px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                view === 'deployments' ? "bg-text-main text-surface shadow-xl" : "text-text-muted hover:text-text-main"
              )}
            >
              My Fleet [{deployments.length}]
            </button>
            <button 
              onClick={() => setView('creations')}
              className={cn(
                "px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                view === 'creations' ? "bg-text-main text-surface shadow-xl" : "text-text-muted hover:text-text-main"
              )}
            >
              My Designs [{myAgents.length}]
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-subsurface animate-pulse border-2 border-border-dim" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {view === 'deployments' && (
              deployments.length > 0 ? deployments.map(d => (
                <div key={d.id} className="bg-subsurface border-2 border-border-dim p-10 hover:border-accent transition-all group flex flex-col justify-between h-[340px]">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-surface border border-border-dim flex items-center justify-center group-hover:border-accent transition-colors">
                        <Cpu className="text-accent" size={24} />
                      </div>
                      <div className={cn(
                        "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-2",
                        d.status === 'active' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {d.status}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted block mb-2 uppercase">DEPLOYMENT_ID // {d.id.slice(0,8)}</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">{d.agentName}<span className="text-accent">.</span></h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-1 bg-border-dim relative overflow-hidden">
                      <div className="absolute inset-0 bg-accent w-3/4 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-3 px-4 border-2 border-border-dim text-[10px] font-black uppercase tracking-widest hover:border-accent transition-colors">
                        Monitor
                      </button>
                      <button className="py-3 px-4 bg-text-main text-surface text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors">
                        Terminate
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center border-4 border-dashed border-border-dim bg-subsurface flex flex-col items-center gap-6">
                  <Zap size={48} className="text-text-muted/20" />
                  <p className="text-xl font-black uppercase tracking-widest text-text-muted">Zero Active Instances</p>
                  <Link to="/marketplace" className="text-accent text-[11px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-text-main transition-colors">Initialize Registry Discovery</Link>
                </div>
              )
            )}

            {view === 'creations' && (
              myAgents.length > 0 ? myAgents.map(a => (
                <div key={a.id} className="bg-subsurface border-2 border-border-dim p-10 hover:border-accent transition-all group flex flex-col justify-between h-[340px]">
                   <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-surface border border-border-dim flex items-center justify-center group-hover:border-accent transition-colors">
                        <Database className="text-accent" size={24} />
                      </div>
                      <div className="flex items-center gap-2 text-accent">
                        <span className="text-xl font-black font-mono tracking-tighter">{(a.rating || 5).toFixed(1)}</span>
                        <span className="text-[10px] font-mono text-text-muted uppercase">RTG</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted block mb-2 uppercase">DESIGN_ID // {a.id.slice(0,8)}</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">{a.name}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono leading-none">Gross_Revenue</span>
                        <span className="text-2xl font-black font-mono tracking-tighter">${(a.price * (a.salesCount || 0)).toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono leading-none">Unit_Sales</span>
                        <span className="block text-2xl font-black font-mono tracking-tighter">{a.salesCount || 0}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-3 px-4 border-2 border-border-dim text-[10px] font-black uppercase tracking-widest hover:border-accent transition-colors">
                        Edit_Architecture
                      </button>
                      <button className="py-3 px-4 bg-accent text-surface text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                        Promote_Registry
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center border-4 border-dashed border-border-dim bg-subsurface flex flex-col items-center gap-6">
                  <Cpu size={48} className="text-text-muted/20" />
                  <p className="text-xl font-black uppercase tracking-widest text-text-muted">Unclaimed Intellectual Property</p>
                  <Link to="/build" className="text-accent text-[11px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-text-main transition-colors">Start Architecture Design</Link>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const AgentBuilder = ({ user }: { user: User | null }) => {
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    price: 19,
    category: 'productivity',
    capabilities: ['Natural Language Processing'],
    imageUrl: ''
  });
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!user) return loginWithGoogle();
    setCreating(true);
    try {
      const agentRef = await addDoc(collection(db, "agents"), {
        ...formData,
        creatorId: user.uid,
        creatorName: user.displayName,
        rating: 5.0,
        salesCount: 0,
        createdAt: serverTimestamp()
      });
      navigate(`/agent/${agentRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'agents');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-8 min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto">
        <header className="mb-20 text-center flex flex-col items-center">
          <span className="text-[11px] font-mono text-accent block mb-6 uppercase tracking-[0.4em] underline decoration-accent decoration-2 underline-offset-8">
            Module // Agent_Architect
          </span>
          <h1 className="text-7xl sm:text-[6rem] font-black tracking-tighter uppercase italic leading-[0.8]">Build Architecture.</h1>
        </header>

        <div className="bg-subsurface border-4 border-border-dim p-8 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-border-dim">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: '33.33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted block mb-6">01 // IDENTITY_PARAM</label>
                  <input 
                    type="text" 
                    placeholder="Set unique designation..."
                    className="w-full bg-surface border-2 border-border-dim p-8 focus:border-accent transition-colors text-4xl font-black uppercase tracking-tighter outline-none placeholder:text-text-muted/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    id="agent-name-input"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted block mb-6">02 // CORE_MANIFESTO</label>
                  <textarea 
                    placeholder="Define the directive..."
                    rows={4}
                    className="w-full bg-surface border-2 border-border-dim p-8 focus:border-accent transition-colors outline-none resize-none text-xl font-bold uppercase tracking-tight"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="pt-8 border-t border-border-dim">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-8 bg-text-main text-surface font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-accent transition-colors"
                  >
                    Proceed to Logic <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted block mb-6">03 // INSTRUCTION_SET (PROMPT)</label>
                  <textarea 
                    placeholder="Enter architectural logic..."
                    rows={8}
                    className="w-full bg-surface border-2 border-border-dim p-8 font-mono text-sm focus:border-accent transition-colors outline-none resize-none"
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted block mb-6">04 // CATEGORY_TAG</label>
                    <select 
                      className="w-full bg-surface border-2 border-border-dim p-8 text-sm font-black uppercase tracking-widest outline-none appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    >
                      <option value="productivity">Productivity</option>
                      <option value="trading">Trading</option>
                      <option value="creative">Creative</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted block mb-6">05 // CREDIT_TIER ($)</label>
                    <input 
                      type="number" 
                      className="w-full bg-surface border-2 border-border-dim p-8 text-4xl font-black font-mono outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-border-dim">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-8 border-2 border-border-dim font-black uppercase tracking-widest hover:border-accent transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-1 py-8 bg-text-main text-surface font-black uppercase tracking-widest hover:bg-accent transition-colors"
                  >
                    Review Design
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="bg-surface border-2 border-accent p-12 space-y-8">
                  <h3 className="text-5xl font-black uppercase tracking-tighter">Final Review_</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-2">
                       <span className="text-[9px] font-mono text-text-muted uppercase">Designation</span>
                       <p className="text-2xl font-black uppercase">{formData.name}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[9px] font-mono text-text-muted uppercase">Pricing</span>
                       <p className="text-2xl font-black uppercase">${formData.price}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[9px] font-mono text-text-muted uppercase">Category</span>
                       <p className="text-2xl font-black uppercase">{formData.category}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-border-dim">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-8 border-2 border-border-dim font-black uppercase tracking-widest hover:border-accent transition-colors"
                  >
                    Reconfigure
                  </button>
                  <button 
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex-1 py-8 bg-accent text-surface font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {creating ? "Forging..." : "Finalize & Forge"} <Zap size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      const u = await loginWithGoogle();
      // Ensure user profile exists
      const userRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: u.displayName,
          photoURL: u.photoURL,
          role: 'user',
          earnings: 0,
          createdAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-surface flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg h-1 bg-border-dim overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 bg-accent w-1/3"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <span className="mt-8 text-[11px] font-mono text-accent uppercase tracking-[1em] animate-pulse">Initializing_Protocol</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-surface text-text-main selection:bg-accent selection:text-surface">
        <Navbar user={user} onLogin={handleLogin} />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/agent/:id" element={<AgentDetails />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/build" element={<AgentBuilder user={user} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
