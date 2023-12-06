import { type RouteRecordRaw } from "vue-router";
import { PageEnum } from "../../enums/pageEnum";

export const RootRoute: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
};

export const MicroRoute = [
 
];

export const basicRoutes = [RootRoute];
