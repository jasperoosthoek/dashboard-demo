import { useMemo } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from 'react-router';

import Dashboard from './components/Dashboard';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeesList from './pages/employees/EmployeesList';
import EmployeeItem from './pages/employees/EmployeeItem';
import RolesPage from './pages/employees/RolesList';
import ProjectsList from './pages/projects/ProjectsList';
import ProjectItem from './pages/projects/ProjectItem';
import TasksList from './pages/tasks/TasksList';
import InvoicesList from './pages/invoices/InvoicesList';
import NotesList from './pages/notes/NotesList';
import NoMatchPage from './pages/NoMatchPage';
import { useLocalization } from '@jasperoosthoek/react-toolbox';

export type RouteDef = RouteObject & {
  title?: string;
  children?: RouteDef[]; // recursive typing for nav tree
};

export const useNavRoutes = () => {
  const { text } = useLocalization();

  return useMemo(() => [
    {
      path: 'employees',
      title: text`link_employees`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: EmployeesList,
        },
        {
          path: ':id',
          Component: EmployeeItem,
        },
        {
          path: 'roles',
          Component: RolesPage,
          title: text`link_roles`,
        },
      ],
    },
    {
      path: 'projects',
      title: text`projects`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: ProjectsList,
        },
        {
          path: ':id',
          Component: ProjectItem,
        },
      ],
    },
    {
      path: 'tasks',
      title: text`tasks`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: TasksList,
        },
      ],
    },
    {
      path: 'invoices',
      title: text`invoices`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: InvoicesList,
        },
      ],
    },
    {
      path: 'notes',
      title: text`notes`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: NotesList,
        },
      ],
    },
  ] as RouteDef[], [text]);
}

const BrowserRouter = () => {
  const navRoutes = useNavRoutes();

  const router = useMemo(() => createBrowserRouter([
    {
      path: '/',
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
      path: '*',
      Component: NoMatchPage,
    },
  ]), [navRoutes]);
  return <RouterProvider router={router} />;
}

export default BrowserRouter;