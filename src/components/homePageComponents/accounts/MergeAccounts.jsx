import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import Loader from '../../../pages/Loader';

// Dummy data for accounts hierarchy
const dummyAccountsHierarchy = [
  {
    _id: 'acc_001',
    accountName: 'Assets',
    subCategories: [
      {
        _id: 'sub_001',
        accountSubCategoryName: 'Current Assets',
        individualAccounts: [
          { _id: 'ind_001', individualAccountName: 'Cash in Hand', accountBalance: 150000 },
          { _id: 'ind_002', individualAccountName: 'Bank Account - Primary', accountBalance: 500000 },
          { _id: 'ind_003', individualAccountName: 'Bank Account - Secondary', accountBalance: 250000 },
          { _id: 'ind_004', individualAccountName: 'Accounts Receivable', accountBalance: 200000 },
        ]
      },
      {
        _id: 'sub_002',
        accountSubCategoryName: 'Fixed Assets',
        individualAccounts: [
          { _id: 'ind_005', individualAccountName: 'Building', accountBalance: 1000000 },
          { _id: 'ind_006', individualAccountName: 'Building - Annex', accountBalance: 500000 },
          { _id: 'ind_007', individualAccountName: 'Equipment', accountBalance: 300000 },
          { _id: 'ind_008', individualAccountName: 'Furniture', accountBalance: 80000 },
        ]
      }
    ]
  },
  {
    _id: 'acc_002',
    accountName: 'Liabilities',
    subCategories: [
      {
        _id: 'sub_003',
        accountSubCategoryName: 'Current Liabilities',
        individualAccounts: [
          { _id: 'ind_009', individualAccountName: 'Accounts Payable', accountBalance: 100000 },
          { _id: 'ind_010', individualAccountName: 'Accounts Payable - Supplier 2', accountBalance: 75000 },
          { _id: 'ind_011', individualAccountName: 'Short-term Loan', accountBalance: 50000 },
          { _id: 'ind_012', individualAccountName: 'Interest Payable', accountBalance: 15000 },
        ]
      },
      {
        _id: 'sub_004',
        accountSubCategoryName: 'Long-term Liabilities',
        individualAccounts: [
          { _id: 'ind_013', individualAccountName: 'Long-term Loan', accountBalance: 500000 },
          { _id: 'ind_014', individualAccountName: 'Mortgage Payable', accountBalance: 750000 },
        ]
      }
    ]
  },
  {
    _id: 'acc_003',
    accountName: 'Equity',
    subCategories: [
      {
        _id: 'sub_005',
        accountSubCategoryName: 'Capital',
        individualAccounts: [
          { _id: 'ind_015', individualAccountName: 'Paid-up Capital', accountBalance: 1000000 },
          { _id: 'ind_016', individualAccountName: 'Retained Earnings', accountBalance: 350000 },
          { _id: 'ind_017', individualAccountName: 'Owner Drawing', accountBalance: -50000 },
        ]
      }
    ]
  }
];

const MergeAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [parentAccountName, setParentAccountName] = useState('');
    const [childAccountIds, setChildAccountIds] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [individualAccounts, setIndividualAccounts] = useState([]);
    const [existingParentAccountId, setExistingParentAccountId] = useState('');
    const [mergeOption, setMergeOption] = useState('new'); // 'new' or 'existing'

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Use dummy data instead of API call
                const accountsData = dummyAccountsHierarchy;
                setAccounts(accountsData);
        
                const allSubCategories = accountsData.flatMap((account) => account.subCategories || []);
                setSubCategories(allSubCategories);
        
                const allIndividualAccounts = allSubCategories.flatMap(
                    (subCategory) => subCategory.individualAccounts || []
                );
                setIndividualAccounts(allIndividualAccounts);
            } catch (error) {
                console.error("Failed fetching accounts: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const payload = {
                childAccountIds,
                ...(mergeOption === 'new' ? { parentAccountName } : { existingParentAccountId })
            };

            // Create dummy response
            const dummyResponse = {
                data: {
                    _id: `merged_${Date.now()}`,
                    message: 'Accounts merged successfully',
                    mergedAt: new Date().toISOString(),
                    parentAccountId: mergeOption === 'new' ? `new_acc_${Date.now()}` : existingParentAccountId,
                    childAccountIds: childAccountIds,
                    mergeType: mergeOption
                }
            };

            if (dummyResponse) {
                // Remove merged child accounts from the list
                setIndividualAccounts(
                    individualAccounts.filter(acc => !childAccountIds.includes(acc._id))
                );

                setParentAccountName('');
                setExistingParentAccountId('');
                setSubmitSuccess(true);
                setChildAccountIds([]);
                
                // Clear success message after 3 seconds
                setTimeout(() => setSubmitSuccess(false), 3000);
            }
        } catch (err) {
            setSubmitError(extractErrorMessage(err) || 'Failed to merge accounts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChildAccountChange = (e) => {
        const accountId = e.target.value;
        if (e.target.checked) {
            if (!childAccountIds.includes(accountId)) {
                setChildAccountIds([...childAccountIds, accountId]);
            }
        } else {
            setChildAccountIds(childAccountIds.filter((id) => id !== accountId));
        }
    };

    const isFormValid = () => {
        if (childAccountIds.length === 0) return false;
        
        if (mergeOption === 'new') {
            return parentAccountName.trim() !== '';
        } else {
            return existingParentAccountId !== '';
        }
    };

    return isLoading ? 
        <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts...." />
    : (
        <div className="p-4 bg-white rounded shadow text-xs">
            <h2 className="text-lg font-semibold mb-4">Merge Accounts</h2>

            {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
            {submitSuccess && <p className="text-green-500 mb-2">Accounts merged successfully!</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Merge Option:</label>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="mergeOption"
                            value="new"
                            checked={mergeOption === 'new'}
                            onChange={() => setMergeOption('new')}
                            className="mr-2"
                        />
                        Create New Parent Account
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="mergeOption"
                            value="existing"
                            checked={mergeOption === 'existing'}
                            onChange={() => setMergeOption('existing')}
                            className="mr-2"
                        />
                        Use Existing Parent Account
                    </label>
                </div>

                {mergeOption === 'new' ? (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parentAccount">
                            New Parent Account Name:
                        </label>
                        <Input 
                            type="text"
                            id="parentAccount"
                            name="parentAccountName"
                            placeholder="Enter new account name"
                            className="p-2"
                            value={parentAccountName}
                            onChange={(e) => setParentAccountName(e.target.value)}
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existingParent">
                            Select Existing Parent Account:
                        </label>
                        <select
                            id="existingParent"
                            className="w-full p-2 border rounded"
                            value={existingParentAccountId}
                            onChange={(e) => setExistingParentAccountId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {individualAccounts
                                .filter(account => !childAccountIds.includes(account._id)) // Exclude selected child accounts
                                .map((account) => (
                                    <option key={account._id} value={account._id}>
                                        {account.individualAccountName}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Accounts to Merge:
                </label>
                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                    {individualAccounts?.map((account) => (
                        <div key={account._id} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                id={`account-${account._id}`}
                                value={account._id}
                                className="mr-2"
                                onChange={handleChildAccountChange}
                                checked={childAccountIds.includes(account._id)}
                                disabled={existingParentAccountId === account._id}
                            />
                            <label htmlFor={`account-${account._id}`}>{account.individualAccountName}</label>
                        </div>
                    ))}
                </div>
            </div>

            <Button 
                className='px-2' 
                onClick={handleSubmit} 
                disabled={isLoading || !isFormValid()}
            >
                {isLoading ? 'Merging...' : 'Merge Accounts'}
            </Button>
        </div>
    );
};

export default MergeAccounts;