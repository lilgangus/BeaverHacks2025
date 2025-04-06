'use client';

import { useState, useEffect, useRef } from 'react';

export default function SpeechToText({ onTranscriptChange, onAudioSave }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);
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
  
  // Start and stop the audio recording using MediaRecorder
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    // Create a MediaRecorder instance
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    // Collect audio chunks as they come in
    mediaRecorder.ondataavailable = (event) => {
      chunks.current.push(event.data);
    };

    // When the recording is stopped, combine chunks and create a Blob
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
      setAudioBlob(audioBlob);
      onAudioSave(audioBlob); // Pass the audioBlob to the parent
      chunks.current = []; // Clear the chunks for the next recording
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop()); // Stop the media stream
    }
  };

  // Toggle the speech recognition and audio recording
  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      stopRecording(); // Stop recording
    } else {
      setTranscript(''); // Reset transcript when starting listening
      onTranscriptChange(''); // Notify the parent to reset the transcript
      startRecording(); // Start recording
      recognition.start(); // Start speech recognition
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
      <div className="mt-4 p-2 border bg-gray-100 min-h-[100px]">
        <textarea
          value={transcript}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          rows={6}
        />
      </div>
      {/* {audioBlob && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recorded Audio</h3>
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )} */}
    </div>
  );
}
