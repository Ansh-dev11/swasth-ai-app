import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../utils/Icon";
import { Card, Badge } from "../components";
import { Colors, Fonts } from "../constants";
import { reportsAPI } from "../utils/api";

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll();
      setReports(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const reportName = file.name.replace(/\.[^.]+$/, "");
      const reportType = file.type.includes("pdf") ? "Medical Document" : "Image Report";

      // Call API to upload report
      const response = await reportsAPI.upload(reportName, reportType, {}, file);

      if (response.success) {
        // Add to reports list
        const newReport = response.data.report || {
          id: Date.now(),
          title: reportName,
          report_type: reportType,
          created_at: new Date().toISOString().slice(0, 10),
          findings: {},
          status: "Normal",
        };

        setReports([newReport, ...reports]);
        setDone(true);
        setSelected(newReport);
        setTimeout(() => setDone(false), 4000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload report");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    if (!selected) return;

    try {
      setDownloading(true);
      setError(null);

      const blob = await reportsAPI.downloadHealthReport();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${selected.title || "health"}_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (reportId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      setError(null);
      await reportsAPI.delete(reportId);
      setReports(reports.filter((r) => r.id !== reportId));
      if (selected?.id === reportId) setSelected(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete report");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const getReportStatus = (report) => {
    return report.findings?.status || "Normal";
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div>
        <Card style={{ marginBottom: 14 }}>
          <div
            style={{
              fontWeight: 700,
              color: Colors.navy,
              marginBottom: 10,
              fontSize: 13,
              fontFamily: Fonts.FD,
            }}
          >
            Upload Medical Report
          </div>
          <div
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${Colors.teal}`,
              borderRadius: 9,
              padding: 20,
              textAlign: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              background: Colors.tealLight,
              opacity: uploading ? 0.7 : 1,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: Colors.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
              }}
            >
              <Icon n="upload" size={17} color="#fff" />
            </div>
            <div style={{ fontWeight: 600, color: Colors.teal, fontSize: 13, fontFamily: Fonts.FD }}>
              Click to upload PDF or image
            </div>
            <div style={{ fontSize: 11, color: Colors.muted, marginTop: 2, fontFamily: Fonts.FT }}>
              PDF, JPG, PNG up to 10MB
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
          {uploading && (
            <div
              style={{
                marginTop: 8,
                color: Colors.teal,
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                fontFamily: Fonts.FT,
              }}
            >
              ⏳ Analyzing report with AI...
            </div>
          )}
          {done && (
            <div
              style={{
                marginTop: 8,
                background: Colors.greenLight,
                color: Colors.green,
                borderRadius: 6,
                padding: "6px 10px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                fontFamily: Fonts.FT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Icon n="check" size={12} color={Colors.green} /> Report uploaded and analyzed
            </div>
          )}
          {error && (
            <div
              style={{
                marginTop: 8,
                background: Colors.amberLight,
                color: Colors.amber,
                borderRadius: 6,
                padding: "6px 10px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                fontFamily: Fonts.FT,
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </Card>

        {selected && (
          <Card>
            <div
              style={{
                fontWeight: 700,
                color: Colors.navy,
                marginBottom: 9,
                fontSize: 13,
                fontFamily: Fonts.FD,
              }}
            >
              Report Details
            </div>
            {[
              ["Name", selected.title || selected.name || "Untitled"],
              ["Date", formatDate(selected.created_at || selected.date)],
              ["Type", selected.report_type || selected.type || "N/A"],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 5, fontSize: 12, fontFamily: Fonts.FT }}>
                <span style={{ color: Colors.muted }}>{k}:</span> <strong>{v}</strong>
              </div>
            ))}
            <div style={{ marginBottom: 9, fontSize: 12, fontFamily: Fonts.FT }}>
              <span style={{ color: Colors.muted }}>Status:</span>
              <Badge color={getReportStatus(selected) === "Normal" ? "green" : "amber"}>
                {getReportStatus(selected)}
              </Badge>
            </div>
            <div
              style={{
                background: Colors.bg,
                borderRadius: 6,
                padding: 10,
                fontSize: 12,
                lineHeight: 1.5,
                color: Colors.text,
                fontFamily: Fonts.FT,
                minHeight: 60,
              }}
            >
              <strong>AI Summary:</strong>
              <br />
              {selected.findings?.summary || selected.summary || "Analyzing report..."}
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                marginTop: 10,
                width: "100%",
                padding: 8,
                background: Colors.blueLight,
                color: Colors.blue,
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: downloading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                fontFamily: Fonts.FT,
                opacity: downloading ? 0.7 : 1,
              }}
            >
              <Icon n="download" size={13} color={Colors.blue} /> 
              {downloading ? "Downloading..." : "Download Summary PDF"}
            </button>
          </Card>
        )}
      </div>

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
          All Reports ({reports.length})
        </div>
        {loading && (
          <div style={{ textAlign: "center", color: Colors.muted, fontSize: 12, padding: 20 }}>
            Loading reports...
          </div>
        )}
        {!loading && reports.length === 0 && (
          <div style={{ textAlign: "center", color: Colors.muted, fontSize: 12, padding: 20 }}>
            No reports yet. Upload one to get started.
          </div>
        )}
        {reports.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelected(r)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              padding: "10px",
              borderRadius: 9,
              marginBottom: 5,
              cursor: "pointer",
              background: selected?.id === r.id ? Colors.tealLight : Colors.bg,
              border: `1px solid ${selected?.id === r.id ? Colors.teal : "transparent"}`,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                background: getReportStatus(r) === "Normal" ? Colors.greenLight : Colors.amberLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon
                n={
                  r.report_type?.includes("Blood") 
                    ? "drop" 
                    : r.report_type?.includes("Imaging") 
                    ? "xray" 
                    : "file"
                }
                size={14}
                color={getReportStatus(r) === "Normal" ? Colors.green : Colors.amber}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: Colors.text, fontFamily: Fonts.FT }}>
                {r.title || r.name || "Untitled Report"}
              </div>
              <div style={{ fontSize: 10, color: Colors.muted, fontFamily: Fonts.FT }}>
                {r.report_type || r.type || "Report"} · {formatDate(r.created_at || r.date)}
              </div>
              <div style={{ marginTop: 3 }}>
                <Badge color={getReportStatus(r) === "Normal" ? "green" : "amber"}>
                  {getReportStatus(r)}
                </Badge>
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(r.id, e)}
              style={{
                background: "none",
                border: "none",
                color: Colors.muted,
                cursor: "pointer",
                padding: 5,
                fontSize: 16,
              }}
              title="Delete report"
            >
              ×
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
};
