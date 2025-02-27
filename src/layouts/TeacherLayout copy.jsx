import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Install using: npm install jwt-decode

const TeacherLayout = ({ children }) => {
  const [user, setUser] = useState({ username: 'Guest', role: 'Teacher' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('x-auth-token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (decoded.exp < currentTime) {
          // Token has expired, log out the user
          console.warn('Token expired. Logging out...');
          localStorage.removeItem('x-auth-token');
          navigate('/login'); // Redirect to login page
        } else {
          // Token is still valid, set user details
          setUser({
            name: decoded.user.name,
            role: decoded.user.role,
            email: decoded.user.email,
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('x-auth-token'); // Ensure token is removed if invalid
        navigate('/login');
      }
    } else {
      navigate('/login'); // If no token, force login
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('x-auth-token');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b border-blue-800 flex flex-col items-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/129/844/large_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
            alt="Profile"
            className="h-20 w-20 rounded-full mb-4 border-2 border-blue-700"
          />
          <h2 className="text-xl font-bold">{user.email}</h2>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-blue-300">{user.role}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6">
          <ul>
            <li className="mb-4">
              <Link
                to="/teacher/courses"
                className="block px-4 py-2 rounded hover:bg-blue-800 transition-colors duration-200"
              >
                รายวิชา
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full text-center px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors duration-200"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default TeacherLayout;
