import React, { ReactNode } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router';

import { useLocalization } from '@jasperoosthoek/react-toolbox';

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Nav.Item>
    <Link to={to} className='nav-item'>
      <div className='nav-link'>{children}</div>
    </Link>
  </Nav.Item>
);

const NavLinks = () => {
  const { text } = useLocalization();

  return (
    <>
      <NavLink to="../datatable">{text`link_users`}</NavLink>
      <NavLink to="../form">{text`link_roles`}</NavLink>
    </>
  )
}

export default NavLinks;