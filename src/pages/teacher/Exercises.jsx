import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash,FaLanguage  } from 'react-icons/fa';
import CreateExerciseModal from '../../components/CreateExerciseModal';
import EditExerciseModal from '../../components/EditExerciseModal';
import AddExerciseQuestionModal from '../../components/AddExerciseQuestionModal';
import TeacherLayout from '../../layouts/TeacherLayout';

function Exercises() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // State สำหรับ modal เพิ่มคำ (exercise question)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedExerciseForQuestion, setSelectedExerciseForQuestion] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem('x-auth-token');
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lessons/${lessonId}/exercises`,
          { headers: { 'x-auth-token': token } }
        );
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    if (lessonId) {
      fetchExercises();
    }
  }, [lessonId]);

  const handleExerciseClick = (exerciseId) => {
    navigate(`/teacher/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/tests`);
  };

  const handleDeleteExercise = async (exerciseId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Are you sure you want to delete this exercise?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${exerciseId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );
      if (response.ok) {
        setExercises(exercises.filter(ex => ex.id !== exerciseId));
      } else {
        console.error('Failed to delete exercise');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleEditExercise = (exercise, e) => {
    e.stopPropagation();
    setSelectedExercise(exercise);
    setIsEditModalOpen(true);
  };

  const handleSaveExercise = async (updatedExercise) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${updatedExercise.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(updatedExercise),
        }
      );
      if (response.ok) {
        setExercises(
          exercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
        );
      } else {
        console.error('Failed to update exercise');
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleCreateExercise = async (newExercise) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            title: newExercise.title,
            description: newExercise.description,
            lessonId,
          }),
        }
      );
      if (response.ok) {
        const createdExercise = await response.json();
        setExercises([...exercises, createdExercise]);
      } else {
        console.error('Failed to create exercise');
      }
    } catch (error) {
      console.error('Error creating exercise:', error);
    }
  };

  // ฟังก์ชันสำหรับเปิด modal เพิ่มคำ (exercise question)
  const handleAddWords = (exercise, e) => {
    e.stopPropagation();
    setSelectedExerciseForQuestion(exercise);
    setIsQuestionModalOpen(true);
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto px-6 py-8 bg-blue-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-blue-900">Exercises</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-md shadow-lg transition duration-200"
          >
            <FaPlus size={18} className="text-white" />
            <span className="font-semibold">Create New Exercise</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blue-200 rounded-lg shadow">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 border-r border-blue-700">Title</th>
                <th className="py-3 px-4 border-r border-blue-700">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-blue-700">
                    No exercises available.
                  </td>
                </tr>
              ) : (
                exercises.map(exercise => (
                  <tr
                    key={exercise.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleExerciseClick(exercise.id)}
                  >
                    <td className="py-3 px-4 border-r border-blue-200">{exercise.title}</td>
                    <td className="py-3 px-4 border-r border-blue-200">{exercise.description}</td>
                    <td className="py-3 px-4 text-right">
                    <button
    className="mr-2 text-purple-500 hover:text-purple-600 transition-colors duration-200"
    onClick={(e) => handleAddWords(exercise, e)}
  >
    <FaLanguage size={20} />
  </button>
                      <button
                        className="mr-2 text-green-500 hover:text-green-600 transition-colors duration-200"
                        onClick={(e) => handleEditExercise(exercise, e)}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        onClick={(e) => handleDeleteExercise(exercise.id, e)}
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
      <EditExerciseModal
        exercise={selectedExercise}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveExercise}
      />
      <CreateExerciseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateExercise}
        lessonId={lessonId}
      />
      <AddExerciseQuestionModal
        exerciseId={selectedExerciseForQuestion ? selectedExerciseForQuestion.id : null}
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={() => setIsQuestionModalOpen(false)}
      />
    </TeacherLayout>
  );
}

export default Exercises;
