import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import LessonContentModal from '../../components/students/LessonContentModal';

const Lessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/course/${courseId}/lessons`, {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token')
          }
        });
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleOpenModal = (lessonId) => {
    setSelectedLessonId(lessonId);
  };

  const handleCloseModal = () => {
    setSelectedLessonId(null);
  };

  return (
    <StudentLayout>
      <h1 className="text-4xl font-bold text-center mb-8">บทเรียน</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">ลำดับ</th>
              <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">ชื่อบทเรียน</th>
              <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <tr key={lesson.id}>
                  <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                  <td className="px-6 py-4 border-b">{lesson.title}</td>
                  <td className="px-6 py-4 border-b text-center space-x-2">
                   
                    <Link
                      to={`/student/courses/${courseId}/lessons/${lesson.id}/contents`}
                       className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
                    >
                      เข้าสู่บทเรียน
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">ไม่พบบทเรียน</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedLessonId && (
        <LessonContentModal 
          courseId={courseId} 
          lessonId={selectedLessonId} 
          onClose={handleCloseModal}
        />
      )}
    </StudentLayout>
  );
};

export default Lessons;
