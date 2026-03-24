import React from "react";
import { Badge } from "./Badge";
import { Colors, Fonts } from "../constants";

export const RiskGauge = ({ label, level, value }) => {
  const levelColorMap = { Low: Colors.green, Medium: Colors.amber, High: Colors.red };
  const levelWidthMap = { Low: "30%", Medium: "65%", High: "90%" };
  const levelBadgeColorMap = { Low: "green", Medium: "amber", High: "red" };

  const cl = levelColorMap[level];
  const w = levelWidthMap[level];
  const bc = levelBadgeColorMap[level];

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: Colors.text,
            fontFamily: Fonts.FT,
          }}
        >
          {label}
        </span>
        <Badge color={bc}>{level}</Badge>
      </div>
      <div style={{ height: 6, background: Colors.border, borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: w,
            background: cl,
            borderRadius: 3,
            transition: "width 1s ease",
          }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          color: Colors.muted,
          marginTop: 2,
          fontFamily: Fonts.FT,
        }}
      >
        {value}
      </div>
    </div>
  );
};
