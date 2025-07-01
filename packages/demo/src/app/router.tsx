import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from 'react-router';

import Dashboard from './components/Dashboard';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeesList from './pages/employees/EmployeesList';
import RolesPage from './pages/employees/RolesList';
import ProjectsList from './pages/projects/ProjectsList';
import ProjectItem from './pages/projects/ProjectItem';
import TasksList from './pages/tasks/TasksList';
import InvoiceList from './pages/invoices/InvoicesList';
import NoMatchPage from './pages/NoMatchPage';
import { useLocalization } from '@jasperoosthoek/react-toolbox';

export type RouteDef = RouteObject & {
  title?: string;
  children?: RouteDef[]; // recursive typing for nav tree
};

export const useNavRoutes = () => {
  const { text } = useLocalization();

  return [
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
          path: 'roles',
          Component: RolesPage,
          title: text`link_roles`,
        },
      ],
    },
    {
      path: 'projects',
      title: text`link_projects`,
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
      title: text`link_tasks`,
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
      title: text`link_invoices`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: InvoiceList,
        },
      ],
    },
    {
      path: 'notes',
      title: text`link_notes`,
      Component: Outlet,
      children: [
        {
          index: true,
          Component: () => <div>{text`link_notes`}</div>,
        },
      ],
    },
  ] as RouteDef[];
}

const BrowserRouter = () => {
  const navRoutes = useNavRoutes();   
    
  const router = createBrowserRouter([
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
  ]);
  return <RouterProvider router={router} />;
}

export default BrowserRouter;