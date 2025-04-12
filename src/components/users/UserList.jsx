import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Container, Alert, Spinner, Card, 
  Badge, InputGroup, FormControl, Row, Col, Modal,
  Form, Dropdown, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { listUsers, deleteUser } from '../../actions/userActions';
import { 
  FaUserCircle, FaTrashAlt, FaPencilAlt, FaSearch,
  FaSort, FaSortUp, FaSortDown, FaFilter, FaEllipsisV,
  FaPlus, FaUserPlus, FaEnvelope, FaPhone, FaIdCard, 
  FaUserTag, FaExclamationTriangle
} from 'react-icons/fa';

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filterRole, setFilterRole] = useState('');

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete, loading: deleteLoading } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.user && userInfo.user.role === 'Admin') {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, successDelete, userInfo]);

  const confirmDeleteHandler = () => {
    dispatch(deleteUser(userToDelete));
    setShowDeleteModal(false);
  };

  const openDeleteModal = (id, name) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-muted" />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const filteredUsers = users
    ? users
        .filter((user) => 
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.phoneNumber?.includes(searchTerm)) &&
          (filterRole === '' || user.role === filterRole)
        )
        .sort((a, b) => {
          let comparison = 0;
          if (a[sortField] > b[sortField]) {
            comparison = 1;
          } else if (a[sortField] < b[sortField]) {
            comparison = -1;
          }
          return sortDirection === 'desc' ? comparison * -1 : comparison;
        })
    : [];

  const getBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'danger';
      case 'Manager':
        return 'warning';
      case 'Employee':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 d-flex align-items-center">
                <FaUserCircle className="me-2 text-primary" /> User Management
              </h3>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                className="d-flex align-items-center"
                onClick={() => navigate('/admin/user/create')}
              >
                <FaUserPlus className="me-2" /> Add User
              </Button>
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4} lg={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="User">User</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col xs="auto" className="ms-auto">
              {users && (
                <Badge bg="info" className="py-2 px-3">
                  {filteredUsers.length} of {users.length} users
                </Badge>
              )}
            </Col>
          </Row>

          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th onClick={() => handleSort('name')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          NAME {getSortIcon('name')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('email')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          EMAIL {getSortIcon('email')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('phoneNumber')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          PHONE {getSortIcon('phoneNumber')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('role')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          ROLE {getSortIcon('role')}
                        </div>
                      </th>
                      <th className="text-end">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle p-2 me-3">
                                <FaUserCircle size={20} className="text-secondary" />
                              </div>
                              <div>
                                <Link 
                                  to={`/users/${user._id}`}
                                  className="text-decoration-none fw-bold"
                                >
                                  {user.name}
                                </Link>
                                <div className="small text-muted">ID: {user._id.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaEnvelope className="text-muted me-2" />
                              <a href={`mailto:${user.email}`} className="text-decoration-none">
                                {user.email}
                              </a>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaPhone className="text-muted me-2" />
                              {user.phoneNumber || 'Not provided'}
                            </div>
                          </td>
                          <td>
                            <Badge bg={getBadgeColor(user.role)} className="py-2 px-3">
                              <FaUserTag className="me-1" /> {user.role}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex justify-content-end">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Edit User</Tooltip>}
                              >
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                  <Button variant="light" className="btn-sm me-2">
                                    <FaPencilAlt />
                                  </Button>
                                </LinkContainer>
                              </OverlayTrigger>
                              
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Delete User</Tooltip>}
                              >
                                <Button
                                  variant="light"
                                  className="btn-sm text-danger"
                                  onClick={() => openDeleteModal(user._id, user.name)}
                                >
                                  <FaTrashAlt />
                                </Button>
                              </OverlayTrigger>
                              
                              <Dropdown className="ms-2">
                                <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${user._id}`}>
                                  <FaEllipsisV />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                  <Dropdown.Item as={Link} to={`/users/${user._id}`}>
                                    <FaIdCard className="me-2" /> View Profile
                                  </Dropdown.Item>
                                  <Dropdown.Item as={Link} to={`/admin/user/${user._id}/permissions`}>
                                    <FaUserTag className="me-2" /> Manage Permissions
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {users && users.length > 10 && (
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="outline-primary" className="px-4">
                    Load More Users
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaExclamationTriangle className="me-2" /> Delete User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteHandler}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrashAlt className="me-2" /> Delete User
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserList;