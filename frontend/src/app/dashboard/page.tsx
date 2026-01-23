"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    CreditCard,
    LogOut,
    MessageSquare,
    Plus,
    Settings,
    Smartphone,
    Play,
    Square,
    Trash2,
    XCircle,
    Clock,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Account {
    apiId: string;
    apiHash: string;
    phone: string;
    status: 'stopped' | 'running';
}

interface Group {
    link: string;
    expiry: string;
}

// --- API Helper ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function DashboardPage() {
    const router = useRouter();
    const [profileName, setProfileName] = useState("");
    const [activeTab, setActiveTab] = useState("accounts");
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Modal State
    const [showAddAccount, setShowAddAccount] = useState(false);

    // Forms
    const [newAccount, setNewAccount] = useState({ apiId: "", apiHash: "", phone: "", otp: "", password: "", step: "init" }); // step: init, otp, 2fa
    const [newGroup, setNewGroup] = useState({ link: "", expiry: "" });

    useEffect(() => {
        const name = localStorage.getItem("profileName");
        if (!name) {
            router.push("/login");
            return;
        }
        setProfileName(name);

        // Load Data
        const savedAccounts = localStorage.getItem("telegramAccounts");
        if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    }, [router]);

    // Persist Accounts
    useEffect(() => {
        if (accounts.length > 0) {
            localStorage.setItem("telegramAccounts", JSON.stringify(accounts));
        }
    }, [accounts]);

    const handleLogout = () => {
        localStorage.removeItem("profileName");
        router.push("/");
    };

    // --- Account Actions ---
    const sendOtp = async () => {
        try {
            const res = await fetch(`${API_URL}/api/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiId: newAccount.apiId, apiHash: newAccount.apiHash, phone: newAccount.phone })
            });
            const data = await res.json();
            if (data.success) {
                setNewAccount({ ...newAccount, step: "otp" });
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert("Failed to connect to backend");
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await fetch(`${API_URL}/api/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apiId: newAccount.apiId,
                    apiHash: newAccount.apiHash,
                    phone: newAccount.phone,
                    otp: newAccount.otp
                })
            });
            const data = await res.json();
            if (data.success) {
                if (data.requires2FA) {
                    setNewAccount({ ...newAccount, step: "2fa" });
                } else {
                    addAccountLocal();
                }
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert("Error verifying OTP");
        }
    };

    const verify2FA = async () => {
        try {
            const res = await fetch(`${API_URL}/api/verify-2fa`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apiId: newAccount.apiId,
                    apiHash: newAccount.apiHash,
                    phone: newAccount.phone,
                    password: newAccount.password
                })
            });
            const data = await res.json();
            if (data.success) {
                addAccountLocal();
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert("Error verifying 2FA");
        }
    };

    const addAccountLocal = () => {
        const acc: Account = {
            apiId: newAccount.apiId,
            apiHash: newAccount.apiHash,
            phone: newAccount.phone,
            status: 'stopped'
        };
        setAccounts([...accounts, acc]);
        setShowAddAccount(false);
        setNewAccount({ apiId: "", apiHash: "", phone: "", otp: "", password: "", step: "init" });
    };

    const toggleAccount = async (index: number) => {
        const acc = accounts[index];
        const items = [...accounts];

        const endpoint = acc.status === 'stopped' ? '/api/start-account' : '/api/stop-account';

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiId: acc.apiId, apiHash: acc.apiHash, phone: acc.phone })
            });
            const data = await res.json();

            if (data.success) {
                items[index].status = acc.status === 'stopped' ? 'running' : 'stopped';
                setAccounts(items);
            } else {
                alert("Action failed: " + data.message);
            }
        } catch (e) {
            alert("Network error");
        }
    };

    // --- Group Actions ---
    const addGroup = () => {
        if (!newGroup.link || !newGroup.expiry) return;
        setGroups([...groups, newGroup]);
        setNewGroup({ link: "", expiry: "" });
    };


    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        AutoGram
                    </h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    <NavItem active={activeTab === 'accounts'} onClick={() => { setActiveTab('accounts'); setSidebarOpen(false); }} icon={<Smartphone size={20} />} label="Accounts" />
                    <NavItem active={activeTab === 'groups'} onClick={() => { setActiveTab('groups'); setSidebarOpen(false); }} icon={<MessageSquare size={20} />} label="Ad Groups" />
                    <NavItem active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setSidebarOpen(false); }} icon={<CreditCard size={20} />} label="Billing" />
                    <NavItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }} icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {profileName.charAt(0)}
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <div className="text-sm font-medium truncate">{profileName}</div>
                            <div className="text-xs text-slate-500">Pro Plan</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-full px-2">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-950 p-4 md:p-8">
                <header className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-white p-2 hover:bg-slate-800 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold capitalize">{activeTab}</h2>
                    </div>
                    {activeTab === 'accounts' && (
                        <button onClick={() => setShowAddAccount(true)} className="btn btn-primary text-sm">
                            <Plus size={18} /> <span className="hidden sm:inline">Add Account</span>
                        </button>
                    )}
                </header>

                {activeTab === 'accounts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {accounts.map((acc, idx) => (
                            <div key={idx} className="glass p-4 md:p-6 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[180px]">
                                <div>
                                    <div className="flex justify-between items-start mb-3 md:mb-4">
                                        <div className="text-base md:text-lg font-bold truncate pr-2">{acc.phone}</div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${acc.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {acc.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="text-xs md:text-sm text-slate-500 truncate">API ID: {acc.apiId}</div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => toggleAccount(idx)}
                                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors text-sm ${acc.status === 'stopped' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                                    >
                                        {acc.status === 'stopped' ? <><Play size={16} /> Start</> : <><Square size={16} /> Stop</>}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newAccs = [...accounts];
                                            newAccs.splice(idx, 1);
                                            setAccounts(newAccs);
                                        }}
                                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {accounts.length === 0 && (
                            <div className="col-span-full text-center py-16 md:py-20 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                                <Smartphone className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-sm md:text-base">No accounts connected. Add one to get started.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'groups' && (
                    <div className="max-w-4xl">
                        <div className="glass p-4 md:p-6 rounded-xl border border-slate-800 mb-6 md:mb-8">
                            <h3 className="text-base md:text-lg font-bold mb-4">Add New Forwarding Rule</h3>
                            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                                <input
                                    type="text"
                                    placeholder="Target Group Link"
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-indigo-500 md:col-span-2"
                                    value={newGroup.link}
                                    onChange={(e) => setNewGroup({ ...newGroup, link: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-indigo-500"
                                    value={newGroup.expiry}
                                    onChange={(e) => setNewGroup({ ...newGroup, expiry: e.target.value })}
                                />
                            </div>
                            <button onClick={addGroup} className="mt-4 btn btn-primary w-full md:w-auto">
                                Save Rule
                            </button>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            {groups.map((group, idx) => (
                                <div key={idx} className="glass p-3 md:p-4 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 flex-shrink-0">
                                            <MessageSquare size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm md:text-base truncate">{group.link}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <Clock size={12} /> Expires: {group.expiry}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                                        <button onClick={() => {
                                            const newGs = [...groups];
                                            newGs.splice(idx, 1);
                                            setGroups(newGs);
                                        }} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="max-w-4xl">
                        <div className="glass p-6 md:p-8 rounded-xl border border-slate-800 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-2">Pro Plan</h3>
                                    <p className="text-slate-400">Unlimited accounts & ad groups</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-indigo-400">$29</div>
                                    <div className="text-sm text-slate-500">per month</div>
                                </div>
                            </div>
                            <div className="border-t border-slate-700 pt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-slate-300">Next billing date</span>
                                    <span className="font-medium">Feb 23, 2026</span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-slate-300">Payment method</span>
                                    <span className="font-medium">•••• 4242</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-300">Status</span>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 md:p-8 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-4">Billing History</h3>
                            <div className="space-y-3">
                                {[
                                    { date: 'Jan 23, 2026', amount: '$29.00', status: 'Paid' },
                                    { date: 'Dec 23, 2025', amount: '$29.00', status: 'Paid' },
                                    { date: 'Nov 23, 2025', amount: '$29.00', status: 'Paid' },
                                ].map((invoice, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <div>
                                            <div className="font-medium">{invoice.date}</div>
                                            <div className="text-sm text-slate-500">Invoice #{1000 + idx}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-indigo-400">{invoice.amount}</div>
                                            <div className="text-sm text-green-400">{invoice.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 btn btn-primary w-full justify-center">
                                <CreditCard size={18} /> Update Payment Method
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-4xl space-y-6">
                        <div className="glass p-6 md:p-8 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-4">Profile Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <button className="btn btn-primary">Save Changes</button>
                            </div>
                        </div>

                        <div className="glass p-6 md:p-8 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-4">Automation Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <div className="font-medium">Auto-forward messages</div>
                                        <div className="text-sm text-slate-500">Automatically forward from source groups</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <div className="font-medium">Smart delay</div>
                                        <div className="text-sm text-slate-500">Add random delay between forwards (1-5s)</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <div className="font-medium">Email notifications</div>
                                        <div className="text-sm text-slate-500">Get notified about important events</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 md:p-8 rounded-xl border border-red-900/50">
                            <h3 className="text-lg font-bold mb-2 text-red-400">Danger Zone</h3>
                            <p className="text-sm text-slate-400 mb-4">Irreversible actions that affect your account</p>
                            <div className="space-y-3">
                                <button className="w-full md:w-auto px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors border border-red-600/30">
                                    Clear All Data
                                </button>
                                <button className="w-full md:w-auto px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors border border-red-600/30 ml-0 md:ml-3">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Account Modal */}
            <AnimatePresence>
                {showAddAccount && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg md:text-xl font-bold">Connect Telegram</h3>
                                <button onClick={() => setShowAddAccount(false)} className="text-slate-400 hover:text-white"><XCircle size={24} /></button>
                            </div>

                            {newAccount.step === 'init' && (
                                <div className="space-y-4">
                                    <input
                                        type="text" placeholder="API ID"
                                        className="input-field"
                                        value={newAccount.apiId}
                                        onChange={e => setNewAccount({ ...newAccount, apiId: e.target.value })}
                                    />
                                    <input
                                        type="text" placeholder="API Hash"
                                        className="input-field"
                                        value={newAccount.apiHash}
                                        onChange={e => setNewAccount({ ...newAccount, apiHash: e.target.value })}
                                    />
                                    <input
                                        type="text" placeholder="Phone Number"
                                        className="input-field"
                                        value={newAccount.phone}
                                        onChange={e => setNewAccount({ ...newAccount, phone: e.target.value })}
                                    />
                                    <button onClick={sendOtp} className="btn btn-primary w-full justify-center">Send OTP</button>
                                    <p className="text-xs text-slate-500 text-center mt-4">
                                        Your credentials are used locally to connect directly to Telegram servers via our secure proxy.
                                    </p>
                                </div>
                            )}

                            {newAccount.step === 'otp' && (
                                <div className="space-y-4">
                                    <div className="text-slate-400 text-sm mb-4">Enter the code sent to {newAccount.phone}</div>
                                    <input
                                        type="text" placeholder="12345"
                                        className="input-field text-center text-2xl tracking-widest"
                                        value={newAccount.otp}
                                        onChange={e => setNewAccount({ ...newAccount, otp: e.target.value })}
                                    />
                                    <button onClick={verifyOtp} className="btn btn-primary w-full justify-center">Verify OTP</button>
                                </div>
                            )}

                            {newAccount.step === '2fa' && (
                                <div className="space-y-4">
                                    <div className="text-slate-400 text-sm mb-4">This account is protected by 2FA Password.</div>
                                    <input
                                        type="password" placeholder="Password"
                                        className="input-field"
                                        value={newAccount.password}
                                        onChange={e => setNewAccount({ ...newAccount, password: e.target.value })}
                                    />
                                    <button onClick={verify2FA} className="btn btn-primary w-full justify-center">Unlock & Connect</button>
                                </div>
                            )}


                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style jsx>{`
        .input-field {
            width: 100%;
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(71, 85, 105, 0.5);
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            color: white;
            outline: none;
            transition: all 0.2s;
            font-size: 0.95rem;
        }
        .input-field:focus {
            border-color: #6366f1;
            background: rgba(30, 41, 59, 1);
        }
        @media (max-width: 640px) {
          .input-field {
            font-size: 0.875rem;
            padding: 0.625rem 0.875rem;
          }
        }
      `}</style>
        </div>
    );
}

function NavItem({ active, icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
