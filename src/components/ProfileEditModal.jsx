import React, { useState, useEffect } from "react";

const ProfileEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setPassword(""); // Reset password field
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("x-auth-token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/user/${user.id}`,
        {
          method: "PUT",
          headers: { "x-auth-token": localStorage.getItem("x-auth-token") , "Content-Type": "application/json",},
          body: JSON.stringify({
            name,
            password: password ? password : undefined,
          })
          
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        onSave(name); // Update UI
        onClose(); // Close modal
      } else {
        console.error("Error updating profile:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
          แก้ไขโปรไฟล์
        </h2>

        {/* Email (non-editable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            อีเมล
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Role (non-editable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            บทบาท
          </label>
          <input
            type="text"
            value={user.role}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Name (Editable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            ชื่อ
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Password (Editable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            รหัสผ่านใหม่ (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
