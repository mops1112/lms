import React, { useState, useEffect } from 'react';

function EditLessonModal({ lesson, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setContent(lesson.content);
    }
  }, [lesson]);

  const handleSave = () => {
    onSave({ ...lesson, title, content });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-blue-900 p-8 rounded-lg shadow-xl w-1/3">
        <h2 className="text-3xl font-bold text-white mb-6">แก้ไขบทเรียน</h2>
        <div className="mb-4">
          <label className="block text-blue-200 mb-1">ชื่อบทเรียน</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ชื่อบทเรียน"
            className="w-full px-4 py-2 rounded bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-blue-200 mb-1">คำอธิบาย</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="คำอธิบาย"
            className="w-full px-4 py-2 rounded bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onClick={handleSave} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLessonModal;
