"use client";

import { useState } from "react";
import { API_URL, getAuthHeader } from "../../components/api";
import { useRouter } from "next/navigation";

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

  const submit = async (e: React.FormEvent) => {
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
          ...getAuthHeader(), // don’t set Content-Type here
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create event");
      }

      await res.json();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
        className="space-y-4 bg-purple shadow-md p-6 rounded-lg"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter event details"
            required
          />
        </div>


        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
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
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value || "0"))}
              className="w-full border rounded px-3 py-2"
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
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-48 h-32 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Event
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </main>
  );
}
