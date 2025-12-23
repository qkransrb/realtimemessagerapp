import BaseLayout from "@/layouts/base-layout";
import AppLayout from "@/layouts/app-layout";
import { Route, Routes } from "react-router-dom";
import { authRoutesPaths, protectedRoutesPaths } from "./routes";
import RouteGuard from "./route-guard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RouteGuard requiredAuth={false} />}>
        <Route element={<BaseLayout />}>
          {authRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<RouteGuard requiredAuth={true} />}>
        <Route element={<AppLayout />}>
          {protectedRoutesPaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
