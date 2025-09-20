"use client";
import { useEffect, useState } from "react";
import { API_URL, getAuthHeader } from "../components/api";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {


                const res = await fetch(`${API_URL}/booking/mine`, {
                    headers: {
                        ...getAuthHeader(), // safe spread
                    },
                });
                if (!res.ok) { throw new Error("Failed to fetch bookings"); }
                const data = await res.json();
                setBookings(data);

            }
            catch (err: any) {
                setError(err.message);

            }
            finally { setLoading(false); }
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

            const data = await res.json();


            setBookings((prev) => prev.filter((b) => b.id !== id));


            alert(
                `Booking canceled. Event ${data.eventId} now has ${data.availableSeats} seats available.`
            );
        } catch (err: any) {
            setError(err.message);
        }
    };



    if (loading) return <p className="p-6">Loading your bookings...</p>;
    if (error) return <p className="p-6 text-red-600">Error:{error}</p>;
    if (bookings.length === 0) return <p>You have no bookings yet.</p>;

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-bold">My Bookings</h1>
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

                        {/* 🔹 Payment Status */}
                        <p className="mt-2">
                            <strong>Status: </strong>
                            {b.status === "Paid" && (
                                <span className="text-green-600 font-semibold">Paid ✅</span>
                            )}
                            {b.status === "Pending" && (
                                <span className="text-yellow-600 font-semibold">Pending ⏳</span>
                            )}
                            {b.status === "Failed" && (
                                <span className="text-red-600 font-semibold">Failed </span>
                            )}
                        </p>

                        {/* Cancel only if not Paid */}
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