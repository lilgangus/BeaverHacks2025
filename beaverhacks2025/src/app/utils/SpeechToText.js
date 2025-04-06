'use client';

import { useState, useRef } from 'react';

export default function SpeechToText({ onTranscriptChange, onAudioSave }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  const CHUNK_DURATION_MS = 30_000; // 30 seconds

  // Initialize SpeechRecognition once
  function initRecognition() {
    if (recognitionRef.current || typeof window === 'undefined' || !window.webkitSpeechRecognition) return;
    const SpeechRecognition = window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript(prev => {
            const updated = prev + result[0].transcript + ' ';
            onTranscriptChange(updated);
            return updated;
          });
        } else {
          interim += result[0].transcript;
        }
      }
      // you could show interim if you like
    };

    rec.onerror = (e) => console.error('Speech recognition error', e);

    // if recognition ends unexpectedly, restart it
    rec.onend = () => {
      if (isListening) {
        rec.start();
      }
    };

    recognitionRef.current = rec;
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
        // immediately emit each chunk
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onAudioSave(blob);
        chunksRef.current = [];
      }
    };

    recorder.start(CHUNK_DURATION_MS); 
    // by passing the timeslice, you get dataavailable every 30s without stopping
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    mediaRecorderRef.current = null;
  }

  const toggleListening = () => {
    initRecognition();

    if (isListening) {
      // stop everything
      recognitionRef.current.stop();
      stopRecording();
    } else {
      setTranscript('');
      onTranscriptChange('');
      startRecording();
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setTranscript(val);
    onTranscriptChange(val);
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
    </div>
  );
}
