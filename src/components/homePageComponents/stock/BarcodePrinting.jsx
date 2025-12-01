/* eslint-disable no-unused-vars */
// BarcodePrintEnhanced.jsx
import React, { useState, useEffect } from "react";
import Barcode from "react-barcode";
import Button from "../../Button";
import { useSelector } from "react-redux";

const BarcodePrinting = () => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [labelSize, setLabelSize] = useState("half");
  const [searchQueryProducts, setSearchQueryProducts] = useState([]);
  
  // Dummy Products Data
  const dummyProducts = [
    {
      _id: "prod_001",
      productName: "Pepsi 500ml",
      productCode: "1404729582032",
      typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
      categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks" }],
      companyDetails: [{ _id: "comp_001", companyName: "PepsiCo" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
      salePriceDetails: [{ salePrice1: 60 }],
      status: true,
      productTotalQuantity: 500,
      productPack: 1,
      createdAt: new Date(2024, 0, 10).toISOString(),
    },
    {
      _id: "prod_002",
      productName: "Sprite 1L",
      productCode: "SPR1L",
      typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
      categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks" }],
      companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
      salePriceDetails: [{ salePrice1: 80 }],
      status: true,
      productTotalQuantity: 300,
      productPack: 1,
      createdAt: new Date(2024, 0, 15).toISOString(),
    },
    {
      _id: "prod_003",
      productName: "Coke 250ml",
      productCode: "COK250",
      typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
      categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks" }],
      companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
      salePriceDetails: [{ salePrice1: 45 }],
      status: true,
      productTotalQuantity: 1000,
      productPack: 1,
      createdAt: new Date(2024, 0, 20).toISOString(),
    },
    {
      _id: "prod_004",
      productName: "Fanta Orange 1L",
      productCode: "FAN1LOR",
      typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
      categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks" }],
      companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
      salePriceDetails: [{ salePrice1: 75 }],
      status: true,
      productTotalQuantity: 200,
      productPack: 1,
      createdAt: new Date(2024, 1, 5).toISOString(),
    },
    {
      _id: "prod_005",
      productName: "Mountain Dew 500ml",
      productCode: "MDEW500",
      typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
      categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks" }],
      companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
      salePriceDetails: [{ salePrice1: 65 }],
      status: true,
      productTotalQuantity: 450,
      productPack: 1,
      createdAt: new Date(2024, 1, 10).toISOString(),
    },
    {
      _id: "prod_006",
      productName: "7UP 1L",
      productCode: "7UP1L",
      typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
      categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks" }],
      companyDetails: [{ _id: "comp_003", companyName: "7UP Inc" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_002", supplierName: "Premium Beverages" }],
      salePriceDetails: [{ salePrice1: 85 }],
      status: true,
      productTotalQuantity: 250,
      productPack: 1,
      createdAt: new Date(2024, 1, 15).toISOString(),
    },
    {
      _id: "prod_007",
      productName: "Nestle Water 500ml",
      productCode: "NSW500",
      typeDetails: [{ _id: "type_002", typeName: "Water" }],
      categoryDetails: [{ _id: "cat_002", categoryName: "Bottled Water" }],
      companyDetails: [{ _id: "comp_004", companyName: "Nestle" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_002", supplierName: "Premium Beverages" }],
      salePriceDetails: [{ salePrice1: 35 }],
      status: true,
      productTotalQuantity: 800,
      productPack: 1,
      createdAt: new Date(2024, 2, 5).toISOString(),
    },
    {
      _id: "prod_008",
      productName: "Aquafina Water 1.5L",
      productCode: "AQU1.5L",
      typeDetails: [{ _id: "type_002", typeName: "Water" }],
      categoryDetails: [{ _id: "cat_002", categoryName: "Bottled Water" }],
      companyDetails: [{ _id: "comp_005", companyName: "Aquafina" }],
      vendorCompanyDetails: [],
      vendorSupplierDetails: [{ _id: "sup_003", supplierName: "Water Suppliers Ltd" }],
      salePriceDetails: [{ salePrice1: 55 }],
      status: true,
      productTotalQuantity: 600,
      productPack: 1,
      createdAt: new Date(2024, 2, 10).toISOString(),
    },
  ];

  // Dummy User Data
  const dummyUserData = {
    _id: "user_001",
    username: "admin",
    email: "admin@business.com",
    BusinessId: {
      _id: "biz_001",
      businessName: "Online PANDAS Store",
    },
  };

  const allProducts =  dummyProducts;
  const { userData } = useSelector((state) => state.auth) || { userData: dummyUserData };

  useEffect(() => {
      if (search.length > 0) {
        const results = allProducts.filter(
          (product) =>
            product.productName?.toLowerCase().includes(search.toLowerCase()) ||
            product.productCode?.toLowerCase().includes(search.toLowerCase())
        );
        setSearchQueryProducts(results);
        console.log('results', results)
      } else {
        setSearchQueryProducts([]);
      }
    }, [search, allProducts]);

  const handleSelectProduct = (product) => {
    setSearch('');
    setSelectedProduct([product]);
  };

  const handlePrint = () => {
    const width = labelSize === "half" ? "40mm" : "60mm";
    const printWindow = window.open("", "_blank", "width=600,height=800");

    if (!printWindow) return;

    const labels = selectedProduct
      .map(
        (p) => `
        <div class="label">
          <svg id="barcode-${p.productCode}"></svg>
          <div class="info">
            <strong>Pandas - </strong> <strong> RS ${p.salePriceDetails[0]?.salePrice1}</strong><br />
            
          </div>
        </div>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: sans-serif;
              padding: 10px;
            }
            .label {
              width: ${width};
              text-align: center;
              margin: 10px auto;
              padding: 8px 0;
              border-bottom: 1px dashed #ccc;
            }
            .info {
              font-size: 12px;
              margin-top: 4px;
            }
            svg {
              width: 100%;
              height: 40px;
            }
          </style>
        </head>
        <body>
          ${labels}
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script>
            ${selectedProduct
              .map(
                (p) =>
                  `JsBarcode("#barcode-${p.productCode}", "${p.productCode}", {
                    format: "CODE128",
                    width: 2,
                    height: 40,
                    displayValue: false,
                    margin: 0
                  });`
              )
              .join("\n")}
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className=" mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Multi Barcode Printer</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      {searchQueryProducts && searchQueryProducts.length > 0 && (
          <div className="overflow-auto max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-20">
            <table className="min-w-full bg-gray-200 border text-xs">
              <thead className='sticky -top-0 border-b shadow-sm bg-gray-300 z-10'>
                <tr>
                  <th className="py-2 px-1 text-left">Code</th>
                  <th className="py-2 px-1 text-left">Name</th>
                  <th className="py-2 px-1 text-left">Type</th>
                  <th className="py-2 px-1 text-left">Category</th>
                  <th className="py-2 px-1 text-left">Company</th>
                  <th className="py-2 px-1 text-left">Supplier</th>
                  <th className="py-2 px-1 text-left">Sale Price</th>
                  <th className="py-2 px-1 text-left">Status</th>
                  <th className="py-2 px-1 text-left">Total Qty</th>
                </tr>
              </thead>
              <tbody>
                {searchQueryProducts?.map((product, index) => (
                  <tr key={index} className="border-t cursor-pointer hover:bg-gray-300" onClick={() => handleSelectProduct(product)}>
                    <td className="px-1 py-1">{product.productCode}</td>
                    <td className="px-1 py-1">{product.productName}</td>
                    <td className="px-1 py-1">{(product.typeDetails[0]?.typeName)}</td>
                    <td className="px-1 py-1">{(product.categoryDetails[0]?.categoryName)}</td>
                    <td className="px-1 py-1">{(product.companyDetails[0]?.companyName)}</td>
                    <td className="px-1 py-1">{
                      product.vendorCompanyDetails.length > 0 ? product.vendorCompanyDetails[0].companyName : product.vendorSupplierDetails[0]?.supplierName
                    }</td>
                    <td className="px-1 py-1">{(product.salePriceDetails[0]?.salePrice1)}</td>
                    <td className="px-1 py-1">{product.status ? "active" : "inactive"}</td>
                    <td className="px-1 py-1">{product.productTotalQuantity / product.productPack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      <ul className="max-h-40 overflow-auto border rounded p-2 mb-4">
        {selectedProduct.map((product) => (
          <li
            key={product._id}
            className={`cursor-pointer p-2 border-b ${
              selectedProduct.find((p) => p._id === product._id)
                ? "bg-blue-100"
                : ""
            }`}
          >
            <div className="flex justify-between">
              <span>{product.productName}</span>
            </div>
            <div className="text-xs text-gray-500">{product.productCode}</div>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 items-center mb-4">
        <label className="font-medium">Label Size:</label>
        <select
          value={labelSize}
          onChange={(e) => setLabelSize(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="half">Half (40mm)</option>
          <option value="threefourth">3/4 (60mm)</option>
        </select>
      </div>

      <Button
        onClick={handlePrint}
        disabled={selectedProduct.length === 0}
        className="w-full"
      >
        Print Selected Barcodes
      </Button>
    </div>
  );
};

export default BarcodePrinting;