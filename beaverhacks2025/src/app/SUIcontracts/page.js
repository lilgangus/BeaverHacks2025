"use client";

import Sidebar from "../utils/Sidebar";
import { useRouter } from "next/router";


export default function SUIcontracts() {
    return (
        <div className="flex">
            
            <Sidebar />
            <div className="flex-grow p-4">
                <h1 className="text-2xl font-bold mb-4">Smart Contracts</h1>
                <p className="mb-4">Here you can view and manage your smart contracts.</p>
                {/* Add your content here */}
            </div>

        </div>

    );
}