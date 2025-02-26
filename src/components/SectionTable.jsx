// components/SectionTable.jsx
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import AddWordsModal from './AddWordsModal';

const SectionTable = ({
  title,
  items,
  onAdd,         // Function to add a new item
  onEdit,        // Function to update an item
  onDelete,      // Function to delete an item
  lessonId,      // Received from parent; used for AddWordsModal
  addButtonLabel = 'Add',
  columns = ['ชื่อ', 'คำอธิบาย'], // Columns to display in the table
  createModalTitle = 'สร้างรายการใหม่',
  editModalTitle = 'แก้ไขรายการ',
  placeholderTitle = 'กรอกชื่อ',
  placeholderDescription = 'กรอกคำอธิบาย',
  addWordsModalProps = {}  // Additional props to pass to AddWordsModal
}) => {
  // State to control the Create, Edit, and AddWords modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddWordsModalOpen, setIsAddWordsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Handlers for Create Modal
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCreate = (newItem) => {
    onAdd(newItem);
    setIsCreateModalOpen(false);
  };

  // Handlers for Edit Modal
  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleEdit = (updatedItem) => {
    onEdit(updatedItem);
    setIsEditModalOpen(false);
  };

  // Handlers for AddWords Modal
  const handleOpenAddWordsModal = (item) => {
    setSelectedItem(item);
    setIsAddWordsModalOpen(true);
  };
  const handleCloseAddWordsModal = () => setIsAddWordsModalOpen(false);

  return (
    <section className="mb-12">
      {/* Header with section title and create button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition duration-200"
        >
          <FaPlus className="mr-2" />
          <span>{addButtonLabel}</span>
        </button>
      </div>
      {/* Data Table */}
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-blue-800 text-white">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="py-2 px-4 border-r">
                {col}
              </th>
            ))}
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4">
                No {title.toLowerCase()} available.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50">
                <td className="py-2 px-4 border-r">{item.title}</td>
                <td className="py-2 px-4 border-r">{item.description}</td>
                <td className="py-2 px-4 flex justify-end space-x-2">
                  {/* Always show the "Add Words" button */}
                  <button
                    onClick={() => handleOpenAddWordsModal(item)}
                    className="text-blue-500 hover:text-blue-600 transition duration-200"
                  >
                    <FaPlusCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="text-green-500 hover:text-green-600 transition duration-200"
                  >
                    <FaEdit size={20} />
                  </button>
                  
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-600 transition duration-200"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreate={handleCreate}
        modalTitle={createModalTitle}
        placeholderTitle={placeholderTitle}
        placeholderDescription={placeholderDescription}
      />
      {/* Edit Modal */}
      <EditModal
        item={selectedItem}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleEdit}
        modalTitle={editModalTitle}
      />
      {/* Add Words Modal */}
      <AddWordsModal
        isOpen={isAddWordsModalOpen}
        onClose={handleCloseAddWordsModal}
        onSave={() => {
          if (addWordsModalProps.onSave) {
            addWordsModalProps.onSave();
          }
          handleCloseAddWordsModal();
        }}
        {...addWordsModalProps}
        contentId={selectedItem ? selectedItem.id : null}  // Pass the selected item's id as contentId
        lessonId={lessonId}
      />
    </section>
  );
};

export default SectionTable;
