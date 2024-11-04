import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchAvailableEquipment } from '../../../redux/actions/equipmentActions';
import AdminFooter from '../../Layout/AdminFooter';
import EquipmentList from './EquipmentList';
import AdminNavbar from '../../Layout/AdminNavbar';
import EquipmentModal from './EquipmentModal';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const EquipmentPage = ({ fetchAvailableEquipment, availableEquipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEquipment] = useState({
    equipmentName: '',
    sportName: '',
    rentPrice: '',
    image: '',
  });

  useEffect(() => {
    fetchAvailableEquipment(); 
  }, [fetchAvailableEquipment]);

  useEffect(() => {
    let filtered = availableEquipment;

    if (searchTerm) {
      filtered = filtered.filter((equipment) =>
        equipment.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSport) {
      filtered = filtered.filter((equipment) => equipment.sportName === selectedSport);
    }

    setFilteredEquipment(filtered); 
  }, [availableEquipment, searchTerm, selectedSport]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSportFilter = (e) => {
    setSelectedSport(e.target.value);
  };

  const handleAddNewEquipment = () => {
    setIsAddingNew(true);
    setModalOpen(true);
  };

  const handleSave = (equipmentDetails) => {
    if (isAddingNew) {
      console.log('New Equipment Added:', equipmentDetails);
    } else {
      console.log('Equipment Updated:', equipmentDetails);
    }
    setModalOpen(false);
    setIsAddingNew(false);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold ml-28 mt-4 text-teal-700">Equipment Management</h1>

        <div className="flex flex-row items-center mt-6 mb-6 ml-28">
          <button
            className="bg-sky-700 mr-12 text-white py-2 px-4 rounded-lg hover:bg-sky-800 transition duration-300"
            onClick={handleAddNewEquipment}
          >
            Add New Equipment
          </button>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search equipment by name..."
            className="p-2 border border-gray-300 rounded-lg w-1/4"
          />

          <select
            value={selectedSport}
            onChange={handleSportFilter}
            className="p-2 border border-gray-300 rounded-lg w-1/6 ml-4"
          >
            <option value="">All Sports</option>
            {[...new Set(availableEquipment.map((eq) => eq.sportName))].map((sport, index) => (
              <option key={index} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <EquipmentList filteredEquipment={filteredEquipment} />
        </div>
      </div>
      <AdminFooter />

      <ToastContainer />

      {isModalOpen && (
        <EquipmentModal
          equipment={isAddingNew ? newEquipment : null}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  availableEquipment: state.equipment.availableEquipment,
});

export default connect(mapStateToProps, { fetchAvailableEquipment })(EquipmentPage);
