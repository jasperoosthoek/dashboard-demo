import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from "react-router";

import Dashboard from "./components/Dashboard";
import DashboardPage from "./pages/dashboard/DashboardPage";
import EmployeesPage from "./pages/employees/EmployeesPage";
import RolesPage from "./pages/employees/RolesPage";
import ProjectsListPage from "./pages/projects/ProjectsListPage";
import ProjectPage from "./pages/projects/ProjectPage";
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
          Component: EmployeesPage,
        },
        {
          path: "roles",
          Component: RolesPage,
          title: text`link_roles`,
        },
      ],
    },
    {
      path: "projects",
      title: text`link_projects`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: ProjectsListPage,
        },
        {
          path: ":id",
          Component: ProjectPage,
        },
      ],
    },
    {
      path: "tasks",
      title: text`link_tasks`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: EmployeesPage,
        },
      ],
    },
    {
      path: "quotations",
      title: text`link_quotations`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: EmployeesPage,
        },
      ],
    },
    {
      path: "notes",
      title: text`link_notes`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: EmployeesPage,
        },
      ],
    },
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