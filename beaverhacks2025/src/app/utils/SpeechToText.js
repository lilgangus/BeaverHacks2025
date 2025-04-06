'use client';

import { useState, useEffect } from 'react';

export default function SpeechToText({ onTranscriptChange }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  let recognition;

  // Web Speech API Setup (works on Chrome, etc.)
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript((prev) => {
            const newTranscript = prev + result[0].transcript + ' ';
            // Pass the new transcript to the parent
            onTranscriptChange(newTranscript);
            return newTranscript;
          });
        } else {
          interimTranscript += result[0].transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  // Toggle the speech recognition
  const toggleListening = () => {
    if (isListening) {
        recognition.stop();
    } else {
        setTranscript(''); // Reset transcript when starting listening

        recognition.start();
    }
    setIsListening(!isListening);
  };

  // Handle manual editing of the transcript
  const handleChange = (e) => {
    const editedTranscript = e.target.value;
    setTranscript(editedTranscript);
    onTranscriptChange(editedTranscript); // Update the parent with the new value
  };

  return (
    <div className="p-4 border rounded shadow w-full max-w-xl">
      <h2 className="text-lg font-semibold mb-2">Voice to Text</h2>
      <button
        onClick={toggleListening}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isListening ? 'Stop' : 'Start'} Listening
      </button>
      <div >
        <textarea
          value={transcript}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          rows={6}
        />
      </div>
    </div>
  );
}
