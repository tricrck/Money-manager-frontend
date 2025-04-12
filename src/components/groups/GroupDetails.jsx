import React, { useEffect } from 'react';
import { Card, Container, Button, Alert, Badge, ListGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaUsers, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupDetails } from '../../actions/groupActions';
import { useParams } from 'react-router-dom';

const GroupDetails = ({ match, history }) => {
  const { id } = useParams();
  const groupId = id;


  const dispatch = useDispatch();

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading, error, group } = groupDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(getGroupDetails(groupId));
    } else {
      history.push('/login');
    }
  }, [dispatch, history, groupId, userInfo]);

  const getGroupTypeBadge = (type) => {
    switch (type) {
      case 'chama':
        return <Badge bg="primary">Chama</Badge>;
      case 'investment':
        return <Badge bg="success">Investment</Badge>;
      case 'savings':
        return <Badge bg="info">Savings</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  const isOwner = group?.owner?._id === userInfo?.user?._id;

  return (
    <Container className="py-5">
      <Link to="/groups" className="btn btn-light my-3">
        <FaArrowLeft /> Go Back
      </Link>
      <h2 className="mb-4">Group Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Card>
            <Card.Body>
              <Card.Title>
                {group.name} {getGroupTypeBadge(group.groupType)}
              </Card.Title>
              <Card.Text>{group.description}</Card.Text>
              <Card.Text>
                <strong>Owner:</strong> {group.owner?.name}
              </Card.Text>
            </Card.Body>
          </Card>

          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Header>Contribution Schedule</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Frequency:</strong> {group.settings?.contributionSchedule?.frequency}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Amount:</strong> ${group.settings?.contributionSchedule?.amount?.toLocaleString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Due Day:</strong> {group.settings?.contributionSchedule?.dueDay}
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <Card className="mt-4">
                <Card.Header>Loan Settings</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Max Loan Multiplier:</strong> {group.settings?.loanSettings?.maxLoanMultiplier}x
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Interest Rate:</strong> {group.settings?.loanSettings?.interestRate}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Max Repayment Period:</strong> {group.settings?.loanSettings?.maxRepaymentPeriod} months
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Late Payment Fee:</strong> {group.settings?.loanSettings?.latePaymentFee}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Processing Fee:</strong> {group.settings?.loanSettings?.processingFee}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Requires Guarantors:</strong> {group.settings?.loanSettings?.requiresGuarantors ? 'Yes' : 'No'}
                  </ListGroup.Item>
                  {group.settings?.loanSettings?.requiresGuarantors && (
                    <ListGroup.Item>
                      <strong>Guarantors Required:</strong> {group.settings?.loanSettings?.guarantorsRequired}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>Meeting Schedule</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Frequency:</strong> {group.settings?.meetingSchedule?.frequency}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Day of Month:</strong> {group.settings?.meetingSchedule?.dayOfMonth}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Time:</strong> {group.settings?.meetingSchedule?.time}
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <Card className="mt-4">
                <Card.Header>Accounts</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Loan Account:</strong> ${group.accounts?.loanAccount?.balance?.toLocaleString() || '0'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Savings Account:</strong> ${group.accounts?.savingsAccount?.balance?.toLocaleString() || '0'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Interest Earned:</strong> ${group.accounts?.interestEarnedAccount?.balance?.toLocaleString() || '0'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Fines Account:</strong> ${group.accounts?.finesAccount?.balance?.toLocaleString() || '0'}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <div className="mt-4 d-flex justify-content-between">
            <div>
              <Link to={`/groups/${group._id}/edit`} className="btn btn-primary me-2">
                <FaEdit /> Edit Group
              </Link>
              <Link to={`/groups/${group._id}/members`} className="btn btn-info me-2">
                <FaUsers /> Manage Members
              </Link>
            </div>
            <div>
              {isOwner && (
                <Link to={`/groups/${group._id}/transfer-ownership`} className="btn btn-warning me-2">
                  <FaExchangeAlt /> Transfer Ownership
                </Link>
              )}
              <Link to={`/groups/${group._id}/accounts`} className="btn btn-success">
                <FaMoneyBillWave /> Update Accounts
              </Link>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default GroupDetails;