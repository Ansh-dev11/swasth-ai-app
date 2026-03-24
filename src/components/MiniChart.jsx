import React from "react";
import { Colors, Fonts } from "../constants";

export const MiniChart = ({ data, dataKey, color, label }) => {
  const max = Math.max(...data.map((d) => d[dataKey]));
  const min = Math.min(...data.map((d) => d[dataKey]));

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: Colors.muted,
          marginBottom: 7,
          fontFamily: Fonts.FT,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 68 }}>
        {data.map((d, i) => {
          const pct = ((d[dataKey] - min) / (max - min || 1)) * 48 + 16;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <div style={{ fontSize: 9, color: Colors.muted, fontFamily: Fonts.FT }}>
                {d[dataKey]}
              </div>
              <div
                style={{
                  width: "100%",
                  height: pct,
                  background: color,
                  borderRadius: "3px 3px 0 0",
                  opacity: i === data.length - 1 ? 1 : 0.42,
                  transition: "height 0.3s",
                }}
              />
              <div style={{ fontSize: 9, color: Colors.muted, fontFamily: Fonts.FT }}>
                {d.date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
