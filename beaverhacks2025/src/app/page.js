import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Welcome to BENNY!</h1>
      <p>Benny is your own personal AI assistant to help you with scheduling your everyday tasks and interact with the real world using technolgoies such as SUI!</p>

      <Link href="/login">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </Link>
      
    </div>
  );
}
