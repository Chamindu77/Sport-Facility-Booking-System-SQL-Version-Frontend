
import React, { useState } from 'react';
import { FaMoneyBill, FaRunning } from 'react-icons/fa';
import EquipmentModal from './EquipmentModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const EquipmentCard = ({ equipment, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [updatedEquipment, setUpdatedEquipment] = useState(equipment || {}); 

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleSave = (updatedDetails) => {
    setUpdatedEquipment(updatedDetails); 
    setModalOpen(false); 
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this equipment?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/v1/equipment/${equipment._id}`, {
          headers: { 'x-auth-token': token }
        });
        toast.success('Equipment deleted successfully!');
        
        setTimeout(() => {
          onDelete(equipment._id);     
            
        }, 1000); 
        window.location.reload();
      } catch (err) {
        toast.error(`Error deleting equipment: ${err.message}`);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/v1/equipment/toggle/${equipment._id}`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      setUpdatedEquipment(response.data);
      toast.success(updatedEquipment?.isActive ? 'Equipment deactivated successfully!' : 'Equipment activated successfully!');
    } catch (err) {
      toast.error(`Error toggling equipment status: ${err.message}`);
    }
  };

  const imageSrc = updatedEquipment?.image || '/path/to/default-image.jpg';

  return (
    <>
      <div className={`bg-white p-4 rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:scale-105 ${updatedEquipment?.isActive ? '' : 'opacity-50'}`}>
        <img
          src={imageSrc}
          alt={updatedEquipment?.equipmentName || 'Equipment Image'}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />

        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{updatedEquipment?.equipmentName || 'Unknown Equipment'}</h3>
          <p className={`text-md mr-2 font-bold ${updatedEquipment?.isActive ? 'text-teal-600' : 'text-red-600'}`}>
            {updatedEquipment?.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaRunning className="mr-2 text-sky-600" />
          <p className="text-lg">Sport: {updatedEquipment?.sportName || 'N/A'}</p>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaMoneyBill className="mr-2 text-green-500" />
          <p className="text-base">Rent Per Day: Rs. {updatedEquipment?.rentPrice || '0'}</p>
        </div>

        <div className="flex space-x-4">
          <button className="bg-teal-700 text-white flex-1 py-2 rounded-lg hover:bg-teal-800 transition duration-300" onClick={handleEdit}>
            Update
          </button>

          <button className={`${updatedEquipment?.isActive ? 'bg-slate-500' : 'bg-sky-800'} text-white flex-1 py-2 rounded-lg hover:${updatedEquipment?.isActive ? 'bg-gray-700' : 'bg-sky-900'} transition duration-300`} onClick={handleToggleStatus}>
            {updatedEquipment?.isActive ? 'Deactivate' : 'Activate'}
          </button>

          <button className="bg-red-500 text-white flex-1 py-2 rounded-lg hover:bg-red-700 transition duration-300" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <EquipmentModal 
        equipment={updatedEquipment}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default EquipmentCard;
