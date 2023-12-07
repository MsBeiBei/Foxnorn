import { LAYOUT } from "@/router/constants";

export const generatedRoutes = [
  {
    name: "app",
    path: "/app",
    component: LAYOUT,
    children: [
      {
        name: "mind",
        path: "mind",
      },
    ],
  },
  {
    name: "system",
    path: "/system",
    component: LAYOUT,
    children: [
      {
        name: "user",
        path: "user",
      },
    ],
  },
];
