/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import config from '../../../features/config';
import { setCustomerData } from '../../../store/slices/customer/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../pages/Loader';
import { useForm } from 'react-hook-form';
import Button from '../../Button';

const ITEMS_PER_PAGE = 200; // Adjust as needed

function Mycustomers() {

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [newCustomerData, setNewCustomerData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [customerName, setCustomerName] = useState('')

  const [isCustomerCreated, setIsCustomerCreated] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1); // Pagination state

  const filteredCustomers = newCustomerData; // No filtering needed in this case
    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length);
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const customerData = useSelector(state => state.customers.customerData)
  const dispatch = useDispatch()
  // console.log(customerData)

  const fetchCustomers = async () => {
    setError('')
    try {
      const data = await config.fetchAllCustomers()
      if (data) {
        setNewCustomerData(data.data)
        dispatch(setCustomerData(data.data));
      }
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (id, name) => {
    setCustomerId(id)
    setIsEdit(true)
    setCustomerName(name)
    // console.log(id)
  }




  const handleUpdateCustomer = async (data) => {
    console.log(data);
    setIsLoading(true)

    console.log("Raw Data:", data);

    // Filter out empty string values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    console.log("Cleaned Data:", cleanedData);

    try {
      const response = await config.updateCustomer(cleanedData);
      if (response) {
        setSuccessMessage(response.message)
        console.log("comp res: ", response.message)
        setIsLoading(false)
        setIsCustomerCreated(true)
        reset()
      }
    } catch (error) {
      console.log("error updating customer:", error)
    }
  };


  useEffect(() => {
    fetchCustomers()
  }, [isEdit])

  return !isEdit ? (!isLoading ? (
    <div className='bg-white rounded-lg'>
      <h2 className="text-lg text-center font-semibold py-4">All Customers</h2>
      {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}
      <div className="overflow-auto max-h-72 mb-4 scrollbar-thin rounded">
        <table className="min-w-full bg-white border text-xs">
          <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
            <tr>
              <th className="py-2 px-1 text-left">S No.</th>
              <th className="py-2 px-1 text-left">Customer Name</th>
              <th className="py-2 px-1 text-left">Receivables</th>
              <th className="py-2 px-1 text-left">Last Order</th>
              <th className="py-2 px-1 text-left">Customer flag</th>
              <th className="py-2 px-1 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers && paginatedCustomers?.map((customer, index) => (
              <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="py-1 px-2">{index + 1}</td>
                <td className="py-1 px-2">{customer.customerName}</td>
                <td className="py-1 px-2">{0}</td>
                <td className="py-1 px-2">25/3/2024</td>
                <td className="py-1 px-2">{customer.customerFlag}<span className={`h-10 w-20  bg-${customer.customerFlag}-500`}></span></td>
                <td className="py-1 px-2">
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full"
                    onClick={() => handleEdit(customer._id, customer.customerName)}
                  >Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 text-sm">
                        <Button
                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>

                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>

                        <Button
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
    </div>
  ) : <Loader message="Loading Data Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />)
    :
    <div className='w-full px-8 flex items-center'>
      {isCustomerCreated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center relative">
            <span className='absolute top-0 pt-1 right-2'>
              <button className='hover:text-red-700' onClick={() => setIsCustomerCreated(false)}>&#10008;</button>
            </span>
            <h2 className="text-lg font-thin p-4">{successMessage}</h2>
          </div>
        </div>
      )}
      <div className="w-5/6 px-16 max-w-md mx-auto py-10 bg-white rounded shadow-lg">
        <span className='absolute right-80 mr-2 top-20'>
          <button className='hover:text-red-700' onClick={() => setIsEdit(false)}>&#10008;</button>
        </span>
        <h2 className="text-lg text-center font-semibold">Update Customer</h2>
        <h2 className="text-m text-center mb-3">{customerName}</h2>

        <form onSubmit={handleSubmit(handleUpdateCustomer)} className='w-full'>
          <div className="space-y-2 text-xs">

            <div className="flex items-center">
              <label className="w-40">Customer ID: <span className='text-red-500 pr-2'>*</span></label>
              <input
                type="hidden"
                value={customerId}
                {...register('customerId', { required: true })}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Customer Name: </label>
              <input
                type="text"
                {...register('customerName')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">NTN Number:</label>
              <input
                type="text"
                {...register('ntnNumber')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Mobile No:</label>
              <input
                type="text"
                {...register('mobileNo')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Phone No:</label>
              <input
                type="text"
                {...register('phoneNo')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Fax No:</label>
              <input
                type="text"
                {...register('faxNo')}
                className="border p-1 rounded w-full"
              />
            </div>


            <div className="flex items-center">
              <label className="w-40">Email:</label>
              <input
                type="email"
                {...register('email')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">CNIC:</label>
              <input
                type="text"
                {...register('cnic')}
                className="border p-1 rounded w-full"
              />
            </div>
            <div className="flex items-center">
              <label className="w-40">Region:</label>
              <input
                type="text"
                {...register('customerRegion')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Customer Flag:</label>
              <select
                {...register('customerFlag')}
                className={`border p-1  rounded w-full`}
              >
                {/* <option value="">Select Flag</option> */}
                <option className='bg-red-500 text-white text-center' value="red">Red</option>
                <option className='bg-green-500 text-white text-center' value="green">Green</option>
                <option className='bg-yellow-500 text-center text-white' value="yellow">Yellow</option>
                <option className='bg-white  text-center' value="white">White</option>
              </select>
            </div>
          </div>

          <div className="mt-4 w-full flex justify-center">

            <div
              className="w-full flex justify-center pt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                  Loading...
                </div>
              ) : (
                <Button
                  type="submit"
                  className={`px-24 `}
                >Update Customer</Button>

              )}
            </div>

          </div>
        </form>
      </div>
    </div>


}

export default Mycustomers