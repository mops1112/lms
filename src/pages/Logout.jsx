import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // ลบ token จาก localStorage
    localStorage.removeItem('x-auth-token');
    // นำผู้ใช้กลับไปยังหน้า Home หรือ Login
    navigate('/');
  }, [navigate]);

  return null;
}

export default Logout;
