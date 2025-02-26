import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TeacherLayout from '../../layouts/TeacherLayout';
import TestWordResultModal from '../../components/TestWordResultModal';

const Summary = () => {
  const { courseId } = useParams();
  const [summaryData, setSummaryData] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [selectedTestResultId, setSelectedTestResultId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem('x-auth-token');

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/courses/${courseId}/students`,
          { headers: { 'x-auth-token': token } }
        );

        if (!response.ok) throw new Error('Failed to fetch summary data');
        const data = await response.json();
        setSummaryData(data);

        // Extract unique students
        const studentMap = {};
        const lessonMap = {};

        data.forEach((entry) => {
          if (!studentMap[entry.studentId]) {
            studentMap[entry.studentId] = { id: entry.studentId, name: entry.studentName };
          }
          if (!lessonMap[entry.lessonId]) {
            lessonMap[entry.lessonId] = {
              id: entry.lessonId,
              title: entry.lessonTitle,
              tests: {},
            };
          }
          if (entry.testId) {
            lessonMap[entry.lessonId].tests[entry.testId] = {
              id: entry.testId,
              title: entry.testTitle,
            };
          }
        });

        setStudents(Object.values(studentMap));
        setLessons(Object.values(lessonMap));

        // Map test results
        const resultMap = {};
        data.forEach((entry) => {
          if (!entry.testId) return;
          if (!resultMap[entry.studentId]) {
            resultMap[entry.studentId] = {};
          }
          resultMap[entry.studentId][entry.testId] = {
            lessonId: entry.lessonId,
            lessonTitle: entry.lessonTitle,
            score: entry.score,
            totalScore: entry.totalScore,
            testResultId: entry.testResultId,
          };
        });

        setTestResults(resultMap);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching summary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [courseId]);

  const handleOpenModal = (testResultId) => {
    setSelectedTestResultId(testResultId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestResultId(null);
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="min-h-screen bg-blue-900 p-8 text-white text-center">
          Loading...
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="min-h-screen bg-blue-900 p-8 text-white text-center">
          {error}
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">สรุปแบบทดสอบ</h1>

        {/* Student Summary Table */}
        <table className="min-w-full bg-white rounded-lg shadow mb-12">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="py-2 px-4 border-r">ชื่อ</th>
              <th className="py-2 px-4 border-r">ชื่อบทเรียน</th>
              <th className="py-2 px-4 border-r">คะแนนแบทดสอบ</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) =>
              Object.keys(testResults[student.id] || {}).map((testId, index) => {
                const result = testResults[student.id][testId];
                return (
                  <tr key={`${student.id}-${testId}`} className="hover:bg-blue-100 transition">
                    {index === 0 && (
                      <td
                        rowSpan={Object.keys(testResults[student.id]).length}
                        className="py-2 px-4 border-r text-center font-semibold"
                      >
                        {student.name}
                      </td>
                    )}
                    <td className="py-2 px-4 border-r">{result.lessonTitle}</td>
                    <td className="py-2 px-4 border-r text-center">
                      {result.score} / {result.totalScore}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleOpenModal(result.testResultId)}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Test Word Result Modal */}
        {isModalOpen && <TestWordResultModal testResultId={selectedTestResultId} onClose={handleCloseModal} />}
      </div>
    </TeacherLayout>
  );
};

export default Summary;
