"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../utils/logout";
import SpeechToText from "../utils/SpeechToText";
import Sidebar from "../utils/Sidebar";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [transcript, setTranscript] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState('');

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript);
    console.log("Transcript:", newTranscript);
  };

  // Function to handle saving the audio file in the parent component
  const handleAudioSave = (audioBlob) => {
    setAudioFile(audioBlob);
    // You can optionally upload this to a server here or save it locally
    const audioURL = URL.createObjectURL(audioBlob);
    console.log('Audio saved!', audioURL);
  };


  // Function to send the transcript and audio file to the backend
  const processSmartcontract = async () => {
    console.log("Processing smart contract...");
    console.log("Transcript:", transcript);
    console.log("Audio File:", audioFile);
    console.log("Selected Contact:", selectedContact);
    
    if (!transcript || !audioFile || !selectedContact) {
      console.error("Some field is missing!");
      return;
    }

    // Create a FormData object to send the transcript and audio as form data
    const formData = new FormData();
    formData.append("transcript", transcript);
    formData.append("audio", audioFile, "recorded-audio.webm"); // You can give your audio a specific name here

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Successfully uploaded transcript and audio!");
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Error uploading data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending request to backend:", error);
    }
  };


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

  // populate based on the users con
    useEffect(() => {
        if (user) {
        const fetchContacts = async () => {
            const response = await fetch(`/api/contacts?user=${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });
    
            const data = await response.json();
            setContacts(data);
        };
    
        fetchContacts();        
        }
    }, [user]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
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

          <SpeechToText onTranscriptChange={handleTranscriptChange} onAudioSave={handleAudioSave} />

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Transcript</h2>
            <div className="border p-4 mt-2 bg-gray-50 rounded">
              <p>{transcript || <em>Start speaking to see the transcript...</em>}</p>

              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`}
                download="transcript.txt"
                className="block mt-2 text-blue-600"
              >
                Download Transcript
              </a>
            </div>
          </div>

          {audioFile && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Saved Audio File</h3>
              <audio controls src={URL.createObjectURL(audioFile)} />
              <a
                href={URL.createObjectURL(audioFile)}
                download="recorded-audio.webm"
                className="block mt-2 text-blue-600"
              >
                Download Audio
              </a>
            </div>
          )}

          
        <div className="mt-6">
            <label htmlFor="contact-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select a contact:
            </label>
            <select
                id="contact-select"
                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
            >
                <option value="">-- Choose a contact --</option>
                {contacts.map((contact, index) => (
                <option key={index} value={contact.username}>
                    {contact.username}, {contact.walletAddress}
                </option>
                ))}
            </select>
        </div>


          <div className="mt-6">
            <button
              onClick={processSmartcontract}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Transcript and Audio to Smart Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
