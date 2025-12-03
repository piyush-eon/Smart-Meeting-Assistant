"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    const name = username.trim() === "" ? "anonymous" : username.trim();

    // const meetingId = "meeting-" + Math.random().toString(36).substring(2, 10);
    const meetingId = process.env.NEXT_PUBLIC_CALL_ID;

    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="p-8 bg-gray-800/60 rounded-2xl border border-gray-700 w-80 backdrop-blur-sm shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter your name
        </h2>

        <input
          className="px-4 py-3 w-full rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="e.g. Piyush (optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleJoin}
          className="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-lg transition"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}
