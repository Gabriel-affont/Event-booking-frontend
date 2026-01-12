"use client";

import { useState } from "react";
import { API_URL, getAuthHeader } from "../../components/api";
import { useRouter } from "next/navigation";
import Image from "next/image";


interface CreateEventResponse {
  id: number;
  title: string;
  message?: string;
}

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState(0);
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("totalSeats", totalSeats.toString());
    formData.append("price", price.toString());
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      const res = await fetch(`${API_URL}/Events`, {
        method: "POST",
        headers: {
          ...getAuthHeader(), // don't set Content-Type here for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create event");
      }

      const data: CreateEventResponse = await res.json();
      console.log("Event created:", data);
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <form
        onSubmit={submit}
        className="space-y-4 bg-purple-100 shadow-md p-6 rounded-lg border"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter event details"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Event location"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Total Seats</label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(parseInt(e.target.value || "0"))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value || "0"))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {preview && (
            <div className="mt-3">
              <Image
                src={preview}
                alt="Event preview"
                width={192}
                height={128}
                className="w-48 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Create Event
        </button>
      </form>
    </main>
  );
}