import React from "react";
import { Colors, Fonts } from "../constants";

export const Badge = ({ color, children }) => {
  const colorMap = {
    green: [Colors.greenLight, Colors.green],
    amber: [Colors.amberLight, Colors.amber],
    red: [Colors.redLight, Colors.red],
    blue: [Colors.blueLight, Colors.blue],
    teal: [Colors.tealLight, Colors.teal],
  };
  const [bg, tc] = colorMap[color] || colorMap.blue;
  return (
    <span
      style={{
        background: bg,
        color: tc,
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: Fonts.FT,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
};

export const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: Colors.card,
      borderRadius: 11,
      padding: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      border: `1px solid ${Colors.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);
