import React, { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router';
import { toast } from 'react-toastify';
import { MenuButton, useError, useLocalization } from '@jasperoosthoek/react-toolbox';

import { useNavRoutes } from '../router';
import NavLinks from './NavLinks';
import LanguageDropdown from './LanguageDropdown';

const Dashboard = () => {
  const { text } = useLocalization();
  const [showMenu, setShowMenu] = useState(false);
  const navRoutes = useNavRoutes();
  const { error, clearError } = useError();
  useEffect(() => {
    if (error) {
      console.log('An unhandled error occured', error)
      toast.error(text`unhandled_error`);
      clearError();
    }
  }, [error]);

  return (
    <>
      <Navbar bg='light'>
        <Link to='../'>
          <Navbar.Brand>{text`dashboard`}</Navbar.Brand>
        </Link>
        <Nav className='mr-auto'>
          <Navbar.Text id='dashboard-title'>
            <div />
          </Navbar.Text>
        </Nav>
        <Nav className='ms-auto align-items-center gap-3'>
          <LanguageDropdown />
          <MenuButton
            className='p-0 d-md-none menu-button'
            size='lg'
            iconSize='24'
            onClick={() => setShowMenu(!showMenu)}
          />
        </Nav>
      </Navbar>

      {showMenu &&
        <div className='nav-menu bg-light'>
          <div className='p-3 d-md-none'>
            <NavLinks
              routes={navRoutes}
              breadcrumb={false}
              onClick={() => setShowMenu(!showMenu)}
            />
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