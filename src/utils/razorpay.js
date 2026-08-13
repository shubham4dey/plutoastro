import axios from "axios";
 
const API = process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";

const RZP_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
 
export const rechargeWithRazorpay = async ({ email, amount, onSuccess }) => {

  try {

    const orderRes = await axios.post(`${API}/api/wallet/create-order`, {

      email,

      amount,

    });
 
    if (!orderRes.data.success) throw new Error(orderRes.data.message);

    const order = orderRes.data.order;
 
    const rzp = new window.Razorpay({

      key: RZP_KEY,

      amount: order.amount,

      currency: "INR",

      name: "PlutoAstro",

      description: "Wallet Recharge",

      order_id: order.id,

      handler: async (resp) => {

        const verifyRes = await axios.post(`${API}/api/wallet/verify-payment`, {

          email,

          amount,

          orderId: order.id,

          paymentId: resp.razorpay_payment_id,

          signature: resp.razorpay_signature,

        });

        if (verifyRes.data.success && onSuccess) onSuccess(verifyRes.data);

      },

      prefill: { email },

      theme: { color: "#a855f7" },

    });
 
    rzp.open();

  } catch (err) {

    console.error("Razorpay Error:", err);

  }

};
 