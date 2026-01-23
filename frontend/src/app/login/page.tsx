"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [name, setName] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        localStorage.setItem("profileName", name);
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-900 -z-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] -z-10 rounded-full" />

            <div className="w-full max-w-md p-8 glass rounded-2xl border border-gray-700 mx-4">
                <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
                <p className="text-gray-400 text-center mb-8">Enter your name to access your dashboard</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-500"
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn btn-primary justify-center text-lg py-3"
                    >
                        Continue <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
