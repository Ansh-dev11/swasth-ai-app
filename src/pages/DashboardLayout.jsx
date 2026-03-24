import React, { useState } from "react";
import { Icon } from "../utils/Icon";
import { Colors, Fonts } from "../constants";

export const DashboardLayout = ({ children, activePage, onNavigate, onLogout, user }) => {
  const [open, setOpen] = useState(true);
  const navItems = [
    { id: "dashboard", icon: "chart", label: "Dashboard" },
    { id: "health", icon: "heart", label: "Health Data" },
    { id: "reports", icon: "clipboard", label: "Reports" },
    { id: "medicines", icon: "pill", label: "Medicine Scanner" },
    { id: "ai", icon: "bot", label: "AI Assistant" },
    { id: "predictions", icon: "crystal", label: "Predictions" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: Colors.bg, fontFamily: Fonts.FT }}>
      {/* Sidebar */}
      <div
        style={{
          width: open ? 212 : 52,
          background: Colors.sidebar,
          transition: "width 0.25s",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "12px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, overflow: "hidden" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: Colors.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon n="stethoscope" size={13} color="#fff" />
            </div>
            {open && (
              <span
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  fontFamily: Fonts.FD,
                }}
              >
                Swasth<span style={{ color: Colors.teal }}>AI</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "6px 5px" }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 9px",
                borderRadius: 7,
                marginBottom: 1,
                cursor: "pointer",
                background: activePage === item.id ? `rgba(${parseInt(Colors.teal.slice(1,3), 16)}, ${parseInt(Colors.teal.slice(3,5), 16)}, ${parseInt(Colors.teal.slice(5,7), 16)}, 0.22)` : "transparent",
                color: activePage === item.id ? Colors.teal : "rgba(255,255,255,0.54)",
                transition: "all 0.15s",
              }}
            >
              <Icon
                n={item.icon}
                size={15}
                color={activePage === item.id ? Colors.teal : "rgba(255,255,255,0.54)"}
              />
              {open && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: activePage === item.id ? 600 : 400,
                    whiteSpace: "nowrap",
                    fontFamily: Fonts.FT,
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div style={{ padding: "6px 5px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {open && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 9px", marginBottom: 3 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: Colors.teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 11,
                  fontFamily: Fonts.FD,
                }}
              >
                {user.name[0]}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: Fonts.FT,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 10,
                    fontFamily: Fonts.FT,
                  }}
                >
                  Premium Plan
                </div>
              </div>
            </div>
          )}
          <div
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 9px",
              borderRadius: 7,
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <Icon n="logout" size={14} color="rgba(255,255,255,0.4)" />
            {open && (
              <span style={{ fontSize: 12, fontFamily: Fonts.FT }}>Logout</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div
          style={{
            background: Colors.card,
            borderBottom: `1px solid ${Colors.border}`,
            padding: "9px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <Icon n="menu" size={17} color={Colors.muted} />
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: Colors.navy,
                fontFamily: Fonts.FD,
              }}
            >
              {navItems.find((n) => n.id === activePage)?.label}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: Colors.bg,
              borderRadius: 18,
              padding: "5px 11px",
            }}
          >
            <Icon n="bell" size={14} color={Colors.muted} />
            <span
              style={{
                background: Colors.red,
                color: "#fff",
                borderRadius: "50%",
                width: 13,
                height: 13,
                fontSize: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontFamily: Fonts.FD,
              }}
            >
              2
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>{children}</div>
      </div>
    </div>
  );
};
