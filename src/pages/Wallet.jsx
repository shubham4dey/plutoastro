import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

import bg from "../image/bg1.jpg";

import { rechargeWithRazorpay } from "../utils/razorpay"; // ✅ NEW
 
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
 
const Wallet = () => {

  const user = useSelector((store) => store.user);
 
  const [wallet, setWallet] = useState(null);

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState(100);

  const [recharging, setRecharging] = useState(false);
 
  const loadWallet = async () => {

    if (!user?.email) return;
 
    try {

      const res = await axios.get(`${API}/api/wallet/details/${user.email}`);

      if (res.data.success) {

        setWallet(res.data.wallet);

        setTransactions(res.data.transactions || []);

      }

    } catch (err) {

      toast.error("Wallet load nahi hua", {

        position: "top-right",

        theme: "dark",

      });

    } finally {

      setLoading(false);

    }

  };
 
  useEffect(() => {

    loadWallet();

    // eslint-disable-next-line

  }, [user]);
 
  // ✅ RAZORPAY RECHARGE HANDLER

  const handleRecharge = async () => {

    if (!user?.email) {

      toast.error("Please login first", { position: "top-right", theme: "dark" });

      return;

    }
 
    setRecharging(true);
 
    await rechargeWithRazorpay({

      email: user.email,

      amount,

      onSuccess: (data) => {

        toast.success(`✅ ₹${amount} added! Balance: ₹${data.balance}`, {

          position: "top-right",

          autoClose: 2000,

          theme: "dark",

        });

        loadWallet(); // balance + history refresh

        setRecharging(false);

      },

    });
 
    // agar popup cancel hua to bhi false karo

    setTimeout(() => setRecharging(false), 500);

  };
 
  const totalRecharged = transactions

    .filter((t) => t.type === "credit")

    .reduce((s, t) => s + Number(t.amount), 0);
 
  const totalSpent = transactions

    .filter((t) => t.type === "debit")

    .reduce((s, t) => s + Number(t.amount), 0);
 
  if (!user) {

    return (
<div className="min-h-screen flex items-center justify-center text-white">
<div className="text-center">
<p className="text-xl mb-4">Pehle login karo</p>
<Link

            to="/login"

            className="px-6 py-3 bg-purple-600 rounded-xl font-semibold"
>

            Login
</Link>
</div>
</div>

    );

  }
 
  return (
<div className="lg:pt-32 pt-24 px-4 lg:px-20 pb-20 min-h-screen relative">
<img

        alt="bg"

        className="h-full w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"

        src={bg}

      />
 
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
<div className="mb-8">
<p className="text-purple-400 text-xs tracking-[0.4em] uppercase">

            PlutoAstro Pay
</p>
<h1 className="text-4xl font-extrabold text-white mt-1">My Wallet</h1>
</div>
 
        {loading ? (
<div className="h-64 flex items-center justify-center">
<div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
</div>

        ) : (
<>

            {/* ═══════════ PREMIUM BALANCE CARD ═══════════ */}
<div className="relative overflow-hidden rounded-[2rem] p-8 lg:p-10 bg-gradient-to-br from-[#2b1055] via-[#4c2278] to-[#8a1f6c] shadow-2xl shadow-purple-900/60">

              {/* Decorative rings */}
<div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10"></div>
<div className="absolute -top-14 -right-14 w-52 h-52 rounded-full border border-white/10"></div>
<div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5 blur-2xl"></div>
<div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
 
              {/* Top row */}
<div className="relative flex items-start justify-between">
<div>
<p className="text-purple-200/70 text-[10px] tracking-[0.35em] uppercase">

                    PlutoAstro Pay
</p>
<p className="text-white/60 text-sm mt-1">{user.email}</p>
</div>
 
                {/* Chip */}
<div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 relative overflow-hidden">
<div className="absolute inset-x-0 top-1/2 h-px bg-yellow-800/50"></div>
<div className="absolute inset-y-0 left-1/3 w-px bg-yellow-800/50"></div>
<div className="absolute inset-y-0 left-2/3 w-px bg-yellow-800/50"></div>
</div>
</div>
 
              {/* Balance */}
<div className="relative mt-10">
<p className="text-purple-200/70 text-xs uppercase tracking-widest">

                  Available Balance
</p>
<h2 className="text-6xl font-extrabold text-white mt-2 drop-shadow-lg">

                  ₹{wallet?.balance ?? 0}
</h2>
</div>
 
              {/* Bottom row */}
<div className="relative mt-8 flex items-end justify-between text-purple-200/60 text-xs tracking-widest">
<span>•••• •••• •••• 4321</span>
<span className="uppercase">Member · 2026</span>
</div>
</div>
 
            {/* ═══════════ STATS ROW ═══════════ */}
<div className="grid grid-cols-2 gap-4 mt-6">
<div className="rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-5">
<p className="text-purple-300 text-[10px] uppercase tracking-[0.25em]">

                  Total Recharged
</p>
<p className="text-emerald-400 text-2xl font-bold mt-1">

                  +₹{totalRecharged}
</p>
</div>
<div className="rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-5">
<p className="text-purple-300 text-[10px] uppercase tracking-[0.25em]">

                  Total Spent
</p>
<p className="text-rose-400 text-2xl font-bold mt-1">

                  −₹{totalSpent}
</p>
</div>
</div>
 
            {/* ═══════════ RECHARGE + HISTORY ═══════════ */}
<div className="grid lg:grid-cols-3 gap-6 mt-6">

              {/* Recharge */}
<div className="rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-6">
<h2 className="text-white font-semibold text-lg mb-1">Add Money</h2>
<p className="text-purple-300/60 text-xs mb-5">

                  Instant credit to your wallet
</p>
 
                <div className="space-y-3 mb-5">

                  {[100, 200, 500].map((amt) => (
<button

                      key={amt}

                      onClick={() => setAmount(amt)}

                      className={`w-full py-3 rounded-xl font-semibold border transition-all ${

                        amount === amt

                          ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-purple-600/40 scale-[1.02]"

                          : "border-purple-500/30 text-purple-200 hover:border-purple-400/60"

                      }`}
>

                      ₹{amt}
</button>

                  ))}
</div>
 
                <button

                  onClick={handleRecharge}

                  disabled={recharging}

                  className="w-full py-3 rounded-xl bg-white text-purple-900 font-bold hover:bg-purple-100 transition-all disabled:opacity-50"
>

                  {recharging ? "Processing..." : `Add ₹${amount}`}
</button>
 
                <p className="text-purple-300/40 text-[10px] mt-3 text-center">

                  🔒 Secured by Razorpay
</p>
</div>
 
              {/* History */}
<div className="lg:col-span-2 rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-6">
<h2 className="text-white font-semibold text-lg mb-5">

                  Recent Activity
</h2>
 
                {transactions.length === 0 ? (
<p className="text-purple-300/50 text-center py-10">

                    No transactions yet
</p>

                ) : (
<div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">

                    {transactions.map((t) => (
<div

                        key={t._id}

                        className="flex items-center justify-between rounded-xl bg-black/25 border border-purple-500/10 px-4 py-3 hover:border-purple-400/30 transition-all"
>
<div className="flex items-center gap-4">

                          {/* Arrow circle */}
<div

                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${

                              t.type === "credit"

                                ? "bg-emerald-500/15 text-emerald-400"

                                : "bg-rose-500/15 text-rose-400"

                            }`}
>

                            {t.type === "credit" ? "↓" : "↑"}
</div>
 
                          <div>
<p className="text-white text-sm font-medium capitalize">

                              {t.reason}
</p>
<p className="text-purple-300/50 text-[11px]">

                              {new Date(t.createdAt).toLocaleString("en-IN", {

                                day: "2-digit",

                                month: "short",

                                year: "numeric",

                                hour: "2-digit",

                                minute: "2-digit",

                              })}
</p>
</div>
</div>
 
                        <div className="text-right">
<p

                            className={`font-bold text-sm ${

                              t.type === "credit"

                                ? "text-emerald-400"

                                : "text-rose-400"

                            }`}
>

                            {t.type === "credit" ? "+" : "−"}₹{t.amount}
</p>
<p className="text-purple-300/40 text-[11px]">

                            Bal ₹{t.balanceAfter}
</p>
</div>
</div>

                    ))}
</div>

                )}
</div>
</div>
</>

        )}
</div>
</div>

  );

};
 
export default Wallet;
 