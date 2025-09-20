"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, getAuthHeader } from "../components/api";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        
        // Fixed: Using backticks for template literal instead of single quotes
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Fixed: proper capitalization
            body: JSON.stringify(form),
        });
        
        if (res.ok) {
            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            const text = await res.text();
            // Fixed: Using backticks for template literal
            setMessage(`Registration failed: ${text}`);
        }
    };

    return (
        <main className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </main>
    );
}