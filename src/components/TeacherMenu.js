import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const TeacherMenu = () => {
  const treeData = [
    {
      title: 'Course',
      children: [
        {
          title: 'Lesson',
          children: [
            { title: 'Exercise' },
            { title: 'Test' }
          ]
        }
      ]
    }
  ];

  const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <li className="ml-4">
        <div
          className="flex items-center cursor-pointer hover:text-blue-500"
          onClick={() => setExpanded(!expanded)}
        >
          {hasChildren && (
            <span className="mr-1">
              {expanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          )}
          <span>{node.title}</span>
        </div>
        {hasChildren && expanded && (
          <ul className="mt-1">
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Teacher Menu</h2>
      <ul>
        {treeData.map((node, index) => (
          <TreeNode key={index} node={node} />
        ))}
      </ul>
    </div>
  );
};

export default TeacherMenu;
