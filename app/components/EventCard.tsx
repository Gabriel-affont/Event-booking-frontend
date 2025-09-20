import Link from "next/link";
type EventProps = {
    id: string;
    title: string;
    description: string;
    date: string;
    
};
export default function EventCard ({id, title, description, date}: EventProps) {
    return (
        <Link href = {`/events/${id}`}>
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        </Link>

    );
}