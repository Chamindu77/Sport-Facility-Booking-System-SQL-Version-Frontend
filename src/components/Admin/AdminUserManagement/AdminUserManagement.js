import React, { useEffect, useState, useCallback } from 'react'
import { FaPlay, FaPowerOff } from 'react-icons/fa'
import axios from 'axios'
import AdminFooter from '../../Layout/AdminFooter'
import AdminNavbar from '../../Layout/AdminNavbar'

const Requests = () => {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [search, setSearch] = useState('')

  
  const token = localStorage.getItem('token')

  
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/user/all', {
        headers: {
          'x-auth-token': token,
        },
      })
      setRequests(res.data)
    } catch (err) {
      console.error('Error fetching users:', err.message)
    }
  }, [token]) 

  
  useEffect(() => {
    fetchUsers() 
  }, [fetchUsers])

  const toggleStatus = async (userId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/user/toggle/${userId}`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      )
      setRequests((prevRequests) =>
        prevRequests.map((user) =>
          user._id === userId ? { ...user, isActive: res.data.isActive } : user
        )
      )
    } catch (err) {
      console.error('Error toggling user status:', err.message)
    }
  }

  const filteredRequests = requests.filter((request) => {
    const status = request.isActive ? 'Active User' : 'Deactive User'
    const isStatusMatch = filter === 'All' || status === filter
    const isRoleMatch = roleFilter === 'All' || request.role === roleFilter
    const isSearchMatch = request.name.toLowerCase().includes(search.toLowerCase())
    const isNotAdmin = request.role !== 'Admin'

    return isStatusMatch && isRoleMatch && isSearchMatch && isNotAdmin
  })

  return (
    <div>
      <AdminNavbar />
      <div className="p-8 pt-4 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-teal-700 ">User Management</h1>

        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md w-1/6"
            placeholder="Search by Full Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 border border-gray-300 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active User">Active User</option>
            <option value="Deactive User">Deactive User</option>
          </select>

          <select
            className="p-2 border border-gray-300 rounded-md"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="User">Users</option>
            <option value="Coach">Coaches</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full max-w-6xl mx-auto bg-white border border-gray-300 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="text-left py-3 px-4 font-semibold text-base w-1/6 pl-8">User Id</th>
                <th className="text-left py-3 px-4 font-semibold text-base w-1/5">Full Name</th>
                <th className="text-left py-3 px-4 font-semibold text-base w-1/4">Email Address</th>
                <th className="text-left py-3 px-4 font-semibold text-base w-1/6">Role</th>
                <th className="text-left py-3 px-6 font-semibold text-base w-1/6">Status</th>
                <th className="text-left py-3 px-12 font-semibold text-base w-1/6 pr-8">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id} className="border-t border-gray-200 hover:bg-gray-100 transition duration-300">
                  <td className="py-4 px-4 whitespace-nowrap pl-8">{request._id}</td>
                  <td className="py-4 px-4">{request.name}</td>
                  <td className="py-4 px-4">{request.email}</td>
                  <td className="py-4 px-4">{request.role}</td>
                  <td className={`py-4 px-4 font-semibold ${request.isActive ? 'text-blue-700' : 'text-red-600'}`}>
                    {request.isActive ? 'Active User' : 'Deactive User'}
                  </td>
                  <td className="py-4 px-4 flex space-x-2 pr-8">
                    {request.isActive ? (
                      <button
                        className="flex justify-center items-center bg-sky-800 text-white text-xs px-4 py-2 rounded-2xl w-32 shadow-md hover:bg-sky-700"
                        onClick={() => toggleStatus(request._id)}
                      >
                        <FaPowerOff className="mr-2" /> DEACTIVATE
                      </button>
                    ) : (
                      <button
                        className="flex justify-center items-center bg-teal-600 text-white text-xs px-4 py-2 rounded-2xl w-32 shadow-md hover:bg-teal-500"
                        onClick={() => toggleStatus(request._id)}
                      >
                        <FaPlay className="mr-2" /> ACTIVATE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AdminFooter />
    </div>
  )
}

export default Requests
