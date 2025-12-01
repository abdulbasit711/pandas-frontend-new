/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import config from '../../../features/config';
import Button from '../../Button';
import ErrorResponseMessage from '../../ErrorResponseMessage';
import SuccessResponseMessage from '../../SuccessResponseMessage';
import Loader from '../../../pages/Loader';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

const ExpenseEntry = () => {
    // Dummy Expense Accounts Data
    const dummyExpenseAccounts = [
        {
            _id: "exp_001",
            accountName: "Office Supplies",
        },
        {
            _id: "exp_002",
            accountName: "Utilities",
        },
        {
            _id: "exp_003",
            accountName: "Transportation",
        },
        {
            _id: "exp_004",
            accountName: "Rent",
        },
        {
            _id: "exp_005",
            accountName: "Salaries",
        },
        {
            _id: "exp_006",
            accountName: "Maintenance",
        },
        {
            _id: "exp_007",
            accountName: "Marketing",
        },
        {
            _id: "exp_008",
            accountName: "Insurance",
        },
    ];

    const [expenseAccounts, setExpenseAccounts] = useState([]);
    const [formData, setFormData] = useState({
        accountId: '',
        amount: '',
        description: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchExpenseAccounts = async () => {
            try {
                setLoading(true);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Use dummy data instead of API call
                setExpenseAccounts(dummyExpenseAccounts);
                
            } catch (err) {
                console.error("Error fetching expense accounts:", err);
                const errorMessage = extractErrorMessage(err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenseAccounts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Validate form data
            if (!formData.accountId || !formData.amount) {
                setError("Account and Amount are required");
                setLoading(false);
                return;
            }

            // Find the selected account name
            const selectedAccount = dummyExpenseAccounts.find(acc => acc._id === formData.accountId);
            
            // Create dummy response object
            const dummyResponse = {
                data: {
                    _id: `expense_${Date.now()}`,
                    accountId: formData.accountId,
                    accountName: selectedAccount?.accountName,
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    createdAt: new Date().toISOString(),
                    status: "recorded"
                },
                message: "Expense recorded successfully!"
            };

            if (dummyResponse.data) {
                setSuccess("Expense recorded successfully!");
                setFormData({
                    accountId: '',
                    amount: '',
                    description: '',
                });
            } else {
                setError(dummyResponse.message || "Failed to record expense.");
            }
        } catch (err) {
            console.error("Error recording expense:", err);
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return loading ? 
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts...." />
    : (
        <div className="p-4 bg-white border rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Expense Entry</h2>
            {error && <p className='text-red-600'>{error}</p> }
            {success && <SuccessResponseMessage message={success} />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Expense Account:
                    </label>
                    <select
                        id="accountId"
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="">Select an account</option>
                        {expenseAccounts.map((account) => (
                            <option key={account._id} value={account._id}>
                                {account.accountName}
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
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Record Expense'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseEntry;