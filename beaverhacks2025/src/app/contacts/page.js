"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../utils/Sidebar';
import { useRouter } from 'next/navigation';

const Contacts = () => {

    const router = useRouter();
    const [user, setUser] = useState(null);

    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({
        username: '',
        walletAddress: '',
    });
    const [editContactId, setEditContactId] = useState(null);
    const [editedContact, setEditedContact] = useState({
        username: '',
        walletAddress: '',
    });

   // Fetch user information from backend API
   useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user", {
                    method: "GET",
                    credentials: "include", // send cookies with the request
                });

                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                setUser(data.username);
                // setIsUserLoading(false); // User data fetched successfully
            } catch (err) {
                console.error("Error fetching user:", err);
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    // Fetch contacts from backend API only if the user is fetched
    useEffect(() => {
        if (user) {
            const fetchContacts = async () => {
                // const response = await fetch('/api/contacts');
                // put request to get contacts for the user with the username
                const response = await fetch(`/api/contacts?user=${user}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();
                setContacts(data);
            };

            fetchContacts();
        }
    }, [user]); // This runs only when user is available



  // Handle input changes for creating new contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value, user: user });
  };

  // Handle input changes for editing contact
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedContact({ ...editedContact, [name]: value, user: user });
  };

  // Handle creating new contact
  const handleCreateContact = async () => {
    const response = await fetch(`/api/contacts?user=${user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    });
    const data = await response.json();
    setContacts([...contacts, data]);
    setNewContact({ username: '', walletAddress: '' });
  };

  // Handle editing a contact
  const handleEditContact = (contact) => {
    setEditContactId(contact.id);
    setEditedContact({ username: contact.username, walletAddress: contact.walletAddress, user: user });
  };

  // Handle saving edited contact
  const handleSaveEdit = async () => {
    try {
      const updatedContact = { ...editedContact, id: editContactId }; // Ensure id is included
      const response = await fetch(`/api/contacts?user=${user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContact),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      const data = await response.json();

      // Update the contacts list with the updated contact
      setContacts(
        contacts.map((contact) =>
          contact.id === editContactId ? { ...contact, ...data } : contact
        )
      );

      // Reset the editable state
      setEditContactId(null);
      setEditedContact({ username: '', walletAddress: '' });

    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Your Contacts</h1>

        {/* Create New Contact Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Create New Contact</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="username"
              value={newContact.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="walletAddress"
              value={newContact.walletAddress}
              onChange={handleInputChange}
              placeholder="Wallet Address"
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleCreateContact}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded"
            >
              Create Contact
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Wallet Address</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="py-2 px-4 border-b">
                  {editContactId === contact.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editedContact.username}
                      onChange={handleEditChange}
                      className="px-4 py-2 border border-gray-300 rounded"
                    />
                  ) : (
                    contact.username
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editContactId === contact.id ? (
                    <input
                      type="text"
                      name="walletAddress"
                      value={editedContact.walletAddress}
                      onChange={handleEditChange}
                      className="px-4 py-2 border border-gray-300 rounded"
                    />
                  ) : (
                    contact.walletAddress
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editContactId === contact.id ? (
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;
