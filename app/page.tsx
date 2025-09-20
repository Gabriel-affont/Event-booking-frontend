"use client";
import {useEffect, useState} from "react";
import EventCard from "../app/components/EventCard";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
}
export default function HomePage(){
  const [events, setEvents] = useState<Event[]>([]);
  const [loading ,setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  useEffect(() =>{
    fetch("https://localhost:7092/api/events")

      .then ((response)=>{
        if (!response.ok){
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then ((data) => setEvents(data))
      .catch ((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error}</p>;
  return (
    <main className="container mx-auto p-4">
      <h1 className ="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            id ={event.id}
            description={event.description}
            date={new Date(event.date).toLocaleDateString()}        />
        ))}
      </div>
    </main>
  );
}