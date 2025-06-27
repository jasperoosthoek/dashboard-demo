import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from "react-router";

import Dashboard from "./components/Dashboard";
import DashboardPage from "./pages/dashboard/DashboardPage";
import EmployesPage from "./pages/employees/EmployeesPage";
import RolesPage from "./pages/employees/RolesPage";
import NoMatchPage from "./pages/NoMatchPage";
import { useLocalization } from '@jasperoosthoek/react-toolbox';

export type RouteDef = RouteObject & {
  title?: string;
  children?: RouteDef[]; // recursive typing for nav tree
};

export const useNavRoutes = () => {
  const { text } = useLocalization();

  return [
    {
      path: "employees",
      title: text`link_employees`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: EmployesPage,
        },
        {
          path: "roles",
          Component: RolesPage,
          title: text`link_roles`,
        },
      ],
    }
  ] as RouteDef[];
}

const BrowserRouter = () => {
  const navRoutes = useNavRoutes();   
    
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Dashboard, // layout route
      children: [
        {
          index: true,
          Component: DashboardPage,
        },
        ...navRoutes,
      ],
    },
    {
      path: "*",
      Component: NoMatchPage,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default BrowserRouter;