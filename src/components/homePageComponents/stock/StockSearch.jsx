/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config';
import Button from '../../Button';
import Loader from '../../../pages/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../Input';
import {
    setAllProducts
} from '../../../store/slices/products/productsSlice';
import ButtonLoader from '../../ButtonLoader';

const StockSearch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isStockUpdated, setIsStockUpdated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState('');
    const [productId, setProductId] = useState('');
    const [product, setProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState('');

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 400;

    // Dummy Products Data
    const dummyAllProducts = [
        {
            _id: "prod_001",
            productCode: "PEP500",
            productName: "Pepsi 500ml",
            productExpiryDate: "2025-12-31",
            typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
            categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks", productName: "Soft Drinks" }],
            companyDetails: [{ _id: "comp_001", companyName: "PepsiCo" }],
            vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 60, salePrice2: 55, salePrice3: 50, salePrice4: 45 }],
            productPack: 1,
            productPurchasePrice: 40,
            productTotalQuantity: 500,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 5,
            status: true,
            createdAt: new Date(2024, 0, 10).toISOString(),
        },
        {
            _id: "prod_002",
            productCode: "SPR1L",
            productName: "Sprite 1L",
            productExpiryDate: "2025-11-30",
            typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
            categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks", productName: "Soft Drinks" }],
            companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
            vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 80, salePrice2: 75, salePrice3: 70, salePrice4: 65 }],
            productPack: 1,
            productPurchasePrice: 55,
            productTotalQuantity: 300,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 8,
            status: true,
            createdAt: new Date(2024, 0, 15).toISOString(),
        },
        {
            _id: "prod_003",
            productCode: "COK250",
            productName: "Coke 250ml",
            productExpiryDate: "2025-10-31",
            typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
            categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks", productName: "Soft Drinks" }],
            companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
            vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 45, salePrice2: 40, salePrice3: 35, salePrice4: 30 }],
            productPack: 1,
            productPurchasePrice: 25,
            productTotalQuantity: 1000,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 3,
            status: true,
            createdAt: new Date(2024, 0, 20).toISOString(),
        },
        {
            _id: "prod_004",
            productCode: "FAN1LOR",
            productName: "Fanta Orange 1L",
            productExpiryDate: "2025-12-15",
            typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
            categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks", productName: "Soft Drinks" }],
            companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
            vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 75, salePrice2: 70, salePrice3: 65, salePrice4: 60 }],
            productPack: 1,
            productPurchasePrice: 50,
            productTotalQuantity: 200,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 6,
            status: true,
            createdAt: new Date(2024, 1, 5).toISOString(),
        },
        {
            _id: "prod_005",
            productCode: "MDEW500",
            productName: "Mountain Dew 500ml",
            productExpiryDate: "2025-11-20",
            typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
            categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks", productName: "Soft Drinks" }],
            companyDetails: [{ _id: "comp_002", companyName: "Coca-Cola" }],
            vendorSupplierDetails: [{ _id: "sup_001", supplierName: "Direct Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 65, salePrice2: 60, salePrice3: 55, salePrice4: 50 }],
            productPack: 1,
            productPurchasePrice: 42,
            productTotalQuantity: 450,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 4,
            status: true,
            createdAt: new Date(2024, 1, 10).toISOString(),
        },
        {
            _id: "prod_006",
            productCode: "7UP1L",
            productName: "7UP 1L",
            productExpiryDate: "2025-12-10",
            typeDetails: [{ _id: "type_001", typeName: "Beverage" }],
            categoryDetails: [{ _id: "cat_001", categoryName: "Soft Drinks", productName: "Soft Drinks" }],
            companyDetails: [{ _id: "comp_003", companyName: "7UP Inc" }],
            vendorSupplierDetails: [{ _id: "sup_002", supplierName: "Premium Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 85, salePrice2: 80, salePrice3: 75, salePrice4: 70 }],
            productPack: 1,
            productPurchasePrice: 58,
            productTotalQuantity: 250,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 7,
            status: true,
            createdAt: new Date(2024, 1, 15).toISOString(),
        },
        {
            _id: "prod_007",
            productCode: "NSW500",
            productName: "Nestle Water 500ml",
            productExpiryDate: "2025-09-30",
            typeDetails: [{ _id: "type_002", typeName: "Water" }],
            categoryDetails: [{ _id: "cat_002", categoryName: "Bottled Water", productName: "Bottled Water" }],
            companyDetails: [{ _id: "comp_004", companyName: "Nestle" }],
            vendorSupplierDetails: [{ _id: "sup_002", supplierName: "Premium Beverages" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 35, salePrice2: 32, salePrice3: 30, salePrice4: 28 }],
            productPack: 1,
            productPurchasePrice: 20,
            productTotalQuantity: 800,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 2,
            status: true,
            createdAt: new Date(2024, 2, 5).toISOString(),
        },
        {
            _id: "prod_008",
            productCode: "AQU1.5L",
            productName: "Aquafina Water 1.5L",
            productExpiryDate: "2025-10-15",
            typeDetails: [{ _id: "type_002", typeName: "Water" }],
            categoryDetails: [{ _id: "cat_002", categoryName: "Bottled Water", productName: "Bottled Water" }],
            companyDetails: [{ _id: "comp_005", companyName: "Aquafina" }],
            vendorSupplierDetails: [{ _id: "sup_003", supplierName: "Water Suppliers Ltd" }],
            vendorCompanyDetails: [],
            salePriceDetails: [{ salePrice1: 55, salePrice2: 50, salePrice3: 48, salePrice4: 45 }],
            productPack: 1,
            productPurchasePrice: 35,
            productTotalQuantity: 600,
            quantityUnit: "pcs",
            packUnit: "pcs",
            productUnit: "ml",
            productDiscountPercentage: 3,
            status: true,
            createdAt: new Date(2024, 2, 10).toISOString(),
        },
    ];

    const dummyCompanyData = [
        { _id: "comp_001", companyName: "PepsiCo" },
        { _id: "comp_002", companyName: "Coca-Cola" },
        { _id: "comp_003", companyName: "7UP Inc" },
        { _id: "comp_004", companyName: "Nestle" },
        { _id: "comp_005", companyName: "Aquafina" },
    ];

    const dummyCategoryData = [
        { _id: "cat_001", categoryName: "Soft Drinks" },
        { _id: "cat_002", categoryName: "Bottled Water" },
        { _id: "cat_003", categoryName: "Energy Drinks" },
        { _id: "cat_004", categoryName: "Juices" },
    ];

    const dummyTypeData = [
        { _id: "type_001", typeName: "Beverage" },
        { _id: "type_002", typeName: "Water" },
        { _id: "type_003", typeName: "Premium" },
        { _id: "type_004", typeName: "Economy" },
    ];

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const allProducts = useSelector(state => state.saleItems.allProducts) || dummyAllProducts;
    const companyData = useSelector(state => state.companies.companyData) || dummyCompanyData;
    const categoryData = useSelector(state => state.categories.categoryData) || dummyCategoryData;
    const typeData = useSelector(state => state.types.typeData) || dummyTypeData;

    const inputRef = useRef(null);

    // Initialize with dummy data on mount
    useEffect(() => {
        dispatch(setAllProducts(dummyAllProducts));
        setFilteredProducts(dummyAllProducts);
        inputRef.current?.focus();
    }, [dispatch]);

    const handleEdit = (id, name, product) => {
        setProductId(id);
        setIsEdit(true);
        setProductName(name);
        setProduct(product);

        setValue('productId', id);
        setValue('productCode', product.productCode || '');
        setValue('productName', product.productName || '');
        setValue('productExpiryDate', product.productExpiryDate || '');
        setValue('salePrice1', product.salePriceDetails?.[0]?.salePrice1 || '');
        setValue('salePrice2', product.salePriceDetails?.[0]?.salePrice2 || '');
        setValue('salePrice3', product.salePriceDetails?.[0]?.salePrice3 || '');
        setValue('salePrice4', product.salePriceDetails?.[0]?.salePrice4 || '');
        setValue('categoryId', product.categoryDetails?.[0]?._id || '');
        setValue('typeId', product.typeDetails?.[0]?._id || '');
        setValue('companyId', product.companyDetails?.[0]?._id || '');
        setValue('productDiscountPercentage', product.productDiscountPercentage || '');
        setValue('productPack', product.productPack || '');
        setValue('quantityUnit', product.quantityUnit || '');
        setValue('packUnit', product.packUnit || '');
        setValue('productUnit', product.productUnit || '');
        setValue('productPurchasePrice', product.productPurchasePrice || '');
        setValue('productTotalQuantity', product.productTotalQuantity / product.productPack || '');
    };

    const handleUpdateProduct = async (data) => {
        setIsButtonLoading(true);

        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        if (cleanedData.productId === undefined) {
            setError("No product ID found!");
            return;
        }

        if (Object.keys(cleanedData).length === 0) {
            setError("No data added to update!");
            return;
        }

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Find and update product in dummy data
            const productIndex = dummyAllProducts.findIndex(p => p._id === data.productId);
            if (productIndex !== -1) {
                dummyAllProducts[productIndex] = {
                    ...dummyAllProducts[productIndex],
                    productCode: cleanedData.productCode || dummyAllProducts[productIndex].productCode,
                    productName: cleanedData.productName || dummyAllProducts[productIndex].productName,
                    productExpiryDate: cleanedData.productExpiryDate || dummyAllProducts[productIndex].productExpiryDate,
                    productDiscountPercentage: cleanedData.productDiscountPercentage || dummyAllProducts[productIndex].productDiscountPercentage,
                    productPack: cleanedData.productPack || dummyAllProducts[productIndex].productPack,
                    productPurchasePrice: cleanedData.productPurchasePrice || dummyAllProducts[productIndex].productPurchasePrice,
                    productTotalQuantity: cleanedData.productTotalQuantity ? cleanedData.productTotalQuantity * dummyAllProducts[productIndex].productPack : dummyAllProducts[productIndex].productTotalQuantity,
                    quantityUnit: cleanedData.quantityUnit || dummyAllProducts[productIndex].quantityUnit,
                    packUnit: cleanedData.packUnit || dummyAllProducts[productIndex].packUnit,
                    salePriceDetails: [{
                        salePrice1: cleanedData.salePrice1 || dummyAllProducts[productIndex].salePriceDetails[0].salePrice1,
                        salePrice2: cleanedData.salePrice2 || dummyAllProducts[productIndex].salePriceDetails[0].salePrice2,
                        salePrice3: cleanedData.salePrice3 || dummyAllProducts[productIndex].salePriceDetails[0].salePrice3,
                        salePrice4: cleanedData.salePrice4 || dummyAllProducts[productIndex].salePriceDetails[0].salePrice4,
                    }],
                };
            }

            dispatch(setAllProducts([...dummyAllProducts]));
            setSuccessMessage("Product updated successfully");
            setIsLoading(false);
            setIsStockUpdated(true);
            setIsButtonLoading(false);
            setIsEdit(false);
            reset();
        } catch (error) {
            console.log("error updating Product:", error);
            setError("Failed to update product");
        } finally {
            setIsLoading(false);
            setIsStockUpdated(true);
            setIsButtonLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsButtonLoading(true);
        setDeleteId(id);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Remove product from dummy data
            const filteredData = dummyAllProducts.filter(p => p._id !== id);
            dummyAllProducts.splice(0, dummyAllProducts.length, ...filteredData);

            dispatch(setAllProducts([...dummyAllProducts]));
            setFilteredProducts([...dummyAllProducts]);
            setSuccessMessage("Product deleted successfully");
            setIsButtonLoading(false);
            setSearchQuery('');
            setDeleteId('');
            setIsLoading(false);
            setIsStockUpdated(true);
        } catch (error) {
            console.log("error deleting Product:", error);
            setError("Failed to delete product");
        } finally {
            setIsLoading(false);
            setIsStockUpdated(true);
            setDeleteId('');
            setIsButtonLoading(false);
        }
    };

    useEffect(() => {
        let results = allProducts && allProducts.length > 0 ? allProducts : dummyAllProducts;
        if (searchQuery) {
            results = results.filter(
                (product) =>
                    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(results);
        setCurrentPage(1);
    }, [searchQuery, allProducts]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const exportToCSV = () => {
        const headers = [
            "Code", "Name", "Type", "Pack", "Company", "Vendor", "product Discount Percentage", "Category", "product Purchase Price", "Sale Price1", "Sale Price2", "Sale Price3", "Sale Price4", "Total Qty", "status"
        ];

        const rows = currentProducts.map(product => [
            product.productCode,
            product.productName,
            product.typeDetails[0]?.typeName,
            product.productPack,
            product.companyDetails[0]?.companyName,
            product.vendorSupplierDetails[0]?.supplierName || product.vendorCompanyDetails[0]?.companyName,
            product.productDiscountPercentage,
            product.categoryDetails[0]?.categoryName,
            product.productPurchasePrice,
            product.salePriceDetails[0]?.salePrice1,
            product.salePriceDetails[0]?.salePrice2,
            product.salePriceDetails[0]?.salePrice3,
            product.salePriceDetails[0]?.salePrice4,
            Math.ceil(product.productTotalQuantity / product.productPack),
            product.status
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return !isEdit ? (
        <div className='bg-white rounded-lg'>
            <div className="w-full px-5 py-5">
                <h2 className="text-lg text-center pt-2 font-semibold mb-2">Search for Stock</h2>
                <div className="text-xs text-red-500 mb-2 text-center">
                    {error && <p>{error}</p>}
                    {errors.productName && <p>Product Name is required.</p>}
                </div>
                <div className="flex justify-between items-center mb-2">
                    <Input
                        label='Search product:'
                        placeholder='Search by Name / Code'
                        divClass="gap-2 items-center"
                        className='text-xs p-1.5 w-72'
                        labelClass="w-24 text-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        ref={inputRef}
                    />
                    <button
                        onClick={exportToCSV}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs"
                    >
                        Export CSV
                    </button>
                </div>
                {currentProducts && currentProducts.length > 0 &&
                    <div className="overflow-auto max-h-80 scrollbar-thin rounded">
                        <table className="min-w-full bg-white border text-xs">
                            <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
                                <tr>
                                    <th className="py-2 px-1 text-left">Code</th>
                                    <th className="py-2 px-1 text-left">Name</th>
                                    <th className="py-2 px-1 text-left">Type</th>
                                    <th className="py-2 px-1 text-left">Pack</th>
                                    <th className="py-2 px-1 text-left">Company</th>
                                    <th className="py-2 px-1 text-left">Vendor</th>
                                    <th className="py-2 px-1 text-left">Category</th>
                                    <th className="py-2 px-1 text-left">Sale Price</th>
                                    <th className="py-2 px-1 text-left">Total Qty</th>
                                    <th className="py-2 px-1 text-left">Total Units</th>
                                    <th className="py-2 px-1 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product, index) => (
                                    <tr key={index} className="border-t hover:bg-gray-100">
                                        <td className="px-1 py-1">{product.productCode}</td>
                                        <td className="px-1 py-1">{product.productName}</td>
                                        <td className="px-1 py-1">{product.typeDetails[0]?.typeName}</td>
                                        <td className="px-1 py-1">{product.productPack}</td>
                                        <td className="px-1 py-1">{product.companyDetails[0]?.companyName}</td>
                                        <td className="px-1 py-1">{product.vendorSupplierDetails[0]?.supplierName || product.vendorCompanyDetails[0]?.companyName}</td>
                                        <td className="px-1 py-1">{product.categoryDetails[0]?.categoryName}</td>
                                        <td className="px-1 py-1">{product.salePriceDetails[0]?.salePrice1}</td>
                                        <td className="px-1 py-1">{Math.ceil(product.productTotalQuantity / product.productPack)}</td>
                                        <td className="px-1 py-1">{Math.ceil(product.productTotalQuantity)}</td>
                                        <td className="py-1 px-2 flex gap-2">
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-full"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                {(isButtonLoading && product._id === deleteId) ?
                                                    <ButtonLoader /> : 'Delete'}
                                            </button>
                                            <button
                                                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full"
                                                onClick={() => handleEdit(product._id, product.productName, product)}
                                            >Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                {currentProducts && currentProducts.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No products found
                    </div>
                )}
                <div className="flex justify-center gap-3 mt-2 text-xs">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                    >Previous</button>
                    <span className="self-center">
                        Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage) || 1}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                prev < Math.ceil(filteredProducts.length / itemsPerPage)
                                    ? prev + 1 : prev)}
                        disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                    >Next</button>
                </div>
            </div>
        </div>
    ) :
        <div className='w-full px-4 flex items-center'>
            {isStockUpdated && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsStockUpdated(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{successMessage}</h2>
                    </div>
                </div>
            )}
            <div className="w-full px-5 max-w-lg mx-auto py-5 bg-white rounded shadow-lg">
                <span className='absolute right-80 mr-2 top-20'>
                    <button className='hover:text-red-700' onClick={() => setIsEdit(false)}>&#10008;</button>
                </span>
                <div className="max-w-6xl mx-auto p-3  bg-white rounded-md">
                    <h2 className="text-lg text-center font-semibold ">Update Product Details</h2>
                    <h5 className=" text-center font-semibold mb-2">{productName}</h5>


                    {/* Error Message Below the Heading */}
                    <div className="text-xs text-red-500 mb-2 text-center">
                        {error && <p>{error}</p>}
                    </div>

                    <form onSubmit={handleSubmit(handleUpdateProduct)}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div>
                                <input
                                    type="hidden"
                                    value={productId}
                                    {...register('productId')}
                                    className="w-full px-2 py-1 border rounded-md text-xs"
                                />
                                {/* Item Code */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Item Code</label>
                                    <input
                                        type="text"
                                        {...register('productCode')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                {/* Name */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Name</label>
                                    <input
                                        type="text"
                                        {...register('productName')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Expiry Date</label>
                                    <input
                                        type="date"
                                        {...register('productExpiryDate')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                {/* Sale Prices */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Sale Price 1</label>
                                    <input
                                        type="text"
                                        {...register('salePrice1')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Sale Price 2</label>
                                    <input
                                        type="text"
                                        {...register('salePrice2')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Sale Price 3</label>
                                    <input
                                        type="text"
                                        {...register('salePrice3')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Sale Price 4</label>
                                    <input
                                        type="text"
                                        {...register('salePrice4')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                {/* Category */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Category:</label>
                                    <select
                                        {...register('categoryId')}
                                        className={`border p-1 text-xs rounded w-full`}
                                    >
                                        <option value="">Select Category</option>
                                        {categoryData && categoryData.map((category, index) => (
                                            <option key={index} value={category._id}>{category.categoryName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Type */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Type:</label>
                                    <select
                                        {...register('typeId')}
                                        className={`border p-1 text-xs rounded w-full`}
                                    >
                                        <option value="">Select Type</option>
                                        {typeData && typeData.map((type, index) => (
                                            <option key={index} value={type._id}>{type.typeName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Company */}
                                <div className="mb-2 items-center">
                                    <label className="block text-gray-700 text-xs">Company:</label>
                                    <select
                                        {...register('companyId')}
                                        className={`border p-1 text-xs rounded w-full`}
                                    >
                                        <option value="">Select Company</option>
                                        {companyData && companyData.map((company, index) => (
                                            <option key={index} value={company._id}>{company.companyName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Discount % */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Discount %:</label>
                                    <input
                                        type="text"
                                        {...register('productDiscountPercentage')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>


                                {/* Pack */}

                                <div className="mb-2 grid grid-cols-2 gap-2 items-center">
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs">Pack:</label>
                                        <input
                                            type="text"
                                            {...register('productPack')}
                                            className="w-full px-2 py-1 border rounded-md text-xs"
                                        />
                                    </div>
                                    <div className=''>
                                        <select name="" id="" className='px-2 py-1 text-xs'
                                            {...register('packUnit')}>
                                            {['pcs', 'kg', 'grams', 'ft', 'inches', 'cm'].map((unit, i) => (
                                                <option key={i} value={unit}>{unit.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Purchase Price */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Purchase Price</label>
                                    <input
                                        type="text"
                                        {...register('productPurchasePrice')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                {/* Total Quantity */}
                                <div className='mb-2 grid grid-cols-2 gap-2 items-center'>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs">Total Quantity</label>
                                        <input
                                            type="text"
                                            {...register('productTotalQuantity')}
                                            className="w-full px-2 py-1 border rounded-md text-xs"
                                        />
                                    </div>
                                    <div className=''>
                                        <select name="" id="" className='px-2 py-1 text-xs'
                                            {...register('quantityUnit')}>
                                            {['pcs', 'cotton', 'box', 'pack', 'kg', 'ton', 'meter', 'yard', 'ft'].map((unit, i) => (
                                                <option key={i} value={unit}>{unit.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='w-full flex justify-center'>
                            <button
                                type="submit"
                                className=" bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 text-xs"
                            >
                                {isButtonLoading ?
                                    <ButtonLoader /> : 'Update Details'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
};

export default StockSearch;