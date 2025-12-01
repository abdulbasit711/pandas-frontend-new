import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import config from "../../../features/config";

// Dummy income statement data generator
const generateDummyIncomeStatement = (fromDate, toDate) => {
  // Realistic expense categories with varying amounts
  const expenses = [
    { accountId: 'exp_001', accountName: 'Salary & Wages', totalExpense: 200000 },
    { accountId: 'exp_002', accountName: 'Rent Expense', totalExpense: 50000 },
    { accountId: 'exp_003', accountName: 'Utilities', totalExpense: 25000 },
    { accountId: 'exp_004', accountName: 'Transportation', totalExpense: 35000 },
    { accountId: 'exp_005', accountName: 'Marketing & Advertising', totalExpense: 60000 },
    { accountId: 'exp_006', accountName: 'Office Supplies', totalExpense: 15000 },
    { accountId: 'exp_007', accountName: 'Depreciation', totalExpense: 20000 },
    { accountId: 'exp_008', accountName: 'Insurance', totalExpense: 18000 },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.totalExpense, 0);
  const revenue = 750000; // Realistic revenue amount
  const netProfit = revenue - totalExpenses;

  return {
    startDate: fromDate,
    endDate: toDate,
    revenue,
    expenses,
    totalExpenses,
    netProfit
  };
};

export default function IncomeStatement() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use dummy data instead of API call
      const dummyData = generateDummyIncomeStatement(fromDate, toDate);
      
      if (dummyData) {
        setData(dummyData);
      } else {
        setError("No data available for the selected range.");
        setData(null);
      }
    } catch (err) {
      console.error("Error fetching income statement:", err);
      setError("Failed to fetch income statement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  const exportToCSV = () => {
    if (!data) return;

    let csv = "Income Statement Report\n";
    csv += `Period: ${data.startDate} to ${data.endDate}\n\n`;
    csv += "Section,Account,Amount\n";

    // Revenue
    csv += `Revenue,Total Revenue,${data.revenue}\n\n`;

    // Expenses
    csv += "Expenses:\n";
    data.expenses.forEach((exp) => {
      csv += `Expense,${exp.accountName},${exp.totalExpense}\n`;
    });
    csv += `Expense,Total Expenses,${data.totalExpenses}\n\n`;

    // Net Profit
    csv += `Net Profit,,${data.netProfit}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `income_statement_${fromDate}_to_${toDate}.csv`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Income Statement</h2>
        <div className="flex items-center gap-2">
          <div>
            <label className="text-sm">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="ml-1 px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label className="text-sm">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="ml-1 px-2 py-1 border rounded"
            />
          </div>

          <button
            className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={exportToCSV}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p className="text-gray-600">Loading income statement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        data && (
          <div>
            {/* Date Range Display */}
            <div className="mb-4 text-sm text-gray-600">
              <p>Period: {data.startDate} to {data.endDate}</p>
            </div>

            {/* Revenue */}
            <div className="mb-6 border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-medium text-gray-700">Revenue</h3>
              <p className="text-green-600 font-bold text-2xl mt-2">
                Rs. {data.revenue.toLocaleString('en-PK')}
              </p>
            </div>

            {/* Expenses */}
            <div className="mb-6 border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-medium text-gray-700">Expenses</h3>
              <table className="w-full text-sm mt-2 border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border">Account</th>
                    <th className="p-3 border text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.length > 0 ? (
                    data.expenses.map((exp) => (
                      <tr key={exp.accountId} className="hover:bg-gray-50">
                        <td className="p-3 border">{exp.accountName}</td>
                        <td className="p-3 border text-right">
                          Rs. {exp.totalExpense.toLocaleString('en-PK')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-3 text-center text-gray-500">
                        No expenses found
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="p-3 border">Total Expenses</td>
                    <td className="p-3 border text-right">
                      Rs. {data.totalExpenses.toLocaleString('en-PK')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Profit */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-medium text-gray-700">Net Profit</h3>
              <p
                className={`font-bold text-2xl mt-2 ${
                  data.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Rs. {data.netProfit.toLocaleString('en-PK')}
              </p>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
              <p className="text-gray-600">
                <span className="font-semibold">Summary:</span> Revenue of Rs. {data.revenue.toLocaleString('en-PK')} minus expenses of Rs. {data.totalExpenses.toLocaleString('en-PK')} results in a net {data.netProfit >= 0 ? 'profit' : 'loss'} of Rs. {Math.abs(data.netProfit).toLocaleString('en-PK')}.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}