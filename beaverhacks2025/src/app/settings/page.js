"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Sidebar from "../utils/Sidebar";


export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [CurrPublicKey, setCurrPublicKey] = useState("Not Set");
    const [publicKey, setPublicKey] = useState("");
    const [secretKey, setSecretKey] = useState("");

    const saveKeys = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user,
                publicKey: publicKey,
                secretKey: secretKey,
            }),
        });

        if (res.ok) {
            alert("Keys saved successfully");
            setCurrPublicKey(publicKey);

        } else {
            console.error("Error saving keys");
        }
    }

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
      

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const res = await fetch(`/api/settings?user=${user}&type=pubKey`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    console.error("Error fetching keys");
                    return;
                }

                const pubKey = await res.json();
                
                setPublicKey(pubKey);
                setCurrPublicKey(pubKey);

            } catch (err) {
                console.error("Error fetching keys:", err);
            }
        };

        if (user) {
            fetchKeys();
        }
    }
    , [user]);

    return (
        <div>
            <div className="flex">

                <Sidebar />

                <div className="flex-grow p-4">

                    <h1 className="text-3xl font-bold mb-4">Account Settings</h1>

                    <p className="mb-4">Manage your account settings here </p>
                    <p className="mb-4">{user}&apos;s current public key: {CurrPublicKey}</p>
                    {/* form to input public and secret key */}

                    <form className="space-y-4" onSubmit={saveKeys}>
                        <div>
                            <label htmlFor="publicKey" className="block mb-1 font-medium">Public Key:</label>
                            <input
                                type="text"
                                id="publicKey"
                                value={publicKey}
                                onChange={(e) => setPublicKey(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="secretKey" className="block mb-1 font-medium">Secret Key:</label>
                            <input
                                type="text"
                                id="secretKey"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                            Save Changes
                        </button>
                    </form>

                </div>

            </div>
                            
        </div>
    )
}