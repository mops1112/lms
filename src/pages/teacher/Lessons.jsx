import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import EditLessonModal from '../../components/EditLessonModal';
import CreateLessonModal from '../../components/CreateLessonModal';
import TeacherLayout from '../../layouts/TeacherLayout';

function Lessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      const token = localStorage.getItem('x-auth-token');
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/courses/${courseId}/lessons`,
          { headers: { 'x-auth-token': token } }
        );
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleLessonClick = (lessonId) => {
    navigate(`/teacher/courses/${courseId}/lessons/${lessonId}/contents`);
  };

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character random code
  };
  
  const handleDeleteLesson = async (lessonId, e) => {
    e.stopPropagation();
    const confirmationCode = generateRandomCode();
    const userInput = window.prompt(`กรอก ${confirmationCode} เพื่อลบบทเรียนนี้`);
  
    if (!userInput) {
      alert('Deletion cancelled.');
      return;
    }
  
    if (userInput.trim().toUpperCase() !== confirmationCode) {
      alert('Incorrect code! Deletion aborted.');
      return;
    }
  
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${lessonId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );
      if (response.ok) {
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
        alert('Lesson deleted successfully.');
      } else {
        console.error('Failed to delete lesson');
        alert('Failed to delete lesson. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('An error occurred while deleting the lesson.');
    }
  };
  

  const handleEditLesson = (lesson, e) => {
    e.stopPropagation();
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleSaveLesson = async (updatedLesson) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${updatedLesson.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(updatedLesson),
        }
      );
      if (response.ok) {
        setLessons(lessons.map(lesson => lesson.id === updatedLesson.id ? updatedLesson : lesson));
      } else {
        console.error('Failed to update lesson');
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleCreateLesson = async (newLesson) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ 
            title: newLesson.title, 
            content: newLesson.description, 
            courseId 
          }),
        }
      );
      if (response.ok) {
        const createdLesson = await response.json();
        setLessons([...lessons, createdLesson]);
      } else {
        console.error('Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-blue-900">บทเรียนทั้งหมด</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-md shadow-lg transition duration-200"
          >
            <FaPlus size={18} className="text-white" />
            <span className="font-semibold">สร้างบทเรียน</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blue-200 rounded-lg shadow">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 border-r border-blue-700">ชื่อบทเรียน</th>
                <th className="py-3 px-4 border-r border-blue-700">รายละเอียด</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-600">
                    No lessons available.
                  </td>
                </tr>
              ) : (
                lessons.map(lesson => (
                  <tr
                    key={lesson.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <td className="py-3 px-4 border-r border-blue-200">{lesson.title}</td>
                    <td className="py-3 px-4 border-r border-blue-200">{lesson.content}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="mr-2 text-green-500 hover:text-green-600 transition-colors duration-200"
                        onClick={(e) => handleEditLesson(lesson, e)}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        onClick={(e) => handleDeleteLesson(lesson.id, e)}
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EditLessonModal
        lesson={selectedLesson}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveLesson}
      />
      <CreateLessonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLesson}
      />
    </TeacherLayout>
  );
}

export default Lessons;
