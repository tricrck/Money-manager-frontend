import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { transferOwnership } from '../../actions/groupActions';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GroupTransferOwnership = ({ group }) => {
  const { id } = useParams();
  const groupId = id;
  const navigate = useNavigate();
  const [newOwnerId, setNewOwnerId] = useState('');
  const dispatch = useDispatch();

  const groupTransferOwnership = useSelector((state) => state.groupTransferOwnership);
  const { loading: loadingTransfer, error: errorTransfer, success: successTransfer } = groupTransferOwnership;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Check if current user is the group owner
  const isOwner = group?.createdBy?._id === userInfo?.user?._id;

  useEffect(() => {
    if (successTransfer) {
      navigate(`/groups/${groupId}`);
    }
  }, [navigate, groupId, successTransfer]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(transferOwnership(groupId, newOwnerId));
  };

  if (!isOwner) {
    return (
      <div className="space-y-6">
        <Alert variant="danger" className="mt-4">
          <h4>Access Denied</h4>
          <p>Only the group owner can transfer ownership of this group.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="mb-4">Transfer Group Ownership</h2>
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
              ?.filter((member) => member?.status === 'active' && member?.user?._id !== userInfo?.user?._id)
              .map((member) => (
                <option key={member?.user?._id} value={member?.user?._id}>
                  {member?.user?.name} ({member?.role})
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
    </div>
  );
};

export default GroupTransferOwnership;