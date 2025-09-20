import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
       
        <nav className="bg-gray-800 p-4 text-white flex gap-4">
          <Link href="/events">Events</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/bookings">My Bookings</Link>
          <Link href="/dashboard">Organizer dashboard</Link>
        </nav>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
