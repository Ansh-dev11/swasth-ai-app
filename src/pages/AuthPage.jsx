import React, { useState } from "react";
import { Icon } from "../utils/Icon";
import { Colors, Fonts } from "../constants";
import { authAPI } from "../utils/api";

export const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      let response;
      if (mode === "login") {
        response = await authAPI.login(form.email, form.password);
      } else {
        response = await authAPI.register(form.email, form.password, form.name);
      }

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        const userData = {
          id: response.user.id,
          name: response.user.name || response.user.email.split('@')[0],
          email: response.user.email,
          avatar: response.user.avatar || "https://i.pravatar.cc/150?u=" + response.user.email
        };
        onLogin(userData);
      }
    } catch (err) {
      setErrors({ submit: err.message || "Authentication failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inp = (field, placeholder, type = "text", icon = null) => (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: Colors.navy, marginBottom: 8, fontFamily: Fonts.FD }}>
        {placeholder}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', color: Colors.muted }}>
            <Icon n={icon} size={18} color={errors[field] ? Colors.red : Colors.muted} />
          </div>
        )}
        <input
          type={type === "password" && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          value={form[field]}
          onChange={(ev) => {
            setForm({ ...form, [field]: ev.target.value });
            setErrors({ ...errors, [field]: "" });
          }}
          style={{
            width: "100%",
            padding: `14px 16px ${14}px ${icon ? 44 : 16}px`,
            borderRadius: 10,
            border: `1.5px solid ${errors[field] ? Colors.red : Colors.border}`,
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            background: errors[field] ? "rgba(244, 63, 94, 0.04)" : "#f8fafc",
            fontFamily: Fonts.FT,
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = errors[field] ? Colors.red : Colors.teal;
            e.target.style.boxShadow = `0 0 0 3px ${errors[field] ? 'rgba(244, 63, 94, 0.1)' : 'rgba(0, 137, 123, 0.1)'}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors[field] ? Colors.red : Colors.border;
            e.target.style.boxShadow = 'none';
          }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 14,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: Colors.muted,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon n={showPassword ? "eye-off" : "eye"} size={16} color={Colors.muted} />
          </button>
        )}
      </div>
      {errors[field] && (
        <div style={{ color: Colors.red, fontSize: 12, marginTop: 5, fontFamily: Fonts.FT, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon n="alert-circle" size={14} color={Colors.red} />
          {errors[field]}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        background: Colors.card,
        borderRadius: 16,
        padding: 50,
        width: "98%",
        maxWidth: "100%",
        boxShadow: "0 25px 64px rgba(0,0,0,0.32)",
        border: "1px solid rgba(255,255,255,0.08)",
        animation: 'fadeInScale 0.4s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${Colors.teal}, #26a69a)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: `0 8px 24px rgba(0,137,123,0.24)`,
          }}
        >
          <Icon n="stethoscope" size={28} color="#fff" />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: Colors.navy, fontFamily: Fonts.FD }}>
          Swasth<span style={{ color: Colors.teal }}>AI</span>
        </div>
        <div style={{ fontSize: 14, color: Colors.muted, marginTop: 8, fontFamily: Fonts.FT }}>
          {mode === "login" ? "Welcome back to your health companion" : "Start your personalized health journey"}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", background: Colors.bg, borderRadius: 10, padding: 6, marginBottom: 32, gap: 2 }}>
        {["login", "signup"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setErrors({});
            }}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 8,
              border: "none",
              background: mode === m ? Colors.card : "transparent",
              color: mode === m ? Colors.navy : Colors.muted,
              fontWeight: mode === m ? 700 : 600,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: mode === m ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              fontFamily: Fonts.FT,
              transition: 'all 0.3s ease',
            }}
          >
            {m === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div style={{ marginBottom: 28 }}>
        {mode === "signup" && inp("name", "Full Name", "text", "user")}
        {inp("email", "Email Address", "email", "mail")}
        {inp("password", "Password", "password", "lock")}
      </div>

      {/* Submit Button */}
      <button
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: loading ? Colors.muted : Colors.teal,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 20,
          fontFamily: Fonts.FD,
          transition: 'all 0.3s ease',
          boxShadow: loading ? 'none' : `0 6px 20px rgba(0,137,123,0.28)`,
          transform: loading ? 'scale(1)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 28px rgba(0,137,123,0.36)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,137,123,0.28)';
          }
        }}
      >
        {loading ? (
          <span>
            <Icon n="loader" size={14} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> 
            {" "} {mode === "login" ? "Signing in..." : "Creating account..."}
          </span>
        ) : mode === "login" ? (
          "Sign In to Dashboard"
        ) : (
          "Create Account"
        )}
      </button>

      {/* Error Message */}
      {errors.submit && (
        <div
          style={{
            background: "rgba(244, 63, 94, 0.1)",
            border: `1px solid rgba(244, 63, 94, 0.3)`,
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 16,
            fontSize: 12,
            color: Colors.red,
            fontFamily: Fonts.FT,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon n="alert-circle" size={14} color={Colors.red} />
          {errors.submit}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: Colors.muted, fontFamily: Fonts.FT }}>
        🔒 Your data is encrypted and secure
      </div>
    </div>
  );
};
