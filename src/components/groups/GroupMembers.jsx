import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert, Badge, Form, Modal } from 'react-bootstrap';
import { FaUserPlus, FaUserEdit, FaUserTimes, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupDetails, addGroupMembers, updateGroupMember, removeGroupMember, leaveGroup } from '../../actions/groupActions';
import { listUsers } from '../../actions/userActions';
import { useParams, Link } from 'react-router-dom';

const GroupMembers = ({  history }) => {
  const { id } = useParams();
  const groupId = id;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [membersToAdd, setMembersToAdd] = useState([]);
  const [role, setRole] = useState('member');
  const [status, setStatus] = useState('active');

  const dispatch = useDispatch();

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading, error, group } = groupDetails;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const groupAddMembers = useSelector((state) => state.groupAddMembers);
  const { loading: loadingAdd, error: errorAdd } = groupAddMembers;

  const groupUpdateMember = useSelector((state) => state.groupUpdateMember);
  const { loading: loadingUpdate, error: errorUpdate } = groupUpdateMember;

  const groupRemoveMember = useSelector((state) => state.groupRemoveMember);
  const { loading: loadingRemove, error: errorRemove } = groupRemoveMember;

  const groupLeave = useSelector((state) => state.groupLeave);
  const { loading: loadingLeave, error: errorLeave } = groupLeave;

  useEffect(() => {
    if (userInfo) {
      dispatch(getGroupDetails(groupId));
      dispatch(listUsers());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, groupId, userInfo]);

  const isOwner = group?.owner?._id === userInfo?.user?._id;
  const isAdmin = group?.members?.some(
    (m) => m.user._id === userInfo?.user?._id && m.role === 'admin'
  );

  const handleAddMembers = () => {
    const membersData = membersToAdd.map((userId) => ({
      userId,
      role,
    }));
    dispatch(addGroupMembers(groupId, membersData));
    setShowAddModal(false);
    setMembersToAdd([]);
  };

  const handleUpdateMember = () => {
    dispatch(updateGroupMember(groupId, selectedMember.user._id, { role, status }));
    setShowEditModal(false);
  };

  const handleRemoveMember = (memberId) => {
    dispatch(removeGroupMember(groupId, memberId));
  };

  const handleLeaveGroup = () => {
    dispatch(leaveGroup(groupId));
    setShowLeaveModal(false);
    history.push('/groups');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return <Badge bg="primary">Owner</Badge>;
      case 'admin':
        return <Badge bg="success">Admin</Badge>;
      case 'treasurer':
        return <Badge bg="info">Treasurer</Badge>;
      default:
        return <Badge bg="secondary">Member</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="warning">Inactive</Badge>;
      case 'suspended':
        return <Badge bg="danger">Suspended</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="py-5">
      <Link to={`/groups/${groupId}`} className="btn btn-light my-3">
        <FaArrowLeft /> Back to Group
      </Link>
      <h2 className="mb-4">Group Members</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {errorAdd && <Alert variant="danger">{errorAdd}</Alert>}
      {errorUpdate && <Alert variant="danger">{errorUpdate}</Alert>}
      {errorRemove && <Alert variant="danger">{errorRemove}</Alert>}
      {errorLeave && <Alert variant="danger">{errorLeave}</Alert>}

      <div className="d-flex justify-content-between mb-4">
        <h4>{group?.name} Members</h4>
        {(isOwner || isAdmin) && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FaUserPlus /> Add Members
          </Button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>NAME</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>JOINED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {group?.owner && (
              <tr key={group.owner._id}>
                <td>
                  {group.owner.name} {group.owner._id === userInfo?.user?._id && '(You)'}
                </td>
                <td>{getRoleBadge('owner')}</td>
                <td>{getStatusBadge('active')}</td>
                <td>{new Date(group.createdAt).toLocaleDateString()}</td>
                <td></td>
              </tr>
            )}
            {group?.members?.map((member) => (
              <tr key={member.user._id}>
                <td>
                  {member.user.name} {member.user._id === userInfo?.user?._id && '(You)'}
                </td>
                <td>{getRoleBadge(member.role)}</td>
                <td>{getStatusBadge(member.status)}</td>
                <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                <td>
                  {(isOwner || isAdmin) && (
                    <>
                      <Button
                        variant="light"
                        className="btn-sm mx-1"
                        onClick={() => {
                          setSelectedMember(member);
                          setRole(member.role);
                          setStatus(member.status);
                          setShowEditModal(true);
                        }}
                      >
                        <FaUserEdit />
                      </Button>
                      {member.user._id !== userInfo?.user?._id && (
                        <Button
                          variant="danger"
                          className="btn-sm mx-1"
                          onClick={() => handleRemoveMember(member.user._id)}
                          disabled={loadingRemove}
                        >
                          <FaUserTimes />
                        </Button>
                      )}
                    </>
                  )}
                  {member.user._id === userInfo?.user?._id && !isOwner && (
                    <Button
                      variant="warning"
                      className="btn-sm mx-1"
                      onClick={() => setShowLeaveModal(true)}
                      disabled={loadingLeave}
                    >
                      <FaSignOutAlt /> Leave
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Members Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="members" className="mb-3">
            <Form.Label>Select Members</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={membersToAdd}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, (option) => option.value);
                setMembersToAdd(options);
              }}
            >
              {users
                ?.filter(
                  (user) =>
                    !group?.members?.some((m) => m.user._id === user._id) &&
                    user._id !== group?.owner?._id
                )
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="role" className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="treasurer">Treasurer</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMembers} disabled={loadingAdd}>
            {loadingAdd ? 'Adding...' : 'Add Members'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <>
              <Form.Group controlId="editRole" className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="treasurer">Treasurer</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="editStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Form.Control>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateMember}
            disabled={loadingUpdate}
          >
            {loadingUpdate ? 'Updating...' : 'Update Member'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Leave Group Modal */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to leave this group? You won't be able to access it
          unless you're added again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLeaveGroup} disabled={loadingLeave}>
            {loadingLeave ? 'Leaving...' : 'Leave Group'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GroupMembers;