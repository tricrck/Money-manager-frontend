import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaLanguage, 
  FaBell, 
  FaIdCard, 
  FaMapMarkerAlt,
  FaUserCircle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { register, updateUser, getUserDetails, login } from '../../actions/userActions';

const UserForm = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditing = Boolean(userId);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [profilePicture, setProfilePicture] = useState('');
  
  // UI state
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Redux state
  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister } = userRegister;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading: loadingDetails, error: errorDetails, user } = userDetails;

  // Counties list from User model
  const counties = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", 
    "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", 
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", 
    "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi", 
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", 
    "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", 
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
  ];

  // Load user data when editing
  useEffect(() => {
    if (isEditing) {
      if (!user || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
        setUsername(user.username || '');
        setIdNumber(user.idNumber || '');
        setCounty(user.county || 'Nairobi');
        setProfilePicture(user.profilePicture || '');
      }
    }
  }, [dispatch, userId, user, isEditing]);

  // Show success message
  useEffect(() => {
    if (successUpdate) {
      setMessage('User updated successfully');
      setTimeout(() => setMessage(null), 3000);
    }
  }, [successUpdate]);

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^(254|0)[17][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid Kenyan phone number (e.g., 0701234567)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Remove non-digits
    value = value.replace(/\D/g, '');
    
    // Format based on Kenyan phone patterns
    if (value.startsWith('254')) {
      // Allow as is
    } else if (value.startsWith('0')) {
      // Allow as is - will be converted on submit if needed
    } else if (value.length > 0) {
      // Add leading zero if user starts typing without it
      value = '0' + value;
    }
    
    // Limit length
    if (value.startsWith('254')) {
      value = value.slice(0, 12);
    } else {
      value = value.slice(0, 10);
    }
    
    setPhoneNumber(value);
    if (value.length > 9) {
      validatePhone(value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Validate password match
    if (!isEditing && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    // Validate phone
    if (!validatePhone(phoneNumber)) {
      return;
    }
    
    if (isEditing) {
      dispatch(updateUser({ 
        _id: userId, 
        name, 
        email, 
        phoneNumber, 
        username, 
        idNumber,
        county,
        profilePicture
      }));
    } else {
      dispatch(register({ 
        name, 
        email, 
        phoneNumber, 
        password
      })).then(() => {
        return dispatch(login(phoneNumber, password));
      }).then(() => {
        navigate('/');
      }).catch(error => {
        console.error('Registration or login failed:', error);
      });
    }
  };

  return (
    <Container className="py-4">
      <Card className="mx-auto shadow-sm border-0 rounded-3" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4">
            {isEditing && (
              <Button 
                variant="link" 
                className="p-0 me-2 text-dark" 
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <FaArrowLeft />
              </Button>
            )}
            <Card.Title className="m-0 text-center flex-grow-1">
              {isEditing ? 'Edit Profile' : 'Create Account'}
            </Card.Title>
          </div>

          {/* Alerts for feedback */}
          {message && (
            <Alert 
              variant={message.includes('not match') ? 'danger' : 'success'}
              dismissible
              onClose={() => setMessage(null)}
            >
              {message}
            </Alert>
          )}
          {(errorRegister || errorUpdate || errorDetails) && (
            <Alert variant="danger">
              {errorRegister || errorUpdate || errorDetails}
            </Alert>
          )}
          
          {/* Loading states */}
          {(loadingDetails && isEditing) ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading user details...</p>
            </div>
          ) : (
            <Form onSubmit={submitHandler}>
              {/* Name */}
              <Form.Group className="mb-3" controlId="name">
                <Form.Label className="d-flex align-items-center">
                  <FaUser className="me-2 text-secondary" />
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="py-2"
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="d-flex align-items-center">
                  <FaEnvelope className="me-2 text-secondary" />
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-2"
                />
              </Form.Group>

              {/* Phone Number */}
              <Form.Group className="mb-3" controlId="phoneNumber">
                <Form.Label className="d-flex align-items-center">
                  <FaPhone className="me-2 text-secondary" />
                  Phone Number
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="tel"
                    placeholder="0701234567"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    className="py-2"
                    isInvalid={!!phoneError}
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Format: 0701234567 or 254701234567
                </Form.Text>
                {phoneError && <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>}
              </Form.Group>

              {/* Password fields - Only for registration */}
              {!isEditing && (
                <>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="d-flex align-items-center">
                      <FaLock className="me-2 text-secondary" />
                      Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="py-2"
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label className="d-flex align-items-center">
                      <FaLock className="me-2 text-secondary" />
                      Confirm Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="py-2"
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </>
              )}

              {/* Additional fields for editing */}
              {isEditing && (
                <>
                  <hr className="my-4" />
                  <h5 className="mb-3">Additional Information</h5>
                  
                  {/* Username */}
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="d-flex align-items-center">
                      <FaUserCircle className="me-2 text-secondary" />
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  {/* ID Number */}
                  <Form.Group className="mb-3" controlId="idNumber">
                    <Form.Label className="d-flex align-items-center">
                      <FaIdCard className="me-2 text-secondary" />
                      National ID Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter ID number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  {/* County */}
                  <Form.Group className="mb-3" controlId="county">
                    <Form.Label className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-secondary" />
                      County
                    </Form.Label>
                    <Form.Select 
                      value={county} 
                      onChange={(e) => setCounty(e.target.value)}
                      className="py-2"
                    >
                      {counties.map(countyName => (
                        <option key={countyName} value={countyName}>
                          {countyName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Profile Picture URL */}
                  <Form.Group className="mb-4" controlId="profilePicture">
                    <Form.Label className="d-flex align-items-center">
                      <FaUserCircle className="me-2 text-secondary" />
                      Profile Picture URL
                    </Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://example.com/profile.jpg"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>
                </>
              )}

              {/* Submit Button */}
              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={loadingRegister || loadingUpdate}
                  className="py-2"
                >
                  {loadingRegister || loadingUpdate ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      {isEditing ? 'Updating...' : 'Creating Account...'}
                    </>
                  ) : (
                    isEditing ? 'Save Changes' : 'Create Account'
                  )}
                </Button>
                
                {!isEditing && (
                  <p className="text-center mt-3 mb-0">
                    Already have an account? <a href="/login">Log In</a>
                  </p>
                )}
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserForm;