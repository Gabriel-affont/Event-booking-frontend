"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL, getAuthHeader } from "../../../components/api";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);



  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/Events/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load event");
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setCurrentImage(data.imageUrl || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  try {
    const formData = new FormData();
    formData.append("Title", event.title);
    formData.append("Description", event.description);
    formData.append("Category", event.category);
    formData.append("Location", event.location);
    formData.append("Date", event.date);
    formData.append("TotalSeats", event.totalSeats);
    formData.append("Price", event.price);

    if (event.imageFile) {
      formData.append("imageFile", event.imageFile);
    }

    const res = await fetch(`${API_URL}/Events/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeader(), // ⚠️ don’t set Content-Type manually, browser will do it
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to update event");
    }

    const updated = await res.json();
    setEvent(updated); // ✅ update state with fresh ImageUrl
    setSuccess("Event updated successfully!");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (err: any) {
    setError(err.message);
  }
};



  if (loading) return <p className="p-6">Loading event...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!event) return <p className="p-6">Event not found.</p>;

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      {error && <p className="p-2 mb-4 bg-red-100 text-red-700 rounded">{error}</p>}
      {success && <p className="p-2 mb-4 bg-green-100 text-green-700 rounded">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <textarea
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />



        <input
          type="text"
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="datetime-local"
          value={event.date?.slice(0, 16)}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          value={event.totalSeats}
          onChange={(e) => setEvent({ ...event, totalSeats: Number(e.target.value) })}
          className="border p-2 rounded w-full"
          min={1}
          required
        />

        <input
          type="number"
          value={event.price}
          onChange={(e) => setEvent({ ...event, price: Number(e.target.value) })}
          className="border p-2 rounded w-full"
          min={0}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setEvent({ ...event, imageFile: e.target.files?.[0] })}
        />

        {currentImage && !event.imageFile && (
          <img
            src={currentImage}
            alt="Current Event Image"
            className="w-48 h-32 object-cover rounded mb-4"
          />
        )}

        {event.imageFile && (
          <img
            src={URL.createObjectURL(event.imageFile)}
            alt="New Preview"
            className="w-48 h-32 object-cover rounded mb-4"
          />
        )}



        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
