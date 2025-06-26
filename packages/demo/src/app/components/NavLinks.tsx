import React, { ReactNode } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router';
import { DashboardTitle } from './Dashboard';
import type { RouteDef } from '../router';

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Nav.Item>
    <Link to={to} className='nav-item'>
      <div className='nav-link'>{children}</div>
    </Link>
  </Nav.Item>
);


type NavLinksProps = {
  routes: RouteDef[];
  path?: string;
  breadcrumb?: React.ReactNode;
  onClick?: () => void;
};

export const NavLinks = ({
  routes,
  path: pathRoot = "",
  breadcrumb,
  onClick,
}: NavLinksProps) => {
  const { pathname } = useLocation();
  return (
    <>
      {routes
        .filter((route) => !route.index && route.path) // skip index routes
        .map((route, key) => {
          const { path, title, children } = route;

          const newPath = `${pathRoot}/${path}`.replace(/\/+/g, "/");
          const isActive = pathname.startsWith(newPath);

          const newBreadcrumb = (
            <>
              {breadcrumb}
              {breadcrumb && " / "}
              <Link to={newPath}>{title}</Link>
            </>
          );

          return (
            <div onClick={onClick} key={key}>
              <NavLink to={newPath}>
                {title}
              </NavLink>

              {children && isActive && (
                <div style={{ marginLeft: "20px" }}>
                  <NavLinks
                    routes={children}
                    path={newPath}
                    breadcrumb={newBreadcrumb}
                    onClick={onClick} 
                  />
                </div>
              )}
      
              {pathname === newPath && (
                <DashboardTitle>{newBreadcrumb}</DashboardTitle>
              )}
            </div>
          );
        })}
    </>
  );
};

export default NavLinks