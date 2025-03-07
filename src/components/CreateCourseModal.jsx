import React, { useState } from 'react';

function CreateCourseModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    onCreate({ title, description });
    onClose();
    setTitle('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 px-4">
      <div className="bg-blue-900 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">สร้างรายวิชา</h2>
        <div className="mb-4">
          <label className="block text-blue-200 mb-1">ชื่อรายวิชา</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ชื่อรายวิชา"
          />
        </div>
        <div className="mb-6">
          <label className="block text-blue-200 mb-1">คำอธิบาย</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="คำอธิบาย"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate} 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition duration-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;
