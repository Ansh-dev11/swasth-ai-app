import React from "react";
import { Icon } from "../utils/Icon";
import { Colors, Fonts } from "../constants";
import { Card } from "./Badge";

export const StatCard = ({ iconName, label, value, unit, color, trend }) => (
  <Card style={{ flex: 1, minWidth: 128 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            color: Colors.muted,
            fontWeight: 500,
            marginBottom: 3,
            fontFamily: Fonts.FT,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, lineHeight: 1, fontFamily: Fonts.FD }}>
          {value}
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: Colors.muted,
              marginLeft: 3,
              fontFamily: Fonts.FT,
            }}
          >
            {unit}
          </span>
        </div>
        {trend !== undefined && (
          <div
            style={{
              fontSize: 11,
              color: trend > 0 ? Colors.red : Colors.green,
              marginTop: 2,
              fontFamily: Fonts.FT,
            }}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon n={iconName} size={16} color={color} />
      </div>
    </div>
  </Card>
);
