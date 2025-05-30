import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  ListGroup,
  Badge,
  Spinner,
  ProgressBar,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  FaArrowLeft,
  FaEdit,
  FaUsers,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaPiggyBank,
  FaCoins,
  FaCalendarAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupDetails } from '../../actions/groupActions';

const formatCurrency = (value, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
};

const statusVariant = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'secondary';
    case 'suspended': return 'danger';
    default: return 'primary';
  }
};

const GroupDetails = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, group } = useSelector(state => state.groupDetails);
  const { userInfo } = useSelector(state => state.userLogin);
  const [key, setKey] = useState('overview');

  useEffect(() => {
    if (!userInfo) navigate('/login');
    else dispatch(getGroupDetails(groupId));
  }, [dispatch, groupId, userInfo, navigate]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Container className="py-5"><h4 className="text-danger">{error}</h4></Container>;
  }

  const { settings, loanAccount, savingsAccount, interestEarnedAccount, finesAccount, members } = group;
  const isOwner = group.createdBy?._id === userInfo?.user?._id;

  return (
    <Container className="py-4">
      <Button variant="light" as={Link} to="/groups" className="mb-3">
        <FaArrowLeft className="me-2" /> Back to Groups
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="mb-2">
                {group.name}{' '}
                <Badge bg="info" pill>
                {group?.groupName?.toUpperCase() || 'Loading...'}
                </Badge>
              </h2>
              <p className="text-muted">{group.description}</p>
              <p>
                <FaUserCircle className="me-2 text-primary" /> Owner: {group.createdBy?.name}
              </p>
            </Col>
            <Col md={4} className="text-end">
              <Link to={`/groups/${group._id}/edit`}>
                <Button variant="outline-primary" className="me-2">
                  <FaEdit /> Edit
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mt-4">
        <Tab eventKey="overview" title={<><FaCoins className="me-1"/>Overview</>}>
          <Row className="mt-3 g-3">
          {[
              { icon: <FaPiggyBank />, label: 'Savings Balance', value: savingsAccount?.balance },
              { icon: <FaCoins />, label: 'Loan Balance', value: loanAccount?.balance },
              { icon: <FaMoneyBillWave />, label: 'Interest Earned', value: interestEarnedAccount?.balance },
              { icon: <FaExchangeAlt />, label: 'Fines Balance', value: finesAccount?.balance },
            ].map((acc, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div className="display-6 text-primary me-3">{acc.icon}</div>
                      <div>
                        <h5 className="mb-1">{acc.label}</h5>
                        <h4 className="fw-bold">{formatCurrency(acc.value)}</h4>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <h5 className="mt-4">Group Activity</h5>
          <ProgressBar 
                now={
                  ((savingsAccount?.balance ?? 0) / 
                  ((loanAccount?.balance ?? 0) + (savingsAccount?.balance ?? 0) + 1)) * 100
                } 
                label="Savings Share" 
                animated 
              />
          </Tab>

        <Tab eventKey="settings" title={<><FaCalendarAlt className="me-1"/>Settings</>}>
          <Row className="mt-3">
            <Col md={6}>
            {settings?.contributionSchedule && (
              <Card className="shadow-sm mb-3">
                <Card.Header><strong>Contribution Schedule</strong></Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Frequency: {settings.contributionSchedule.frequency}</ListGroup.Item>
                  <ListGroup.Item>Amount: {formatCurrency(settings.contributionSchedule.amount)}</ListGroup.Item>
                  <ListGroup.Item>Due Day: {settings.contributionSchedule.dueDay}</ListGroup.Item>
                </ListGroup>
              </Card>
            )}

              <Card className="shadow-sm mb-3">
                <Card.Header><strong>Loan Settings</strong></Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Max Multiplier: {settings?.loanSettings?.maxLoanMultiplier ?? 'N/A'}x
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Interest Rate: {settings?.loanSettings?.interestRate ?? 'N/A'}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Repayment Period: {settings?.loanSettings?.maxRepaymentPeriod ?? 'N/A'} mo.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Late Fee: {settings?.loanSettings?.latePaymentFee ?? 'N/A'}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Processing Fee: {settings?.loanSettings?.processingFee ?? 'N/A'}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Requires Guarantors: {' '}
                    <Badge bg={settings?.loanSettings?.requiresGuarantors ? 'success' : 'secondary'}>
                      {settings?.loanSettings?.requiresGuarantors ? 'Yes' : 'No'}
                    </Badge>
                  </ListGroup.Item>
                  {settings?.loanSettings?.requiresGuarantors && (
                    <ListGroup.Item>
                      Guarantors Required: {settings?.loanSettings?.guarantorsRequired ?? 'N/A'}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>

            </Col>

            <Col md={6}>
            {settings?.meetingSchedule && (
              <Card className="shadow-sm mb-3">
                <Card.Header><strong>Meeting Schedule</strong></Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Frequency: {settings.meetingSchedule.frequency}</ListGroup.Item>
                  <ListGroup.Item>Day: {settings.meetingSchedule.dayOfMonth}</ListGroup.Item>
                  <ListGroup.Item>Time: {settings.meetingSchedule.time}</ListGroup.Item>
                </ListGroup>
              </Card>
            )}

            </Col>
          </Row>
        </Tab>

        <Tab eventKey="members" title={<><FaUsers className="me-1"/>Members</>}>
        <ListGroup variant="flush" className="mt-3">
            {members?.map((m) => (
              <ListGroup.Item key={m._id} className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FaUserCircle size={30} className="me-3 text-secondary" />
                  <div>
                    <div className="fw-bold">{m?.user?.name ?? 'Unknown User'}</div>
                    <small className="text-muted">
                      Joined: {m?.joinedDate ? new Date(m.joinedDate).toLocaleDateString() : 'N/A'}
                    </small>
                  </div>
                </div>
                <Badge bg={statusVariant(m?.status ?? '')}>{m?.role ?? 'Member'}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>

        </Tab>

        <Tab eventKey="actions" title="Actions">
          <div className="mt-3 d-flex flex-wrap gap-2">
            <Button as={Link} to={`/groups/${group._id}/members`} variant="outline-info">
              <FaUsers className="me-1"/> Manage Members
            </Button>
            {isOwner && (
              <Button as={Link} to={`/groups/${group._id}/transfer-ownership`} variant="outline-warning">
                <FaExchangeAlt className="me-1"/> Transfer Ownership
              </Button>
            )}
            <Button as={Link} to={`/groups/${group._id}/accounts`} variant="outline-success">
              <FaMoneyBillWave className="me-1"/> Update Accounts
            </Button>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default GroupDetails;