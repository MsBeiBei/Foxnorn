import { style, globalStyle, createVar } from "@vanilla-extract/css";

globalStyle("html, body, #app", {
  height: "100%",
});

globalStyle("*, :before, :after", {
  boxSizing: "border-box",
  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "currentColor",
});

globalStyle("body", {
  margin: 0,
  lineHeight: "inherit",
});

export const height = createVar();

export const LayoutStyle = style({
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  position: "relative",
  height: "100%",
  minHeight: "100%",
  backgroundColor: "#efeff7",
});

export const HeaderStyle = style({
  vars: {
    [height]: "56px",
  },
  backgroundColor: "#ffffff",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "50px",
});

export const FooterStyle = style({
  backgroundColor: "#ffffff",
  height: 48,
  flexShrink: 0,
});

export const ContentStyle = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  paddingLeft: 240,
});

export const SliderStyle = style({
  width: 240,
  backgroundColor: "#ffffff",
  position: "absolute",
  left: 0,
  top: 0,
  height: "100%",
});
