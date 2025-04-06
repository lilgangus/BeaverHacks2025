import Image from "next/image";
import Link from "next/link";
// import benny image
import benny from "./benny.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 py-8">
      
      <Image
        src={benny}
        alt="Benny"
        width={500}
        height={500}
        className="mb-8"
        
      />
      
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
        Welcome to BENNY – Your Personal Contract Enforcer
      </h1>
      
      <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
        Benny is your personal AI assistant that lets you record verbal agreements with others and
        store them securely on the blockchain. This creates a permanent and verifiable record of
        your agreements, which can be used as reliable evidence in case of disputes. Protect your
        interests and make your verbal agreements official with Benny!
      </p>
      
      <div className="flex flex-col items-center gap-4">
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
            Get Started
          </button>
        </Link>

        {/* <Link href="/learn-more">
          <button className="bg-transparent border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-semibold py-2 px-6 rounded-lg transition duration-300">
            Learn More
          </button>
        </Link> */}
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        <p>&copy; 2025 Benny Inc. All rights reserved. Lol not really but it makes the page look better</p>
        
      </footer>
    </div>
  );
}
