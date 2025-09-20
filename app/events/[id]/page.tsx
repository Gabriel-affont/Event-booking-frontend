

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL, getAuthHeader } from "../../components/api";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<null | string>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Events/${id}`);
      if (!res.ok)
        throw new Error("Failed to fetch event ");
      const data = await res.json();
      setEvent(data);
    }
    catch (err: any) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();

  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const baseHeaders = { "Content-Type": "application/json" };
      const authHeader = getAuthHeader();
      const headers = authHeader
        ? { ...baseHeaders, ...authHeader }
        : baseHeaders;

      // Fixed: Using correct endpoint /Booking instead of /bookings
      const res = await fetch(`${API_URL}/Booking`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          eventId: id,
          numberOfSeats: quantity,
          // Remove userId if your API doesn't need it or gets it from auth token
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to book event: ${errorText}`);
      }

      const result = await res.json();
      setMessage("Booking successful!");

      // Optionally refresh event data to update available seats

      fetchEvent();

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading event...</p>
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!event) return <p className="p-6">No event found</p>;

  return (
    <main className="container mx-auto p-4">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500 mb-4">{new Date(event.date).toLocaleDateString()}</p>
      <p className="font-semibold">Location: {event.location}</p>
      <p className="font-semibold">Price: {event.price}</p>
      <p className="font-semibold">Available Seats: {event.availableSeats}/{event.totalSeats}</p>

      {message && <p className="mt-4 p-2 bg-green-100 text-green-700 rounded">{message}</p>}
      {error && <p className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</p>}

      <form onSubmit={handleBooking} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-gray-700">Number of Tickets</span>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={event.availableSeats}
            className="border p-2 rounded w-full"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={event.availableSeats === 0}
        >
          {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
        </button>
      </form>
    </main>
  );
}