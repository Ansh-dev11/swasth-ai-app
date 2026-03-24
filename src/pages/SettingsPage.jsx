import React, { useState } from "react";
import { Icon } from "../utils/Icon";
import { Card, Badge } from "../components";
import { Colors, Fonts, MOCK_USER } from "../constants";
import { reportsAPI } from "../utils/api";

export const SettingsPage = () => {
  const [profile, setProfile] = useState(MOCK_USER);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("profile");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const fld = (label, key, type = "text") => (
    <div style={{ marginBottom: 10 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: Colors.muted,
          display: "block",
          marginBottom: 3,
          fontFamily: Fonts.FT,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={profile[key]}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        style={{
          width: "100%",
          padding: "8px 11px",
          borderRadius: 6,
          border: `1px solid ${Colors.border}`,
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: Fonts.FT,
        }}
      />
    </div>
  );

  const tabs = [
    { id: "profile", icon: "user", label: "Profile" },
    { id: "security", icon: "lock", label: "Security" },
    { id: "notifications", icon: "bell", label: "Notifications" },
    { id: "privacy", icon: "shield", label: "Privacy" },
  ];

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await reportsAPI.downloadHealthReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "health-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              border: "none",
              background: tab === t.id ? Colors.teal : Colors.bg,
              color: tab === t.id ? "#fff" : Colors.muted,
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: Fonts.FT,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Icon n={t.icon} size={12} color={tab === t.id ? "#fff" : Colors.muted} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
              paddingBottom: 16,
              borderBottom: `1px solid ${Colors.border}`,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: Colors.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                fontFamily: Fonts.FD,
              }}
            >
              {profile.name[0]}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: Colors.navy,
                  fontFamily: Fonts.FD,
                }}
              >
                {profile.name}
              </div>
              <div style={{ color: Colors.muted, fontSize: 12, fontFamily: Fonts.FT }}>
                {profile.email}
              </div>
              <button
                style={{
                  marginTop: 5,
                  padding: "4px 11px",
                  background: Colors.blueLight,
                  color: Colors.blue,
                  border: "none",
                  borderRadius: 5,
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: Fonts.FT,
                }}
              >
                Change Photo
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {fld("Full Name", "name")}
            {fld("Email Address", "email", "email")}
            {fld("Age", "age", "number")}
            {fld("Blood Group", "blood")}
            {fld("Phone Number", "phone")}
          </div>
          <div style={{ marginTop: 4, display: "flex", gap: 9, alignItems: "center" }}>
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              style={{
                padding: "9px 22px",
                background: Colors.teal,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: Fonts.FD,
              }}
            >
              Save Changes
            </button>
            {saved && (
              <div
                style={{
                  color: Colors.green,
                  fontWeight: 600,
                  fontSize: 12,
                  fontFamily: Fonts.FT,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon n="check" size={13} color={Colors.green} /> Profile saved
              </div>
            )}
          </div>
        </Card>
      )}

      {tab === "security" && (
        <Card>
          <div
            style={{
              fontWeight: 700,
              color: Colors.navy,
              marginBottom: 12,
              fontSize: 14,
              fontFamily: Fonts.FD,
            }}
          >
            Security Settings
          </div>
          <div
            style={{
              background: Colors.greenLight,
              borderRadius: 7,
              padding: 10,
              marginBottom: 14,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Icon n="shield" size={16} color={Colors.green} />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: Colors.green,
                  fontSize: 12,
                  fontFamily: Fonts.FD,
                }}
              >
                Your account is secure
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: Colors.muted,
                  fontFamily: Fonts.FT,
                }}
              >
                Two-factor authentication is enabled
              </div>
            </div>
          </div>
          {["Current Password", "New Password", "Confirm New Password"].map((l) => (
            <div key={l} style={{ marginBottom: 10 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: Colors.muted,
                  display: "block",
                  marginBottom: 3,
                  fontFamily: Fonts.FT,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {l}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: 6,
                  border: `1px solid ${Colors.border}`,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: Fonts.FT,
                }}
              />
            </div>
          ))}
          <button
            style={{
              padding: "9px 22px",
              background: Colors.blue,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: Fonts.FD,
            }}
          >
            Update Password
          </button>
        </Card>
      )}

      {tab === "notifications" && (
        <Card>
          <div
            style={{
              fontWeight: 700,
              color: Colors.navy,
              marginBottom: 12,
              fontSize: 14,
              fontFamily: Fonts.FD,
            }}
          >
            Notification Preferences
          </div>
          {[
            { label: "Health alerts", desc: "Get notified when vitals are abnormal" },
            { label: "Report analysis ready", desc: "When AI finishes analyzing uploaded reports" },
            { label: "Medication reminders", desc: "Daily reminders for tracked medications" },
            { label: "Weekly health summary", desc: "Receive weekly digest of your health data" },
            { label: "AI insights", desc: "Proactive health tips based on your data" },
          ].map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: `1px solid ${Colors.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: Colors.text,
                    fontFamily: Fonts.FT,
                  }}
                >
                  {n.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: Colors.muted,
                    fontFamily: Fonts.FT,
                  }}
                >
                  {n.desc}
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 20,
                  borderRadius: 10,
                  background: i < 3 ? Colors.teal : Colors.border,
                  cursor: "pointer",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 3,
                    left: i < 3 ? 21 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === "privacy" && (
        <Card>
          <div
            style={{
              fontWeight: 700,
              color: Colors.navy,
              marginBottom: 12,
              fontSize: 14,
              fontFamily: Fonts.FD,
            }}
          >
            Privacy & Data
          </div>
          <div
            style={{
              background: Colors.blueLight,
              borderRadius: 7,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: Colors.blue,
                marginBottom: 3,
                fontSize: 12,
                fontFamily: Fonts.FD,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Icon n="lock" size={13} color={Colors.blue} /> Your data is protected
            </div>
            <div
              style={{
                fontSize: 11,
                color: Colors.muted,
                lineHeight: 1.5,
                fontFamily: Fonts.FT,
              }}
            >
              All health data is encrypted with AES-256. We never sell or share your personal health information with
              third parties.
            </div>
          </div>
          {[
            "Data is encrypted at rest and in transit",
            "You own your health data completely",
            "Export your data anytime in JSON/CSV format",
            "Delete your account and all data permanently",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 7,
                padding: "8px 0",
                borderBottom: `1px solid ${Colors.border}`,
                fontSize: 12,
                color: Colors.text,
                fontFamily: Fonts.FT,
                alignItems: "center",
              }}
            >
              <Icon n="check" size={12} color={Colors.teal} /> {item}
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                padding: "8px 16px",
                background: Colors.blueLight,
                color: Colors.blue,
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: Fonts.FT,
              }}
            >
              {exporting ? "Exporting..." : "Export My Data"}
            </button>
            <button
              style={{
                padding: "8px 16px",
                background: Colors.redLight,
                color: Colors.red,
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: Fonts.FT,
              }}
            >
              Delete Account
            </button>
          </div>
          {exportError && <div style={{ color: 'red', marginTop: '10px', fontSize: '12px' }}>{exportError}</div>}
        </Card>
      )}
    </div>
  );
};
