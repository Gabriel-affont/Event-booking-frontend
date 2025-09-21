"use client";
import { useEffect, useState } from "react";
import { API_URL, getAuthHeader } from "../components/api";


interface Event {
  id: number;
  title: string;
  Location: string;
  date: string;
}

interface Booking {
  id: number;
  event: Event;
  numberOfSeats: number;
  totalPrice: number;
  status: "Paid" | "Pending" | "Failed";
  eventId: number;
}

interface CancelResponse {
  eventId: number;
  availableSeats: number;
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`${API_URL}/booking/mine`, {
                    headers: {
                        ...getAuthHeader(), 
                    },
                });
                if (!res.ok) { 
                    throw new Error("Failed to fetch bookings"); 
                }
                const data: Booking[] = await res.json();
                setBookings(data);
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
            }
            finally { 
                setLoading(false); 
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const res = await fetch(`${API_URL}/booking/${id}`, {
                method: "DELETE",
                headers: {
                    ...getAuthHeader(),
                },
            });

            if (!res.ok) throw new Error("Failed to cancel booking");

            const data: CancelResponse = await res.json();

            setBookings((prev) => prev.filter((b) => b.id !== id));

            alert(
                `Booking canceled. Event ${data.eventId} now has ${data.availableSeats} seats available.`
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
            setError(errorMessage);
        }
    };

    if (loading) return <p className="p-6">Loading your bookings...</p>;
    if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
    if (bookings.length === 0) return <p className="p-6">You have no bookings yet.</p>;

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            <ul className="space-y-4">
                {bookings.map((b) => (
                    <li key={b.id} className="border rounded-lg p-4 shadow">
                        <h2 className="text-xl font-semibold">{b.event.title}</h2>
                        <p className="text-gray-600">{b.event.Location}</p>
                        <p className="text-sm text-gray-600">
                            Date: {new Date(b.event.date).toLocaleDateString()}
                        </p>
                        <p className="mt-2"><strong>Seats:</strong> {b.numberOfSeats}</p>
                        <p className="mt-2"><strong>Total Price:</strong> {b.totalPrice}</p>

                        {/* Payment Status */}
                        <p className="mt-2">
                            <strong>Status: </strong>
                            {b.status === "Paid" && (
                                <span className="text-green-600 font-semibold">Paid ✅</span>
                            )}
                            {b.status === "Pending" && (
                                <span className="text-yellow-600 font-semibold">Pending ⏳</span>
                            )}
                            {b.status === "Failed" && (
                                <span className="text-red-600 font-semibold">Failed ❌</span>
                            )}
                        </p>

                        
                        {b.status !== "Paid" && (
                            <button
                                onClick={() => handleCancel(b.id)}
                                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Cancel Booking
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
}