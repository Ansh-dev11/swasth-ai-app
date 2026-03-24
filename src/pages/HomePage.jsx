import React from "react";
import { Icon } from "../utils/Icon";
import { Colors, Fonts } from "../constants";
import { Card } from "../components/Badge";

export const HomePage = ({ onGetStarted }) => (
  <div style={{ fontFamily: Fonts.FT }}>
    <div
      style={{
        background: `linear-gradient(135deg, ${Colors.navy} 0%, #1a3a6b 60%, #0d4a4a 100%)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: Colors.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon n="stethoscope" size={16} color="#fff" />
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              fontFamily: Fonts.FD,
            }}
          >
            Swasth<span style={{ color: Colors.teal }}>AI</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "How It Works", "About"].map((l) => (
            <span
              key={l}
              style={{
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: Fonts.FT,
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              {l}
            </span>
          ))}
        </div>
        <button
          onClick={onGetStarted}
          style={{
            background: Colors.teal,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: Fonts.FT,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,137,123,0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(0,137,123,0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 2px 8px rgba(0,137,123,0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "44px 20px",
        }}
      >
        <div
          style={{
            background: `rgba(${parseInt(Colors.teal.slice(1,3), 16)}, ${parseInt(Colors.teal.slice(3,5), 16)}, ${parseInt(Colors.teal.slice(5,7), 16)}, 0.16)`,
            border: `1px solid rgba(${parseInt(Colors.teal.slice(1,3), 16)}, ${parseInt(Colors.teal.slice(3,5), 16)}, ${parseInt(Colors.teal.slice(5,7), 16)}, 0.32)`,
            borderRadius: 18,
            padding: "5px 14px",
            fontSize: 12,
            color: Colors.teal,
            marginBottom: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontFamily: Fonts.FT,
          }}
        >
          <Icon n="rocket" size={12} color={Colors.teal} /> AI-Powered Health Management Platform
        </div>
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 62px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.08,
            marginBottom: 16,
            letterSpacing: "-2px",
            fontFamily: Fonts.FD,
          }}
        >
          Your Health,<br />
          <span style={{ color: Colors.teal }}>Intelligently</span> Managed
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 520,
            lineHeight: 1.5,
            marginBottom: 28,
            fontFamily: Fonts.FT,
          }}
        >
          Track vitals, analyze medical reports, scan medicines, and get AI-powered health insights — all in one secure
          platform.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={onGetStarted}
            style={{
              background: Colors.teal,
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 5px 20px rgba(0,137,123,0.36)",
              fontFamily: Fonts.FD,
            }}
          >
            Start Free Today
          </button>
          <button
            onClick={onGetStarted}
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 9,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: Fonts.FT,
            }}
          >
            See Demo
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 48,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            ["50K+", "Active Users"],
            ["98%", "Accuracy"],
            ["24/7", "AI Support"],
            ["256-bit", "Encryption"],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: Colors.teal, fontFamily: Fonts.FD }}>
                {v}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.42)",
                  marginTop: 2,
                  fontFamily: Fonts.FT,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div style={{ padding: "56px 48px", background: "#f8fafc" }}>
      <div style={{ textAlign: "center", marginBottom: 38 }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: Colors.navy,
            letterSpacing: "-1px",
            fontFamily: Fonts.FD,
          }}
        >
          Everything You Need
        </h2>
        <p
          style={{
            color: Colors.muted,
            fontSize: 15,
            marginTop: 7,
            fontFamily: Fonts.FT,
          }}
        >
          Comprehensive health management powered by advanced AI
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 14,
          maxWidth: 1020,
          margin: "0 auto",
        }}
      >
        {[
          {
            icon: "chart",
            title: "Health Dashboard",
            desc: "Visualize BP, sugar, weight with trend charts and smart alerts.",
          },
          {
            icon: "microscope",
            title: "Report Analysis",
            desc: "Upload blood tests or imaging. AI extracts key values in plain language.",
          },
          {
            icon: "pill",
            title: "Medicine Scanner",
            desc: "Verify medicine authenticity by scanning packaging. Instant verification.",
          },
          {
            icon: "bot",
            title: "AI Assistant",
            desc: "Ask anything about your health. Evidence-based, personalized answers.",
          },
          {
            icon: "crystal",
            title: "Future Predictions",
            desc: "AI predicts health risks from your trends — act before problems arise.",
          },
          {
            icon: "shield",
            title: "Secure & Private",
            desc: "End-to-end encrypted. Your data stays yours — never shared, never sold.",
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              background: Colors.card,
              borderRadius: 11,
              padding: 20,
              border: `1px solid ${Colors.border}`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: Colors.tealLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Icon n={f.icon} size={17} color={Colors.teal} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: Colors.navy, marginBottom: 5, fontFamily: Fonts.FD }}>
              {f.title}
            </div>
            <div style={{ fontSize: 12, color: Colors.muted, lineHeight: 1.5, fontFamily: Fonts.FT }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* How It Works Section */}
    <div style={{ padding: "56px 48px", background: Colors.navy }}>
      <div style={{ textAlign: "center", marginBottom: 38 }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-1px",
            fontFamily: Fonts.FD,
          }}
        >
          How It Works
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 15,
            marginTop: 7,
            fontFamily: Fonts.FT,
          }}
        >
          Get started in minutes
        </p>
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: 820,
          margin: "0 auto",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { step: "01", title: "Create Account", desc: "Sign up free. Set up your health profile in under 2 minutes." },
          { step: "02", title: "Add Health Data", desc: "Enter vitals, upload reports, or connect wearables." },
          {
            step: "03",
            title: "Get AI Insights",
            desc: "Our AI analyzes patterns and delivers personalized recommendations.",
          },
          {
            step: "04",
            title: "Stay Proactive",
            desc: "Monitor trends, get alerts, and prevent issues before they occur.",
          },
        ].map((s, i) => (
          <div key={i} style={{ flex: "1 1 180px", textAlign: "center", padding: "0 18px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: Colors.teal,
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                fontFamily: Fonts.FD,
              }}
            >
              {s.step}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 5,
                fontFamily: Fonts.FD,
              }}
            >
              {s.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.5,
                fontFamily: Fonts.FT,
              }}
            >
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA Section */}
    <div style={{ padding: "56px 48px", background: Colors.teal, textAlign: "center" }}>
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 10,
          fontFamily: Fonts.FD,
        }}
      >
        Ready to take control of your health?
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 15,
          marginBottom: 22,
          fontFamily: Fonts.FT,
        }}
      >
        Join 50,000+ users managing their health smarter with AI
      </p>
      <button
        onClick={onGetStarted}
        style={{
          background: "#fff",
          color: Colors.teal,
          border: "none",
          borderRadius: 9,
          padding: "12px 32px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: Fonts.FD,
        }}
      >
        Get Started — It's Free
      </button>
    </div>
  </div>
);
