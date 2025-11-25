import React from "react";
import { Button } from "antd";
import "./index.scss";

interface ModeSwitchProps {
  activeMode: "edit" | "view";
  onModeChange: (mode: "edit" | "view") => void;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({
  activeMode,
  onModeChange,
}) => {
  return (
    <div className="mode-switch">
      <Button
        type={activeMode === "edit" ? "primary" : "text"}
        size="small"
        className={`mode-btn ${activeMode === "edit" ? "active" : ""}`}
        onClick={() => onModeChange("edit")}
      >
        Edit Mode
      </Button>
      <Button
        type={activeMode === "view" ? "primary" : "text"}
        size="small"
        className={`mode-btn ${activeMode === "view" ? "active" : ""}`}
        onClick={() => onModeChange("view")}
      >
        View Mode
      </Button>
    </div>
  );
};

