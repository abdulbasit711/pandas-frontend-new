/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setAllProducts,
  setSearchQuery,
  setSearchQueryProducts,
  setSelectedItems,
  setDate,
  setTotalQty,
  setFlatDiscount,
  setTotalGst,
  setTotalAmount,
  setPaidAmount,
  setPreviousBalance,
  setIsPaid,
  setProductName,
  setProductCode,
  setProductQuantity,
  setProductDiscount,
  setProductPrice,
  setProduct,
  setTotalGrossAmount,
  setProductUnits,
  setCustomer,
  setExtraProducts,
  removeExtraItem
} from '../../../store/slices/products/productsSlice'
import { setBillData } from '../../../store/slices/bills/billSlice';
import Input from '../../Input';
import Button from '../../Button';
// import config from '../../../features/config'; // Commented out - using dummy data
import { useNavigate } from 'react-router-dom';
import Loader from '../../../pages/Loader';
import { useForm } from 'react-hook-form';
import QuotationComponent from './quotation/QuotationComponent';
import QuotationList from './quotation/QuotationList';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import { useReactToPrint } from "react-to-print";
import ViewBill from "./bills/ViewBill";
import ViewBillThermal from "./bills/ViewBillThermal";
import AddCustomer from './AddCustomer';

// --- DUMMY DATA ---
const DUMMY_PRODUCTS = [
  {
    _id: '1',
    productName: 'Laptop Pro',
    productCode: 'LAP001',
    productPack: 1,
    productTotalQuantity: 50,
    packUnit: 'pcs',
    quantityUnit: 'pcs',
    productPurchasePrice: 45000,
    salePriceDetails: [{ salePrice1: 65000, salePrice2: 62000, salePrice3: 60000, salePrice4: 58000 }],
    typeDetails: [{ typeName: 'Electronics' }],
    companyDetails: [{ companyName: 'Dell' }],
    vendorSupplierDetails: [{ supplierName: 'Tech Supplier' }],
    vendorCompanyDetails: [{ companyName: 'Tech Corp' }],
    categoryDetails: [{ categoryName: 'Computers' }]
  },
  {
    _id: '2',
    productName: 'Wireless Mouse',
    productCode: 'MOU001',
    productPack: 10,
    productTotalQuantity: 200,
    packUnit: 'box',
    quantityUnit: 'pcs',
    productPurchasePrice: 500,
    salePriceDetails: [{ salePrice1: 899, salePrice2: 850, salePrice3: 800, salePrice4: 750 }],
    typeDetails: [{ typeName: 'Accessories' }],
    companyDetails: [{ companyName: 'Logitech' }],
    vendorSupplierDetails: [{ supplierName: 'Tech Supplier' }],
    vendorCompanyDetails: [{ companyName: 'Tech Corp' }],
    categoryDetails: [{ categoryName: 'Peripherals' }]
  },
  {
    _id: '3',
    productName: 'USB-C Cable',
    productCode: 'USB001',
    productPack: 5,
    productTotalQuantity: 500,
    packUnit: 'box',
    quantityUnit: 'pcs',
    productPurchasePrice: 150,
    salePriceDetails: [{ salePrice1: 299, salePrice2: 280, salePrice3: 260, salePrice4: 240 }],
    typeDetails: [{ typeName: 'Cables' }],
    companyDetails: [{ companyName: 'Generic' }],
    vendorSupplierDetails: [{ supplierName: 'Cable Supplier' }],
    vendorCompanyDetails: [{ companyName: 'Cable Corp' }],
    categoryDetails: [{ categoryName: 'Cables' }]
  },
  {
    _id: '4',
    productName: '4K Monitor',
    productCode: 'MON001',
    productPack: 1,
    productTotalQuantity: 30,
    packUnit: 'pcs',
    quantityUnit: 'pcs',
    productPurchasePrice: 22000,
    salePriceDetails: [{ salePrice1: 35000, salePrice2: 33000, salePrice3: 31000, salePrice4: 29000 }],
    typeDetails: [{ typeName: 'Display' }],
    companyDetails: [{ companyName: 'Samsung' }],
    vendorSupplierDetails: [{ supplierName: 'Display Supplier' }],
    vendorCompanyDetails: [{ companyName: 'Display Corp' }],
    categoryDetails: [{ categoryName: 'Monitors' }]
  },
  {
    _id: '5',
    productName: 'Mechanical Keyboard',
    productCode: 'KEY001',
    productPack: 1,
    productTotalQuantity: 40,
    packUnit: 'pcs',
    quantityUnit: 'pcs',
    productPurchasePrice: 8000,
    salePriceDetails: [{ salePrice1: 12999, salePrice2: 12500, salePrice3: 12000, salePrice4: 11500 }],
    typeDetails: [{ typeName: 'Keyboard' }],
    companyDetails: [{ companyName: 'Corsair' }],
    vendorSupplierDetails: [{ supplierName: 'Tech Supplier' }],
    vendorCompanyDetails: [{ companyName: 'Tech Corp' }],
    categoryDetails: [{ categoryName: 'Peripherals' }]
  }
];

const DUMMY_BILL_NUMBERS = {
  thermal: 1001,
  A4: 2001
};

const DUMMY_BILL = {
  _id: '1',
  billNo: 1001,
  billType: 'thermal',
  billPaymentType: 'cash',
  customer: 'CUST001',
  date: new Date().toISOString(),
  description: 'Sample Invoice',
  billItems: [],
  flatDiscount: 0,
  totalAmount: 0,
  paidAmount: 0,
  billStatus: 'unpaid',
  dueDate: null
};

// --- Mock API Service ---
const mockConfig = {
  createInvoice: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock Invoice Created:', data);
        resolve({
          data: {
            _id: Math.random().toString(36).substr(2, 9),
            billNo: DUMMY_BILL_NUMBERS[data.billType],
            ...data
          }
        });
      }, 800); // Simulate network delay
    });
  },

  fetchAllProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock Products Fetched');
        resolve({
          data: DUMMY_PRODUCTS
        });
      }, 500);
    });
  },

  getLastBillNo: async (billType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentNo = DUMMY_BILL_NUMBERS[billType] || 1000;
        const nextNo = currentNo + 1;
        DUMMY_BILL_NUMBERS[billType] = nextNo;
        console.log('Mock Bill No:', nextNo);
        resolve({
          data: { nextBillNo: nextNo }
        });
      }, 300);
    });
  },

  fetchSingleBill: async (billNo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock Bill Fetched:', billNo);
        resolve({
          data: { ...DUMMY_BILL, billNo }
        });
      }, 400);
    });
  }
};

const InvoiceComponent = () => {

  const navigate = useNavigate();

  const [quantityError, setQuantityError] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [productUnitError, setProductUnitError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [billNo, setBillNo] = useState(0)
  const [viewBillNo, setViewBillNo] = useState(0)
  const [description, setDescription] = useState('')
  const [billType, setBillType] = useState('thermal')
  const [billPaymentType, setBillPaymentType] = useState('cash')
  const [customerIndex, setCustomerIndex] = useState('')
  const [customerFlag, setCustomerFlag] = useState('red')
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [salesPerson, salesPalesPerson] = useState('')
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [billError, setBillError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const [addBalanceToDiscount, setAddBalanceToDiscount] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [showQuotationListModal, setShowQuotationListModal] = useState(false);

  const [bill, setBill] = useState(null)

  const [showAddCustomer, setShowAddCustomer] = useState(false)

  const [showAddExtraProductModal, setShowAddExtraProductModal] = useState(false);
  const [extraProduct, setExtraProduct] = useState({
    id: 0,
    itemName: '',
    salePrice: 0,
    quantity: 1
  });

  const inputRef = useRef(null);

  const buttonRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isInvoiceGenerated && e.key === "Enter") {
        handleViewBill(viewBillNo);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isInvoiceGenerated, viewBillNo]);

  const tableContainerRef = useRef(null);

  const thermalColor = {
    th100: "bg-blue-100",
    th200: "bg-blue-200",
    th300: "bg-blue-300",
    th500: "bg-blue-500"
  }

  const A4Color = {
    a4100: "bg-primary/20",
    a4200: "bg-primary/30",
    a4300: "bg-primary/50",
    a4500: "bg-primary/80",
  }

  //bill states

  const customerData = useSelector((state) => state.customers.customerData)
  const { primaryPath } = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  const {
    allProducts,
    searchQuery,
    searchQueryProducts,
    selectedItems,
    date,
    totalQty,
    flatDiscount,
    totalGst,
    customerId,
    totalAmount,
    paidAmount,
    previousBalance,
    isPaid,
    productName,
    productUnits,
    productCode,
    productQuantity,
    productDiscount,
    productPrice,
    product,
    totalGrossAmount,
    extraProducts
  } = useSelector((state) => state.saleItems);

  const billData = useSelector(state => state.bills.billData)

  const handleSelectProduct = (product) => {
    dispatch(setSearchQuery(''));
    dispatch(setProductName(product.productName));
    dispatch(setProductCode(product.productCode));
    dispatch(setProductQuantity(1));
    dispatch(setProductDiscount(0));
    dispatch(setProductUnits(product.productPack));
    {
      customerFlag === "red" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice1))
      ) : customerFlag === "green" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice2))
      ) : customerFlag === "yellow" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice3))
      ) : customerFlag === "white" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice4))
      ) : (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice1))
      )
    }
    dispatch(setProduct(product));
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = selectedItems.map((item, i) => {
      if (i === index) {
        if (key === "quantity") {
          const newQty = parseFloat(value) || 0;
          if (newQty > item.productTotalQuantity / item.productPack) {
            alert(`You cannot exceed stock limit! Max: ${Math.floor(item.productTotalQuantity / item.productPack)} ${item.quantityUnit}`);
            return { ...item, quantity: Math.floor(item.productTotalQuantity / item.productPack) };
          }
          return { ...item, quantity: newQty };
        }
        if (key === "billItemUnit") {
          const newUnits = parseInt(value) || 0;
          if (newUnits > item.productTotalQuantity) {
            alert(`You cannot exceed stock limit! Max: ${item.maxQuantity} ${item.packUnit}`);
            return { ...item, billItemUnit: item.productTotalQuantity };
          }
          return { ...item, billItemUnit: newUnits };
        }
        return { ...item, [key]: value };
      }
      return item;
    });

    dispatch(setSelectedItems(updatedItems));
    updateTotals();
  };

  const handleAddProduct = () => {
    if (product.productTotalQuantity <= 0) {
      alert("Product is out of stock!");
      return;
    }
    if (productName !== '') {
      const existingProductIndex = selectedItems.findIndex(
        (item) => item._id === product._id
      );

      if (existingProductIndex >= 0) {
        const updatedItems = selectedItems.map((item, index) => {
          if (index === existingProductIndex) {
            const newQty = parseFloat(item.quantity) + parseFloat(productQuantity);
            if (newQty > item.maxQuantity) {
              alert(`Cannot add more than ${item.maxQuantity} in stock.`);
              return { ...item, quantity: item.maxQuantity };
            }
            return { ...item, quantity: newQty };
          }
          return item;
        });

        dispatch(setSelectedItems(updatedItems));
      } else {
        if (productQuantity > product.productTotalQuantity) {
          alert(`You cannot add more than ${product.productTotalQuantity} in stock.`);
          return;
        }

        const newProduct = {
          ...product,
          maxQuantity: product.productTotalQuantity,
          salePrice1: productPrice,
          quantity: productQuantity,
          discount: productDiscount,
          billItemUnit: 0,
        };

        dispatch(setSelectedItems([...selectedItems, newProduct]));
      }

      dispatch(setSearchQueryProducts([]));
      dispatch(setProductName(''));
      dispatch(setProductCode(''));
      dispatch(setProductQuantity(1));
      dispatch(setProductDiscount(0));
      dispatch(setProductPrice(0));
      dispatch(setProductUnits(0));
      dispatch(setProduct({}));
      setPriceError('');
    }
  };

  const handleQuantityChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      dispatch(setProductQuantity(value));
      setQuantityError('');
    } else {
      setQuantityError('Quantity must be a number.');
    }
  };

  const handleDiscountChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      setDiscountError('');
      dispatch(setProductDiscount(value));
    } else {
      setDiscountError('Discount must be a number.');
    }
  };

  const handleProductUnitsChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      setProductUnitError('');
      dispatch(setProductUnits(value));
      dispatch(setProductPrice((Number(productPrice) * Number(value)) / product.productPack));
    } else {
      setProductUnitError('Product Unit must be a number.');
    }
  };

  const handlePriceChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      setPriceError('');

      if (value < product.productPurchasePrice && value) {
        setPriceError(`minimum price is ${product.productPurchasePrice}`);
      }

      dispatch(setProductPrice(value));
    } else {
      setPriceError('Price must be a number.');
    }
  };

  const handleExtraDiscountChange = (index, extraDiscount) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].extraDiscount = parseFloat(extraDiscount) || 0;
    dispatch(setSelectedItems(updatedItems))
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    dispatch(setSelectedItems(updatedItems));
    updateTotals();
  }

  const updateTotals = () => {
    const totalQty = selectedItems.reduce((sum, item) => sum + Number((item.quantity || 0)), 0);
    const totalDiscount = selectedItems.reduce((sum, item) => sum + (item.salePrice1 * item.quantity * (item.discount || 0) / 100), 0);
    const totalGrossAmount = selectedItems.reduce((sum, item) => sum + ((item.salePrice1 * (item.billItemUnit / item.productPack + item.quantity))), 0);

    const totalAmount = (totalGrossAmount - totalDiscount);
    const totalGst = 0
    const netAmount = totalAmount - totalDiscount + totalGst;

    const totalExtraProductsQuantity = extraProducts.reduce((sum, item) => sum + Number((item.quantity || 0)), 0);
    const totalExtraProductsGrossAmount = extraProducts.reduce((sum, item) => sum + ((item.salePrice * item.quantity)), 0);
    const totalExtraProductsTotalAmount = Math.floor(totalExtraProductsGrossAmount)

    const balance = (totalAmount + totalExtraProductsTotalAmount - flatDiscount + totalGst - paidAmount);

    dispatch(setTotalGrossAmount(totalGrossAmount + totalExtraProductsGrossAmount))
    dispatch(setTotalQty(totalQty + totalExtraProductsQuantity))
    dispatch(setTotalAmount(totalAmount + totalExtraProductsTotalAmount));
    dispatch(setTotalGst(totalGst));
    dispatch(setIsPaid(balance === 0 ? 'paid' : 'unpaid'));
  };

  const generateInvoice = async () => {

    if (!billType || !totalAmount) {
      alert("Please fill all the required fields.");
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to Generate the invoice? This action cannot be undone."
    );

    if (userConfirmed) {
      setIsLoading(true)
      try {
        const billItems = selectedItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          billItemDiscount: item.discount,
          billItemPrice: item.salePrice1,
          billItemPack: item.productPack,
          billItemUnit: item.billItemUnit,
        }))

        const response = await mockConfig.createInvoice({
          description,
          billType,
          billPaymentType: "cash",
          customer: customerId,
          billItems,
          flatDiscount: flatDiscount || 0,
          billStatus: parseInt(totalAmount - paidAmount - flatDiscount) === 0 ? 'paid' : 'unpaid',
          totalAmount: totalAmount || 0,
          paidAmount: paidAmount || 0,
          dueDate,
          extraItems: extraProducts
        });

        if (response) {
          console.log("response: ", response);
          dispatch(setSelectedItems([]))
          dispatch(setFlatDiscount(0))
          dispatch(setTotalQty(0))
          dispatch(setTotalAmount(0))
          dispatch(setTotalGrossAmount(0))
          dispatch(setPaidAmount(''))
          dispatch(setPreviousBalance(0))
          dispatch(setProductName(''))
          dispatch(setProductQuantity(''))
          dispatch(setProductDiscount(''))
          dispatch(setProductPrice(''))
          dispatch(setProduct({}))
          dispatch(setCustomer(null));
          dispatch(setExtraProducts([]))
        }

        setViewBillNo(billNo)
        setIsInvoiceGenerated(true);
        fetchLastBillNo(billType)

        if (response) {
          const allProductsBefore = await mockConfig.fetchAllProducts();
          if (allProductsBefore.data) {
            dispatch(setAllProducts(allProductsBefore.data));
          }
        }

      } catch (error) {
        console.error('Failed to generate bill', error)
        const errorMessage = error.message || 'Failed to generate invoice'
        setBillError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const clearInvoice = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to clear the invoice?"
    );

    if (userConfirmed) {
      dispatch(setSelectedItems([]));
      dispatch(setFlatDiscount(0));
      dispatch(setTotalQty(0));
      dispatch(setTotalAmount(0));
      dispatch(setTotalGrossAmount(0));
      dispatch(setPaidAmount(''));
      dispatch(setPreviousBalance(0));
      dispatch(setProductName(''));
      dispatch(setProductQuantity(''));
      dispatch(setProductDiscount(''));
      dispatch(setProductPrice(''));
      dispatch(setProduct({}));
      dispatch(setExtraProducts([]));
    }
  };

  const generateQuotation = () => {
    if (!billType || !billPaymentType || !totalAmount) {
      alert("Please fill all the required fields.");
      return;
    }

    const userConfirmed = window.confirm(
      "Do you want to save this as a Quotation?"
    );

    if (userConfirmed) {
      const quotation = {
        id: Date.now(),
        description,
        billType,
        billPaymentType,
        customer: customerId,
        billItems: selectedItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          billItemDiscount: item.discount,
          billItemPrice: item.salePrice1,
          billItemPack: item.productPack,
          billItemUnit: item.billItemUnit,
        })),
        flatDiscount: flatDiscount || 0,
        totalAmount: totalAmount || 0,
        paidAmount: paidAmount || 0,
        dueDate,
        extraItems: extraProducts,
        createdAt: new Date().toISOString()
      };

      alert("Quotation saved successfully ✅");
    }
  };

  const handleViewBill = (billNo) => {
    navigate(`/${primaryPath}/sales/view-bill/${billNo}`);
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customerData?.filter((customer) =>
    customer?.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const componentRef = useRef();

  const handleDirectPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleFullyPaid = async () => {

    if (!billType || !billPaymentType || !totalAmount) {
      alert("Please fill all the required fields.");
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to Generate the invoice? This action cannot be undone."
    );

    const billId = billNo || ""

    if (!userConfirmed) return;

    if (userConfirmed) {
      setIsLoading(true)
      try {
        const billItems = selectedItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          billItemDiscount: item.discount,
          billItemPrice: item.salePrice1,
          billItemPack: item.productPack,
          billItemUnit: item.billItemUnit,
        }))

        const response = await mockConfig.createInvoice({
          description,
          billType,
          billPaymentType: "cash",
          customer: customerId,
          billItems,
          flatDiscount: 0,
          billStatus: 'paid',
          totalAmount: totalAmount || 0,
          paidAmount: totalAmount || 0,
          dueDate,
          extraItems: extraProducts
        });

        if (response) {
          console.log("response: ", response);
          dispatch(setSelectedItems([]))
          dispatch(setFlatDiscount(0))
          dispatch(setTotalQty(0))
          dispatch(setTotalAmount(0))
          dispatch(setTotalGrossAmount(0))
          dispatch(setPaidAmount(''))
          dispatch(setPreviousBalance(0))
          dispatch(setProductName(''))
          dispatch(setProductQuantity(''))
          dispatch(setProductDiscount(''))
          dispatch(setProductPrice(''))
          dispatch(setProduct({}))
          dispatch(setCustomer(null));
          dispatch(setExtraProducts([]))
        }
        setViewBillNo(billNo)
        fetchLastBillNo(billType)

        if (response) {
          const allProductsBefore = await mockConfig.fetchAllProducts();
          if (allProductsBefore.data) {
            dispatch(setAllProducts(allProductsBefore.data));
          }
        }

      } catch (error) {
        console.error('Failed to generate bill', error)
        const errorMessage = error.message || 'Failed to generate invoice'
        setBillError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (!billError) {
      try {
        setIsLoading(true)
        const response = await mockConfig.fetchSingleBill(billNo)

        if (response.data) {
          setBill(response.data);
        }
      } catch (error) {
        const errorMessage = error.message || 'Failed to fetch bill'
        setBillError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
  };

  useEffect(() => {
    if (bill) {
      handleDirectPrint();
      setBill(null)
    }
  }, [bill]);

  useEffect(() => {
    console.log('extraProducts', extraProducts)
  }, [extraProducts])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && product) {
        handleAddProduct();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [product]);

  const fetchLastBillNo = async (billType) => {
    setIsLoading(true)
    try {
      const response = await mockConfig.getLastBillNo(billType)
      if (response) setBillNo(response.data.nextBillNo)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLastBillNo(billType)
  }, [billType])

  useEffect(() => {
    updateTotals();
  }, [selectedItems, paidAmount, previousBalance, extraProducts]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19);
      dispatch(setDate(localDateTime));
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = allProducts.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const top200Products = results.slice(0, 250)
      dispatch(setSearchQueryProducts(top200Products));
    } else {
      dispatch(setSearchQueryProducts([]));
    }
  }, [searchQuery, allProducts, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && searchQuery.trim() !== '') {
        const product = allProducts.find(
          (product) =>
            product.productCode?.toLowerCase() === searchQuery.toLowerCase()
        );

        if (product) {
          handleSelectProduct(product);
          setTimeout(() => {
            handleAddProduct();
          }, 100);
        }
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [searchQuery, allProducts, product, dispatch]);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }
  }, [selectedItems]);

  useEffect(() => {
    if (selectedCustomer === 'add') {
      setShowAddCustomer(true);
      setSelectedCustomer('');
    }
  }, [selectedCustomer]);

  // Initialize with dummy products on mount
  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(setAllProducts(DUMMY_PRODUCTS));
    }
  }, []);

  return (!isLoading ?
    (<div className="w-full mx-auto p-2 bg-white rounded shadow-lg overflow-auto max-h-[90vh]">

      {/* Popup Modal */}
      {(isInvoiceGenerated || billError) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center relative">
            <span className='absolute top-0 pt-1 right-2'>
              <button className='hover:text-red-700' onClick={() => {
                setIsInvoiceGenerated(false)
                setBillError('')
              }}>&#10008;</button>
            </span>
            <h2 className={`${billError && 'text-red-500'} text-lg font-thin mb-4`}>{billError ? billError : 'Invoice generated successfully!'}</h2>
            {isInvoiceGenerated &&
              <Button className='px-4 text-xs' onClick={() => handleViewBill(viewBillNo)}>
                View Invoice
              </Button>}
          </div>
        </div>
      )}

      {showAddExtraProductModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Extra Item</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddExtraProductModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Item Name</label>
                <input
                  type="text"
                  value={extraProduct.itemName}
                  onChange={(e) => setExtraProduct({ ...extraProduct, itemName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Sale Price</label>
                <input
                  type="number"
                  value={extraProduct.salePrice}
                  onChange={(e) => setExtraProduct({ ...extraProduct, salePrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Quantity</label>
                <input
                  type="number"
                  value={extraProduct.quantity}
                  onChange={(e) => setExtraProduct({ ...extraProduct, quantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

            </div>

            <div className="flex justify-end space-x-3 mt-6 text-xs">
              <Button
                onClick={() => setShowAddExtraProductModal(false)}
                className="px-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  dispatch(setExtraProducts([...extraProducts, { ...extraProduct, id: extraProducts.length + 101 }]))
                  setShowAddExtraProductModal(false)
                }}
                className="px-2"
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddCustomer && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40'
          onClick={() => setShowAddCustomer(false)
          }
        >
          <AddCustomer
            onCustomerCreated={(newCustomer) => {
              dispatch(setCustomer(newCustomer?._id));
              setCustomerFlag(newCustomer?.customerFlag);
              setSelectedCustomer(newCustomer._id);
            }}
          />
        </div>
      )}

      <div style={{ display: "none" }}>
        {billType === "thermal" ? (
          <ViewBillThermal
            ref={componentRef}
            bill={bill ? bill : {}}
            packingSlip={false}
            exemptedParagraph={false}
            showPreviousBalance={false}
            previousBalance={0}
          />
        ) : (
          <ViewBill
            ref={componentRef}
            bill={bill ? bill : {}}
            packingSlip={false}
            exemptedParagraph={false}
            showPreviousBalance={false}
            previousBalance={0}
          />
        )}
      </div>

      {/* Invoice Information */}
      <div className="mb-2">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Input
            label='Bill No:'
            placeholder='Enter Bill Number'
            labelClass="w-28"
            divClass="flex  items-center"
            className='w-44 text-xs p-1'
            value={billNo && billNo || 0}
            readOnly
          />

          <Input
            label='Date & Time:'
            divClass="flex items-center"
            labelClass="w-28"
            className='w-44 text-xs p-1'
            type='datetime-local'
            value={date || ''}
            onChange={(e) => dispatch(setDate(e.target.value))}
          />

          <div className='flex gap-2'>
            <Input
              label='Description:'
              placeholder='Enter Description'
              divClass="flex items-center"
              labelClass="w-20"
              className='w-28 text-xs p-1 '
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button className={`w-40 px-4 ${billType === 'thermal' ? 'hover:bg-red-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? 'bg-red-600' : A4Color.a4500}
              onClick={clearInvoice}>
              <p className='text-xs text-white'>Clear Invoice</p>
            </Button>
          </div>

          <label className="ml-1 flex items-center">
            <span className="w-28">Bill Type: <span className='text-red-600'>*</span></span>
            <select
              onChange={(e) => setBillType(e.target.value)}
              className={`${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} border p-1 rounded text-xs w-44`}
              value={billType}
            >
              <option value="thermal">Thermal</option>
              <option value="A4">A4</option>
            </select>
          </label>

          <Input
            label='Due Date:'
            divClass="flex items-center "
            type="date"
            labelClass="w-28 text-red-600"
            className='w-44 text-xs p-1 text-red-600'
            value={dueDate || ''}
            onChange={(e) => setDueDate(e.target.value)}
          >
          </Input>

          <label className="ml-1 flex gap-2 items-start">
            <span className="w-28 mb-1">Customer Name:</span>
            <input
              type="text"
              placeholder="Search Customers..."
              className={`${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} border p-1 rounded text-xs mb-1 w-20`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              value={selectedCustomer}
              onChange={(e) => {
                const customerId = e.target.value;
                setSelectedCustomer(customerId);
                dispatch(setCustomer(customerId));
                const customer = customerData.find((c) => c._id === customerId);
                setCustomerFlag(customer?.customerFlag);
                document.title = customer.customerName || 'Sale Item'
              }}
              className={`${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} border p-1 rounded text-xs w-full`}
            >
              <option value="">Select Customer</option>
              <option value="add"
                onClick={() => setShowAddCustomer(true)}
              >+ Add New Customer</option>
              {filteredCustomers?.map((customer, index) => {
                const flag =
                  customer.customerFlag === "white" ? "⚪" :
                    customer.customerFlag === "yellow" ? "🟡" :
                      customer.customerFlag === "green" ? "🟢" :
                        "🔴";
                return (
                  <option
                    key={index}
                    onClick={() => setCustomerIndex(index)}
                    value={customer._id}
                  >
                    {customer.customerName} {flag}
                  </option>
                )
              })}
            </select>
          </label>
        </div>
      </div>

      <div className='w-full border border-gray-100 my-3'></div>

      {/* Product Search */}
      <div className="mb-2">
        <div className="grid grid-cols-12 gap-2 text-xs">

          <Input
            label='Search:'
            placeholder='Search by Name / Item code'
            divClass="flex items-center col-span-4"
            labelClass="w-24"
            className='w-44 text-xs p-1'
            value={searchQuery || ''}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const product = allProducts.find(
                  (product) =>
                    product.productCode?.toLowerCase() === searchQuery.toLowerCase() ||
                    product.productName?.toLowerCase() === searchQuery.toLowerCase()
                );

                if (product) {
                  const newProduct = {
                    ...product,
                    maxQuantity: product.productTotalQuantity
                  }
                  handleSelectProduct(newProduct);
                  setTimeout(() => {
                    handleAddProduct();
                  }, 100);
                }

                dispatch(setSearchQuery(''));
              }
            }}
          />

          <Input
            label='Item Name:'
            divClass="flex items-center col-span-4"
            labelClass="w-24"
            className='w-44 text-xs p-1'
            value={productName ?? ''}
            readOnly
          />

          <div className='col-span-2 flex items-center'>
            <div className={`w-full rounded-md ${billType === 'thermal' ? "bg-purple-500" : A4Color.a4100}`}>
              <QuotationComponent
                selectedItems={selectedItems}
                totalAmount={totalAmount}
                billType={billType}
                billPaymentType={billPaymentType}
                flatDiscount={flatDiscount}
              />
            </div>
          </div>

          <div className='col-span-2 flex items-center'>
            <Button
              className="px-4 w-40 hover:bg-emerald-800"
              bgColor={billType === 'thermal' ? "bg-emerald-700" : A4Color.a4500}
              onClick={() => setShowQuotationListModal(true)}
            >
              <p className="text-xs text-white">Quotation List</p>
            </Button>
          </div>

          {showQuotationListModal &&
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <QuotationList
                onClose={() => setShowQuotationListModal(false)}
                onLoadQuotation={(q) => {
                  const payload = q.payload ?? {};
                  const items =
                    payload._rawSelectedItems ??
                    q.items ?? [];

                  dispatch(setSelectedItems(items));
                  dispatch(setFlatDiscount(payload.flatDiscount ?? 0));
                  dispatch(setTotalAmount(payload.totalAmount ?? q.total ?? 0));
                  dispatch(setPaidAmount(payload.paidAmount ?? 0));
                  dispatch(setPreviousBalance(0));
                  dispatch(setTotalQty(0));
                  dispatch(setTotalGrossAmount(0));
                  dispatch(setProductName(""));
                  dispatch(setProductQuantity(""));
                  dispatch(setProductDiscount(""));
                  dispatch(setProductPrice(""));
                  dispatch(setProduct({}));

                  if (payload.customer !== undefined) {
                    dispatch(setCustomer(payload.customer ?? null));
                  }
                  if (payload.description !== undefined) {
                    setDescription(payload.description ?? "");
                  }

                  setBillPaymentType("cash");

                  if (payload.dueDate !== undefined) {
                    setDueDate(payload.dueDate ?? "");
                  }
                  if (payload.extraItems !== undefined) {
                    dispatch(setExtraProducts(payload.extraItems ?? []));
                  }

                  alert(`Quotation "${q.name}" loaded into invoice ✅`);
                }}
              />
            </div>
          }

          <Input
            label='Discount %:'
            divClass="flex items-center col-span-4"
            type="number"
            labelClass="w-24"
            className='w-44 text-xs p-1'
            value={productDiscount && productDiscount || ''}
            onChange={handleDiscountChange}
          >
            {discountError && <p className="pl-2 text-red-500 text-xs">{discountError}</p>}
          </Input>

          <Input
            label='Quantity:'
            divClass="flex items-center col-span-4"
            labelClass="w-24"
            type="number"
            className='w-44 text-xs p-1'
            value={productQuantity || ''}
            onChange={handleQuantityChange}
          >
            {quantityError && <p className="pl-2 text-red-500 text-xs">{quantityError}</p>}
          </Input>

          <div className=' col-span-2'>
            <Button
              className={`px-4 w-40  ${billType === 'thermal' ? 'hover:bg-blue-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? thermalColor.th500 : A4Color.a4500}
              onClick={handleAddProduct}
            >
              <p className='text-xs text-gray-100'>Add</p>
            </Button>
          </div>

          <div className=' col-span-2'>
            <Button
              className={`px-4 w-40  ${billType === 'thermal' ? 'hover:bg-yellow-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? 'bg-yellow-600' : A4Color.a4500}
              onClick={() => setShowAddExtraProductModal(true)}
            >
              <p className='text-xs text-white'>Add Extra Item</p>
            </Button>
          </div>

          <Input
            label='Units / Packs:'
            divClass="flex items-center col-span-4"
            labelClass="w-24"
            type="number"
            className='w-44 text-xs p-1'
            value={productUnits && productUnits || ''}
            readOnly
          >
            {discountError && <p className="pl-2 text-red-500 text-xs">{discountError}</p>}
          </Input>

          <Input
            label='Price:'
            divClass="flex items-center col-span-4"
            labelClass="w-24"
            type="number"
            className='w-44 text-xs p-1'
            value={productPrice && productPrice || ''}
            onChange={handlePriceChange}
          >
            {priceError && <p className="pl-2 text-red-500 text-xs">{priceError}</p>}
          </Input>

          <div className='col-span-2 '>
            <Button className={`w-40 px-4 ${billType === 'thermal' ? 'hover:bg-red-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? 'bg-cyan-600' : A4Color.a4500}
              onClick={handleFullyPaid}>
              <p className='text-xs text-white'>Fully Paid</p>
            </Button>
          </div>

          <div className=' col-span-2'>
            <Button
              className={`w-40 px-4 ${billType === 'thermal' ? 'hover:bg-green-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? 'bg-green-600' : 'bg-primary'}
              onClick={generateInvoice}
            >
              <p className='text-xs text-white'>Generate Invoice</p>
            </Button>
          </div>

        </div>

        {/* Search Result Table */}
        {searchQuery && (
          <div className="mt-2 -ml-2 overflow-auto absolute w-[81%] max-h-72 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-20">
            <table className={`min-w-full ${billType === 'thermal' ? thermalColor.th200 : A4Color.a4200} border text-xs`}>
              <thead className={`bg-primary sticky -top-0 text-white border-b shadow-sm z-10`}>
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
                </tr>
              </thead>
              <tbody>
                {searchQueryProducts?.length ? searchQueryProducts.map((product, index) => (
                  <tr key={index} className={`${billType === 'thermal' ? 'hover:bg-blue-300' : 'hover:bg-gray-300'} border-t cursor-pointer hover:bg-gray-300`} onClick={() => {
                    handleSelectProduct(product);
                  }}>
                    <td className="px-1 py-1">{product.productCode}</td>
                    <td className="px-1 py-1">{product.productName}</td>
                    <td className="px-1 py-1">{product.typeDetails[0]?.typeName}</td>
                    <td className="px-1 py-1">{product.productPack}</td>
                    <td className="px-1 py-1">{product.companyDetails[0]?.companyName}</td>
                    <td className="px-1 py-1">{product.vendorSupplierDetails[0]?.supplierName || product.vendorCompanyDetails[0]?.companyName}</td>
                    <td className="px-1 py-1">{product.categoryDetails[0]?.categoryName}</td>
                    <td className="px-1 py-1">
                      {customerFlag === "red" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice1}</p>
                      ) : customerFlag === "green" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice2}</p>
                      ) : customerFlag === "yellow" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice3}</p>
                      ) : customerFlag === "white" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice4}</p>
                      ) : (
                        <p>{product.salePriceDetails?.[0]?.salePrice1}</p>
                      )}
                    </td>
                    <td className="px-1 py-1">{Math.ceil(product.productTotalQuantity / product.productPack)}</td>
                    <td className="px-1 py-1">{Math.ceil(product.productTotalQuantity)} {product.packUnit?.toUpperCase()}</td>
                  </tr>
                )) : <tr className='text-center w-full'>
                  <td>No product found with name or code</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Table */}
      <div>
        <div className="overflow-auto max-h-40 scrollbar-thin" ref={tableContainerRef}>
          <table className="min-w-full bg-white border text-xs ">
            <thead className={`bg-primary/80 sticky text-white -top-0 border-b shadow-sm z-10`}>
              <tr className={` border-b`}>
                <th className="py-2 px-1 text-left">S No</th>
                <th className="py-2 px-1 text-left">Name</th>
                <th className="py-2 px-1 text-left">Qty</th>
                <th className="py-2 px-1 text-left">Units</th>
                <th className="py-2 px-1 text-left">Rate</th>
                <th className="py-2 px-1 text-left">G Amount</th>
                <th className="py-2 px-1 text-left">Extra Discount %</th>
                <th className="py-2 px-1 text-left">Net Amount</th>
                <th className="py-2 px-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems && selectedItems?.map((item, index) => {
                const grossAmount = (item.salePrice1 * (item.billItemUnit / item.productPack + item.quantity));
                const netAmount = (grossAmount * (1 - item.discount / 100)).toFixed(2);

                return (
                  <tr key={index} className={`border-t bg-primary/20`}>
                    <td className=" px-1">{index + 1}</td>
                    <td className=" px-1">{item.productName}</td>
                    <td className=" px-1 flex items-start">
                      <div className='flex items-center gap-1 bg-white rounded px-1'>
                        <Input
                          type="number"
                          step="any"
                          className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
                        />
                        <span>{item.quantityUnit?.toUpperCase() || 'PCS'}</span>
                      </div>
                    </td>
                    <td className=" px-1 ">
                      <div className='bg-white w-28 rounded'>
                        <div className='flex items-center justify-start w-20 gap-1 bg-white'>
                          <Input
                            type="number"
                            className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                            value={item.billItemUnit || ''}
                            onChange={(e) => {
                              handleItemChange(index, "billItemUnit", parseInt(e.target.value))
                            }}
                          />
                          <span>{item.packUnit?.toUpperCase() || 'PCS'}</span>
                        </div>
                      </div>
                    </td>
                    <td className=" px-1 ">
                      <input
                        type="text"
                        className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} bg-white`}
                        value={
                          typeof item.salePrice1 === "number" && !isNaN(item.salePrice1)
                            ? item.salePrice1.toFixed(2)
                            : ""
                        }
                        onChange={(e) =>
                          handleItemChange(index, "salePrice1", parseFloat(e.target.value) || 0)
                        }
                      />
                    </td>
                    <td className=" px-1">{grossAmount.toFixed(2)}</td>
                    <td className=" px-1">
                      <input
                        type="text"
                        className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                        value={item.discount || ''}
                        onChange={(e) => handleExtraDiscountChange(index, e.target.value)}
                      />
                    </td>
                    <td className=" px-1">{netAmount}</td>
                    <td className=" px-1">
                      <button
                        className={`px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-700 rounded-lg`}
                        onClick={() => handleRemoveItem(index)}
                      >
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* extra products */}
              {extraProducts && extraProducts?.map((item, index) => {
                const grossAmount = (parseFloat(item.salePrice) * parseFloat(item.quantity));
                const netAmount = (grossAmount).toFixed(2);

                return (
                  <tr key={index} className={`border-t bg-primary/20`}>
                    <td className=" px-1">{selectedItems.length + index + 1}</td>
                    <td className=" px-1">{item.itemName}</td>
                    <td className=" px-1">{item.quantity}</td>
                    <td className=" px-1"></td>
                    <td className=" px-1">{item.salePrice}</td>
                    <td className=" px-1">{grossAmount.toFixed(2)}</td>
                    <td className=" px-1"></td>
                    <td className=" px-1">{netAmount}</td>
                    <td className=" px-1">
                      <button
                        className={`px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-700 rounded-lg`}
                        onClick={() => {
                          dispatch(removeExtraItem(index))
                          updateTotals()
                        }}
                      >
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className={`mt-4 p-2 border-t border-gray-300 bg-primary/30`}>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="col-span-1">
            <Input
              label='Total Quantity:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={totalQty || 0}
              readOnly
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Total Discount on Items:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={totalAmount && ((totalGrossAmount - totalAmount).toFixed(2)) || 0}
              readOnly
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Total Amount:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={totalAmount && totalAmount.toFixed(2) || 0}
              readOnly
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Total GST:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              readOnly
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Flat Discount:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={flatDiscount && flatDiscount || 0}
              onChange={(e) => dispatch(setFlatDiscount(parseFloat(e.target.value)))}
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Paid Amount:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={paidAmount || 0}
              onChange={(e) => {
                dispatch(setPaidAmount(parseFloat(e.target.value) || 0));
                dispatch(setFlatDiscount(0));
              }}
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Bill Status:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={isPaid}
              readOnly
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Add remaining balance to Discount:'
              type='checkbox'
              divClass="flex items-center"
              labelClass="w-52"
              className='w-24 text-xs p-1'
              checked={flatDiscount !== 0}
              onChange={(e) => {
                e.target.checked ? dispatch(setFlatDiscount((totalAmount + totalGst - paidAmount)))
                  : dispatch(setFlatDiscount(0))
              }}
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Bill Balance:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={(totalAmount && (totalAmount - flatDiscount + totalGst - paidAmount).toFixed(2)) || 0}
              onChange={(e) => dispatch(setIsPaid(totalAmount === 0 ? 'paid' : 'unpaid'))}
              readOnly
            />
          </div>
        </div>
      </div>

    </div>)
    :
    (<Loader h_w='h-16 w-16 border-t-4 border-b-4' message='Loading please Wait...' />)
  );
};

export default InvoiceComponent;

