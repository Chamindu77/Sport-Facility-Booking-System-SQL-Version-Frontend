import React, { useState } from 'react';
import { FaMapMarkerAlt, FaMoneyBill } from 'react-icons/fa';
import FacilityModal from './FacilityModal';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const SportCard = ({ facility, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [updatedFacility, setUpdatedFacility] = useState(facility);

  const getFacilityLabel = (category) => {
    switch (category) {
      case 'Indoor Games':
        return 'Court No';
      case 'Outdoor Games':
        return 'Ground No';
      case 'Aquatic Sports':
        return 'Pool No';
      default:
        return 'Facility No';
    }
  };

  
  const handleBookNow = () => {
    setModalOpen(true);
  };

  
  const handleSave = (updatedDetails) => {
    setUpdatedFacility(updatedDetails);
    setModalOpen(false);
  };

 
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this facility?');
    
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token'); 
        await axios.delete(`http://localhost:5000/api/v1/facilities/${facility.facilityId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        
        toast.success('Facility deleted successfully!');
        
        
        setTimeout(() => {
          
        onDelete(facility._id);
          
        }, 3000);
        window.location.reload();
       
      } catch (err) {
        toast.error(`Error deleting facility: ${err.message}`); 
      }
    } else {
      toast.info('Deletion canceled'); 
    }
  };

  
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/v1/facilities/toggle/${facility.facilityId}`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setUpdatedFacility(response.data); 
      toast.success(
        updatedFacility.isActive ? 'Facility deactivated successfully!' : 'Facility activated successfully!'
      );
    } catch (err) {
      toast.error(`Error toggling facility status: ${err.message}`);
    }
  };

  return (
    <>
      <div className={`bg-white p-4 rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:scale-105 ${updatedFacility.isActive ? '' : 'opacity-50'}`}>
        <img
          src={updatedFacility.image}
          alt={updatedFacility.sportName}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />

       
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{updatedFacility.sportName}</h3>

         
          <p className={`text-md mr-2 font-bold ${updatedFacility.isActive ? 'text-teal-600' : 'text-red-600'}`}>
            {updatedFacility.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-2 text-sky-600" />
          <p className="text-lg">{`${getFacilityLabel(updatedFacility.sportCategory)}: ${updatedFacility.courtNumber}`}</p>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaMoneyBill className="mr-2 text-green-500" />
          <p className="text-base">{`Hourly Booking Fee : Rs. ${updatedFacility.courtPrice}`}</p>
        </div>

        
        <div className="flex space-x-4">
          {/* Update button */}
          <button
            className="bg-teal-700 text-white flex-1 py-2 rounded-lg hover:bg-teal-800 transition duration-300"
            onClick={handleBookNow}
          >
            Update
          </button>

          {/* Toggle Active/Deactivate button */}
          <button
            className={`${
              updatedFacility.isActive ? 'bg-slate-500 ' : 'bg-sky-800'
            } text-white flex-1 py-2 rounded-lg hover:${
              updatedFacility.isActive ? 'bg-gray-700 ' : 'bg-sky-900'
            } transition duration-300`}
            onClick={handleToggleStatus}
          >
            {updatedFacility.isActive ? 'Deactivate' : 'Activate'}
          </button>

          {/* Delete button */}
          <button
            className="bg-red-500 text-white flex-1 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal for updating facility */}
      <FacilityModal
        facility={updatedFacility}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default SportCard;
