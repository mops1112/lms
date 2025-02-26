// components/WordSelector.jsx
import React from "react";

const WordSelector = ({ words, onSelect, selectedWordIds }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {words.map((word) => (
        <button
          key={word.value}
          onClick={() => onSelect(word)}
          className={`px-3 py-1 border rounded transition-colors duration-200 ${
            selectedWordIds.includes(word.value)
              ? "bg-green-200 text-green-900"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {word.label}
        </button>
      ))}
    </div>
  );
};

export default WordSelector;
