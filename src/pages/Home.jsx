import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('x-auth-token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Adjust property names based on your token's payload.
        setRole(decoded.user.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleGoMainMenu = () => {
    if (role === 'teacher') {
      navigate('/teacher/courses');
    } else {
      navigate('/student/courses');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mt-8 text-center">
        Welcome to LMS
      </h1>
      <img
        src="https://blog.esc13.net/wp-content/uploads/2019/03/GettyImages-486325400-1-1104x621.jpeg"
        alt="Welcome"
        className="rounded mt-4 max-w-full sm:max-w-md shadow-lg"
      />
      <div className="mt-8 w-full flex flex-col sm:flex-row justify-center items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleGoMainMenu}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition duration-200 w-full sm:w-auto"
          >
            Go to Main Menu
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/login">
              <button className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition duration-200 w-full sm:w-auto">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition duration-200 w-full sm:w-auto">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Home;
