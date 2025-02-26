import React, { useEffect, useState } from 'react';

function WordPopup({ lessonId, onClose }) {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');

  useEffect(() => {
    const fetchWords = async () => {
      const token = localStorage.getItem('x-auth-token'); // Assuming the token is stored in localStorage
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${lessonId}/words`, {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setWords(data);
    };

    fetchWords();
  }, [lessonId]);

  const handleAddWord = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('x-auth-token'); // Assuming the token is stored in localStorage
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teacher/word`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ text: newWord, lessonId }),
    });
    const data = await response.json();
    setWords([...words, data]);
    setNewWord('');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Words</h2>
        <form onSubmit={handleAddWord} className="mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Word</label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Word
            </button>
          </div>
        </form>
        <div className="space-y-4">
          {words.map((word) => (
            <div key={word.id} className="p-4 border border-gray-300 rounded-md shadow-sm">
              <p className="text-lg">{word.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordPopup;
