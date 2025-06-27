import React, { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router';

import { MenuButton } from '@jasperoosthoek/react-toolbox';
import { useNavRoutes } from '../router';
import NavLinks from './NavLinks';
import LanguageDropdown from './LanguageDropdown';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navRoutes = useNavRoutes();

  return (
    <>
      <Navbar bg='light'>
        <Link to='../'>
          <Navbar.Brand>Dashboard</Navbar.Brand>
        </Link>
        <MenuButton
          className='p-0 d-md-none ms-3 menu-button'
          size='lg'
          onClick={() => setShowMenu(!showMenu)}
        />
        <Nav className='mr-auto'>
          <Navbar.Text id='dashboard-title'>
            <div />
          </Navbar.Text>
        </Nav>
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>
          </Navbar.Text>
          &nbsp;
          
          <Navbar.Text>
            <LanguageDropdown />
          </Navbar.Text>
          {/* <Nav.Link onClick={() => logout()}>{text`logout`}</Nav.Link> */}
        </Navbar.Collapse>
      </Navbar>

      {showMenu &&
        // Mobile menu that can be opened by clicking on MenuButton
        <div className='nav-menu bg-light'>
          <div className='p-0 d-md-none ms-3'>
            <div className='divider' />
            <Nav className='d-block'>
              <NavLinks
                routes={navRoutes}
                breadcrumb={false}
                onClick={() => setShowMenu(!showMenu)}
              />
            </Nav>
          </div>
        </div>
      }

      <Row className="full-width">
        {/* Sidebar: Visible on md+ screens, hidden on small screens */}
        <Col md="2" className="sidebar d-none d-md-block">
          <Nav className="nav-sidebar no-wrap bg-light fluid">
            <div>
              <NavLinks routes={navRoutes} />
            </div>
          </Nav>
        </Col>

        {/* Main Content: Full width when sidebar is hidden */}
        <Col xs="12" md="10">
          <Outlet />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard;

export const DashboardTitle = ({ children }: { children: React.ReactNode }) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.getElementById("dashboard-title"));
  }, []);

  if (!element) return null;

  return createPortal(children, element);
};