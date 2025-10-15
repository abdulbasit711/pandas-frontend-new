/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../../../Logo';
import commonFunction from '../../../../features/functions';
import billLogo from '../../../../assets/billLogo.jpg'
import paymentQR from '../../../../assets/paymentQR.jpg'
// import { useSelector } from 'react-redux';

// ViewBill component wrapped in forwardRef
const ViewBill = React.forwardRef((props, ref) => {

    const bill = props.bill;
    const packingSlip = props.packingSlip
    const previousBalance = props.previousBalance
    const showPreviousBalance = props.showPreviousBalance
    const showExemptedParagraph = props.exemptedParagraph

    const exemptedParagraph = bill?.BusinessId?.exemptedParagraph

    return bill && (
        <div className=' h-[28rem] shadow-lg overflow-y-auto scrollbar-thin'>
            <div ref={ref} className="view-bill p-4 pt-8 bg-white" >
                {/* Business Information */}
                <div className="flex justify-center">

                    <div className='ml-5'>
                        <img src={billLogo} alt="" className='w-36' />
                    </div>

                    <div className='text-center w-full'>
                        <div className='flex pl-4'>
                            
                            <div className='flex items-end justify-center ml-5'>
                                <span className='text-4xl font-extrabold pb-2 pr-2'>PARKO </span> <h2 className="text-xl font-bold pb-2"> ELECTRIC AND ELECTRONICS</h2>
                                <span className='text-xs pb-6 pl-2'>RTM 294967</span>
                            </div>
                        </div>
                        <p className="text-sm ">{bill?.storeAddress}</p>
                        <p className="text-sm text-left ml-10 "><span className='font-bold'>Phone</span> &#128382;: {bill?.BusinessId?.owner?.mobileno?.map((num, i) => <span className='px-1' key={i}>{num}</span>)} | <span className='font-bold'>Address</span> &#10003;: {bill?.BusinessId?.businessRegion}</p>
                        <h3 className="text-xl font-bold mt-4 text-left ml-10">{packingSlip ? 'Packing Slip' : 'Sale Invoice'}</h3>
                    </div>
                    <div></div>
                </div>

                <div className='w-full flex justify-center'><div className='border-b-2 my-5 w-4/5'></div></div>

                {/* Invoice and Customer Information */}
                <div className="flex justify-between mb-4">
                    {/* Customer Info */}
                    <div className="text-left">
                        <p className='font-semibold'><strong className='font-bold'>Customer Name:</strong> {bill?.customer?.customerName}</p>
                        <p className='font-semibold'><strong className='font-bold'>NTN:</strong> {bill?.customer?.ntnNumber}</p>
                        <p className='font-semibold'><strong className='font-bold'>Mobile Number:</strong> {bill?.customer?.mobileNo}</p>
                        <p className='font-semibold'><strong className='font-bold'>Address:</strong> {bill?.customer?.customerRegion}</p>
                    </div>
                    {/* Invoice Info */}
                    <div className=''>
                        <div className="text-left">
                            <p className='font-semibold'>Invoice No: <strong className='pr-1 font-bold'>{bill?.billNo}</strong> </p>
                            <p><strong className='pr-1'>Date:</strong>{
                                bill?.createdAt &&
                                new Date(bill?.createdAt).toLocaleString("en-PK", {
                                    timeZone: "Asia/Karachi",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })
                            }</p>
                        </div>
                    </div>
                </div>
                {/* Items Section */}
                <div className="my-6">
                    <table className="w-full border">
                        <thead className="border-2 border-black">
                            <tr>
                                <th className="text-xs text-left p-2">No.</th>
                                <th className="text-xs text-left p-2">Item Name</th>
                                <th className="text-xs text-left p-2">Company</th>
                                <th className="text-xs text-left p-2">Qty</th>
                                <th className="text-xs text-left p-2">Units/pack</th>
                                {
                                    !packingSlip && <th className="text-xs text-left p-2">Rate/pack</th>}
                                {
                                    !packingSlip && <th className="text-xs text-left p-2">Gross Am.</th>}
                                {
                                    !packingSlip &&
                                    <th className="text-xs text-left p-2">Extra Disc.</th>
                                }
                                {
                                    !packingSlip &&
                                    <th className="text-xs text-left p-2">Net Am.</th>
                                }                    </tr>
                        </thead>
                        <tbody>
                            {bill?.billItems && bill?.billItems.map((item, index) => (
                                <tr key={index} className="break-inside-avoid border-2 border-black">
                                    <td className="text-xs p-2">{index + 1}</td>
                                    <td className="text-xs p-2">{commonFunction.truncateString(item.productId.productName, 50)}</td>
                                    <td className="text-xs p-2">{commonFunction.truncateString(item.productId?.companyId?.companyName, 13)}</td>
                                    <td className="text-xs p-2">
                                        <div>
                                            {((item.quantity + item.billItemUnit / item.billItemPack) < 1 || item.quantity === 0) ? (item.billItemUnit) : (item.quantity + item.billItemUnit / item.billItemPack)?.toFixed(2)}
                                            <span> {((item.quantity + item.billItemUnit / item.billItemPack) < 1 || item.quantity === 0) ? (item.productId.packUnit)?.toUpperCase() || 'PCS' : (item.productId.quantityUnit)?.toUpperCase() || 'PCS'}</span>
                                        </div>
                                    </td>
                                    <td className="text-xs p-2">
                                        {item.billItemPack + " " + (item.productId?.packUnit?.toUpperCase() ||"PCS")}
                                    </td>
                                    {!packingSlip &&
                                        <td className="text-xs p-2">
                                            {(item.quantity + item.billItemUnit / item.billItemPack) < 1 ? commonFunction.formatAsianNumber(item.billItemPrice / item.billItemPack) : commonFunction.formatAsianNumber(item.billItemPrice)}
                                        </td>
                                        // <td className="text-xs p-2">
                                        //     {(item.quantity + item.billItemUnit / item.billItemPack) < 1 ? commonFunction.formatAsianNumber(((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice) -
                                        //         (((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice) * item.billItemDiscount / 100)) : commonFunction.formatAsianNumber(item.billItemPrice)}
                                        // </td>
                                    }
                                    {!packingSlip &&
                                        <td className="text-xs p-2">
                                            {commonFunction.formatAsianNumber(((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice))}
                                        </td>
                                    }
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber(item.billItemDiscount)}</td>
                                    }
                                    {!packingSlip &&
                                        <td className="text-xs p-2">
                                            {commonFunction.formatAsianNumber(((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice) -
                                                (((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice) * item.billItemDiscount / 100))}
                                        </td>
                                    }
                                </tr>
                            ))}

                            {bill.extraItems && bill.extraItems.map((item, index) => (
                                <tr key={index} className="text-xs break-inside-avoid border-2 border-black">
                                    <td className="text-xs p-2">{bill?.billItems.length + index + 1}</td>
                                    <td className="text-xs p-2">{commonFunction.truncateString(item.itemName, 30)}</td>
                                    <td className="text-xs p-2"></td>
                                    <td className="text-xs p-2">{item.quantity} PCS</td>
                                    {!packingSlip && <td className="text-xs p-2">{commonFunction.formatAsianNumber(item.salePrice)}</td>}
                                    {!packingSlip && <td className="text-xs p-2">
                                        {commonFunction.formatAsianNumber((item.quantity * item.salePrice))}
                                    </td>}
                                    <td className="text-xs p-2"></td>
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber((item.quantity * item.salePrice))}</td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Totals Section */}
                {!packingSlip &&
                    <div className='grid grid-cols-2 '>
                        <div className='flex justify-start pl-5'>
                            <img src={paymentQR} alt="" className=' h-32' />
                        </div>
                        <div className='flex justify-end pr-5'>
                            <div className=" mb-4 text-l border-2 border-black p-3">
                                <p className='font-semibold'><span className='inline-block font-medium w-44'>Total Gross Amount:</span> {bill && commonFunction.formatAsianNumber(bill.totalAmount)}</p>
                                <p className='font-semibold'><span className='inline-block font-medium w-44'>Discount Amount:</span> {bill && commonFunction.formatAsianNumber(bill.flatDiscount)}</p>
                                <p className='font-semibold'><span className='inline-block font-medium w-44'>Paid Amount:</span> {bill && commonFunction.formatAsianNumber(bill.paidAmount)}</p>
                                <p className='font-bold'><span className='inline-block font-medium w-44'>Bill Balance:</span> {bill && commonFunction.formatAsianNumber(bill?.totalAmount - bill?.flatDiscount - bill?.paidAmount)}</p>
                                {showPreviousBalance && <p className='font-bold'><span className='inline-block font-medium w-44'>Previous Balance:</span><span className='underline'> {previousBalance && commonFunction.formatAsianNumber(previousBalance - (bill?.totalAmount - bill?.flatDiscount - bill?.paidAmount))}</span></p>}
                                {showPreviousBalance && <p className='font-bold'><span className='inline-block font-medium w-44'>Total Balance:</span> {previousBalance && commonFunction.formatAsianNumber(previousBalance)}</p>}
                            </div>
                        </div>
                    </div>
                }

                {/* Signature Section */}
                <div className=''>
                    {showExemptedParagraph &&
                        <div className="text-center mt-3 text-xs font-semibold ">
                            {exemptedParagraph}
                        </div>
                    }
                    <div className='flex items-end justify-end gap-20'>
                        <p className='text-center text-[10px]'>Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk</p>
                        <div className="text-right mt-16 mr-24">
                            <p>____________________________</p>
                            <p className='mr-4'>Signature & Stamp</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Add displayName for better debugging
ViewBill.displayName = 'ViewBill';

export default ViewBill;
