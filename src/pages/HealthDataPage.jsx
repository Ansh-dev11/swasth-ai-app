import React, { useState } from "react";
import { useRef } from "react";
import { Icon } from "../utils/Icon";
import { Card } from "../components";
import { Colors, Fonts, HEALTH_HISTORY } from "../constants";
import { MiniChart } from "../components";

export const HealthDataPage = () => {
  const [records, setRecords] = useState(HEALTH_HISTORY.map((h, i) => ({ ...h, id: i })));
  const [form, setForm] = useState({ date: "", bp: "", sugar: "", weight: "" });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Date required";
    if (!form.bp || isNaN(form.bp) || form.bp < 60 || form.bp > 200) e.bp = "BP: 60–200 mmHg";
    if (!form.sugar || isNaN(form.sugar) || form.sugar < 40 || form.sugar > 500)
      e.sugar = "Sugar: 40–500 mg/dL";
    if (!form.weight || isNaN(form.weight) || form.weight < 20 || form.weight > 300)
      e.weight = "Weight: 20–300 kg";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setRecords([
      ...records,
      {
        id: Date.now(),
        date: form.date.slice(5, 7) + "/" + form.date.slice(2, 4),
        bp: +form.bp,
        sugar: +form.sugar,
        weight: +form.weight,
      },
    ]);
    setForm({ date: "", bp: "", sugar: "", weight: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fld = (key, label, placeholder, hint) => (
    <div>
      <label
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: Colors.muted,
          display: "block",
          marginBottom: 3,
          fontFamily: Fonts.FT,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <input
        type={key === "date" ? "date" : "number"}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value });
          setErrors({ ...errors, [key]: "" });
        }}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 6,
          border: `1px solid ${errors[key] ? Colors.red : Colors.border}`,
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: Fonts.FT,
        }}
      />
      {errors[key] ? (
        <div style={{ color: Colors.red, fontSize: 10, marginTop: 2, fontFamily: Fonts.FT }}>
          {errors[key]}
        </div>
      ) : (
        <div style={{ color: Colors.muted, fontSize: 10, marginTop: 2, fontFamily: Fonts.FT }}>
          {hint}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
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
          Add Health Record
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {fld("date", "Date", "", "Select measurement date")}
          {fld("bp", "Blood Pressure", "e.g. 120", "Normal: 90–120 mmHg")}
          {fld("sugar", "Blood Sugar", "e.g. 95", "Normal: 70–100 mg/dL")}
          {fld("weight", "Weight (kg)", "e.g. 72.5", "Enter in kilograms")}
        </div>
        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "10px",
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
          Add Record
        </button>
        {saved && (
          <div
            style={{
              marginTop: 8,
              background: Colors.greenLight,
              color: Colors.green,
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 11,
              textAlign: "center",
              fontFamily: Fonts.FT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Icon n="check" size={12} color={Colors.green} /> Record saved
          </div>
        )}
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
            Trend Charts
          </div>
          <MiniChart data={records.slice(-6)} dataKey="bp" color={Colors.blue} label="Blood Pressure (mmHg)" />
          <div style={{ marginTop: 12 }}>
            <MiniChart
              data={records.slice(-6)}
              dataKey="sugar"
              color={Colors.amber}
              label="Blood Sugar (mg/dL)"
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <MiniChart data={records.slice(-6)} dataKey="weight" color={Colors.green} label="Weight (kg)" />
          </div>
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
            History ({records.length} records)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                fontFamily: Fonts.FT,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `2px solid ${Colors.border}` }}>
                  {["Date", "BP (mmHg)", "Sugar", "Weight", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "6px 9px",
                        textAlign: "left",
                        color: Colors.muted,
                        fontWeight: 600,
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...records].reverse().map((r) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                    <td style={{ padding: "7px 9px" }}>{r.date}</td>
                    <td style={{ padding: "7px 9px" }}>{r.bp}</td>
                    <td style={{ padding: "7px 9px" }}>{r.sugar}</td>
                    <td style={{ padding: "7px 9px" }}>{r.weight}</td>
                    <td style={{ padding: "7px 9px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            r.bp < 120 && r.sugar < 100 ? Colors.greenLight : r.bp < 130 ? Colors.amberLight : Colors.redLight,
                          color:
                            r.bp < 120 && r.sugar < 100 ? Colors.green : r.bp < 130 ? Colors.amber : Colors.red,
                        }}
                      >
                        {r.bp < 120 && r.sugar < 100 ? "Normal" : r.bp < 130 ? "Elevated" : "High"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
