import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';
import EditCourseModal from '../../components/EditCourseModal';
import CreateCourseModal from '../../components/CreateCourseModal';
import TeacherLayout from '../../layouts/TeacherLayout';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('x-auth-token');
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/courses`,
          { headers: { 'x-auth-token': token } }
        );
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/teacher/courses/${courseId}/lessons`);
  };

  const handleGoToSummary = (courseId, e) => {
    e.stopPropagation(); // Prevent row click navigation
    navigate(`/teacher/courses/${courseId}/summary`);
  };

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character random code
  };
  
  const handleDeleteCourse = async (courseId, e) => {
    e.stopPropagation();
    const confirmationCode = generateRandomCode();
    const userInput = window.prompt(`กรอก ${confirmationCode} เพื่อลบรายวิชานี้`);
  
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
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/course/${courseId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );
      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId));
        alert('Course deleted successfully.');
      } else {
        console.error('Failed to delete course');
        alert('Failed to delete course. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('An error occurred while deleting the course.');
    }
  };
  

  const handleEditCourse = (course, e) => {
    e.stopPropagation();
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleSaveCourse = async (updatedCourse) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/course/${updatedCourse.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(updatedCourse),
        }
      );
      if (response.ok) {
        setCourses(courses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
      } else {
        console.error('Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleCreateCourse = async (newCourse) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/course`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(newCourse),
        }
      );
      if (response.ok) {
        const createdCourse = await response.json();
        setCourses([...courses, createdCourse]);
      } else {
        console.error('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-blue-900">รายวิชาทั้งหมด</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
             className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-md shadow-lg transition duration-200"
          >
            <FaPlus size={18} className="text-white" />
            <span className="font-semibold">สร้างรายวิชา</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blue-200 rounded-lg shadow">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 border-r border-blue-700">ชื่อ</th>
                <th className="py-3 px-4 border-r border-blue-700">คำอธิบาย</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-600">
                    No courses available.
                  </td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr
                    key={course.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <td className="py-3 px-4 border-r border-blue-200">{course.title}</td>
                    <td className="py-3 px-4 border-r border-blue-200">{course.description}</td>
                    <td className="py-3 px-4 text-right flex items-center justify-end space-x-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={(e) => handleGoToSummary(course.id, e)}
                        title="View Summary"
                      >
                        <FaChartBar size={20} />
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700 transition-colors duration-200"
                        onClick={(e) => handleEditCourse(course, e)}
                        title="Edit Course"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        title="Delete Course"
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
      <EditCourseModal
        course={selectedCourse}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCourse}
      />
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCourse}
      />
    </TeacherLayout>
  );
}

export default Courses;
