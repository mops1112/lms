import React, { useEffect, useState, useRef } from 'react';

const TestModal = ({ courseId, lessonId, testId, onClose }) => {
  const [test, setTest] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchTestWords = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/student/test/${testId}/testwords`,
          { headers: { 'x-auth-token': localStorage.getItem('x-auth-token') } }
        );
        if (!response.ok) throw new Error('Failed to fetch test words');
        const data = await response.json();
        setWords(data.map((item) => ({ wordText: item.wordText, testWordId: item.id })));
        setTest({ title: `Test ${testId}` });
      } catch (err) {
        console.error(err);
        setError('Error fetching test words');
      } finally {
        setLoading(false);
      }
    };

    fetchTestWords();
  }, [testId]);

  useEffect(() => {
    if (words.length === 0 || currentIndex >= words.length) return;

    const wordObj = words[currentIndex];

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
      const isCorrect = transcript.toLowerCase() === wordObj.wordText.toLowerCase();

      setResults((prev) => ({
        ...prev,
        [wordObj.testWordId]: { answer: transcript, isCorrect },
      }));

      if (currentIndex + 1 >= words.length) {
        // เรียก postTestResult() เมื่อคำสุดท้ายเสร็จสิ้น
        // postTestResult({
        //   ...results,
        //   [wordObj.testWordId]: { answer: transcript, isCorrect },
        // });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setResults((prev) => ({
        ...prev,
        [wordObj.testWordId]: { answer: '', isCorrect: false },
      }));

      if (currentIndex + 1 >= words.length) {
        // เรียก postTestResult() เมื่อคำสุดท้ายเสร็จสิ้น
        // postTestResult({
        //   ...results,
        //   [wordObj.testWordId]: { answer: '', isCorrect: false },
        // });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [currentIndex, words]);

  const postTestResult = async (finalResults) => {
    if (scoreSubmitted) return; // ป้องกันการส่งซ้ำ
    setScoreSubmitted(true);

    const total = words.length;
    const correctCount = Object.values(finalResults).filter((result) => result.isCorrect).length;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/testresult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('x-auth-token'),
        },
        body: JSON.stringify({
          testId: testId,
          score: correctCount,
          totalScore: total,
          answers: Object.keys(finalResults).map((testWordId) => ({
            testWordId,
            answer: finalResults[testWordId].answer,
            isCorrect: finalResults[testWordId].isCorrect,
          })),
        }),
      });

      if (response.ok) {
        console.log('Test result submitted successfully');
      } else {
        console.error('Failed to submit test result');
      }
    } catch (err) {
      console.error('Error submitting test result:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading test...</p>
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-3xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-200"
        >
          &times;
        </button>
  
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">แบบทดสอบ</h1>
  
        <div className="mb-6">
          <p className="mb-4 text-center">ให้อ่านคำตามไฮไลท์</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {words.map((wordObj, index) => (
              <span
                key={index}
                className={`px-3 py-1 border rounded-lg transition text-xs sm:text-sm md:text-base ${
                  index === currentIndex ? 'bg-yellow-300' : 'bg-gray-200'
                }`}
              >
                {wordObj.wordText}{' '}
                {results[wordObj.testWordId] !== undefined &&
                  (results[wordObj.testWordId].isCorrect ? (
                    <span className="text-green-600 ml-1">&#10003;</span>
                  ) : (
                    <span className="text-red-600 ml-1">&#10007;</span>
                  ))}
              </span>
            ))}
          </div>
        </div>
  
        {Object.keys(results).length >= words.length && (
          <div className="mt-4 border-t pt-4 text-center">
            <p className="text-xl font-bold">สรุปคะแนน</p>
            <p>
              คำที่อ่านถูกต้อง: {Object.values(results).filter((r) => r.isCorrect).length} / {words.length}
            </p>
          </div>
        )}
  
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default TestModal;
