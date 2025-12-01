/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import config from '../../../features/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UpdateConfirmation from '../../UpdateConfirmation'
import SuccessResponseMessage from '../../SuccessResponseMessage'
import ErrorResponseMessage from '../../ErrorResponseMessage';
import Button from '../../Button';
import functions from '../../../features/functions';

const ITEMS_PER_PAGE = 200;

// --- Dummy Account Receivables Data ---
const dummyReceivablesData = {
  accountReceivables: [
    {
      _id: "rec_001",
      bill: {
        _id: "bill_001",
        billNo: "BILL-0001",
        createdAt: new Date(2024, 0, 5).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 45000,
        paidAmount: 15000,
        flatDiscount: 0,
        dueDate: new Date(2024, 1, 5).toISOString(),
        salesPerson: { firstname: "Ahmad", lastname: "Hassan" }
      },
      customer: {
        _id: "cust_001",
        customerName: "Ahmed Enterprises",
        customerRegion: "Islamabad"
      }
    },
    {
      _id: "rec_002",
      bill: {
        _id: "bill_002",
        billNo: "BILL-0002",
        createdAt: new Date(2024, 0, 6).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 12500,
        paidAmount: 6250,
        flatDiscount: 500,
        dueDate: new Date(2024, 1, 6).toISOString(),
        salesPerson: { firstname: "Ali", lastname: "Khan" }
      },
      customer: {
        _id: "cust_002",
        customerName: "Blue Sky Trading",
        customerRegion: "Karachi"
      }
    },
    {
      _id: "rec_003",
      bill: {
        _id: "bill_003",
        billNo: "BILL-0003",
        createdAt: new Date(2024, 0, 7).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 68000,
        paidAmount: 0,
        flatDiscount: 2000,
        dueDate: new Date(2024, 1, 7).toISOString(),
        salesPerson: { firstname: "Fatima", lastname: "Ahmed" }
      },
      customer: {
        _id: "cust_003",
        customerName: "Tech Solutions Ltd",
        customerRegion: "Lahore"
      }
    },
    {
      _id: "rec_004",
      bill: {
        _id: "bill_004",
        billNo: "BILL-0004",
        createdAt: new Date(2024, 0, 8).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 35000,
        paidAmount: 17500,
        flatDiscount: 1000,
        dueDate: new Date(2024, 1, 8).toISOString(),
        salesPerson: { firstname: "Muhammad", lastname: "Rizvi" }
      },
      customer: {
        _id: "cust_004",
        customerName: "General Store",
        customerRegion: "Rawalpindi"
      }
    },
    {
      _id: "rec_005",
      bill: {
        _id: "bill_005",
        billNo: "BILL-0005",
        createdAt: new Date(2024, 0, 9).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 95000,
        paidAmount: 0,
        flatDiscount: 5000,
        dueDate: new Date(2024, 1, 9).toISOString(),
        salesPerson: { firstname: "Hassan", lastname: "Malik" }
      },
      customer: {
        _id: "cust_005",
        customerName: "City Mart",
        customerRegion: "Peshawar"
      }
    },
    {
      _id: "rec_006",
      bill: {
        _id: "bill_006",
        billNo: "BILL-0006",
        createdAt: new Date(2024, 0, 10).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 28000,
        paidAmount: 14000,
        flatDiscount: 0,
        dueDate: new Date(2024, 1, 10).toISOString(),
        salesPerson: { firstname: "Zara", lastname: "Nasir" }
      },
      customer: {
        _id: "cust_006",
        customerName: "Premium Supplies",
        customerRegion: "Quetta"
      }
    },
    {
      _id: "rec_007",
      bill: {
        _id: "bill_007",
        billNo: "BILL-0007",
        createdAt: new Date(2024, 0, 11).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 52000,
        paidAmount: 0,
        flatDiscount: 1500,
        dueDate: new Date(2024, 1, 11).toISOString(),
        salesPerson: { firstname: "Salman", lastname: "Farooq" }
      },
      customer: {
        _id: "cust_007",
        customerName: "Global Traders",
        customerRegion: "Faisalabad"
      }
    },
    {
      _id: "rec_008",
      bill: {
        _id: "bill_008",
        billNo: "BILL-0008",
        createdAt: new Date(2024, 0, 12).toISOString(),
        billStatus: "unpaid",
        isPosted: false,
        totalAmount: 78000,
        paidAmount: 39000,
        flatDiscount: 2500,
        dueDate: new Date(2024, 1, 12).toISOString(),
        salesPerson: { firstname: "Noor", lastname: "Hussain" }
      },
      customer: {
        _id: "cust_008",
        customerName: "Bright Business Co",
        customerRegion: "Islamabad"
      }
    },
  ]
};

const AccountReceivables = () => {
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bill, setBill] = useState(null);
  const [totalReceivables, setTotalReceivables] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSuccessMessageOpen, setSuccessMessageOpen] = useState(false);
  const [isErrorMessageOpen, setErrorMessageOpen] = useState(false);

  const navigate = useNavigate();

  const { primaryPath } = useSelector((state) => state.auth)

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(receivables.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, receivables.length);
  const paginatedReceivables = receivables.slice(startIndex, endIndex);

  const handleConfirm = () => {
    posting()
    setIsConfirmationOpen(false);
  };

  // --- Dummy Post Bill Handler (Replaces API call) ---
  const posting = async () => {
    setSuccessMessageOpen(false)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mark bill as posted in dummy data
      const updatedReceivables = receivables.map(rec => {
        if (rec.bill.billNo === bill.billNo) {
          return {
            ...rec,
            bill: { ...rec.bill, isPosted: true }
          };
        }
        return rec;
      });

      // Filter out posted bills
      const unpostedReceivables = updatedReceivables.filter(rec => !rec.bill.isPosted && rec.bill.billStatus !== 'paid');
      setReceivables(unpostedReceivables);
      
      // Recalculate total
      calculateTotal(unpostedReceivables);
      
      setSuccessMessageOpen(true)
    } catch (error) {
      setErrorMessageOpen(true)
    }
  }

  // Calculate total receivables
  const calculateTotal = (data) => {
    const billsWithoutPosted = data.filter(
      (item) => item.bill.isPosted !== true
    );

    const total = billsWithoutPosted.reduce(
      (sum, item) => sum + ((item?.bill?.totalAmount - item?.bill?.paidAmount - item?.bill?.flatDiscount) || 0),
      0
    );
    setTotalReceivables(total);
  };

  // --- Dummy Data Fetcher (Replaces API call) ---
  const fetchReceivables = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = dummyReceivablesData.accountReceivables;
      
      // Filter out paid and posted bills
      const unpostedReceivables = data.filter(rec => !rec.bill.isPosted && rec.bill.billStatus !== 'paid');
      setReceivables(unpostedReceivables);

      calculateTotal(unpostedReceivables);
    } catch (err) {
      setError('Failed to fetch account receivables');
    } finally {
      setLoading(false);
    }
  };

  const handleBillPayment = (billNo) => {
    navigate(`/${primaryPath}/sales/bill-payment/${billNo}`);
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

  const viewBill = (billId) => {
    navigate(`/${primaryPath}/sales/view-bill/${billId}`);
  }

  // Fetch account receivables on component mount
  useEffect(() => {
    fetchReceivables();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading account receivables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded shadow-md text-xs">
      <UpdateConfirmation
        isOpen={isConfirmationOpen}
        onCancel={() => {
          setBill(null)
          setIsConfirmationOpen(false)
        }}
        onConfirm={handleConfirm}
        message="Are you sure you want to post this Bill? This action cannot be undone."
      />

      <SuccessResponseMessage
        isOpen={isSuccessMessageOpen}
        onClose={() => {
          setBill(null)
          setSuccessMessageOpen(false)
        }}
        message="Bill Posted successfully!"
      />

      <ErrorResponseMessage
        isOpen={isErrorMessageOpen}
        onClose={() => {
          setBill(null)
          setErrorMessageOpen(false)
        }}
        errorMessage="An error has occurred while posting the bill"
      />
      <h2 className="text-xl font-bold mb-4 text-center">Account Receivables</h2>
      <div className="overflow-x-auto border rounded-lg shadow-lg max-h-72">
        <table className="min-w-full bg-white border text-xs">
          <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
            <tr>
              <th className="py-2 px-1 ">#</th>
              <th className="py-2 px-1 ">Customer Name</th>
              <th className="py-2 px-1 ">Bill No</th>
              <th className="py-2 px-1 ">Bill Date</th>
              <th className="px-1 py-2 ">Sales Person</th>
              <th className="px-1 py-2 ">Outstanding Balance</th>
              <th className="px-1 py-2">Due Date</th>
              <th className="px-1 py-2">City</th>
              <th className="px-1 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReceivables.filter((receivable) =>
              receivable.bill?.billStatus !== 'paid' && !receivable.bill?.isPosted).map((receivable, index) => (

                <React.Fragment key={receivable.bill.billNo}>
                  <tr
                    key={index}
                    onClick={() => viewBill(receivable.bill.billNo)}
                    className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <td className="py-2 px-2 text-center">{index + 1}</td>
                    <td className="py-2 px-2 text-center">
                      {receivable?.customer?.customerName || 'N/A'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {receivable.bill.billNo || 'N/A'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {
                        receivable.bill.createdAt &&
                        getDate(receivable.bill.createdAt)
                      }
                    </td>
                    <td className="py-2 px-2 text-center">
                      {receivable.bill.salesPerson.firstname + " " + receivable.bill.salesPerson.lastname || 'N/A'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {functions.formatAsianNumber(receivable.bill.totalAmount - receivable.bill.paidAmount - receivable.bill.flatDiscount) || '0.00'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {receivable.bill.dueDate ? getDate(receivable.bill.dueDate).slice(0, 12) : 'N/A'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {receivable.customer?.customerRegion || 'N/A'}
                    </td>
                    <td className="py-1 px-2 text-center ">
                      <button
                        className="hover:bg-green-600 border border-green-600 text-green-600 hover:text-white py-1 px-2 rounded-full "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBillPayment(receivable.bill.billNo)
                        }
                        }
                      >Add Payment</button>
                      <span> </span>
                      <button
                        className="hover:bg-red-600 border border-red-600 text-red-600 hover:text-white py-1 px-2 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBill(receivable.bill)
                          setIsConfirmationOpen(true)
                        }}
                      >Post</button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <Button
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <div className="w-full text-sm flex justify-end mt-3">
        <div className="border p-2 rounded">
          <label className="block mb-1">Total Outstanding Balance:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={functions.formatAsianNumber(totalReceivables)}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default AccountReceivables;