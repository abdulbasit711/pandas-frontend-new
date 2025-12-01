/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import config from '../../../features/config';
import Button from '../../Button';
import ErrorResponseMessage from '../../ErrorResponseMessage';
import SuccessResponseMessage from '../../SuccessResponseMessage';
import Loader from '../../../pages/Loader';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

const CustomerJournalEntry = () => {
    // Dummy Customer Accounts Data
    const dummyCustomerAccounts = [
        {
            _id: "cust_001",
            individualAccountName: "ABC Corp",
            customerId: "cust_001",
        },
        {
            _id: "cust_002",
            individualAccountName: "XYZ Ltd",
            customerId: "cust_002",
        },
        {
            _id: "cust_003",
            individualAccountName: "Tech Solutions",
            customerId: "cust_003",
        },
        {
            _id: "cust_004",
            individualAccountName: "New Customer A",
            customerId: "cust_004",
        },
        {
            _id: "cust_005",
            individualAccountName: "New Customer B",
            customerId: "cust_005",
        },
        {
            _id: "cust_006",
            individualAccountName: "Global Enterprises",
            customerId: "cust_006",
        },
        {
            _id: "cust_007",
            individualAccountName: "Prime Solutions Inc",
            customerId: "cust_007",
        },
        {
            _id: "cust_008",
            individualAccountName: "Outstanding Client A",
            customerId: "cust_008",
        },
    ];

    const [customerAccounts, setCustomerAccounts] = useState([]);
    const [formData, setFormData] = useState({
        customerAccountId: '',
        amount: '',
        description: '',
        details: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCustomerAccounts = async () => {
            try {
                setLoading(true);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Use dummy data instead of API call
                setCustomerAccounts(dummyCustomerAccounts);
                
            } catch (err) {
                console.error("Error fetching customer accounts:", err);
                const errorMessage = extractErrorMessage(err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerAccounts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        console.log('formData', formData)
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Validate form data
            if (!formData.customerAccountId || !formData.amount) {
                setError("Customer Account and Amount are required");
                setLoading(false);
                return;
            }

            // Find the selected customer account
            const selectedCustomer = dummyCustomerAccounts.find(acc => acc._id === formData.customerAccountId);
            
            // Create dummy response object
            const dummyResponse = {
                data: {
                    _id: `customer_entry_${Date.now()}`,
                    customerAccountId: formData.customerAccountId,
                    customerAccountName: selectedCustomer?.individualAccountName,
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    details: formData.details,
                    createdAt: new Date().toISOString(),
                    status: "recorded",
                    credit: parseFloat(formData.amount)
                },
                message: "Customer journal entry recorded successfully!"
            };

            if (dummyResponse.data) {
                setSuccess("Customer journal entry recorded successfully!");
                setFormData({
                    customerAccountId: '',
                    amount: '',
                    description: '',
                    details: '',
                });
            } else {
                setError(dummyResponse.message || "Failed to record customer journal entry.");
            }
        } catch (err) {
            console.error("Error recording customer journal entry:", err);
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return loading ? (
        <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Customer Accounts..." />
    ) : (
        <div className="p-4 bg-white border rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Customer Journal Entry</h2>
            {error && <p className='text-red-600'>{error}</p>}
            {success && <p className='text-green-600'>{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="customerAccountId" className="block text-sm font-medium text-gray-700">
                        Customer Account:
                    </label>
                    <select
                        id="customerAccountId"
                        name="customerAccountId"
                        value={formData.customerAccountId}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="">Select a customer</option>
                        {customerAccounts.map((account) => (
                            <option key={account._id} value={account._id}>
                                {account.individualAccountName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional):
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                        Details:
                    </label>
                    <textarea
                        id="details"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        
                    />
                </div>

                <div className="mt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Record Entry'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CustomerJournalEntry;