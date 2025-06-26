import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from "react-router";

import Dashboard from "./components/Dashboard";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UsersPage from "./pages/users/UsersPage";
import RolesPage from "./pages/users/RolesPage";
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
      path: "users",
      title: text`link_users`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: UsersPage,
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