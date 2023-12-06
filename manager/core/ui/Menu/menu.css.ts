import { style } from "@vanilla-extract/css";

export const base = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  borderRadius: "50%",
  minWidth: 52,
  minHeight: 52,
  cursor: "pointer",
  transition:
    "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out",
  ":hover": {
    backgroundColor: "#f1f4f9",
  },
});
