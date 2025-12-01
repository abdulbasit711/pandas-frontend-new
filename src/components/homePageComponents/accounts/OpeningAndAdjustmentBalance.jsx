import React, { useState, useEffect } from 'react';
import config from '../../../features/config';
import Button from '../../Button';
import Input from '../../Input';
import ErrorResponseMessage from '../../ErrorResponseMessage';
import SuccessResponseMessage from '../../SuccessResponseMessage';
import Loader from '../../../pages/Loader';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

// Dummy data for accounts with subcategories and individual accounts
const dummyAccountsData = [
  {
    _id: 'acc_001',
    accountName: 'Assets',
    description: 'Asset accounts',
    subCategories: [
      {
        _id: 'sub_001',
        subCategoryName: 'Current Assets',
        individualAccounts: [
          { _id: 'ind_001', individualAccountName: 'Cash in Hand', accountNumber: '1010', balance: 150000 },
          { _id: 'ind_002', individualAccountName: 'Bank Account - Primary', accountNumber: '1020', balance: 500000 },
          { _id: 'ind_003', individualAccountName: 'Accounts Receivable', accountNumber: '1030', balance: 200000 },
        ]
      },
      {
        _id: 'sub_002',
        subCategoryName: 'Fixed Assets',
        individualAccounts: [
          { _id: 'ind_004', individualAccountName: 'Building', accountNumber: '1110', balance: 1000000 },
          { _id: 'ind_005', individualAccountName: 'Equipment', accountNumber: '1120', balance: 300000 },
        ]
      }
    ]
  },
  {
    _id: 'acc_002',
    accountName: 'Liabilities',
    description: 'Liability accounts',
    subCategories: [
      {
        _id: 'sub_003',
        subCategoryName: 'Current Liabilities',
        individualAccounts: [
          { _id: 'ind_006', individualAccountName: 'Accounts Payable', accountNumber: '2010', balance: 100000 },
          { _id: 'ind_007', individualAccountName: 'Short-term Loan', accountNumber: '2020', balance: 50000 },
        ]
      },
      {
        _id: 'sub_004',
        subCategoryName: 'Long-term Liabilities',
        individualAccounts: [
          { _id: 'ind_008', individualAccountName: 'Long-term Loan', accountNumber: '2110', balance: 500000 },
        ]
      }
    ]
  },
  {
    _id: 'acc_003',
    accountName: 'Equity',
    description: 'Equity and capital accounts',
    subCategories: [
      {
        _id: 'sub_005',
        subCategoryName: 'Capital',
        individualAccounts: [
          { _id: 'ind_009', individualAccountName: 'Paid-up Capital', accountNumber: '3010', balance: 1000000 },
          { _id: 'ind_010', individualAccountName: 'Retained Earnings', accountNumber: '3020', balance: 350000 },
        ]
      }
    ]
  }
];

const OpeningAndAdjustmentBalance = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [individualAccounts, setIndividualAccounts] = useState([]);

  const [adjustFormData, setAdjustFormData] = useState({ accountId: '', reason: '', debit: 0, credit: 0 });
  const [closeFormData, setCloseFormData] = useState({ accountId: '' });
  const [openFormData, setOpenFormData] = useState({ accountId: '', amount: '' });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use dummy data instead of API call
        setAccounts(dummyAccountsData);
        setSubCategories(dummyAccountsData.flatMap(acc => acc.subCategories || []));
        setIndividualAccounts(dummyAccountsData.flatMap(acc => acc.subCategories?.flatMap(sub => sub.individualAccounts) || []));
      } catch (error) {
        console.error("Failed fetching accounts: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, endpoint, formData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create dummy response based on endpoint
      const dummyResponse = {
        data: {
          _id: `balance_${Date.now()}`,
          accountId: formData.accountId,
          endpoint: endpoint,
          timestamp: new Date().toISOString(),
          message: `${endpoint.charAt(0).toUpperCase() + endpoint.slice(1).replace(/-/g, ' ')} completed successfully`
        }
      };
      
      setSuccess(dummyResponse.data.message || 'Operation successful');
      
      // Reset form based on endpoint
      if (endpoint === 'adjust-account-balance') {
        setAdjustFormData({ accountId: '', reason: '', debit: 0, credit: 0 });
      } else if (endpoint === 'close-account-balance') {
        setCloseFormData({ accountId: '' });
      } else if (endpoint === 'open-account-balance') {
        setOpenFormData({ accountId: '', amount: '' });
      }
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts..." />
  ) : (
    <div className="p-6 bg-white grid grid-cols-3 gap-6">
      {/* Adjust Account Balance */}
      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Adjust Account Balance</h2>
        {error &&
          <ErrorResponseMessage
            isOpen={error}
            onClose={() => {
              setError("")
            }}
            errorMessage={error} />
        }
        {success &&
          <SuccessResponseMessage
            message={success}
            isOpen={success}
            onClose={() => {
              setSuccess("")
            }}
          />
        }
        <form onSubmit={(e) => handleSubmit(e, 'adjust-account-balance', adjustFormData)} className="space-y-4">
          <select
            name="accountId"
            value={adjustFormData.accountId}
            onChange={(e) => handleChange(e, setAdjustFormData)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Account</option>
            {individualAccounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.individualAccountName}</option>
            ))}
          </select>
          <Input
            label="Debit"
            type='number'
            name="debit"
            placeholder="Debit"
            value={adjustFormData.debit}
            onChange={(e) => handleChange(e, setAdjustFormData)}
            className="w-full p-2 border rounded-md"
          />
          <Input
            label="Credit"
            type='number'
            name="credit"
            placeholder="Credit"
            value={adjustFormData.credit}
            onChange={(e) => handleChange(e, setAdjustFormData)}
            className="w-full p-2 border rounded-md"
          />
          <Input
            label="Reason"
            type="text"
            name="reason"
            placeholder="Enter Reason"
            value={adjustFormData.reason}
            onChange={(e) => handleChange(e, setAdjustFormData)}
            className="w-full p-2 border rounded-md"
          />
          <div className="flex justify-end">
            <Button className='px-2' type="submit">Adjust</Button>
          </div>
        </form>
      </div>

      {/* Close Account Balance */}
      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Close Account Balance</h2>
        {error &&
          <ErrorResponseMessage
            isOpen={error}
            onClose={() => {
              setError("")
            }}
            errorMessage={error} />
        }
        {success &&
          <SuccessResponseMessage
            message={success}
            isOpen={success}
            onClose={() => {
              setSuccess("")
            }}
          />
        }
        <form onSubmit={(e) => handleSubmit(e, 'close-account-balance', closeFormData)} className="space-y-4">
          <select
            name="accountId"
            value={closeFormData.accountId}
            onChange={(e) => handleChange(e, setCloseFormData)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Account to Close</option>
            {individualAccounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.individualAccountName}</option>
            ))}
          </select>
          <div className="flex justify-end">
            <Button className='px-2' type="submit">Close</Button>
          </div>
        </form>
      </div>

      {/* Open Account Balance */}
      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Open Account Balance</h2>
        {error &&
          <ErrorResponseMessage
            isOpen={error}
            onClose={() => {
              setError("")
            }}
            errorMessage={error} />
        }
        {success &&
          <SuccessResponseMessage
            message={success}
            isOpen={success}
            onClose={() => {
              setSuccess("")
            }}
          />
        }
        <form onSubmit={(e) => handleSubmit(e, 'open-account-balance', openFormData)} className="space-y-4" >
          <select
            name="accountId"
            value={openFormData.accountId}
            onChange={(e) => handleChange(e, setOpenFormData)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Account</option>
            {individualAccounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.individualAccountName}</option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={openFormData.amount}
            onChange={(e) => handleChange(e, setOpenFormData)}
            required
            className="w-full p-2 border rounded-md"
          />
          <div className="flex justify-end">
            <Button className='px-2' type="submit">Open</Button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default OpeningAndAdjustmentBalance;