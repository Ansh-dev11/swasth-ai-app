import React, { useState, useEffect } from "react";
import { Icon } from "../utils/Icon";
import { Card, Badge } from "../components/Badge";
import { StatCard, MiniChart } from "../components";
import { Colors, Fonts, HEALTH_HISTORY, MOCK_USER } from "../constants";
import { reportsAPI } from "../utils/api";

export const DashboardHome = ({ onNavigate }) => {
  const latest = HEALTH_HISTORY[HEALTH_HISTORY.length - 1];
  const [recentReports, setRecentReports] = useState([]);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      const reports = response.data || [];
      setRecentReports(reports.slice(0, 4)); // Show last 4 reports
      setReportCount(reports.length);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: Colors.navy, fontFamily: Fonts.FD }}>
          Good morning, {MOCK_USER.name.split(" ")[0]}
        </div>
        <div style={{ color: Colors.muted, marginTop: 2, fontSize: 12, fontFamily: Fonts.FT }}>
          Here's your health summary for today
        </div>
      </div>

      {/* Alert */}
      <div
        style={{
          background: "#fff3e0",
          border: "1px solid #ffcc02",
          borderRadius: 9,
          padding: "10px 14px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}
      >
        <Icon n="alert" size={16} color="#e65100" />
        <div>
          <div style={{ fontWeight: 600, color: "#e65100", fontSize: 12, fontFamily: Fonts.FD }}>
            Attention Needed
          </div>
          <div style={{ fontSize: 12, color: "#bf360c", fontFamily: Fonts.FT }}>
            Your LDL cholesterol (142 mg/dL) is slightly elevated. Consider scheduling a follow-up with your doctor.
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <StatCard iconName="drop" label="Blood Pressure" value={latest.bp} unit="mmHg" color={Colors.blue} trend={2} />
        <StatCard
          iconName="flask"
          label="Blood Sugar"
          value={latest.sugar}
          unit="mg/dL"
          color={Colors.amber}
          trend={7}
        />
        <StatCard iconName="scale" label="Weight" value={latest.weight} unit="kg" color={Colors.green} trend={-1} />
        <StatCard
          iconName="clipboard"
          label="Reports"
          value={reportCount}
          unit="total"
          color={Colors.teal}
        />
      </div>

      {/* Charts and Reports */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, color: Colors.navy, marginBottom: 12, fontSize: 13, fontFamily: Fonts.FD }}>
            6-Month Trends
          </div>
          <MiniChart data={HEALTH_HISTORY} dataKey="bp" color={Colors.blue} label="Blood Pressure (mmHg)" />
          <div style={{ marginTop: 12 }}>
            <MiniChart data={HEALTH_HISTORY} dataKey="sugar" color={Colors.amber} label="Blood Sugar (mg/dL)" />
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: Colors.navy, marginBottom: 10, fontSize: 13, fontFamily: Fonts.FD }}>
            Recent Reports
          </div>
          {recentReports.length > 0 ? (
            recentReports.map((r) => {
              const status = r.findings?.status || "Normal";
              const reportType = r.report_type || "Report";
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: `1px solid ${Colors.border}` }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: status === "Normal" ? Colors.greenLight : Colors.amberLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      n={reportType.includes("Blood") ? "drop" : "file"}
                      size={13}
                      color={status === "Normal" ? Colors.green : Colors.amber}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, fontFamily: Fonts.FT }}>
                      {r.title || r.name || "Report"}
                    </div>
                    <div style={{ fontSize: 10, color: Colors.muted, fontFamily: Fonts.FT }}>
                      {new Date(r.created_at || r.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge color={status === "Normal" ? "green" : "amber"}>{status}</Badge>
                </div>
              );
            })
          ) : (
            <div style={{ fontSize: 12, color: Colors.muted, padding: "10px", textAlign: "center" }}>
              No reports uploaded yet
            </div>
          )}
          <button
            onClick={() => onNavigate("reports")}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "7px",
              background: Colors.tealLight,
              color: Colors.teal,
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: Fonts.FT,
            }}
          >
            View All Reports
          </button>
        </Card>

        {/* Quick Actions */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700, color: Colors.navy, marginBottom: 10, fontSize: 13, fontFamily: Fonts.FD }}>
            Quick Actions
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            {[
              { icon: "plus", label: "Add Health Data", page: "health", bg: Colors.blueLight, tc: Colors.blue },
              {
                icon: "upload",
                label: "Upload Report",
                page: "reports",
                bg: Colors.greenLight,
                tc: Colors.green,
              },
              { icon: "chat", label: "Ask AI", page: "ai", bg: Colors.tealLight, tc: Colors.teal },
              {
                icon: "crystal",
                label: "Predictions",
                page: "predictions",
                bg: Colors.amberLight,
                tc: Colors.amber,
              },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.page)}
                style={{
                  flex: "1 1 140px",
                  padding: "10px 12px",
                  background: a.bg,
                  border: "none",
                  borderRadius: 9,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Icon n={a.icon} size={14} color={a.tc} />
                <span style={{ fontSize: 12, fontWeight: 600, color: a.tc, fontFamily: Fonts.FT }}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
