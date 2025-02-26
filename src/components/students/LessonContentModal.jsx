// components/student/LessonContentModal.jsx
import React, { useEffect, useState } from 'react';

const LessonContentModal = ({ courseId, lessonId, onClose }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/lesson/${lessonId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch lesson data');
        }
        const data = await response.json();
        setLesson(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching lesson data');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        {/* ปุ่มปิด Modal */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        <div className="flex justify-end space-x-4">
          {/* ปุ่มสำหรับนำไปสู่แบบฝึกหัดและทดสอบ สามารถเพิ่มได้ */}
          <button 
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonContentModal;
