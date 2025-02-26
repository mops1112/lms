import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CreateTestModal from '../../components/CreateTestModal';
import EditTestModal from '../../components/EditTestModal';
import AddTestQuestionModal from '../../components/AddTestQuestionModal';
import TeacherLayout from '../../layouts/TeacherLayout';

function Tests() {
  // Retrieve lessonId and exerciseId from URL parameters
  const { lessonId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // State for the modal that adds test questions
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedTestForQuestion, setSelectedTestForQuestion] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      const token = localStorage.getItem('x-auth-token');
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercises/${exerciseId}/tests`,
          { headers: { 'x-auth-token': token } }
        );
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    if (exerciseId) {
      fetchTests();
    }
  }, [exerciseId]);

  const handleTestClick = (testId) => {
    // Navigate to test details page (if exists)
    navigate(`/teacher/tests/${testId}`);
  };

  const handleDeleteTest = async (testId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Are you sure you want to delete this test?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${testId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );
      if (response.ok) {
        setTests(tests.filter(test => test.id !== testId));
      } else {
        console.error('Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleEditTest = (test, e) => {
    e.stopPropagation();
    setSelectedTest(test);
    setIsEditModalOpen(true);
  };

  const handleSaveTest = async (updatedTest) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${updatedTest.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          // Send data using keys: title, description, and exerciseId
          body: JSON.stringify(updatedTest),
        }
      );
      if (response.ok) {
        setTests(tests.map(test => test.id === updatedTest.id ? updatedTest : test));
      } else {
        console.error('Failed to update test');
      }
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const handleCreateTest = async (newTest) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          // Send data using keys: title, description, and exerciseId
          body: JSON.stringify({
            title: newTest.title,
            description: newTest.description,
            exerciseId
          }),
        }
      );
      if (response.ok) {
        const createdTest = await response.json();
        setTests([...tests, createdTest]);
      } else {
        console.error('Failed to create test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  // Function to open modal for adding test questions
  const handleAddTestQuestions = (test, e) => {
    e.stopPropagation();
    setSelectedTestForQuestion(test);
    setIsQuestionModalOpen(true);
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto px-6 py-8 bg-blue-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-blue-900">Tests</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-md shadow-lg transition duration-200"
          >
            <FaPlus size={18} className="text-white" />
            <span className="font-semibold">Create New Test</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          {tests.length === 0 ? (
            <p className="text-center text-blue-700">No tests available.</p>
          ) : (
            <table className="min-w-full bg-white border border-blue-200 rounded-lg shadow">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="py-3 px-4 border-r border-blue-700">Title</th>
                  <th className="py-3 px-4 border-r border-blue-700">Description</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr
                    key={test.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    // onClick={() => handleTestClick(test.id)}
                  >
                    <td className="py-3 px-4 border-r border-blue-200">{test.title}</td>
                    <td className="py-3 px-4 border-r border-blue-200">{test.description}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="mr-2 text-purple-500 hover:text-purple-600 transition-colors duration-200"
                        onClick={(e) => handleAddTestQuestions(test, e)}
                      >
                        Add Questions
                      </button>
                      <button
                        className="mr-2 text-green-500 hover:text-green-600 transition-colors duration-200"
                        onClick={(e) => handleEditTest(test, e)}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        onClick={(e) => handleDeleteTest(test.id, e)}
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <EditTestModal
        test={selectedTest}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTest}
      />
      <CreateTestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTest}
        lessonId={lessonId}
      />
      <AddTestQuestionModal
        testId={selectedTestForQuestion ? selectedTestForQuestion.id : null}
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={() => setIsQuestionModalOpen(false)}
      />
    </TeacherLayout>
  );
}

export default Tests;
