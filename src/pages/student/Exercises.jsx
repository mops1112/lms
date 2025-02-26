import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import ExerciseModal from '../../components/students/ExerciseModal';

const StudentExercises = () => {
  const { courseId, lessonId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/student/lesson/${lessonId}/exercises`,
          {
            headers: {
              'x-auth-token': localStorage.getItem('x-auth-token'),
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [courseId, lessonId]);

  const handleOpenModal = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
  };

  const handleCloseModal = () => {
    setSelectedExerciseId(null);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-blue-900 p-8 text-white text-center">Loading...</div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-blue-900 p-8 text-white text-center">{error}</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
        <h1 className="text-4xl font-bold text-center mb-8">แบบฝึกหัด</h1>
        {exercises.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">ลำดับ</th>
                  <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">ชื่อแบบฝึกหัด</th>
                  <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">รายละเอียด</th>
                  <th className="px-6 py-3 border-b text-xl text-gray-800 text-center">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((exercise, index) => (
                  <tr key={exercise.id}>
                    <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                    <td className="px-6 py-4 border-b">{exercise.title}</td>
                    <td className="px-6 py-4 border-b">{exercise.description}</td>
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        onClick={() => handleOpenModal(exercise.id)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                      >
                        เริ่มทำแบบฝึกหัด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">ไม่พบแบบฝึกหัด</p>
        )}
      {selectedExerciseId && (
        <ExerciseModal
          courseId={courseId}
          lessonId={lessonId}
          exerciseId={selectedExerciseId}
          onClose={handleCloseModal}
        />
      )}
    </StudentLayout>
  );
};

export default StudentExercises;
