import React, { useEffect, useState, useRef } from 'react';

const ExerciseModal = ({ courseId, lessonId, exerciseId, onClose }) => {
  const [exercise, setExercise] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/student/exercise/${exerciseId}/exercisewords`,
          { headers: { 'x-auth-token': localStorage.getItem('x-auth-token') } }
        );
        if (!response.ok) throw new Error('Failed to fetch exercise details');
        const data = await response.json();
        setWords(data.map((item) => item.wordText));
        setExercise({ title: `Exercise ${exerciseId}` });
      } catch (err) {
        console.error(err);
        setError('Error fetching exercise details');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const startRecognition = (word) => {
    if (!word) return;
    setSelectedWord(word);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'th-TH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const isCorrect = transcript.toLowerCase() === word.toLowerCase();

      setResults((prev) => ({ ...prev, [word]: isCorrect }));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setResults((prev) => ({ ...prev, [word]: false }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleRestartExercise = () => {
    setResults({});
    setSelectedWord(null);
    setScoreSubmitted(false);
  };

  const total = words.length;
  const correctCount = Object.values(results).filter((correct) => correct).length;

  useEffect(() => {
    if (Object.keys(results).length === words.length && !scoreSubmitted) {
      postExerciseResult();
    }
  }, [results]);

  const postExerciseResult = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/exerciseresult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('x-auth-token'),
        },
        body: JSON.stringify({
          exerciseId: exerciseId,
          score: correctCount,
          totalScore: total,
        }),
      });

      if (response.ok) {
        console.log('Score submitted successfully');
        setScoreSubmitted(true);
      } else {
        console.error('Failed to submit score');
      }
    } catch (err) {
      console.error('Error submitting score:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl">
          &times;
        </button>
        <h1 className="text-3xl font-bold mb-4">แบบฝึกหัด</h1>
        {/* <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1> */}

        <div className="mb-6">
          <p className="mb-4">เลือกคำและอ่านออกเสียง</p>
          <div className="flex flex-wrap gap-2">
            {words.map((word, index) => (
              <button
                key={index}
                onClick={() => startRecognition(word)}
                className={`px-3 py-1 border rounded-lg transition ${
                  selectedWord === word ? 'bg-yellow-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {word}{' '}
                {results[word] !== undefined &&
                  (results[word] ? (
                    <span className="text-green-600 ml-1">&#10003;</span>
                  ) : (
                    <span className="text-red-600 ml-1">&#10007;</span>
                  ))}
              </button>
            ))}
          </div>
        </div>

        {Object.keys(results).length >= words.length && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xl font-bold">Summary:</p>
            <p>
              Correct: {correctCount} / {total}
            </p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={handleRestartExercise} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            เริ่มทำแบบฝึกใหม่
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
