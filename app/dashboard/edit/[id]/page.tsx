"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL, getAuthHeader } from "../../../components/api";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  description: string;
  category?: string;
  location: string;
  date: string;
  totalSeats: number;
  price: number;
  imageUrl?: string;
  imageFile?: File;
}

interface UpdateEventResponse {
  id: number;
  title: string;
  imageUrl?: string;
  message?: string;
}

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/Events/${id}`, {
          headers: {
            ...getAuthHeader(),
          },
        });
        
        if (!res.ok) throw new Error("Failed to load event");
        
        const data: Event = await res.json();
        setEvent(data);
        setCurrentImage(data.imageUrl || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load event';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!event) return;

    try {
      const formData = new FormData();
      formData.append("Title", event.title);
      formData.append("Description", event.description);
      if (event.category) formData.append("Category", event.category);
      formData.append("Location", event.location);
      formData.append("Date", event.date);
      formData.append("TotalSeats", event.totalSeats.toString());
      formData.append("Price", event.price.toString());

      if (event.imageFile) {
        formData.append("imageFile", event.imageFile);
      }

      const res = await fetch(`${API_URL}/Events/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(), // Don't set Content-Type manually, browser will do it for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update event");
      }

      const updated: UpdateEventResponse = await res.json();
      
      // Update state with fresh data
      setEvent(prev => prev ? { ...prev, imageUrl: updated.imageUrl } : null);
      setCurrentImage(updated.imageUrl || null);
      setSuccess("Event updated successfully!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
    }
  };

  const handleFileChange = (file: File | undefined) => {
    if (!event) return;
    setEvent({ ...event, imageFile: file });
  };

  if (loading) return <p className="p-6">Loading event...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!event) return <p className="p-6">Event not found.</p>;

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded border border-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-lg border">
        <div>
          <label className="block font-medium mb-2">Event Title</label>
          <input
            type="text"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Location</label>
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event location"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Date & Time</label>
          <input
            type="datetime-local"
            value={event.date?.slice(0, 16)}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Total Seats</label>
            <input
              type="number"
              value={event.totalSeats}
              onChange={(e) => setEvent({ ...event, totalSeats: Number(e.target.value) })}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={event.price}
              onChange={(e) => setEvent({ ...event, price: Number(e.target.value) })}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={0}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-4 space-y-4">
            {currentImage && !event.imageFile && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <Image
                  src={currentImage}
                  alt="Current Event Image"
                  width={192}
                  height={128}
                  className="w-48 h-32 object-cover rounded border"
                />
              </div>
            )}

            {event.imageFile && (
              <div>
                <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                <Image
                  src={URL.createObjectURL(event.imageFile)}
                  alt="New Preview"
                  width={192}
                  height={128}
                  className="w-48 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}