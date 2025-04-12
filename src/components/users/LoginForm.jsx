import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaMobile, FaExclamationTriangle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../actions/userActions';

const LoginForm = () => {
  // Enhanced state management
  const [credentials, setCredentials] = useState({
    phoneNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin || {};

  // Load saved phone number if remember me was checked
  useEffect(() => {
    const savedPhone = localStorage.getItem('rememberedPhone');
    if (savedPhone) {
      setCredentials(prev => ({ ...prev, phoneNumber: savedPhone }));
      setRememberMe(true);
    }
  }, []);

  // Navigation after successful login
  useEffect(() => {
    if (userInfo) {
      // Save phone number if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedPhone', credentials.phoneNumber);
      } else {
        localStorage.removeItem('rememberedPhone');
      }
      
      // Add success message before navigating
      const loginTimestamp = new Date().toLocaleString();
      sessionStorage.setItem('loginSuccess', `Last login: ${loginTimestamp}`);
      
      navigate('/');
    }
  }, [navigate, userInfo, rememberMe, credentials.phoneNumber]);

  // Track failed login attempts
  useEffect(() => {
    if (error && loginAttempts > 0) {
      setLoginAttempts(prev => prev + 1);
      
      // Lock out after 5 failed attempts
      if (loginAttempts >= 5) {
        // Add lockout logic here
        const lockoutTime = 5; // minutes
        sessionStorage.setItem('loginLockout', Date.now() + (lockoutTime * 60 * 1000));
      }
    }
  }, [error]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    // Enhanced validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Format phone number (remove spaces, dashes, etc.)
    const formattedPhone = credentials.phoneNumber.replace(/[^0-9]/g, '');
    
    // Increment login attempts counter
    setLoginAttempts(prev => prev + 1);
    
    // Dispatch login action
    dispatch(login(formattedPhone, credentials.password));
  };

  // Check if user is locked out
  const lockoutTimestamp = sessionStorage.getItem('loginLockout');
  const isLockedOut = lockoutTimestamp && Date.now() < parseInt(lockoutTimestamp);
  const remainingLockoutTime = isLockedOut ? 
    Math.ceil((parseInt(lockoutTimestamp) - Date.now()) / 60000) : 0;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="mb-0 d-flex align-items-center justify-content-center">
                <FaSignInAlt className="me-2" /> Secure Login
              </h3>
            </Card.Header>
            
            <Card.Body className="px-4 py-5">
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> {error}
                </Alert>
              )}
              
              {isLockedOut && (
                <Alert variant="warning">
                  <FaExclamationTriangle className="me-2" /> 
                  Too many failed attempts. Please try again in {remainingLockoutTime} minute(s).
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group controlId="phoneNumber" className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <FaMobile />
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      placeholder="Enter phone number"
                      value={credentials.phoneNumber}
                      onChange={handleChange}
                      pattern="^[0-9\-\+\s\(\)]{8,15}$"
                      required
                      disabled={isLockedOut || loading}
                      autoComplete="tel"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid phone number.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Format: 0701234567
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={credentials.password}
                      onChange={handleChange}
                      minLength="8"
                      required
                      disabled={isLockedOut || loading}
                      autoComplete="current-password"
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={togglePasswordVisibility}
                      disabled={isLockedOut || loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember my phone number"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLockedOut || loading}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="py-2"
                    disabled={isLockedOut || loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" /> Login
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="text-center py-3 bg-light">
              <div className="mb-2">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
              <div>
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none">
                  Sign Up
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;