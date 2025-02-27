import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherCourses from './pages/teacher/Courses';
import StudentCourses from './pages/student/Courses';
import Lessons from './pages/teacher/Lessons';
import Summary from './pages/teacher/Summary';
// import Exercises from './pages/teacher/Exercises';
// import Tests from './pages/teacher/Tests';
import Contents from './pages/teacher/Contents';

import StudentLessons from './pages/student/Lessons';           // หน้ารายการบทเรียนสำหรับนักเรียน
import StudentLessonContent from './pages/student/Contents'; // หน้าสำหรับแสดงเนื้อหาบทเรียน
import StudentExercises from './pages/student/Exercises';         // หน้าทำแบบฝึกหัดสำหรับนักเรียน
// import StudentTests from './pages/student/Tests';                 // หน้าทดสอบสำหรับนักเรียน



import Logout from './pages/Logout';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/courses/:courseId/lessons" element={<Lessons />} />
        {/* <Route path="/teacher/courses/:courseId/lessons/:lessonId/exercises" element={<Exercises />} /> */}
        {/* <Route path="/teacher/courses/:courseId/lessons/:lessonId/exercises/:exerciseId/tests" element={<Tests />} /> */}
        <Route path="/teacher/courses/:courseId/lessons/:lessonId/contents" element={<Contents />} />
        <Route path="/teacher/courses/:courseId/summary" element={<Summary />} />

        {/* Routes สำหรับนักเรียน */}
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/courses/:courseId/lessons" element={<StudentLessons />} />
        <Route path="/student/courses/:courseId/lessons/:lessonId/contents" element={<StudentLessonContent />} />
        <Route path="/student/courses/:courseId/lessons/:lessonId/exercises" element={<StudentExercises />} />
        {/* <Route path="/student/courses/:courseId/lessons/:lessonId/tests" element={<StudentTests />} /> */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
      
    </Router>
  );
}

export default App;
