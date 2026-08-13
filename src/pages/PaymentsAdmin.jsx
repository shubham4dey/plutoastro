import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";
 
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
 
const PaymentsAdmin = () => {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
 
  useEffect(() => {

    const load = async () => {

      try {

        const res = await axios.get(`${API}/api/admin/transactions`);

        if (res.data.success) setData(res.data);

      } catch (err) {

        toast.error("Failed to load transactions");

      } finally {

        setLoading(false);

      }

    };

    load();

  }, []);
 
  if (loading) {

    return (
<div className="min-h-screen flex items-center justify-center text-purple-300 text-xl">

        Loading payments...
</div>

    );

  }
 
  return (
<div className="min-h-screen bg-[#0f0f1a] text-white p-6 lg:p-10 lg:pt-32">
<div className="max-w-7xl mx-auto">

        {/* ✅ BACK BUTTON */}
<button

          onClick={() => navigate("/admin/dashboard")}

          className="mb-4 px-4 py-2 bg-purple-800/60 hover:bg-purple-700 text-purple-200 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
>

          ← Back to Dashboard
</button>
 
        <h1 className="text-3xl font-bold text-purple-200 mb-6">

          💳 Payments & Transactions
</h1>
 
        {/* Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
<div className="bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-30 rounded-2xl p-5">
<p className="text-purple-300 text-sm uppercase">Total Revenue (Recharge)</p>
<p className="text-green-400 text-3xl font-bold mt-1">₹{data?.totalRevenue || 0}</p>
</div>
<div className="bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-30 rounded-2xl p-5">
<p className="text-purple-300 text-sm uppercase">Total Spent (Chat/Call)</p>
<p className="text-red-400 text-3xl font-bold mt-1">₹{data?.totalSpent || 0}</p>
</div>
<div className="bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-30 rounded-2xl p-5">
<p className="text-purple-300 text-sm uppercase">Total Transactions</p>
<p className="text-white text-3xl font-bold mt-1">{data?.count || 0}</p>
</div>
</div>
 
        {/* Transactions Table */}
<div className="overflow-x-auto bg-[#1b1b2f] rounded-2xl border border-purple-500 border-opacity-30">
<table className="w-full text-sm">
<thead>
<tr className="border-b border-purple-800 text-purple-300 uppercase text-xs">
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">User</th>
<th className="p-4 text-left">Type</th>
<th className="p-4 text-left">Reason</th>
<th className="p-4 text-right">Amount</th>
<th className="p-4 text-right">Balance After</th>
<th className="p-4 text-left">Payment ID</th>
<th className="p-4 text-left">Status</th>
</tr>
</thead>
<tbody>

              {data?.transactions?.map((t) => (
<tr key={t._id} className="border-b border-purple-900 border-opacity-40 hover:bg-purple-900 hover:bg-opacity-20">
<td className="p-4 text-gray-400">

                    {new Date(t.createdAt).toLocaleString("en-IN")}
</td>
<td className="p-4">
<p className="text-white font-medium">{t.userId?.name || "N/A"}</p>
<p className="text-gray-500 text-xs">{t.userId?.email || "—"}</p>
</td>
<td className="p-4">
<span className={`px-2 py-1 rounded-full text-xs font-semibold ${

                      t.type === "credit"

                        ? "bg-green-600 bg-opacity-30 text-green-300"

                        : "bg-red-600 bg-opacity-30 text-red-300"

                    }`}>

                      {t.type === "credit" ? "⬇️ IN" : "⬆️ OUT"}
</span>
</td>
<td className="p-4 text-gray-300">{t.reason}</td>
<td className={`p-4 text-right font-bold ${

                    t.type === "credit" ? "text-green-400" : "text-red-400"

                  }`}>

                    {t.type === "credit" ? "+" : "-"}₹{t.amount}
</td>
<td className="p-4 text-right text-gray-300">₹{t.balanceAfter}</td>
<td className="p-4 text-gray-500 text-xs font-mono">

                    {t.paymentId ? t.paymentId.slice(0, 14) + "..." : "—"}
</td>
<td className="p-4">
<span className={`px-2 py-1 rounded-full text-xs ${

                      t.status === "success"

                        ? "bg-green-600 bg-opacity-30 text-green-300"

                        : "bg-yellow-600 bg-opacity-30 text-yellow-300"

                    }`}>

                      {t.status}
</span>
</td>
</tr>

              ))}
 
              {data?.transactions?.length === 0 && (
<tr>
<td colSpan="8" className="p-10 text-center text-gray-500">

                    Abhi koi transaction nahi hai
</td>
</tr>

              )}
</tbody>
</table>
</div>
</div>
</div>

  );

};
 
export default PaymentsAdmin;
 