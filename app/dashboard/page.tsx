"use client";

import { useEffect, useState } from "react";
import { API_URL, getAuthHeader } from "../components/api";
import Link from "next/link";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    fetch(`${API_URL}/Events/my-events`, {
      headers: {
        ...getAuthHeader(),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events");
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${API_URL}/Events/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!res.ok) throw new Error("Failed to delete event");

      // remove event from UI immediately
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>

      <Link href="/dashboard/create">
        <button className="mb-6 bg-green-600 text-white px-4 py-2 rounded">
          + Create New Event
        </button>
      </Link>

      {events.length === 0 ? (
        <p className="text-gray-600">You haven’t created any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >

              {/* Show event image if available */}
              {ev.imageUrl ? (
                <img
                  src={`${API_URL}${ev.imageUrl}`}
                  alt={ev.title}
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
                  No Image
                </div>
              )}

              <div>
                <h2 className="font-semibold">{ev.title}</h2>
                <p className="text-gray-600">
                  {new Date(ev.date).toLocaleDateString()}
                </p>
                <p>{ev.location}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/edit/${ev.id}`}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
