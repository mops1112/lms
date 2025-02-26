import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import ContentModal from '../../components/students/ContentModal';
import ExerciseModal from '../../components/students/ExerciseModal';
import TestModal from '../../components/students/TestModal';

function Contents() {
  const { courseId, lessonId } = useParams();
  const token = localStorage.getItem('x-auth-token');
  const [contents, setContents] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [tests, setTests] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const fetchData = async () => {
    try {
      const resContent = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/student/lessons/${lessonId}/contents`,
        { headers: { 'x-auth-token': token } }
      );
      if (!resContent.ok) throw new Error('Failed to fetch lesson data');
      const contentData = await resContent.json();
      setContents(contentData);
  
      const resExercise = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/student/lessons/${lessonId}/exercises`,
        { headers: { 'x-auth-token': token } }
      );
      if (!resExercise.ok) throw new Error('Failed to fetch exercises');
      const exerciseData = await resExercise.json();
      setExercises(exerciseData);
  
      const resTest = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/student/lessons/${lessonId}/tests`,
        { headers: { 'x-auth-token': token } }
      );
      if (!resTest.ok) throw new Error('Failed to fetch tests');
      const testData = await resTest.json();
      setTests(testData);
  
      // Fetch test results for all available tests
      testData.forEach((test) => fetchTestResult(test.id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [courseId, lessonId, token]);
  
  const fetchTestResult = async (testId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/testresults/${testId}`, {
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Failed to fetch test result');
      const results = await res.json();
      if (results.length > 0) {
        const latestResult = results[0]; // Assuming the first result is the most recent
        setTestResults((prev) => ({
          ...prev,
          [testId]: {
            score: latestResult.score,
            totalScore: latestResult.totalScore
          }
        }));
      }
    } catch (err) {
      console.error(`Error fetching test result for testId ${testId}:`, err);
    }
  };
  // Open/Close Content Modal
  const handleOpenContentModal = (contentId) => {
    setSelectedContentId(contentId);
    setIsContentModalOpen(true);
  };
  const handleCloseContentModal = () => {
    setIsContentModalOpen(false);
    setSelectedContentId(null);
  };

  // Open/Close Exercise Modal
  const handleOpenExerciseModal = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
    setIsExerciseModalOpen(true);
  };
  const handleCloseExerciseModal = () => {
    setIsExerciseModalOpen(false);
    setSelectedExerciseId(null);
  };

  // Open/Close Test Modal
  const handleOpenTestModal = (testId) => {
    setSelectedTestId(testId);
    setIsTestModalOpen(true);
  };
  const handleCloseTestModal = () => {
    setIsTestModalOpen(false);
    setSelectedTestId(null);
    fetchData();
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-blue-900 p-8 text-white text-center">
          Loading...
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-blue-900 p-8 text-white text-center">
          {error}
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="container mx-auto px-6 py-8">
        {/* <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Lesson Contents</h1> */}

        {/* Contents Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 text-left">แบบเรียน</h2>
          {contents.length === 0 ? (
            <p className="text-center text-gray-600">No contents available.</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-2 px-4 border-r">ชื่อ</th>
                  <th className="py-2 px-4">คำอธิบาย</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-blue-100 transition">
                    <td className="py-2 px-4 border-r">{content.title}</td>
                    <td className="py-2 px-4 border-r">{content.description}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleOpenContentModal(content.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
                      >
                        Start Content
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Exercises Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 text-left">แบบฝึกหัด</h2>
          {exercises.length === 0 ? (
            <p className="text-center text-gray-600">No exercises available.</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-2 px-4 border-r">ชื่อ</th>
                  <th className="py-2 px-4">คำอธิบาย</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex) => (
                  <tr key={ex.id} className="hover:bg-blue-100 transition">
                    <td className="py-2 px-4 border-r">{ex.title}</td>
                    <td className="py-2 px-4 border-r">{ex.description}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleOpenExerciseModal(ex.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
                      >
                        Start Exercise
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Tests Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 text-left">แบบทดสอบ</h2>
          {tests.length === 0 ? (
            <p className="text-center text-gray-600">No tests available.</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-2 px-4 border-r">ชื่อ</th>
                  <th className="py-2 px-4 border-r">คำอธิบาย</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-blue-100 transition">
                    <td className="py-2 px-4 border-r">{test.title}</td>
                    <td className="py-2 px-4 border-r">{test.description}</td>
                    <td className="py-2 px-4">
                      {testResults[test.id] ? (
                        <button
                          disabled
                          className="bg-gray-400 text-white py-1 px-3 rounded transition cursor-not-allowed"
                        >
                          {testResults[test.id].score} / {testResults[test.id].totalScore}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenTestModal(test.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
                        >
                          Start Test
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        

        {/* Modals */}
        {isContentModalOpen && <ContentModal contentId={selectedContentId} onClose={handleCloseContentModal} />}
        {isExerciseModalOpen && <ExerciseModal exerciseId={selectedExerciseId} onClose={handleCloseExerciseModal} />}
        {isTestModalOpen && <TestModal testId={selectedTestId} onClose={handleCloseTestModal} />}
      </div>
    </StudentLayout>
  );
}

export default Contents;
