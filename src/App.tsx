import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Shield, 
  Lock, 
  Activity, 
  Database, 
  User, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Wifi,
  History,
  Terminal,
  Server as ServerIcon,
  Globe as GlobeIcon,
  Zap,
  Network,
  ChevronRight,
  Fingerprint,
  Cpu,
  MapPin,
  Radar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import ReactGlobeGL from 'react-globe.gl';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Alert {
  id: number;
  ip: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detail: string;
  timestamp: string;
  blocked: boolean;
  source: 'local' | 'peer';
  ai_confidence?: number;
  lat?: number;
  lng?: number;
}

interface Transaction {
  tx_hash: string;
  ip: string;
  attack_type: string;
  severity: string;
  block: number;
  gas_used: number;
  timestamp: string;
}

interface Stats {
  total_requests: number;
  total_alerts: number;
  blocked_count: number;
  chain_records: number;
  block_num: number;
  recent_alerts: Alert[];
  blocked_ips: string[];
  known_peers: string[];
  cpu_load: number;
}

interface Dossier {
  ip: string;
  codename: string;
  timestamp: string;
  geo: {
    city: string;
    country: string;
    isp: string;
    org: string;
    asn: string;
    isProxy: boolean;
  };
  behavior: {
    classification: string;
    entropyScore: number;
    timingVariance: number;
    abuseScore: number;
  };
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [stats, setStats] = useState<Stats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeDossier, setActiveDossier] = useState<Dossier | null>(null);
  const [deviceCount, setDeviceCount] = useState(1);
  const [loginMsg, setLoginMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [myIp, setMyIp] = useState<string>('');
  const [myGeo, setMyGeo] = useState<{lat: number, lon: number} | null>(null);
  const [serverIp, setServerIp] = useState<string>(window.location.host);
  const [deviceNetworkId, setDeviceNetworkId] = useState<string>('');
  const [arcsData, setArcsData] = useState<{startLat: number, startLng: number, endLat: number, endLng: number, color: string[]}[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const globeReff = useRef<any>(null);

  // Fake neural packet stream state
  const [streamLines, setStreamLines] = useState<{ id: number, text: string, isMalicious: boolean }[]>([]);
  const lineCountRef = useRef(0);

  useEffect(() => {
     const t = setInterval(() => {
        // Organic background traffic calculations
        const types = ["PING", "TCP", "UDP", "TLS_HANDSHAKE", "HTTP_GET"];
        const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
        const randStr = () => types[Math.floor(Math.random() * types.length)];
        const newLine = {
          id: lineCountRef.current++,
          text: `[${new Date().toISOString().split('T')[1].slice(0,-1)}] INGRESS: ${hex} | PROTOCOL: ${randStr()} | SIG: VALID`,
          isMalicious: false
        };
        setStreamLines(p => [newLine, ...p].slice(0, 8)); // Keep 8 lines max
     }, 800);
     return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (globeReff.current) {
      globeReff.current.controls().autoRotate = true;
      globeReff.current.controls().autoRotateSpeed = 0.5;
    }
  }, [globeReff.current]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (arcsData.length > 0) {
      const t = setTimeout(() => {
        setArcsData(prev => prev.slice(1));
      }, 5000); // Let the arc fade gracefully over 5s
      return () => clearTimeout(t);
    }
  }, [arcsData]);

  const myGeoRef = useRef<{lat: number, lon: number} | null>(null);
  useEffect(() => { myGeoRef.current = myGeo; }, [myGeo]);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to NetShield X');
    });

    socket.on('stats_update', (data: Stats) => {
      setStats(data);
      setAlerts(data.recent_alerts);
    });

    socket.on('new_alert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 50));
      // Spawn 3D globe arc
      if (alert.lat && alert.lng) {
        setArcsData(p => [...p, {
          startLat: alert.lat as number,
          startLng: alert.lng as number,
          endLat: myGeoRef.current?.lat || 37.7749, // Target is real server or SF
          endLng: myGeoRef.current?.lon || -122.4194,
          color: ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 1)'] // Fade into red
        }]);
      }
      
      // Inject threat into packet stream
      const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
      const newLine = {
         id: lineCountRef.current++,
         text: `[!! THREAT DETECTED !!] IP: ${alert.ip} | TYPE: ${alert.type} | SIG_HEX: ${hex} | CONF: ${alert.ai_confidence}%`,
         isMalicious: true
      };
      setStreamLines(p => [newLine, ...p].slice(0, 8));
    });

    socket.on('blockchain_tx', (tx: Transaction) => {
      setTransactions(prev => [tx, ...prev].slice(0, 30));
    });

    socket.on('initial_txs', (data: { transactions: Transaction[] }) => {
      setTransactions(data.transactions);
    });

    socket.on('device_count', (data: { count: number }) => {
      setDeviceCount(data.count);
    });

    socket.on('new_dossier', (dossier: Dossier) => {
      // Background stream logic will not steal focus automatically unless clicking IP or during specific scenarios
      // Still load into UI state so click is instant if they haven't explicitly requested one
      if (!activeDossier || activeDossier.ip === dossier.ip) {
        // Just cache it, don't interrupt user necessarily, but we'll show it if they triggered it
      }
    });

    socket.on('system_reset', () => {
      setAlerts([]);
      setTransactions([]);
      setIsBlocked(false);
      setLoginMsg(null);
      setActiveDossier(null);
    });

    // Check my block status via true backend network IP
    const checkIp = async () => {
      try {
        const [ipRes, srvIpRes] = await Promise.all([
          fetch(`/api/myip`),
          fetch(`/api/server-ip`).catch(() => null)
        ]);
        
        const data = await ipRes.json();
        setMyIp(data.ip);
        if (data.geo && data.geo.lat) {
          setMyGeo({ lat: data.geo.lat, lon: data.geo.lon });
        }
        setDeviceNetworkId(`net-${btoa(data.ip).slice(0,8)}`); // Simple visual hash of the IP for the UI

        if (srvIpRes && srvIpRes.ok) {
           const srvData = await srvIpRes.json();
           if (srvData.ip && srvData.ip !== "127.0.0.1") {
             setServerIp(srvData.ip);
           }
        }
      } catch (err) {
        console.error('Failed to get IP', err);
      }
    };
    checkIp();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (stats?.blocked_ips.includes(myIp)) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [stats, myIp]);

  const handleLogin = async (e: React.FormEvent, attackType?: string) => {
    e.preventDefault();
    setLoginMsg(null);
    if (!attackType) setIsAuthenticating(true);

    // Fake cinematic delay for real login attempt
    if (!attackType) await new Promise(r => setTimeout(r, 1200));

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          attack_type: attackType
        })
      });
      const data = await res.json();
      
      setIsAuthenticating(false);
      
      if (res.ok) {
        if (data.success) {
          setLoginMsg({ type: 'success', text: 'Login successful!' });
        } else if (data.message) {
          setLoginMsg({ type: 'info', text: data.message });
        }
      } else {
        if (data.blocked) setIsBlocked(true);
        setLoginMsg({ type: 'error', text: data.error });
      }
    } catch (err) {
      setIsAuthenticating(false);
      setLoginMsg({ type: 'error', text: 'Network connection failed.' });
    }
  };

  const handleReset = async () => {
    await fetch('/api/reset', { method: 'POST' });
  };

  const fetchDossier = async (ip: string) => {
    try {
      const res = await fetch(`/api/dossier/${ip}`);
      if (res.ok) {
        const data = await res.json();
        setActiveDossier(data);
        setTimeout(() => setActiveDossier(null), 12000);
      }
    } catch (err) {
      console.error('Failed to fetch dossier for IP:', ip);
    }
  };

  const dashboardElements = (
    <div className="flex flex-col gap-6 relative z-10">
      {/* Header Stat Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Requests', val: stats?.total_requests || 0, sub: 'All nodes', color: 'text-slate-200' },
          { label: 'Threats', val: stats?.total_alerts || 0, sub: 'IDS Engine', color: 'text-red-400' },
          { label: 'IPs Blocked', val: stats?.blocked_count || 0, sub: 'Registry', color: 'text-red-500' },
          { label: 'Chain Records', val: stats?.chain_records || 0, sub: 'Immutable', color: 'text-emerald-400' },
          { label: 'Block No.', val: stats?.block_num || 1, sub: 'Latest Hash', color: 'text-white', isMono: true },
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={s.label} 
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 lg:p-5 backdrop-blur-md relative overflow-hidden"
          >
            <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               {s.label === 'Threats' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block" />}
               {s.label}
            </p>
            <p className={cn("text-2xl lg:text-3xl font-bold tracking-tight mt-1 drop-shadow-[0_0_8px_currentColor]", s.color, s.isMono && "font-mono lg:text-2xl")}>{s.val.toLocaleString()}{s.suffix}</p>
            <p className="text-[9px] lg:text-[10px] text-slate-500 mt-2">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Network Map / Visualization Simulation */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-6 min-h-[300px] flex flex-col relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <GlobeIcon className="w-3 h-3" /> Live Network Map
            </h3>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> SYNCED ({stats?.peers?.length || 0})
            </span>
          </div>
          <div className="flex-1 relative bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center z-10 p-0">
             <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, #020617 80%)', zIndex: 1 }} />
             
             {/* Neural Packet Terminal Overlay */}
             <div 
               className="absolute bottom-4 left-4 z-20 w-[90%] md:w-80 h-32 overflow-hidden flex flex-col justify-end bg-slate-950/80 border border-slate-800/80 rounded-lg backdrop-blur-md p-3 font-mono text-[8.5px] leading-relaxed shadow-[0_0_20px_rgba(0,0,0,0.8)]"
               style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%)' }}
             >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <AnimatePresence>
                  {streamLines.slice().reverse().map(line => (
                     <motion.div
                       key={line.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className={cn("whitespace-nowrap transition-colors flex gap-2 items-center", line.isMalicious ? "text-red-400 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" : "text-emerald-500/60")}
                     >
                       {line.isMalicious ? <span className="text-red-500 font-black animate-pulse">{'>'}</span> : <span className="opacity-50">{'>'}</span>}
                       <span className="truncate">{line.text}</span>
                     </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             <div className="h-full w-full flex items-center justify-center -mt-8">
               <div className="scale-125 md:scale-150 relative" style={{ height: '300px', width: '300px' }}>
                 <ReactGlobeGL
                   ref={globeReff}
                   globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                   backgroundColor="rgba(0,0,0,0)"
                   atmosphereColor="rgba(16,185,129,0.4)"
                   atmosphereAltitude={0.2}
                   arcsData={arcsData}
                   arcColor="color"
                   arcDashLength={0.4}
                   arcDashGap={0.2}
                   arcDashInitialGap={() => Math.random()}
                   arcDashAnimateTime={2000}
                   arcStroke={0.8}
                   width={300}
                   height={300}
                 />
               </div>
             </div>
             
             {/* HUD Overlays */}
             <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-slate-900/80 border border-slate-800 p-2 rounded flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Network Edge</span>
                  <span className="text-[10px] font-mono text-emerald-400">TENSORFLOW CLASSIFIER [ACTIVE]</span>
                </div>
             </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400 uppercase tracking-widest">PEER_SYNC: ON</div>
                <div className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400 uppercase tracking-widest">MESH_LINKS: {stats?.known_peers?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Alerts Log */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col h-[400px] backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Active Threat Ledger
            </h3>
            <button onClick={handleReset} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
             <button onClick={(e) => handleLogin(e, 'ddos')} className="px-3 py-1.5 bg-slate-800/40 text-slate-400 text-[10px] font-mono tracking-widest rounded border border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300 transition-colors uppercase">DDOS SIM</button>
             <button onClick={(e) => handleLogin(e, 'portscan')} className="px-3 py-1.5 bg-slate-800/40 text-slate-400 text-[10px] font-mono tracking-widest rounded border border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300 transition-colors uppercase">SCAN SIM</button>
             <button onClick={(e) => handleLogin(e, 'brute')} className="px-3 py-1.5 bg-slate-800/40 text-slate-400 text-[10px] font-mono tracking-widest rounded border border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300 transition-colors uppercase">BRUTE SIM</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 font-mono">
                <Activity className="w-8 h-8 opacity-20" />
                <p className="text-xs font-medium">Monitoring engine idling...</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {alerts.map((a) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "p-3 rounded-lg border flex items-center gap-3 transition-colors",
                      a.severity === 'HIGH' ? "bg-red-950/20 border-red-900/30" : "bg-slate-800/40 border-slate-700/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center shrink-0 border",
                      a.severity === 'HIGH' ? "bg-red-500/20 text-red-500 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    )}>
                      {a.severity === 'HIGH' ? <Lock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <button 
                            onClick={() => fetchDossier(a.ip)}
                            className={cn("text-[11px] font-mono truncate hover:underline hover:text-white transition-colors cursor-pointer text-left focus:outline-none", a.severity === 'HIGH' ? "text-red-400" : "text-slate-300")}
                            title="Click to pull Threat Dossier"
                          >
                            {a.ip}
                          </button>
                          {a.ai_confidence && (
                             <span className="text-[8px] bg-indigo-900 border border-indigo-500/50 text-indigo-300 px-1 py-0.5 rounded shadow-[0_0_5px_rgba(99,102,241,0.5)] uppercase tracking-widest whitespace-nowrap">
                               AI: {a.ai_confidence}%
                             </span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{a.detail}</p>
                    </div>
                    {a.blocked ? (
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-mono rounded">BLOCKED</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-slate-700 text-slate-400 text-[9px] font-mono rounded">MONITORING</span>
                    )}
                    {a.source === 'peer' && (
                      <span className="px-1.5 py-0.5 bg-blue-950 text-blue-400 overflow-hidden text-[9px] font-mono rounded border border-blue-900">PEER</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Blockchain Registry */}
      <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-white text-base font-bold flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" /> Decentralized Threat Ledger
            </h3>
            <p className="text-slate-500 text-xs mt-1 font-mono">Immutable proof of attack stored across the cluster</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CHAIN STATUS</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center justify-end gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> OPERATIONAL
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">BLOCK TIME</span>
              <span className="text-xs text-white font-mono mt-1">1.2s avg</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {(!transactions || transactions.length === 0) ? (
            <div className="py-12 border border-dashed border-slate-700 bg-slate-800/20 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-3">
               <Database className="w-8 h-8 opacity-50" />
               <p className="text-xs font-mono">Waiting for block confirmation...</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {transactions.map((tx) => (
                <div key={tx.tx_hash} className="group bg-slate-800/40 hover:bg-slate-800/80 p-4 rounded-lg border border-slate-700/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                         <span className="text-[11px] font-mono text-emerald-400">#{tx.block}</span>
                         <span className="text-slate-300 text-xs font-mono truncate max-w-[120px] md:max-w-none">{tx.tx_hash}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-1.5">
                        <Terminal className="w-3 h-3" /> {tx.attack_type} flagged at {tx.ip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-slate-800 pt-3 md:pt-0">
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">GAS USED</span>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5">{tx.gas_used.toLocaleString()}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-700 hidden md:block" />
                    <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/30 tracking-wider">CONFIRMED</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const loginView = (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative z-10 w-full">
      
      {/* Decorative background vectors for login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[0.5px] border-emerald-900/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-900/20 rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-slate-950/80 backdrop-blur-2xl p-1 relative overflow-hidden rounded-2xl shadow-[0_0_80px_rgba(2,6,23,0.8)] border border-slate-800"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Top Glitch Bar */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

        <div className="bg-slate-900/90 rounded-xl p-8 md:p-10 relative z-10 w-full h-full border border-slate-800/50">
          
          <div className="flex justify-between items-start mb-10">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative border border-emerald-500/30">
              <Shield className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)] animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-mono text-emerald-500 uppercase tracking-widest mb-1">Node Synchronization</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-bold bg-slate-800 px-2 py-1 rounded border border-slate-700">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                 ACTIVE
              </span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">Secure Terminal Access</h2>
            <p className="text-slate-400 text-xs mt-2 font-mono flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-emerald-500" /> INITIALIZING HANDSHAKE PROTOCOL
            </p>
          </div>

          {isBlocked ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-red-950/20 border border-red-900/50 rounded-xl p-8 text-center flex flex-col items-center gap-4 relative z-10 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 bg-red-500/5 scanlines pointer-events-none" />
              <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center border-2 border-red-500/50 relative shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <Lock className="w-5 h-5 relative z-10" />
              </div>
              <div>
                <p className="text-red-400 font-bold uppercase text-sm tracking-widest mb-2 font-sans drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Access Permanently Restricted</p>
                <p className="text-slate-300 text-[11px] leading-relaxed font-mono mt-3">
                  Your identity hash <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30 mx-1">{myIp}</span> has been globally flagged by the AI Threat Matrix.
                </p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent my-2" />
              <p className="text-slate-500 text-[10px] font-mono italic">Trace reported to {deviceCount} peered security nodes.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleLogin} className="w-full space-y-5 relative z-10">
              <AnimatePresence>
                {loginMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.9 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "p-3 rounded-lg text-[10px] font-mono border overflow-hidden",
                      loginMsg.type === 'error' ? "bg-red-950/40 text-red-300 border-red-900/40" : 
                      loginMsg.type === 'success' ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/40" :
                      "bg-blue-950/40 text-blue-300 border-blue-900/40"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Terminal className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{loginMsg.text}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors z-10" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter operator hash" 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] font-mono"
                  />
                  <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-slate-700 pointer-events-none transition-colors" />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors z-10" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter decryption key" 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] tracking-widest font-mono"
                  />
                  <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-slate-700 pointer-events-none transition-colors" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isAuthenticating}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-lg text-[11px] tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 overflow-hidden relative group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                   <span className="flex items-center gap-2">
                     <Fingerprint className="w-4 h-4 animate-pulse opacity-80" /> DECRYPTING...
                   </span>
                ) : "ESTABLISH CONNECTION"}
                
                {/* Button shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              </button>

              <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-slate-800/80">
                 <div className="flex items-center gap-2 w-full">
                    <div className="h-px bg-slate-800 flex-1" />
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">Developer Payload Suite</p>
                    <div className="h-px bg-slate-800 flex-1" />
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                    <button type="button" onClick={(e) => handleLogin(e, 'ddos')} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-all hover:border-emerald-500/30 group">
                      <History className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-400" />
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-emerald-400">INJECT DDOS</span>
                    </button>
                    <button type="button" onClick={(e) => handleLogin(e, 'portscan')} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-all hover:border-amber-500/30 group">
                      <Activity className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400" />
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-amber-400">EXEC SCAN</span>
                    </button>
                    <button type="button" onClick={(e) => handleLogin(e, 'brute')} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-all hover:border-red-500/30 group">
                      <Zap className="w-4 h-4 text-red-500/70 group-hover:text-red-400" />
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-red-400">BRUTE FORCE</span>
                    </button>
                 </div>
              </div>
              
              <p className="text-[9px] text-slate-600 text-center font-mono pt-4 flex items-center justify-center gap-2 border-t border-slate-800/80 mt-6 md:mt-8">
                <Network className="w-3 h-3" /> ASSIGNED RELAY ID: {deviceNetworkId}
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (currentPath === '/login') {
    return (
      <div className="min-h-screen bg-slate-950 bg-grid-slate-900 text-slate-200 font-sans p-4 md:p-6 overflow-x-hidden relative selection:bg-emerald-900 selection:text-emerald-50 flex items-center justify-center">
        <div className="scanlines" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />
        <main className="max-w-7xl mx-auto w-full relative z-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div key="login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              {loginView}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-slate-900 text-slate-200 font-sans p-4 md:p-6 overflow-x-hidden relative selection:bg-emerald-900 selection:text-emerald-50 flex flex-col">
      <div className="scanlines" />
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Rail / Top Bar */}
      <header className="max-w-7xl w-full mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6 border-b border-slate-800 pb-4 relative z-10 px-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400">
             <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white mb-0.5">NETSHIELD CHAIN v4.2</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">GLOBAL IP DISTRIBUTED LEDGER</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-lg backdrop-blur-md">
           <a 
            href={window.location.origin + "/login"} target="_blank" rel="noreferrer"
            className="px-4 py-2 text-[10px] font-mono tracking-widest rounded transition-all flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20"
           >
              <ExternalLink className="w-3.5 h-3.5" /> TARGET: {serverIp}
           </a>
        </div>

        <div className="hidden lg:flex gap-8">
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Mesh Peers</span>
            <span className="text-emerald-400 font-mono text-sm">{stats?.known_peers?.length || 0} LINKED</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">UI Clients</span>
            <span className="text-slate-300 font-mono text-sm">{deviceCount} ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key="dash" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {dashboardElements}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto w-full py-6 flex flex-col items-start gap-4 border-t border-slate-800 mt-12 relative z-10 text-[10px] font-mono text-slate-500">
        <div className="flex flex-wrap w-full items-center justify-between gap-4">
          <div className="flex gap-4 sm:gap-6">
            <span>CONSENSUS: {stats?.known_peers?.length ? '100% DISTRIBUTED' : 'LOCAL ONLY'}</span>
            <span>LATENCY: 14ms</span>
            <span className={stats?.known_peers?.length ? "text-emerald-400 font-bold" : ""}>
              PEERS FOUND: {stats?.known_peers?.length || 0}
            </span>
          </div>
          <div>
            SECURITY PROTOCOL: SHA-256 / MESH FIREWALL
          </div>
        </div>
        {stats?.known_peers && stats.known_peers.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50 w-full">
             <span className="py-0.5 text-slate-600 font-bold uppercase tracking-widest">ACTIVE ROUTING TABLE:</span>
             {stats.known_peers.map(ip => (
                <span key={ip} className="px-1.5 py-0.5 bg-slate-900 border border-slate-700/50 rounded text-emerald-500/80">{ip}</span>
             ))}
          </div>
        )}
      </footer>

      {/* Global Toast for Peer-Sync events */}
      <AnimatePresence>
        {alerts[0]?.source === 'peer' && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 border border-emerald-500/50 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-0.5">PEER NETWORK SYNC</p>
              <p className="text-[11px] font-medium text-slate-300">New block recorded: Attack detected on peer node <span className="font-mono text-emerald-300 px-1">{alerts[0].ip}</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Phantom Trace Dossier */}
      <AnimatePresence>
        {activeDossier && (
          <motion.div 
            className="fixed top-20 right-6 z-[200] w-80 bg-slate-950/95 border border-red-900/50 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur-xl"
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Cinematic Scanline Overlay */}
            <div className="absolute inset-0 bg-red-500/5 scanlines pointer-events-none" />
            <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <div className="p-4 border-b border-red-900/30 bg-red-950/20 flex gap-3 items-start relative">
               <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 rounded flex items-center justify-center shrink-0">
                 <Radar className="w-5 h-5 text-red-500 animate-pulse" />
               </div>
               <div>
                  <div className="text-[9px] font-mono text-red-400 uppercase tracking-[0.2em] mb-1">Target Profile Generated</div>
                  <div className="text-sm font-bold text-white tracking-widest">{activeDossier.codename}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{activeDossier.ip}</div>
               </div>
               <button onClick={() => setActiveDossier(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">&times;</button>
            </div>

            <div className="p-4 space-y-4">
               {/* Location Intel */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-amber-500" /> Origin Intel
                 </div>
                 <div className="bg-slate-900/50 rounded border border-slate-800 p-2 text-xs font-mono grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-slate-500">LOC</span>
                       <span className="text-slate-300 truncate" title={`${activeDossier.geo.city}, ${activeDossier.geo.country}`}>{activeDossier.geo.city}, {activeDossier.geo.country}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] text-slate-500">ISP</span>
                       <span className="text-amber-400/80 truncate" title={activeDossier.geo.isp}>{activeDossier.geo.isp}</span>
                    </div>
                 </div>
               </div>

               {/* Behavioral Intel */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Cpu className="w-3 h-3 text-indigo-500" /> Behavioral Trace
                 </div>
                 <div className="bg-slate-900/50 rounded border border-slate-800 p-2 text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] text-slate-500">CLASS</span>
                       <span className="text-indigo-400">{activeDossier.behavior.classification}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] text-slate-500">TIMING VARIANCE</span>
                       <span className="text-slate-300">{activeDossier.behavior.timingVariance}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] text-slate-500">PAYLOAD ENTROPY</span>
                       <div className="flex items-center gap-2">
                         <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: `${activeDossier.behavior.entropyScore}%` }} />
                         </div>
                         <span className="text-slate-300">{activeDossier.behavior.entropyScore}%</span>
                       </div>
                    </div>
                 </div>
               </div>

               {/* AbuseIPDB Global Trust */}
               <div className="bg-red-950/20 border border-red-900/30 rounded p-3 text-center relative overflow-hidden flex flex-col justify-center items-center gap-2">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent pointer-events-none" />
                 <span className="text-[9px] font-bold text-red-500/80 uppercase tracking-widest block">Global Threat Confidence</span>
                 <div className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                    {activeDossier.behavior.abuseScore}%
                 </div>
                 <a 
                   href={`https://www.abuseipdb.com/check/${activeDossier.ip}`} 
                   target="_blank" 
                   rel="noreferrer" 
                   className="text-[10px] text-red-400 font-mono flex items-center gap-1 hover:text-red-300 hover:underline"
                 >
                   Verify on AbuseIPDB <ExternalLink className="w-3 h-3" />
                 </a>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .radar-sweep {
          background: conic-gradient(from 0deg, transparent 70%, rgba(16, 185, 129, 0.2) 95%, rgba(16, 185, 129, 0.4) 100%);
          animation: radar-spin 4s linear infinite;
          border-radius: 50%;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
