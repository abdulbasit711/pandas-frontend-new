import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import config from "../../../features/config";

const ExpiryReport = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [days, setDays] = useState(30);
  const [error, setError] = useState("");

  // Dummy Expiry Products Data
  const dummyExpiryProducts = [
    {
      _id: "prod_exp_001",
      productName: "Pepsi 500ml",
      productExpiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_001", companyName: "PepsiCo" },
      typeId: { _id: "type_001", typeName: "Beverage" },
    },
    {
      _id: "prod_exp_002",
      productName: "Sprite 1L",
      productExpiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_002", companyName: "Coca-Cola" },
      typeId: { _id: "type_001", typeName: "Beverage" },
    },
    {
      _id: "prod_exp_003",
      productName: "Coke 250ml",
      productExpiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_002", companyName: "Coca-Cola" },
      typeId: { _id: "type_001", typeName: "Beverage" },
    },
    {
      _id: "prod_exp_004",
      productName: "Fanta Orange 1L",
      productExpiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_002", companyName: "Coca-Cola" },
      typeId: { _id: "type_001", typeName: "Beverage" },
    },
    {
      _id: "prod_exp_005",
      productName: "Mountain Dew 500ml",
      productExpiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_002", companyName: "Coca-Cola" },
      typeId: { _id: "type_001", typeName: "Beverage" },
    },
    {
      _id: "prod_exp_006",
      productName: "7UP 1L",
      productExpiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_003", companyName: "7UP Inc" },
      typeId: { _id: "type_001", typeName: "Beverage" },
    },
    {
      _id: "prod_exp_007",
      productName: "Nestle Water 500ml",
      productExpiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_004", companyName: "Nestle" },
      typeId: { _id: "type_002", typeName: "Water" },
    },
    {
      _id: "prod_exp_008",
      productName: "Aquafina Water 1.5L",
      productExpiryDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_005", companyName: "Aquafina" },
      typeId: { _id: "type_002", typeName: "Water" },
    },
    {
      _id: "prod_exp_009",
      productName: "Orange Juice 1L",
      productExpiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_006", companyName: "Tropicana" },
      typeId: { _id: "type_003", typeName: "Juice" },
    },
    {
      _id: "prod_exp_010",
      productName: "Apple Juice 500ml",
      productExpiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: { _id: "comp_007", companyName: "Minute Maid" },
      typeId: { _id: "type_003", typeName: "Juice" },
    },
  ];

  const fetchExpiryReport = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Filter products expiring within specified days
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      
      const filtered = dummyExpiryProducts.filter((product) => {
        const expiryDate = new Date(product.productExpiryDate);
        return expiryDate >= now && expiryDate <= futureDate;
      });

      setProducts(filtered);
      setFilteredProducts(filtered);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expiry report.");
    }
  };

  useEffect(() => {
    fetchExpiryReport();
  }, [days]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.companyId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.typeId?.typeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const exportToCSV = () => {
    const headers = [
      "Product Name",
      "Company",
      "Type",
      "Expiry Date"
    ];

    const rows = filteredProducts.map((product) => [
      product.productName,
      product.companyId?.companyName || "",
      product.typeId?.typeName || "",
      format(new Date(product.productExpiryDate), "yyyy-MM-dd")
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `expiry_report_${days}_days.csv`);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Expiry Report</h2>
        <button
          onClick={exportToCSV}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, type or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded text-sm w-full md:w-1/3"
        />
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value={7}>Next 7 Days</option>
          <option value={15}>Next 15 Days</option>
          <option value={30}>Next 30 Days</option>
          <option value={60}>Next 60 Days</option>
          <option value={90}>Next 90 Days</option>
        </select>
      </div>

      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">No expiring products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{product.productName}</td>
                  <td className="border p-2">{product.companyId?.companyName}</td>
                  <td className="border p-2">{product.typeId?.typeName}</td>
                  <td className="border p-2">
                    {format(new Date(product.productExpiryDate), "yyyy-MM-dd")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpiryReport;