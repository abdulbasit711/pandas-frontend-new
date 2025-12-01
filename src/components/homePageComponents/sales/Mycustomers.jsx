/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import config from '../../../features/config';
import { setCustomerData } from '../../../store/slices/customer/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../pages/Loader';
import { useForm } from 'react-hook-form';
import Button from '../../Button';
import ErrorResponseMessage from '../../ErrorResponseMessage';
import ButtonLoader from '../../ButtonLoader';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import SuccessResponseMessage from '../../SuccessResponseMessage';

const ITEMS_PER_PAGE = 200;

// --- Dummy Customers Data ---
const dummyCustomersData = [
  {
    _id: "cust_001",
    customerName: "Ahmed Enterprises",
    mobileNo: "03001234567",
    phoneNo: "051-1234567",
    faxNo: "051-1234568",
    email: "ahmed@enterprise.com",
    cnic: "12345-6789123-4",
    ntnNumber: "1234567",
    customerRegion: "Islamabad",
    customerFlag: "red",
    createdAt: new Date(2024, 0, 5).toISOString(),
    totalRemainingPayableAmount: 45000
  },
  {
    _id: "cust_002",
    customerName: "Blue Sky Trading",
    mobileNo: "03109876543",
    phoneNo: "021-2345678",
    faxNo: "021-2345679",
    email: "bluesky@trading.com",
    cnic: "98765-4321098-7",
    ntnNumber: "7654321",
    customerRegion: "Karachi",
    customerFlag: "green",
    createdAt: new Date(2024, 0, 10).toISOString(),
    totalRemainingPayableAmount: 12500
  },
  {
    _id: "cust_003",
    customerName: "Tech Solutions Ltd",
    mobileNo: "03214567890",
    phoneNo: "042-5678901",
    faxNo: "042-5678902",
    email: "tech@solutions.com",
    cnic: "55555-5555555-5",
    ntnNumber: "5555555",
    customerRegion: "Lahore",
    customerFlag: "yellow",
    createdAt: new Date(2024, 0, 15).toISOString(),
    totalRemainingPayableAmount: 68000
  },
  {
    _id: "cust_004",
    customerName: "General Store",
    mobileNo: "03008765432",
    phoneNo: "061-9876543",
    faxNo: "061-9876544",
    email: "general@store.com",
    cnic: "11111-1111111-1",
    ntnNumber: "1111111",
    customerRegion: "Rawalpindi",
    customerFlag: "white",
    createdAt: new Date(2024, 0, 20).toISOString(),
    totalRemainingPayableAmount: 35000
  },
  {
    _id: "cust_005",
    customerName: "City Mart",
    mobileNo: "03123456789",
    phoneNo: "031-3456789",
    faxNo: "031-3456790",
    email: "city@mart.com",
    cnic: "22222-2222222-2",
    ntnNumber: "2222222",
    customerRegion: "Peshawar",
    customerFlag: "red",
    createdAt: new Date(2024, 0, 25).toISOString(),
    totalRemainingPayableAmount: 52000
  },
  {
    _id: "cust_006",
    customerName: "Premium Supplies",
    mobileNo: "03334567890",
    phoneNo: "033-4567890",
    faxNo: "033-4567891",
    email: "premium@supplies.com",
    cnic: "33333-3333333-3",
    ntnNumber: "3333333",
    customerRegion: "Quetta",
    customerFlag: "green",
    createdAt: new Date(2024, 1, 5).toISOString(),
    totalRemainingPayableAmount: 88000
  },
  {
    _id: "cust_007",
    customerName: "Global Traders",
    mobileNo: "03006789012",
    phoneNo: "041-6789012",
    faxNo: "041-6789013",
    email: "global@traders.com",
    cnic: "44444-4444444-4",
    ntnNumber: "4444444",
    customerRegion: "Faisalabad",
    customerFlag: "yellow",
    createdAt: new Date(2024, 1, 10).toISOString(),
    totalRemainingPayableAmount: 42000
  },
  {
    _id: "cust_008",
    customerName: "Bright Business Co",
    mobileNo: "03119012345",
    phoneNo: "051-9012345",
    faxNo: "051-9012346",
    email: "bright@business.com",
    cnic: "66666-6666666-6",
    ntnNumber: "6666666",
    customerRegion: "Islamabad",
    customerFlag: "white",
    createdAt: new Date(2024, 1, 15).toISOString(),
    totalRemainingPayableAmount: 78000
  },
];

function Mycustomers() {

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [showDeleteMessage, setShowDeleteMessage] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState('')
  const [newCustomerData, setNewCustomerData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [deleteId, setDeleteId] = useState('')
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  const [isCustomerCreated, setIsCustomerCreated] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');


  const filteredCustomers = newCustomerData.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.customerName?.toLowerCase().includes(term) ||
      customer.mobileNo?.toLowerCase().includes(term) ||
      customer.customerRegion?.toLowerCase().includes(term)
    );
  });

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

  const dispatch = useDispatch()

  // --- Dummy Data Fetcher (Replaces API call) ---
  const fetchCustomers = async () => {
    setError('')
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNewCustomerData(dummyCustomersData);
      dispatch(setCustomerData(dummyCustomersData));
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
    }
  }

  // --- Dummy Delete Handler (Replaces API call) ---
  const handleDeleteCustomer = async (customerId, customerName) => {
    setError('')
    setSuccessMessage('')
    setDeleteId(customerId)
    const message = `Are you sure you want to delete this customer? \nThis action is permanent and will also remove the customer's linked ledger account.\nThis cannot be undone.`;
    const confirmDelete = window.confirm(message);

    if (!confirmDelete) return;

    setIsDeleteLoading(true)

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove customer from dummy data
      const updatedCustomers = newCustomerData.filter(c => c._id !== customerId);
      setNewCustomerData(updatedCustomers);
      dispatch(setCustomerData(updatedCustomers));
      
      setSuccessMessage(`Customer "${customerName}" deleted successfully!`)
      setShowSuccessMessage(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      const msg = extractErrorMessage(error) || 'Error deleting customer'
      setDeleteMessage(msg)
      setShowDeleteMessage(true)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const handleEdit = (customer) => {
    setCustomerId(customer._id);
    setIsEdit(true);
    setCustomerName(customer.customerName);

    reset({
      customerId: customer._id,
      customerName: customer.customerName || "",
      ntnNumber: customer.ntnNumber || "",
      mobileNo: customer.mobileNo || "",
      phoneNo: customer.phoneNo || "",
      faxNo: customer.faxNo || "",
      email: customer.email || "",
      cnic: customer.cnic || "",
      customerRegion: customer.customerRegion || "",
      customerFlag: customer.customerFlag || "white"
    });
  };

  const getDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // --- Dummy Update Handler (Replaces API call) ---
  const handleUpdateCustomer = async (data) => {
    setIsLoading(true)

    // Filter out empty string values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update customer in dummy data
      const updatedCustomers = newCustomerData.map(c => 
        c._id === customerId 
          ? { ...c, ...cleanedData }
          : c
      );
      
      setNewCustomerData(updatedCustomers);
      dispatch(setCustomerData(updatedCustomers));
      
      setSuccessMessage(`Customer "${cleanedData.customerName || customerName}" updated successfully!`)
      setIsLoading(false)
      setIsCustomerCreated(true)
      reset()
      
      // Auto close success modal and edit view after 2 seconds
      setTimeout(() => {
        setIsCustomerCreated(false);
        setIsEdit(false);
      }, 2000);
    } catch (error) {
      setError('Error updating customer')
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchCustomers()
  }, [])

  return !isEdit ? (!isLoading ? (
    <div className='bg-white rounded-lg'>
      <h2 className="text-lg text-center font-semibold py-4">All Customers</h2>
      {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

      <ErrorResponseMessage
        isOpen={showDeleteMessage}
        onClose={() => setShowDeleteMessage(false)}
        errorMessage={deleteMessage}
      />

      <SuccessResponseMessage
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        message={successMessage}
      />

      <div className="flex justify-between items-center mb-3 px-4">
        <input
          type="text"
          placeholder="Search by name, mobile no, or region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 w-1/2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-red-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-auto max-h-72 mb-4 scrollbar-thin rounded">
        <table className="min-w-full bg-white border text-xs">
          <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
            <tr>
              <th className="py-2 px-1 text-left">S No.</th>
              <th className="py-2 px-1 text-left">Customer Name</th>
              <th className="py-2 px-1 text-left">Mobile No</th>
              <th className="py-2 px-1 text-left">Customer Region</th>
              <th className="py-2 px-1 text-left">Customer flag</th>
              <th className="py-2 px-1 text-left">Created at</th>
              <th className="py-2 px-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers && paginatedCustomers?.map((customer, index) => (
              <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="py-1 px-2">{index + 1}</td>
                <td className="py-1 px-2">{customer.customerName}</td>
                <td className="py-1 px-2">{customer.mobileNo}</td>
                <td className="py-1 px-2">{customer.customerRegion}</td>
                <td className="py-1 px-2">{customer.customerFlag}<span className={`h-10 w-20  bg-${customer.customerFlag}-500`}></span></td>
                <td className="py-1 px-2">{customer.createdAt && getDate(customer.createdAt)}</td>
                <td className="py-1 px-2 flex gap-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-full"
                    onClick={() => handleDeleteCustomer(customer._id, customer.customerName)}
                  >{isDeleteLoading && customer._id === deleteId ? <ButtonLoader /> : 'Delete'}</button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded-full"
                    onClick={() => handleEdit(customer)}
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
                className={`border p-1 rounded w-full`}
              >
                <option className='bg-red-500 text-white text-center' value="red">Red</option>
                <option className='bg-green-500 text-white text-center' value="green">Green</option>
                <option className='bg-yellow-500 text-center text-white' value="yellow">Yellow</option>
                <option className='bg-white text-center' value="white">White</option>
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
                  className={`px-24`}
                >Update Customer</Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
}

export default Mycustomers