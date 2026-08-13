import React, { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import axios from "axios";
 
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
 
const ProfileDropdown = ({ onLogout }) => {

  const user = useSelector((s) => s.user);

  const [open, setOpen] = useState(false);

  const [balance, setBalance] = useState(0);

  const [pos, setPos] = useState({ top: 60, right: 16 });

  const boxRef = useRef(null);

  const btnRef = useRef(null);
 
  // Balance fetch

  useEffect(() => {

    if (!open || !user?.email) return;

    axios

      .get(`${API}/api/wallet/details/${user.email}`)

      .then((res) => {

        if (res.data.success) setBalance(res.data.wallet?.balance || 0);

      })

      .catch(() => {});

  }, [open, user]);
 
  // Bahar click pe band

  useEffect(() => {

    const close = (e) => {

      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);

    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);

  }, []);
 
  if (!user) return null;
 
  const initial = (user.displayName || user.email || "U")

    .charAt(0)

    .toUpperCase();
 
  // ✅ Button ki position se dropdown set karo (hamesha screen ke andar)

  const toggle = () => {

    if (!open && btnRef.current) {

      const r = btnRef.current.getBoundingClientRect();

      setPos({

        top: r.bottom + 10,

        right: Math.max(12, window.innerWidth - r.right),

      });

    }

    setOpen((o) => !o);

  };
 
  const linkStyle = {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    padding: "12px 16px",

    borderRadius: 12,

    color: "#e5e7eb",

    fontSize: 14,

    textDecoration: "none",

  };
 
  return (
<div ref={boxRef}>

      {/* Avatar Button */}
<button

        ref={btnRef}

        onClick={toggle}

        style={{

          width: 40,

          height: 40,

          borderRadius: "50%",

          background: "linear-gradient(135deg, #9333ea, #db2777)",

          color: "#fff",

          fontWeight: 700,

          fontSize: 16,

          border: "2px solid rgba(196,181,253,0.5)",

          boxShadow: "0 4px 14px rgba(147,51,234,0.4)",

          cursor: "pointer",

        }}
>

        {initial}
</button>
 
      {/* ✅ FIXED Dropdown — viewport ke hisaab se, kabhi bahar nahi jayega */}

      {open && (
<div

          style={{

            position: "fixed",

            top: pos.top,

            right: pos.right,

            width: 288,

            zIndex: 9999,

            background: "#14141f",

            border: "1px solid rgba(107,33,168,0.6)",

            borderRadius: 16,

            boxShadow: "0 20px 50px rgba(0,0,0,0.7)",

            overflow: "hidden",

          }}
>

          {/* User Info */}
<div

            style={{

              padding: "20px 16px",

              textAlign: "center",

              borderBottom: "1px solid rgba(107,33,168,0.4)",

              background:

                "linear-gradient(to bottom, rgba(88,28,135,0.35), transparent)",

            }}
>
<div

              style={{

                width: 64,

                height: 64,

                margin: "0 auto",

                borderRadius: "50%",

                background: "linear-gradient(135deg, #9333ea, #db2777)",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                fontSize: 26,

                fontWeight: 700,

                color: "#fff",

              }}
>

              {initial}
</div>
<p

              style={{

                color: "#fff",

                fontWeight: 600,

                marginTop: 12,

                fontSize: 15,

                textTransform: "capitalize",

              }}
>

              {user.displayName || "User"}
</p>
<p style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>

              {user.email}
</p>
</div>
 
          {/* Menu */}
<div style={{ padding: 8 }}>
<Link to="/wallet" onClick={() => setOpen(false)} style={linkStyle}>
<span>💰 Wallet</span>
<span style={{ color: "#34d399", fontWeight: 700 }}>

                ₹{balance}
</span>
</Link>
 
            <Link to="/messages" onClick={() => setOpen(false)} style={linkStyle}>
<span>💬 My Chats</span>
<span style={{ color: "#6b7280" }}>›</span>
</Link>
 
            <Link to="/following" onClick={() => setOpen(false)} style={linkStyle}>
<span>⭐ Following</span>
<span style={{ color: "#6b7280" }}>›</span>
</Link>
 
            <div

              style={{

                borderTop: "1px solid rgba(107,33,168,0.3)",

                margin: "8px 0",

              }}
></div>
 
            <button

              onClick={onLogout}

              style={{

                width: "100%",

                display: "flex",

                alignItems: "center",

                gap: 12,

                padding: "12px 16px",

                borderRadius: 12,

                color: "#f87171",

                fontSize: 14,

                fontWeight: 600,

                background: "transparent",

                border: "none",

                cursor: "pointer",

                textAlign: "left",

              }}
>

              🚪 Sign Out
</button>
</div>
</div>

      )}
</div>

  );

};
 
export default ProfileDropdown;
 