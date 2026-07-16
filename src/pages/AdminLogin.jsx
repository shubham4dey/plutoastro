
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://plutoastro-backend.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {
        localStorage.setItem(
          "adminToken",
          data.token
        );

        navigate(
          "/admin/dashboard"
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#050010,#180028,#32004b)",
      }}
    >
      {/* AURORA GLOW */}

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background:
            "#a855f7",
          borderRadius: "50%",
          filter:
            "blur(180px)",
          opacity: 0.25,
          top: "-100px",
          left: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background:
            "#ec4899",
          borderRadius: "50%",
          filter:
            "blur(180px)",
          opacity: 0.2,
          bottom: "-100px",
          right: "-100px",
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        style={{
          width: "450px",
          padding: "40px",
          borderRadius: "30px",
          backdropFilter:
            "blur(25px)",
          background:
            "rgba(255,255,255,0.05)",
          border:
            "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 0 60px rgba(168,85,247,0.25)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            textAlign:
              "center",
            marginBottom:
              "30px",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize:
                "34px",
              fontWeight:
                "800",
              marginBottom:
                "10px",
            }}
          >
            ✨ PlutoAstro
          </h1>

          <p
            style={{
              color:
                "#c084fc",
              fontSize:
                "15px",
            }}
          >
            Admin Dashboard Access
          </p>
        </div>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding:
              "15px",
            marginBottom:
              "18px",
            borderRadius:
              "14px",
            border:
              "1px solid rgba(255,255,255,0.1)",
            background:
              "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize:
              "15px",
            outline:
              "none",
            boxSizing:
              "border-box",
          }}
        />

        <div
          style={{
            position:
              "relative",
          }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "15px",
              marginBottom:
                "20px",
              borderRadius:
                "14px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              background:
                "rgba(255,255,255,0.08)",
              color:
                "#fff",
              fontSize:
                "15px",
              outline:
                "none",
              boxSizing:
                "border-box",
            }}
          />

          <button
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={{
              position:
                "absolute",
              right:
                "15px",
              top: "14px",
              background:
                "transparent",
              border:
                "none",
              color:
                "#c084fc",
              cursor:
                "pointer",
            }}
          >
            {showPassword
              ? "🙈"
              : "👁️"}
          </button>
        </div>

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={
            handleLogin
          }
          style={{
            width: "100%",
            padding:
              "15px",
            border:
              "none",
            borderRadius:
              "14px",
            cursor:
              "pointer",
            color:
              "#fff",
            fontWeight:
              "700",
            fontSize:
              "16px",
            background:
              "linear-gradient(90deg,#9333ea,#ec4899)",
            boxShadow:
              "0 0 30px rgba(168,85,247,0.6)",
          }}
        >
          Login To Dashboard
        </motion.button>

        <div
          style={{
            marginTop:
              "20px",
            textAlign:
              "center",
            color:
              "#a78bfa",
            fontSize:
              "13px",
          }}
        >
          Secure Admin Panel
        </div>
      </motion.div>

      <style>
        {`
          input::placeholder{
            color:#d8b4fe;
            opacity:1;
          }
        `}
      </style>
    </div>
  );
}

export default AdminLogin;

