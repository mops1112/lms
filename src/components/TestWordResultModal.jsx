import React, { useEffect, useState } from 'react';

const TestWordResultModal = ({ testResultId, onClose }) => {
  const [testWords, setTestWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestWordResults = async () => {
      try {
        const token = localStorage.getItem('x-auth-token');
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/testwordresults/${testResultId}`,
          { headers: { 'x-auth-token': token } }
        );
        if (!response.ok) throw new Error('Failed to fetch test word results');
        const data = await response.json();
        setTestWords(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching test word results');
      } finally {
        setLoading(false);
      }
    };

    fetchTestWordResults();
  }, [testResultId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl">
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-4">แบบทดสอบ</h1>
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">โจทย์</th>
              <th className="py-2 px-4 border">คำตอบ</th>
              <th className="py-2 px-4 border">ถูกต้อง</th>
            </tr>
          </thead>
          <tbody>
            {testWords.map((word) => (
              <tr key={word.id}>
                <td className="py-2 px-4 border">{word.wordText}</td>
                <td className="py-2 px-4 border">{word.answer}</td>
                <td className="py-2 px-4 border">{word.isCorrect ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestWordResultModal;
