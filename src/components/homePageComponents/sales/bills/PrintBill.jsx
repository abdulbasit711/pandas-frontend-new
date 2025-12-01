/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ViewBill from './ViewBill';
import Button from '../../../Button';
import { useParams } from 'react-router-dom';
import config from '../../../../features/config';
import Loader from '../../../../pages/Loader';
import ViewBillThermal from './ViewBillThermal';

// --- Dummy Bill Data ---
const dummyBill = {
  _id: "bill_001",
  billNo: "BILL-0001",
  createdAt: new Date().toISOString(),
  billStatus: "unpaid",
  isPosted: false,
  totalAmount: 45000,
  paidAmount: 15000,
  flatDiscount: 2000,
  customer: {
    _id: "cust_001",
    customerName: "Ahmed Enterprises"
  },
  BusinessId: {
    _id: "biz_001",
    businessName: "PANDAS",
    businessRegion: "Islamabad, Pakistan",
    exemptedParagraph: "All items are subject to 17% GST as per government regulations.",
    owner: {
      mobileno: ["03001234567", "03109876543"]
    }
  },
  billItems: [
    {
      _id: "item_001",
      productId: {
        _id: "prod_001",
        productName: "Laptop Pro 15 inch",
        quantityUnit: "pcs",
        packUnit: "box"
      },
      quantity: 2,
      billItemUnit: 0,
      billItemPack: 1,
      billItemPrice: 150000,
      billItemDiscount: 10
    },
    {
      _id: "item_002",
      productId: {
        _id: "prod_002",
        productName: "Wireless Mouse USB",
        quantityUnit: "pcs",
        packUnit: "pcs"
      },
      quantity: 5,
      billItemUnit: 0,
      billItemPack: 1,
      billItemPrice: 2500,
      billItemDiscount: 5
    },
    {
      _id: "item_003",
      productId: {
        _id: "prod_003",
        productName: "USB-C Cable 2m",
        quantityUnit: "pcs",
        packUnit: "pcs"
      },
      quantity: 10,
      billItemUnit: 0,
      billItemPack: 1,
      billItemPrice: 800,
      billItemDiscount: 0
    }
  ],
  extraItems: [
    {
      _id: "extra_001",
      itemName: "Installation Service",
      quantity: 1,
      salePrice: 2000
    }
  ]
};

const PrintBill = () => {

  const [bill, setBill] = useState(dummyBill);
  const [isLoading, setIsLoading] = useState(true)
  const [exemptedParagraph, setExemptedParagraph] = useState(false)
  const [packingSlip, setPackingSlip] = useState(false)
  const [showPreviousBalance, setShowPreviousBalance] = useState(false)
  const [previousBalance, setPreviousBalance] = useState(0)
  const [billType, setBillType] = useState('thermal')

  const componentRef = useRef();
  const { billId } = useParams()

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (bill && e.key === "Enter") {
        handlePrint();
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [bill]);
  


  // const pageStyle = `@page { size: auto; margin: 0.1in; } @media print { body { margin: 0.5in; } }`;
  // Function to handle printing the bill
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const handleSaveAsPDF = (billType) => {
    const invoiceElement = componentRef.current;

    // Define dimensions for thermal and A4 bills
    const THERMAL_WIDTH = 80; // Thermal width in mm
    const THERMAL_HEIGHT = 200; // Approximate thermal height in mm
    const A4_WIDTH = 210; // A4 width in mm
    const A4_HEIGHT = 295; // A4 height in mm

    html2canvas(invoiceElement, {
      scale: (billId.at(0) === 'T') ? 1 : 1, // Higher scale for better quality
      useCORS: true, // Allow external images
      logging: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let pdf;

      if (billId.at(0) === 'T') {
        // Thermal Bill - No Pagination
        const imgWidth = THERMAL_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf = new jsPDF("p", "mm", [THERMAL_WIDTH, imgHeight]); // Custom size for thermal
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // A4 Bill - Paginated
        const imgWidth = A4_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= A4_HEIGHT;

        while (heightLeft > 0) {
          position -= A4_HEIGHT;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= A4_HEIGHT;
        }
      }


      // Save the generated PDF
      pdf.save(`${billId}.pdf`);
    });
  };




  // return isLoading ? (
  return isLoading ? (

    <div>
      <div className='flex items-center gap-4'>
        <Button onClick={handlePrint} className='text-xs px-4 mb-2'>
          Print Bill
        </Button>
        <Button onClick={handleSaveAsPDF} className='text-xs px-4 mb-2'>
          Save in PDF
        </Button>
        <div className='text-xs mb-2 flex gap-2'>
          <label htmlFor="exempted" className=''>Add Exempted Paragraph:</label>
          <input type='checkbox' id='exempted' className='' checked={exemptedParagraph == true} onChange={() => setExemptedParagraph((prev) => !prev)} />
        </div>
        <div className='text-xs mb-2 flex gap-2'>
          <label htmlFor="packingSlip" className=''>Packing Slip:</label>
          <input type='checkbox' id='packingSlip' className='' checked={packingSlip == true} onChange={() => setPackingSlip((prev) => !prev)} />
        </div>
        {bill?.customer &&
          <div className='text-xs mb-2 flex gap-2'>
            <label htmlFor="showPreviousBalance" className=''>Show Previous Balance:</label>
            <input type='checkbox' id='showPreviousBalance' className='' checked={showPreviousBalance == true} onChange={() => setShowPreviousBalance((prev) => !prev)} />
          </div>
        }

        <div className='text-xs mb-2 flex items-center gap-2'>
            <label htmlFor="" className=''>Change Bill Type:</label>
            
            <select className="p-2 rounded-sm" id="" onChange={(e) => setBillType(e.target.value)} value={billType}>
              <option value="thermal">Thermal</option>
              <option value="A4">A4</option>
            </select>
          </div>

      </div>

      {/* Render the bill content */}
      {billType === 'thermal' ?
        <ViewBillThermal
          bill={bill}
          ref={componentRef}
          exemptedParagraph={exemptedParagraph}
          packingSlip={packingSlip}
          showPreviousBalance={showPreviousBalance}
          previousBalance={previousBalance}

        />
        :
        <ViewBill
          bill={bill}
          ref={componentRef}
          exemptedParagraph={exemptedParagraph}
          packingSlip={packingSlip}
          showPreviousBalance={showPreviousBalance}
          previousBalance={previousBalance}
        />
      }
    </div>
  ) :
    <Loader h_w="w-16 h-16 border-b-4 border-t-4" message='Loading bill...' />
};

export default PrintBill;
