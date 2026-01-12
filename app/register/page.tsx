"use client";
import { useState } from "react";
import{ API_URL } from "../components/api";




export default function RegisterPage() {
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        password: "",
        role: 0 // 0 = Attendee, 1 = Organizer, 2 = Admin
    });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.name === "role" ? parseInt(e.target.value) : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };
    
    const handleSubmit = async () => {
        setMessage("");
        
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(form),
            });
            
            if (res.ok) {
                setMessage("✅ Registration successful! You can now login with your credentials.");
                // Clear form
                setForm({ name: "", email: "", password: "", role: 0 });
            } else {
                const text = await res.text();
                setMessage(` Registration failed: ${text}`);
            }
        } catch (error) {
            setMessage(` Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            placeholder="Batman"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="batman@gmail.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value={0}>🎫 Attendee - Browse & Book Events</option>
                            <option value={1}>🎪 Organizer - Create & Manage Events</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {form.role === 0 
                                ? "Perfect for attending events and booking tickets" 
                                : "Create your own events and manage bookings"}
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!form.name || !form.email || !form.password}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
                    >
                        Create Account
                    </button>
                </div>

                {message && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        message.includes("✅") 
                            ? "bg-green-50 text-green-800 border border-green-200" 
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}