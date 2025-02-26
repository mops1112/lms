import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleRegister = async (courseId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/course/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('x-auth-token')
        },
        body: JSON.stringify({ courseId })
      });
      const data = await response.json();
      if (response.ok) {
        // หลังจากลงทะเบียนสำเร็จ ให้เปลี่ยนหน้าไปยัง Lesson page ของคอร์สนั้น
        navigate(`/student/courses/${courseId}/lessons`);
      } else {
        setMessage(data.msg || 'Error registering course');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Server error');
    }
  };

  return (
    <StudentLayout>
      <h1 className="text-4xl font-bold text-center text-white mb-8">รายวิชาทั้งหมด</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://blog.esc13.net/wp-content/uploads/2019/03/GettyImages-486325400-1-1104x621.jpeg"
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
              <p className="mt-2 text-gray-600">{course.description}</p>
              <button
                onClick={() => handleRegister(course.id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                เลือก
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && (
        <div className="mt-8 text-center text-white font-semibold">
          {message}
        </div>
      )}
    </StudentLayout>
  );
}

export default Courses;
