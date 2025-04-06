"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../utils/Sidebar";

export default function SUIcontracts() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userContracts, setUserContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user", {
                    method: "GET",
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

    useEffect(() => {
        const fetchContracts = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/createSmartContract?user=${user}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch contracts");
                }

                const data = await response.json();
                setUserContracts(data);
                console.log("User Contracts: ", data);
            } catch (err) {
                setError("Error fetching contracts: " + err.message);
                console.error("Error fetching contracts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [user]);

    return (
        <div className="flex">
            <Sidebar />
            {/* <div className="flex-grow p-2">
                <h1 className="text-2xl font-bold mb-4">Smart Contracts</h1>
                <p className="mb-4">Here you can view and manage your verbal contracts that you have made on the block chain with other people.</p>
            </div> */}

            <div className="flex-grow p-4">
                <h2 className="text-xl font-bold mb-4">Your Smart Contracts</h2>
                <h1 className="text-2xl font-bold mb-4">Smart Contracts</h1>
                <p className="mb-4">Here you can view and manage your verbal contracts that you have made on the block chain with other people.</p>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <ul className="space-y-4">
                    {userContracts.length > 0 ? (
                        [...userContracts]
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // earliest date at the top
                        .map((contract) => (
                            <li key={contract.id} className="border p-4 rounded-md">
                            <h3 className="text-lg font-semibold">Contract ID: {contract.id}</h3>
                            <p>Transcript: {contract.transcript}</p>
                            <a className="text-blue-500 hover:text-blue-700 hover:underline">Audio link</a>
                            <p>Contact: {contract.contact}</p>
                            <p>Date: {new Date(contract.date).toLocaleString()}</p>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No contracts found.</p>
                    )}
                </ul>


            </div>
        </div>
    );
}
