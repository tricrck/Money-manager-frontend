import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { transferOwnership, getGroupDetails } from '../../actions/groupActions';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GroupTransferOwnership = ({ history }) => {
  const { id } = useParams();
  const groupId = id;

  const navigate = useNavigate();

  const [newOwnerId, setNewOwnerId] = useState('');

  const dispatch = useDispatch();

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading: loadingDetails, error: errorDetails, group } = groupDetails;

  const groupTransferOwnership = useSelector((state) => state.groupTransferOwnership);
  const { loading: loadingTransfer, error: errorTransfer, success: successTransfer } = groupTransferOwnership;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(getGroupDetails(groupId));
    } else {
        navigate('/login');
    }
  }, [dispatch, history, groupId, userInfo]);

  useEffect(() => {
    if (successTransfer) {
        navigate(`/groups/${groupId}`);
    }
  }, [history, groupId, successTransfer]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(transferOwnership(groupId, newOwnerId));
  };

  return (
    <Container className="py-5">
      <Link to={`/groups/${groupId}`} className="btn btn-light my-3">
        <FaArrowLeft /> Back to Group
      </Link>
      <h2 className="mb-4">Transfer Group Ownership</h2>
      {errorDetails && <Alert variant="danger">{errorDetails}</Alert>}
      {errorTransfer && <Alert variant="danger">{errorTransfer}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="newOwner" className="mb-3">
          <Form.Label>Select New Owner</Form.Label>
          <Form.Control
            as="select"
            value={newOwnerId}
            onChange={(e) => setNewOwnerId(e.target.value)}
            required
          >
            <option value="">Select a member</option>
            {group?.members
              ?.filter((member) => member.status === 'active')
              .map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name} ({member.role})
                </option>
              ))}
          </Form.Control>
        </Form.Group>

        <Alert variant="warning" className="mt-4">
          <strong>Warning:</strong> Transferring ownership will make you a regular member of
          this group. You will lose administrative privileges.
        </Alert>

        <Button
          type="submit"
          variant="primary"
          disabled={loadingTransfer || !newOwnerId}
          className="mt-4"
        >
          {loadingTransfer ? 'Transferring...' : 'Transfer Ownership'}
        </Button>
      </Form>
    </Container>
  );
};

export default GroupTransferOwnership;