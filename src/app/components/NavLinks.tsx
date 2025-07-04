import React, { type ReactNode } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, matchPath } from 'react-router';
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
  breadcrumb?: React.ReactNode | false;
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
          const { path, title: titleBase, children } = route;

          const newPath = `${pathRoot}/${path}`.replace(/\/+/g, "/");
          const isActive = pathname.startsWith(newPath);
          
          const finalPart = pathname.split('/').pop()
          // Use the given title for in case of a match use the last part of the path to display the id 
          const title = titleBase || (matchPath(newPath, pathname) && !!Number(finalPart) && `#${finalPart}`);

          // Use actual path then no title is given but a match exists which means there is number in the path
          const showPath = !titleBase && matchPath(newPath, pathname) ? pathname : newPath;

          const newBreadcrumb = breadcrumb === false ? false : (
            <>
              {breadcrumb}
              {breadcrumb && " / "}
              <Link to={showPath}>{title}</Link>
            </>
          );

          return (
            <div onClick={onClick} key={key}>
              {title && (
                <NavLink to={showPath}>
                  {title}
                </NavLink>
              )}
              {children && isActive && (
                <div style={{ marginLeft: "20px" }}>
                  <NavLinks
                    routes={children}
                    path={showPath}
                    breadcrumb={newBreadcrumb}
                    onClick={onClick} 
                  />
                </div>
              )}
      
              {matchPath(newPath, pathname) && newBreadcrumb && (
                <DashboardTitle>{newBreadcrumb}</DashboardTitle>
              )}
            </div>
          );
        })}
    </>
  );
};

export default NavLinks