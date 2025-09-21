
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, getAuthHeader } from "../components/api";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        
        fetch(`${API_URL}/Events`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to load events: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log('Events loaded:', data); // Debug log
                setEvents(data);
            })
            .catch((err) => {
                console.error('Error loading events:', err); // Debug log
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading events...</p>;
    if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Available Events</h1>
            {events.length === 0 ? (
                <p className="text-gray-500">No events available at the moment.</p>
            ) : (
                <div className="grid gap-4">
                    {events.map((ev) => (
                        <Link key={ev.id} href={`/events/${ev.id}`}>
                            <div className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
                                {ev.imageUrl && (
                                    <img
                                        src={ev.imageUrl}
                                        alt={ev.title}
                                        className="w-full h-48 object-cover rounded mb-2"
                                    />
                                )}
                                

                                <h2 className="text-xl font-semibold">{ev.title}</h2>
                                <p className="text-gray-600">{ev.description}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(ev.date).toLocaleDateString()}
                                </p>
                                {ev.location && <p className="text-sm text-gray-500">📍 {ev.location}</p>}
                                {ev.price && <p className="text-sm font-medium text-green-600">💰 {ev.price}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}