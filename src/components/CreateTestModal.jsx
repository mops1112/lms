import React, { useState } from 'react';

function CreateTestModal({ isOpen, onClose, onCreate, lessonId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    onCreate({ title, description, lessonId });
    onClose();
    // Reset fields
    setTitle('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-blue-900 p-8 rounded-lg shadow-xl w-1/3">
        <h2 className="text-3xl font-bold text-white mb-6">Create Test</h2>
        <div className="mb-4">
          <label className="block text-blue-200 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter test title"
            className="w-full px-4 py-2 rounded bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-blue-200 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter test description"
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

export default CreateTestModal;
