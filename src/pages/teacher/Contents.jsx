// pages/teacher/Contents.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TeacherLayout from '../../layouts/TeacherLayout';
import SectionTable from '../../components/SectionTable';

function Contents() {
  const { lessonId, courseId } = useParams();
  const token = localStorage.getItem('x-auth-token');
  const [contents, setContents] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Content
        const resContent = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lessons/${lessonId}/contents`,
          { headers: { 'x-auth-token': token } }
        );
        const contentData = await resContent.json();
        setContents(contentData);

        // Fetch Exercises
        const resExercise = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lessons/${lessonId}/exercises`,
          { headers: { 'x-auth-token': token } }
        );
        const exerciseData = await resExercise.json();
        setExercises(exerciseData);

        // Fetch Tests
        const resTest = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lessons/${lessonId}/tests`,
          { headers: { 'x-auth-token': token } }
        );
        const testData = await resTest.json();
        setTests(testData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [lessonId, token]);

  // Utility function for deletion confirmation
  const generateRandomCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const confirmDeletion = () => {
    const code = generateRandomCode(6);
    const userInput = prompt(`กรอก "${code}" เพื่อลบรายการนี้`);
    return userInput === code;
  };

  // Create functions
  const handleAddContent = async (newItem) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ 
            title: newItem.title, 
            description: newItem.description,
            lessonId,
          }),
        }
      );
      if (response.ok) {
        const createdContent = await response.json();
        setContents([...contents, createdContent]);
      } else {
        console.error('Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleAddExercise = async (newItem) => {
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
            title: newItem.title, 
            description: newItem.description,
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

  const handleAddTest = async (newItem) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ 
            title: newItem.title, 
            description: newItem.description,
            lessonId,
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

  // Edit functions
  const handleEditContent = async (updatedItem) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/content/${updatedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(updatedItem),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setContents(contents.map(item => item.id === data.id ? data : item));
      } else {
        console.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleEditExercise = async (updatedItem) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${updatedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(updatedItem),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setExercises(exercises.map(item => item.id === data.id ? data : item));
      } else {
        console.error('Failed to update exercise');
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleEditTest = async (updatedItem) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${updatedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(updatedItem),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTests(tests.map(item => item.id === data.id ? data : item));
      } else {
        console.error('Failed to update test');
      }
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  // Delete functions with confirmation
  const handleDeleteContent = async (id) => {
    if (!confirmDeletion()) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/content/${id}`,
        {
          method: 'DELETE',
          headers: { 'x-auth-token': token },
        }
      );
      if (response.ok) {
        setContents(contents.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleDeleteExercise = async (id) => {
    if (!confirmDeletion()) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${id}`,
        {
          method: 'DELETE',
          headers: { 'x-auth-token': token },
        }
      );
      if (response.ok) {
        setExercises(exercises.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete exercise');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirmDeletion()) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${id}`,
        {
          method: 'DELETE',
          headers: { 'x-auth-token': token },
        }
      );
      if (response.ok) {
        setTests(tests.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto px-6 py-8">
        {/* <h1 className="text-4xl font-bold text-blue-900 mb-8">Course Contents</h1> */}
        <SectionTable
          title="แบบเรียน"
          items={contents}
          onAdd={handleAddContent}
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
          addButtonLabel="เพิ่มแบบเรียน"
          modalTitle="สร้างแบบเรียนใหม่"
          placeholderTitle="ชื่อแบบเรียน"
          placeholderDescription="คำอธิบายแบบเรียน"
          lessonId={lessonId}   // ส่งค่า lessonId จาก useParams
          addWordsModalProps={{
            fetchUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${lessonId}/contentwords`,
            newWordUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/word`,
            updateUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/content/${"CONTENT_ID"}/contentwords`,
            entityType: 'content'
            // "CONTENT_ID" จะถูกแทนที่ด้วยค่า contentId (selectedItem.id) ใน SectionTable
          }}
        />

        <SectionTable
          title="แบบฝึกหัด"
          items={exercises}
          onAdd={handleAddExercise}
          onEdit={handleEditExercise}
          onDelete={handleDeleteExercise}
          addButtonLabel="เพิ่มแบบฝึกหัด"
          modalTitle="สร้างแบบฝึกหัดใหม่"
          placeholderTitle="ชื่อแบบฝึกหัด"
          placeholderDescription="คำอธิบายแบบฝึกหัด"
          lessonId={lessonId}
          addWordsModalProps={{
            fetchUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${lessonId}/exercisewords`,
            newWordUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/word`,
            updateUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${"EXERCISE_ID"}/exercisewords`,
            entityType: 'exercise'
          }}
        />

        <SectionTable
          title="แบบทดสอบ"
          items={tests}
          onAdd={handleAddTest}
          onEdit={handleEditTest}
          onDelete={handleDeleteTest}
          addButtonLabel="เพิ่มแบบทดสอบ"
          modalTitle="สร้างแบบทดสอบใหม่"
          placeholderTitle="ชื่อแบบทดสอบ"
          placeholderDescription="คำอธิบายแบบทดสอบ"
          lessonId={lessonId}
          addWordsModalProps={{
            fetchUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${lessonId}/testwords`,
            newWordUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/word`,
            updateUrl: `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${"TEST_ID"}/testwords`,
            entityType: 'test'
          }}
        />
      </div>
    </TeacherLayout>
  );
}

export default Contents;
