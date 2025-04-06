import { useRouter } from "next/navigation";
import LogoutButton from "./logout";

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Benny&apos;s Contracts</h2>
      <nav>
        <ul>
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => router.push('/home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => router.push('/contacts')}
            >
              Contacts
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => router.push('/SUIcontracts')}
            >
              Smart Contracts
            </button>
          </li>

          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
              onClick={() => router.push('/settings')}
            >
              Account Settings
            </button> 
          </li>

          {/* set the logout button to be at the bottom */}

          <li >
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
