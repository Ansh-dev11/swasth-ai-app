import React, { useState } from "react";
import { Icon } from "../utils/Icon";
import { Card, Badge } from "../components";
import { RiskGauge } from "../components";
import { Colors, Fonts } from "../constants";
import { aiAPI } from "../utils/api";

export const PredictionsPage = () => {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiAPI.predictHealthRisks();
      setPredictions(response);
      setAnalyzed(true);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to run analysis. Check that GEMINI_API_KEY is set in backend_py/.env");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <Card style={{ background: `linear-gradient(135deg, ${Colors.navy}, #1a3a6b)`, border: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: `rgba(${parseInt(Colors.teal.slice(1,3), 16)}, ${parseInt(Colors.teal.slice(3,5), 16)}, ${parseInt(Colors.teal.slice(5,7), 16)}, 0.28)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon n="trending" size={18} color={Colors.teal} />
              </div>
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: Fonts.FD,
                  }}
                >
                  AI Health Prediction Engine
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    fontFamily: Fonts.FT,
                  }}
                >
                  Analyzes your 6-month health trends to predict future risks
                </div>
              </div>
            </div>
            <button
              onClick={runAnalysis}
              disabled={loading}
              style={{
                background: Colors.teal,
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: Fonts.FD,
                opacity: loading ? 0.8 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? "⏳ Analyzing..." : analyzed ? "Re-analyze" : "Run Analysis"}
            </button>
          </div>
        </Card>
      </div>

      {!analyzed && !loading && (
        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 44, color: Colors.muted }}>
          Click "Run Analysis" to get AI-powered health risk predictions
        </div>
      )}

      {error && (
        <div style={{ gridColumn: "1 / -1" }}>
          <Card style={{ background: Colors.redLight, border: `1px solid ${Colors.red}` }}>
            <div style={{ color: Colors.red, fontSize: 12, fontWeight: 600 }}>
              ⚠️ Analysis failed: {error}
            </div>
            <div style={{ color: Colors.red, fontSize: 11, marginTop: 6, fontFamily: Fonts.FT }}>
              Make sure your Gemini API key is set in: <code>backend_py/.env</code> → <code>GEMINI_API_KEY=...</code>
            </div>
          </Card>
        </div>
      )}

      {loading && (
        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 44 }}>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: Colors.tealLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
              animation: 'spin 1s linear infinite'
            }}
          >
            <Icon n="settings" size={24} color={Colors.teal} />
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: Colors.navy,
              fontFamily: Fonts.FD,
            }}
          >
            Analyzing your health data...
          </div>
          <div
            style={{
              color: Colors.muted,
              marginTop: 5,
              fontSize: 12,
              fontFamily: Fonts.FT,
            }}
          >
            Processing 6 months of trends, vitals, and reports
          </div>
        </div>
      )}

      {analyzed && (
        <>
          <Card>
            <div
              style={{
                fontWeight: 700,
                color: Colors.navy,
                marginBottom: 12,
                fontSize: 13,
                fontFamily: Fonts.FD,
              }}
            >
              12-Month Risk Assessment
            </div>
            <RiskGauge
              label="Hypertension Risk"
              level="Medium"
              value="Systolic BP trending up 8 mmHg over 6 months"
            />
            <RiskGauge
              label="Type 2 Diabetes Risk"
              level="Low"
              value="Blood sugar in pre-borderline range, stable"
            />
            <RiskGauge
              label="Cardiovascular Risk"
              level="Medium"
              value="Elevated LDL (142 mg/dL), sedentary indicators"
            />
            <RiskGauge label="Obesity Risk" level="Low" value="BMI stable at 24.1, within healthy range" />
            <RiskGauge label="Metabolic Syndrome" level="Low" value="No clustering of risk factors detected yet" />
          </Card>

          <Card>
            <div
              style={{
                fontWeight: 700,
                color: Colors.navy,
                marginBottom: 10,
                fontSize: 13,
                fontFamily: Fonts.FD,
              }}
            >
              AI Predictions (Next 12 Months)
            </div>
            {[
              {
                icon: "trending",
                label: "Blood Pressure",
                pred: "Likely Stage 1 Hypertension (130–139 mmHg) within 6–9 months if unchanged",
                risk: "amber",
              },
              {
                icon: "drop",
                label: "Blood Sugar",
                pred: "Expected pre-diabetic range. Dietary intervention can prevent progression",
                risk: "green",
              },
              {
                icon: "heart",
                label: "Cardiovascular",
                pred: "Moderate risk increase due to LDL trend. Recommend statin evaluation at 6-month checkup",
                risk: "amber",
              },
              {
                icon: "scale",
                label: "Weight",
                pred: "Stable trajectory. BMI expected in healthy range (23–25)",
                risk: "green",
              },
            ].map((p) => (
              <div key={p.label} style={{ background: Colors.bg, borderRadius: 7, padding: 10, marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: Fonts.FT,
                    }}
                  >
                    <Icon n={p.icon} size={13} color={Colors.muted} /> {p.label}
                  </div>
                  <Badge color={p.risk}>{p.risk === "green" ? "Low Risk" : "Watch"}</Badge>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: Colors.muted,
                    lineHeight: 1.45,
                    fontFamily: Fonts.FT,
                  }}
                >
                  {p.pred}
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <div
              style={{
                fontWeight: 700,
                color: Colors.navy,
                marginBottom: 10,
                fontSize: 13,
                fontFamily: Fonts.FD,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Icon n="clipboard" size={14} color={Colors.navy} /> Personalized Action Plan
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 10,
              }}
            >
              {[
                {
                  icon: "flask",
                  title: "Diet Changes",
                  items: [
                    "Reduce sodium to <2300mg/day",
                    "Increase omega-3 (fish 2x/week)",
                    "Cut refined carbs by 30%",
                  ],
                },
                {
                  icon: "heart",
                  title: "Exercise Plan",
                  items: [
                    "30 min cardio, 5x/week",
                    "Strength training 2x/week",
                    "10,000 steps daily goal",
                  ],
                },
                {
                  icon: "stethoscope",
                  title: "Medical Follow-ups",
                  items: [
                    "HbA1c test in 3 months",
                    "Lipid profile retest in 3 months",
                    "BP monitoring weekly",
                  ],
                },
                {
                  icon: "eye",
                  title: "Lifestyle",
                  items: [
                    "7–8 hours sleep nightly",
                    "Stress reduction (yoga/meditation)",
                    "Limit alcohol to 1 drink/day",
                  ],
                },
              ].map((s) => (
                <div key={s.title} style={{ background: Colors.bg, borderRadius: 9, padding: 12 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: Colors.navy,
                      marginBottom: 6,
                      fontSize: 12,
                      fontFamily: Fonts.FD,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Icon n={s.icon} size={13} color={Colors.teal} /> {s.title}
                  </div>
                  {s.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        gap: 5,
                        marginBottom: 4,
                        fontSize: 11,
                        color: Colors.text,
                        fontFamily: Fonts.FT,
                        alignItems: "flex-start",
                      }}
                    >
                      <Icon n="check" size={11} color={Colors.teal} style={{ marginTop: 1 }} /> {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
