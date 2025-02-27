// components/AddWordsModal.jsx
import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

const AddWordsModal = ({
  isOpen,
  onClose,
  onSave,             // Callback after successful save
  lessonId,           // For fetching all available words from lesson
  contentId,          // For fetching current words & updating (this is the entity's id)
  entityType = "content", // "content", "exercise", or "test"
  modalTitle = "เพิ่มคำ",
  availablePlaceholder = "Available words",
  currentPlaceholder = "Type or select words..."
}) => {
  const [availableWords, setAvailableWords] = useState([]);
  const [currentWords, setCurrentWords] = useState([]); // Array of { value, label }
  const token = localStorage.getItem("x-auth-token");

  // Fetch available words from lesson endpoint every time modal opens
  useEffect(() => {
    const fetchAvailableWords = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/lesson/${lessonId}/contentwords`,
          { headers: { "x-auth-token": token } }
        );
        // Assuming response.data is an array of objects: { wordId, wordText }
        const opts = response.data.map(word => ({
          value: word.wordId,
          label: word.wordText
        }));
        setAvailableWords(opts);
      } catch (error) {
        console.error("Error fetching available words:", error);
      }
    };

    if (isOpen && lessonId) {
      fetchAvailableWords();
    }
  }, [isOpen, lessonId, token]);

  // Fetch current words for this entity using contentId
  useEffect(() => {
    const fetchCurrentWords = async () => {
      try {
        // Build the URL dynamically based on entityType.
        const url =
          entityType === "content"
            ? `${import.meta.env.VITE_API_BASE_URL}/api/teacher/content/${contentId}/contentwords`
            : entityType === "exercise"
            ? `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${contentId}/exercisewords`
            : `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${contentId}/testwords`;

        const response = await axios.get(url, {
          headers: { "x-auth-token": token }
        });
        // Assuming response.data is an array of objects: { wordId, wordText }
        const opts = response.data.map(word => ({
          value: word.wordId,
          label: word.wordText
        }));
        setCurrentWords(opts);
      } catch (error) {
        console.error("Error fetching current words:", error);
      }
    };

    if (isOpen && contentId) {
      fetchCurrentWords();
    }
  }, [isOpen, contentId, token, entityType]);

  // Handle change from CreatableSelect
  const handleChange = (newValue) => {
    setCurrentWords(newValue);
  };

  // When user clicks a word in the available words list, add it if not already selected.
  const handleSelectAvailableWord = (word) => {
    if (!currentWords.find(opt => opt.value === word.value)) {
      setCurrentWords([...currentWords, word]);
    }
  };

  // Handle saving: update the words via the API.
  const handleSubmit = async () => {
    try {
      // For each word in currentWords, if it has no value, create it.
      const wordIds = await Promise.all(
        currentWords.map(async (option) => {
          
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/teacher/word`,
              { text: option.label },
              {
                headers: {
                  "Content-Type": "application/json",
                  "x-auth-token": token,
                },
              }
            );
            return response.data.id;
          
        })
      );

      // Build update URL based on entityType.
      const updateUrl =
        entityType === "content"
          ? `${import.meta.env.VITE_API_BASE_URL}/api/teacher/content/${contentId}/contentwords`
          : entityType === "exercise"
          ? `${import.meta.env.VITE_API_BASE_URL}/api/teacher/exercise/${contentId}/exercisewords`
          : `${import.meta.env.VITE_API_BASE_URL}/api/teacher/test/${contentId}/testwords`;

      // Update the words for the entity.
      await axios.post(
        updateUrl,
        { wordIds },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("Error saving words:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 px-4">
      <div className="bg-blue-900 p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">{modalTitle}</h2>
        
        {/* Section 1: Display all available words */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">เลือกคำที่มีในบทเรียน</h3>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, index) => (
              <button
                key={`${word.value}-${index}`}
                onClick={() => handleSelectAvailableWord(word)}
                className="px-3 py-1 border rounded bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              >
                {word.label}
              </button>
            ))}
          </div>
        </div>
  
        {/* Section 2: Creatable select for current words */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">
            คำที่เลือกใช้ใน{entityType === "content" ? "แบบเรียน" : entityType === "exercise" ? "แบบฝึกหัด" : "แบบทดสอบ"}
          </h3>
          <CreatableSelect
            isMulti
            onChange={handleChange}
            options={availableWords}
            value={currentWords}
            placeholder={currentPlaceholder}
          />
        </div>
        
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default AddWordsModal;
