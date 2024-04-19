import React, { useState } from 'react';
import { Button } from 'carbon-components-react';
import ModalForm from './ModalForm';
import DataTable from './DataTable';
import './App.css';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData1, setFormData1] = useState<string[][]>([]);
  const [formData2, setFormData2] = useState<string[][]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formType, setFormType] = useState<number>(1); // To track which form is being used

  const openModal = (
    editIndex: number | null = null,
    formType: number = 1
  ) => {
    setIsModalOpen(true);
    setEditIndex(editIndex);
    setFormType(formType);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
  };

  const handleFormSubmit = (data: string[]) => {
    if (editIndex !== null) {
      if (formType === 1) {
        const newData = [...formData1];
        newData[editIndex] = data;
        setFormData1(newData);
      } else {
        const newData = [...formData2];
        newData[editIndex] = data;
        setFormData2(newData);
      }
    } else {
      if (formType === 1) {
        setFormData1([...formData1, data]);
      } else {
        setFormData2([...formData2, data]);
      }
    }
    closeModal();
  };

  const handleEdit = (index: number) => {
    openModal(index, formType);
  };

  const handleDelete = (index: number) => {
    if (formType === 1) {
      const newData = [...formData1];
      newData.splice(index, 1);
      setFormData1(newData);
    } else {
      const newData = [...formData2];
      newData.splice(index, 1);
      setFormData2(newData);
    }
  };

  return (
    <div className="app">
      <Button onClick={() => openModal()}>Open Modal Form 1</Button>
      <Button onClick={() => openModal(null, 2)}>Open Modal Form 2</Button>
      {isModalOpen && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          editData={editIndex !== null ? (formType === 1 ? formData1[editIndex] : formData2[editIndex]) : undefined}
        />
      )}
      {formData1.length>0 && (
        <div>
        <h2>Entered Data for Form 1</h2>
        <DataTable data={formData1} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      )}
      {formData2.length>0 && (
        <div>
        <h2>Entered Data for Form 2</h2>
        <DataTable data={formData2} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      ) }
      
    </div>
  );
};

export default App;
