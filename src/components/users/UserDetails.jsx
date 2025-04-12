import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, Alert, Button, Tab, Nav, ProgressBar, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../actions/userActions';
import { listMyGroups } from '../../actions/groupActions';
import { 
  FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLanguage, 
  FaUserShield, FaCheckCircle, FaTimesCircle, FaSms, 
  FaBell, FaCalendarAlt, FaEdit, FaUserFriends, FaIdCard,
  FaClock, FaExclamationTriangle, FaMapMarkerAlt, FaUserTag,
  FaAddressCard
} from 'react-icons/fa';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: loadingMy, error: errorMy, myGroups: myGroupsList = [] } = myGroups;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const userId = id || userInfo?.user?._id;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails(userId));
      dispatch(listMyGroups());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userId, userInfo]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    return status ? 'success' : 'warning';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'danger';
      case 'Manager':
        return 'primary';
      case 'Member':
        return 'info';
      case 'User':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Loading placeholder component
  const LoadingSpinner = () => (
    <div className="text-center p-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted">Loading user information...</p>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }) => (
    <Alert variant="danger" className="d-flex align-items-center">
      <FaExclamationTriangle className="me-2" />
      <div>{message}</div>
    </Alert>
  );

  // Card header component
  const ProfileCardHeader = ({ icon, title, badgeText, badgeVariant }) => (
    <Card.Header className="bg-white border-bottom">
      <div className="d-flex align-items-center">
        {icon}
        <h5 className="mb-0 ms-2">{title}</h5>
        {badgeText && (
          <Badge bg={badgeVariant} className="ms-auto">
            {badgeText}
          </Badge>
        )}
      </div>
    </Card.Header>
  );

  // Group card component
  const GroupCard = ({ group }) => (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">{group.name}</h6>
            <Badge bg="light" text="dark" className="me-2">{group.groupType}</Badge>
            <Badge bg={group.isActive ? 'success' : 'warning'} className="me-2">
              {group.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="text-end text-muted small">
            <div>{group.members.length} members</div>
            <div>Created: {new Date(group.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <Alert variant="info">No user data available</Alert>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Link to="/users" className="btn btn-light me-3 rounded-circle">
            <FaArrowLeft />
          </Link>
          <h2 className="mb-0">{user?.name?.split(' ')[0] || 'Unknown'} profile</h2>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate(`/users/${user._id}/edit`)}
          className="d-flex align-items-center"
        >
          <FaEdit className="me-2" /> Edit Profile
        </Button>
      </div>

      <Row>
        <Col lg={4} md={5} className="mb-4">
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="text-center py-4">
              {user.profilePicture ? (
                <div className="mb-4">
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="rounded-circle img-thumbnail" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div className="bg-light text-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                  <FaUser size={40} />
                </div>
              )}
              <h4 className="mb-1">{user.name}</h4>
              {user.username && (
                <p className="text-primary mb-2">@{user.username}</p>
              )}
              <p className="text-muted mb-3">{user.email}</p>
              <Badge bg={getRoleBadge(user.role)} className="px-3 py-2">
                {user.role}
              </Badge>
            </Card.Body>
            <Card.Footer className="bg-white pt-0 border-top-0">
              <Row className="text-center g-0">
                <Col xs={6} className="border-end">
                  <div className="p-3">
                    <h6>Status</h6>
                    <Badge bg={getStatusColor(user.isActive)} className="px-3 py-2">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="p-3">
                    <h6>Verified</h6>
                    {user.isVerified ? (
                      <FaCheckCircle className="text-success" size={24} />
                    ) : (
                      <FaTimesCircle className="text-danger" size={24} />
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={8} md={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white p-0 border-bottom-0">
              <Nav variant="tabs" className="nav-tabs-custom" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="px-3 py-3">
                    <FaUser className="me-2" />
                    Profile Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="notifications" className="px-3 py-3">
                    <FaBell className="me-2" />
                    Notifications
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="groups" className="px-3 py-3">
                    <FaUserFriends className="me-2" />
                    Groups
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="account" className="px-3 py-3">
                    <FaUserFriends className="me-2" />
                    Account Info
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body className="p-4">
              <Tab.Content>
                <Tab.Pane eventKey="profile" active={activeTab === 'profile'}>
                  <Row className="g-4">
                    <Col md={6}>
                    <div className="mb-4 text-start">
                      <label className="text-muted small text-uppercase">Full Name</label>
                      <div className="d-flex align-items-center mt-2">
                        <FaUser className="text-primary me-3" />
                        <h6 className="mb-0">{user.name}</h6>
                      </div>
                    </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4 text-start">
                        <label className="text-muted small text-uppercase">Email</label>
                        <div className="d-flex align-items-center mt-2">
                          <FaEnvelope className="text-primary me-3" />
                          <h6 className="mb-0">{user.email}</h6>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4 text-start">
                        <label className="text-muted small text-uppercase">Phone</label>
                        <div className="d-flex align-items-center mt-2">
                          <FaPhone className="text-primary me-3" />
                          <h6 className="mb-0">{user.phoneNumber || 'Not provided'}</h6>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4 text-start">
                        <label className="text-muted small text-uppercase">Role</label>
                        <div className="d-flex align-items-center mt-2">
                          <FaUserShield className="text-primary me-3" />
                          <h6 className="mb-0">
                            <Badge bg={getRoleBadge(user.role)}>
                              {user.role}
                            </Badge>
                          </h6>
                        </div>
                      </div>
                    </Col>
                    {user.username && (
                      <Col md={6}>
                        <div className="mb-4 text-start">
                          <label className="text-muted small text-uppercase">Username</label>
                          <div className="d-flex align-items-center mt-2">
                            <FaUserTag className="text-primary me-3" />
                            <h6 className="mb-0">@{user.username}</h6>
                          </div>
                        </div>
                      </Col>
                    )}
                    {user.county && (
                      <Col md={6}>
                        <div className="mb-4 text-start">
                          <label className="text-muted small text-uppercase">County</label>
                          <div className="d-flex align-items-center mt-2">
                            <FaMapMarkerAlt className="text-primary me-3" />
                            <h6 className="mb-0">{user.county}</h6>
                          </div>
                        </div>
                      </Col>
                    )}
                    {user.idNumber && (
                      <Col md={6}>
                        <div className="mb-4 text-start">
                          <label className="text-muted small text-uppercase">ID Number</label>
                          <div className="d-flex align-items-center mt-2">
                            <FaAddressCard className="text-primary me-3" />
                            <h6 className="mb-0">{user.idNumber}</h6>
                          </div>
                        </div>
                      </Col>
                    )}
                    <Col md={6}>
                      <div className="mb-4 text-start">
                        <label className="text-muted small text-uppercase">Language</label>
                        <div className="d-flex align-items-center mt-2">
                          <FaLanguage className="text-primary me-3" />
                          <h6 className="mb-0">{user.language || 'Not specified'}</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>
                
                <Tab.Pane eventKey="notifications" active={activeTab === 'notifications'}>
                  <div className="mb-4">
                    <h6 className="text-uppercase small text-muted mb-3">Notification Channels</h6>
                    <Row className="g-3">
                      <Col md={4}>
                        <Card className={`border-0 h-100 ${user.notificationPreferences?.email ? 'shadow-sm' : 'bg-light'}`}>
                          <Card.Body className="d-flex align-items-center">
                            <div className={`me-3 fs-4 ${user.notificationPreferences?.email ? 'text-primary' : 'text-muted'}`}>
                              <FaEnvelope />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0">Email</h6>
                              <small className={user.notificationPreferences?.email ? 'text-success' : 'text-muted'}>
                                {user.notificationPreferences?.email ? 'Enabled' : 'Disabled'}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className={`border-0 h-100 ${user.notificationPreferences?.sms ? 'shadow-sm' : 'bg-light'}`}>
                          <Card.Body className="d-flex align-items-center">
                            <div className={`me-3 fs-4 ${user.notificationPreferences?.sms ? 'text-primary' : 'text-muted'}`}>
                              <FaSms />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0">SMS</h6>
                              <small className={user.notificationPreferences?.sms ? 'text-success' : 'text-muted'}>
                                {user.notificationPreferences?.sms ? 'Enabled' : 'Disabled'}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className={`border-0 h-100 ${user.notificationPreferences?.push ? 'shadow-sm' : 'bg-light'}`}>
                          <Card.Body className="d-flex align-items-center">
                            <div className={`me-3 fs-4 ${user.notificationPreferences?.push ? 'text-primary' : 'text-muted'}`}>
                              <FaBell />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0">Push</h6>
                              <small className={user.notificationPreferences?.push ? 'text-success' : 'text-muted'}>
                                {user.notificationPreferences?.push ? 'Enabled' : 'Disabled'}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  
                  <h6 className="text-uppercase small text-muted mb-3">Notification Coverage</h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Configuration completeness</span>
                      <small>
                        {
                          Object.values(user.notificationPreferences || {}).filter(v => v).length
                        }/3
                      </small>
                    </div>
                    <ProgressBar 
                      now={
                        (Object.values(user.notificationPreferences || {}).filter(v => v).length / 3) * 100
                      } 
                      variant="primary"
                    />
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="groups" active={activeTab === 'groups'}>
                  {loadingMy ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" size="sm" variant="primary" />
                      <p className="mt-2 text-muted">Loading groups...</p>
                    </div>
                  ) : errorMy ? (
                    <ErrorMessage message={errorMy} />
                  ) : myGroupsList && myGroupsList.length ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase small text-muted mb-0">Group Memberships</h6>
                        <Badge bg="primary" pill>{myGroupsList.length}</Badge>
                      </div>
                      <div>
                        {myGroupsList.map((group) => (
                          <GroupCard key={group._id} group={group} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <FaUserFriends className="text-muted mb-3" size={32} />
                      <p className="mb-0">No groups assigned</p>
                    </div>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="account" active={activeTab === 'account'}>
                  {loadingMy ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" size="sm" variant="primary" />
                      <p className="mt-2 text-muted">Loading account info...</p>
                    </div>
                  ) : errorMy ? (
                    <ErrorMessage message={errorMy} />
                  ) : user ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase small text-muted mb-0">Account Info</h6>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <FaCalendarAlt className="text-muted me-2" />
                        <div>
                          <div className="small text-muted">Created</div>
                          <div>{user.createdAt ? formatDate(user.createdAt) : 'Not available'}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <FaClock className="text-muted me-2" />
                        <div>
                          <div className="small text-muted">Last Updated</div>
                          <div>{user.updatedAt ? formatDate(user.updatedAt) : 'Not available'}</div>
                        </div>
                      </div>
                      {user.username && (
                        <div className="d-flex align-items-center mb-3">
                          <FaUserTag className="text-muted me-2" />
                          <div>
                            <div className="small text-muted">Username</div>
                            <div>@{user.username}</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <FaUserFriends className="text-muted mb-3" size={32} />
                      <p className="mb-0">ERROR</p>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetails;