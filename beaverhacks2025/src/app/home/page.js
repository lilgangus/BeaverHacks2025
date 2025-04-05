"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutButton from "../utils/logout";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          // send cookies with the request
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.username);
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="max-w-xl mx-auto text-center mt-10">
      <h1 className="text-3xl font-bold mb-4 underline">Welcome to BENNY!</h1>
      <p className="mb-4">
        Benny is your own personal AI assistant to help you with scheduling your everyday tasks and interact with the real world using technologies such as SUI!
      </p>

      {user ? (
        <div>
            <p className="mb-4 text-lg font-semibold">Hello, {user} 👋</p>
            <LogoutButton />
        </div>
      ) : (
        <p className="mb-4 italic text-gray-500">Loading user...</p>
      )}

    </div>
  );
}
