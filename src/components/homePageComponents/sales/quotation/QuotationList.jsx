/* eslint-disable react/prop-types */
// src/components/QuotationList.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    getQuotations,
    deleteQuotation,
    deleteQuotations,
    clearQuotations,
} from "../../../../utils/quotationStorage";
import Button from "../../../Button";

export default function QuotationList({ onLoadQuotation, onClose }) {
    const [quotations, setQuotations] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(new Set());
    const [preview, setPreview] = useState(null); // quotation to preview

    const previewRef = useRef(); // for printing preview
    const listRef = useRef();    // optional: for printing list

    // react-to-print hook
    const handlePrintPreview = useReactToPrint({
        content: () => previewRef.current,
        documentTitle: preview?.name || "Quotation",
    });

    const handlePrintList = useReactToPrint({
        content: () => listRef.current,
        documentTitle: "Quotations List",
    });

    useEffect(() => {
        setQuotations(getQuotations());
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return quotations;
        return quotations.filter((x) => {
            const name = (x.name || "").toLowerCase();
            const idStr = String(x.id || "");
            return name.includes(q) || idStr.includes(q);
        });
    }, [quotations, query]);

    const allChecked = filtered.length > 0 && filtered.every((x) => selected.has(String(x.id)));

    const toggleOne = (id) => {
        const s = new Set(selected);
        const key = String(id);
        s.has(key) ? s.delete(key) : s.add(key);
        setSelected(s);
    };

    const toggleAll = () => {
        if (allChecked) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filtered.map((x) => String(x.id))));
        }
    };

    const handleDeleteOne = (id) => {
        if (!window.confirm("Delete this quotation?")) return;
        const next = deleteQuotation(id);
        setQuotations(next);
        setSelected((s) => {
            const t = new Set(s);
            t.delete(String(id));
            return t;
        });
    };

    const handleDeleteSelected = () => {
        if (selected.size === 0) {
            alert("No quotations selected.");
            return;
        }
        if (!window.confirm(`Delete ${selected.size} selected quotation(s)?`)) return;
        const next = deleteQuotations(Array.from(selected));
        setQuotations(next);
        setSelected(new Set());
    };

    const handleClearAll = () => {
        if (!window.confirm("Delete ALL quotations? This cannot be undone.")) return;
        clearQuotations();
        setQuotations([]);
        setSelected(new Set());
    };

    const handleLoad = (q) => {
        // Pass the entire object upward; parent decides how to restore into invoice
        if (typeof onLoadQuotation === "function") onLoadQuotation(q);
    };

    const formatMoney = (n) => {
        const num = Number(n);
        return Number.isFinite(num) ? num.toFixed(2) : "0.00";
        // (safe against strings/undefined)
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold">Saved Quotations</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name or ID"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                    <button
                        onClick={handleDeleteSelected}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                        Delete Selected
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="overflow-auto max-h-96 rounded border" ref={listRef}>
                <table className="min-w-full text-xs">
                    <thead className="sticky top-0 bg-gray-100 border-b">
                        <tr>
                            <th className="px-2 py-2 w-8">
                                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                            </th>
                            <th className="px-2 py-2 text-left">Name</th>
                            <th className="px-2 py-2 text-left">ID</th>
                            <th className="px-2 py-2 text-left">Created</th>
                            <th className="px-2 py-2 text-right">Total</th>
                            <th className="px-2 py-2 text-right">Items</th>
                            <th className="px-2 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-2 py-6 text-center text-gray-500">
                                    No quotations found.
                                </td>
                            </tr>
                        ) : (
                            filtered
                                .slice()
                                .reverse() // show newest first
                                .map((q) => {
                                    const itemCount =
                                        (q.payload?._rawSelectedItems?.length ??
                                            q.items?.length ??
                                            q.payload?.billItems?.length ??
                                            0);
                                    return (
                                        <tr key={q.id} className="border-t hover:bg-gray-50">
                                            <td className="px-2 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(String(q.id))}
                                                    onChange={() => toggleOne(q.id)}
                                                />
                                            </td>
                                            <td className="px-2 py-2">{q.name || "(Untitled)"}</td>
                                            <td className="px-2 py-2">{q.id}</td>
                                            <td className="px-2 py-2">
                                                {q.createdAt
                                                    ? new Date(q.createdAt).toLocaleString()
                                                    : "-"}
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                {formatMoney(q.payload?.totalAmount ?? q.total)}
                                            </td>
                                            <td className="px-2 py-2 text-right">{itemCount}</td>
                                            <td className="px-2 py-2 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                                                        onClick={() => {
                                                            console.log('q', q)
                                                            setPreview(q)
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => {
                                                            handleLoad(q)
                                                            onClose()
                                                        }}
                                                    >
                                                        Load
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                                                        onClick={() => handleDeleteOne(q.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                        )}
                    </tbody>
                </table>

            </div>

            <div className="flex justify-end p-2">
                <Button
                    className="px-2"
                    onClick={onClose}
                >Close</Button>
            </div>

            {/* Preview Modal */}
            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white max-w-3xl w-full mx-4 rounded-2xl shadow p-6 relative">
                        <button
                            className="absolute right-3 top-2 text-lg"
                            onClick={() => setPreview(null)}
                            title="Close"
                        >
                            ×
                        </button>
                        <div ref={previewRef} >
                            <h4 className="text-base font-semibold mb-3">
                                PARKO ELECTRIC AND ELECTRONICS
                            </h4>

                            <div className="grid grid-cols-2 gap-3 text-[10px] mb-4">
                                <div><span className="text-gray-500">ID:</span> {preview.id}</div>
                                <div>
                                    <span className="text-gray-500">Created:</span>{" "}
                                    {preview.createdAt
                                        ? new Date(preview.createdAt).toLocaleString()
                                        : "-"}
                                </div>
                                <div>
                                    <span className="text-gray-500">Bill Type:</span>{" "}
                                    Quotation
                                </div>
                                <div>
                                    <span className="text-gray-500">Payment Type:</span>{" "}
                                    {preview.payload?.billPaymentType ?? "-"}
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500">Description:</span>{" "}
                                    {preview.payload?.description ?? "-"}
                                </div>
                            </div>

                            <div className="overflow-auto max-h-72 border rounded  print:overflow-visible print:max-h-none">
                                <table className="min-w-full text-xs">
                                    <thead className="sticky text-[10px] top-0 bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-2 py-2 text-left">#</th>
                                            <th className="px-2 py-2 text-left">Product</th>
                                            <th className="px-2 py-2 text-right">Qty</th>
                                            <th className="px-2 py-2 text-right">Units</th>
                                            <th className="px-2 py-2 text-right">Units / QTY</th>
                                            <th className="px-2 py-2 text-right">Price</th>
                                            <th className="px-2 py-2 text-right">Discount</th>
                                            <th className="px-2 py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(preview.payload?._rawSelectedItems ?? preview.items ?? []).map((it, idx) => (
                                            <tr key={idx} className="border-t text-[8px]">
                                                <td className="px-2">{idx + 1}</td>
                                                <td className="px-2">{it.productName ?? it.name ?? it.productCode ?? it.productId ?? "-"}</td>
                                                <td className="px-2 text-right">{it.quantity ?? "-"}</td>
                                                <td className="px-2 text-right">{it.billItemUnit !==0 ? it.billItemUnit : "-"}</td>
                                                <td className="px-2 text-right">{it.productPack ?? "-"}</td>
                                                <td className="px-2 text-right">
                                                    {formatMoney(it.salePrice1 ?? it.price ?? 0)}
                                                </td>
                                                <td className="px-2 text-right">
                                                    {formatMoney(it.discount ?? 0)}
                                                </td>
                                                <td className="px-2 text-right">
                                                    {formatMoney((it.salePrice1 * (it.billItemUnit / it.productPack + it.quantity))?? 0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm">
                                <div>
                                    {/* <span className="text-gray-500">Flat Discount:</span>{" "}
                                    {formatMoney(preview.payload?.flatDiscount ?? 0)} */}
                                </div>
                                <div className="font-semibold">
                                    Total: {formatMoney(preview.payload?.totalAmount ?? preview.total)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={handlePrintPreview}
                            >
                                Print
                            </button>
                            <button
                                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setPreview(null)}
                            >
                                Close
                            </button>
                            <button
                                className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => {
                                    handleLoad(preview);
                                    setPreview(null);
                                    onClose()
                                }}
                            >
                                Load into Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
