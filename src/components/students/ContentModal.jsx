import React, { useEffect, useState } from 'react';
import { X } from "lucide-react";
const ContentModal = ({ contentId, onClose }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  const handleWordClick = (word) => {
    setSelectedWord(word); // ตั้งค่าคำที่ถูกเลือก
    speakWord(word); // เล่นเสียงคำที่เลือก
  };
  // ดึงข้อมูลคำศัพท์จาก API
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/student/content/${contentId}/contentwords`,
          {
            headers: { 'x-auth-token': localStorage.getItem('x-auth-token') },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch content data');

        const data = await response.json();
        setWords(data || []);
      } catch (err) {
        console.error(err);
        setError('Error fetching content data');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [contentId]);

  // ฟังก์ชันสำหรับอ่านคำศัพท์ด้วย Text-to-Speech
  const speakWord = (word) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'th-TH'; // กำหนดเป็นภาษาไทย
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <div className="bg-blue-900 p-8 rounded-lg shadow-xl text-white">
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <div className="bg-blue-900 p-8 rounded-lg shadow-xl text-white">
          <p>{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 px-4">
      <div className="bg-blue-900 p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300 transition duration-200"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">แบบเรียน</h1>

        <div className="mb-6">
          <p className="mb-4 text-white text-center">เลือกคำเพื่อฟังเสียง</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {words.length > 0 ? (
              words.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word.wordText)}
                  className={`px-3 py-2 border rounded-lg transition duration-200 ${
                    selectedWord === word.wordText
                      ? "bg-yellow-500 text-white" // สีเหลืองเมื่อเลือก
                      : "bg-white text-blue-900 hover:bg-gray-100"
                  }`}
                >
                  {word.wordText}
                </button>
              ))
            ) : (
              <p className="text-center text-gray-300">No content available.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
