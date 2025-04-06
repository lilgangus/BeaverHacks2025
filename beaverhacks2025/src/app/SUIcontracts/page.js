"use client";

import Sidebar from "../utils/Sidebar";
import { useRouter } from "next/router";


export default function SUIcontracts() {
    return (
        <div className="flex">
            
            <Sidebar />
            <div className="flex-grow p-4">
                <p className="mb-4">Here you can view and manage your smart contracts.</p>
                {/* Add your content here */}
            </div>

        </div>

    );
}