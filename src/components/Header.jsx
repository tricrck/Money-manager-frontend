import React from 'react';
import { 
  Container, 
  Navbar, 
  Nav, 
  NavDropdown, 
  Badge,
  Stack,
  Offcanvas
} from 'react-bootstrap';
import { 
  LinkContainer 
} from 'react-router-bootstrap';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { 
  logout 
} from '../actions/userActions';
import { 
  FaUser, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaWallet, 
  FaChartLine, 
  FaHome,
  FaBell,
  FaQuestionCircle
} from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin || {};
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <Navbar 
      bg="light" 
      variant="light" 
      expand="lg" 
      sticky="top"
      className="border-bottom"
    >
      <Container fluid className="px-3">
        {/* Left side - Brand with blue icon */}
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            <FaWallet className="me-2 text-primary" size={20} />
            <span className="fw-bold">Money Manager</span>
          </Navbar.Brand>
        </LinkContainer>

        {/* Center - Main navigation items */}
        

        {/* Right side - User controls */}
        <div className="d-flex align-items-center">
          {/* Notification Bell */}
          <Nav.Link className="position-relative me-3">
            <FaBell size={16} />
            <Badge pill bg="secondary" className="position-absolute top-0 start-100 translate-middle">
              3
            </Badge>
          </Nav.Link>

          {userInfo ? (
            <NavDropdown 
              title={userInfo.user?.name || 'Account'} 
              align="end"
              id="user-dropdown"
            >
              <LinkContainer to="/profile">
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <LinkContainer to="/login">
              <Nav.Link>Sign In</Nav.Link>
            </LinkContainer>
          )}
        </div>

        {/* Mobile Offcanvas Menu */}
        <Offcanvas 
          show={showOffcanvas} 
          onHide={handleCloseOffcanvas} 
          placement="end"
          className="bg-white"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <LinkContainer to="/" onClick={handleCloseOffcanvas}>
                <Nav.Link className="py-2">
                  <Stack direction="horizontal" gap={2}>
                    <FaHome />
                    <span>Home</span>
                  </Stack>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/dashboard" onClick={handleCloseOffcanvas}>
                <Nav.Link className="py-2">
                  <Stack direction="horizontal" gap={2}>
                    <FaChartLine />
                    <span>Dashboard</span>
                  </Stack>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/transactions" onClick={handleCloseOffcanvas}>
                <Nav.Link className="py-2">
                  <Stack direction="horizontal" gap={2}>
                    <FaWallet />
                    <span>Transactions</span>
                  </Stack>
                </Nav.Link>
              </LinkContainer>
              
              <hr className="my-2" />
              
              {userInfo ? (
                <>
                  <LinkContainer to="/profile" onClick={handleCloseOffcanvas}>
                    <Nav.Link className="py-2">
                      <Stack direction="horizontal" gap={2}>
                        <FaUser />
                        <span>Profile</span>
                      </Stack>
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={() => {
                    logoutHandler();
                    handleCloseOffcanvas();
                  }} className="py-2">
                    <Stack direction="horizontal" gap={2}>
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </Stack>
                  </Nav.Link>
                </>
              ) : (
                <LinkContainer to="/login" onClick={handleCloseOffcanvas}>
                  <Nav.Link className="py-2">
                    <Stack direction="horizontal" gap={2}>
                      <FaSignInAlt />
                      <span>Sign In</span>
                    </Stack>
                  </Nav.Link>
                </LinkContainer>
              )}

              <hr className="my-2" />
              <LinkContainer to="/help" onClick={handleCloseOffcanvas}>
                <Nav.Link className="py-2">
                  <Stack direction="horizontal" gap={2}>
                    <FaQuestionCircle />
                    <span>Help</span>
                  </Stack>
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Header;