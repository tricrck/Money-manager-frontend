import React, { useEffect, useState } from 'react';
import { 
  Card, Container, Button, Alert, Row, Col, ListGroup, 
  Badge, ProgressBar, Spinner, Tabs, Tab, Modal
} from 'react-bootstrap';
import { 
  FaArrowLeft, FaMoneyBillWave, FaMoneyBillAlt, FaHistory, 
  FaChartLine, FaInfoCircle, FaExchangeAlt, FaRegCreditCard,
  FaAngleRight, FaEllipsisV, FaRegBell, FaUserCircle, FaWallet
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletDetails } from '../../actions/walletActions';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WalletDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading, error, wallet = {} } = walletDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userId = params.userId || userInfo?.user?._id;
  
  // Quick action transaction amounts
  const quickAmounts = [100, 500, 1000, 5000];

  useEffect(() => {
    if (userInfo) {
      dispatch(getWalletDetails(userId));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userId, userInfo]);

  const handleQuickAction = (action, amount = 0) => {
    setActiveAction({ type: action, amount });
    setShowModal(true);
  };

  

  const confirmAction = () => {
    // Handle the transaction
    // In real implementation, call appropriate API endpoint
    if (activeAction.type === 'deposit') {
      console.log(`Depositing ${activeAction.amount}`);
      // dispatch(depositFunds(userId, activeAction.amount));
    } else if (activeAction.type === 'withdraw') {
      console.log(`Withdrawing ${activeAction.amount}`);
      // dispatch(withdrawFunds(userId, activeAction.amount));
    }
    setShowModal(false);
  };

  const transactions = wallet.transactions || [];

  
  // Calculate spending trend
  const getTrend = () => {
    if (transactions.length < 2) return { status: 'neutral', percentage: 0 };
    
    const withdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
    if (withdrawals.length < 2) return { status: 'neutral', percentage: 0 };
    
    const latestWithdrawal = withdrawals[0].amount;
    const previousWithdrawal = withdrawals[1].amount;
    
    const difference = latestWithdrawal - previousWithdrawal;
    const percentage = Math.round((difference / previousWithdrawal) * 100);
    
    return {
      status: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };
  
  const trend = getTrend();
  
  const renderTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaMoneyBillWave className="text-success" />;
      case 'withdrawal':
        return <FaMoneyBillAlt className="text-danger" />;
      default:
        return <FaExchangeAlt className="text-info" />;
    }
  };

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
     <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Link to="/" className="btn btn-light rounded-circle shadow-sm">
            <FaArrowLeft />
          </Link>
        </Col>
        <Col xs={8} sm={9} md={10} className="text-center text-md-start">
          <h2 className="mb-0 fw-bold">My Wallet</h2>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="light" className="rounded-circle shadow-sm">
            <FaRegBell />
          </Button>
          <Button variant="light" className="rounded-circle shadow-sm">
            <FaUserCircle />
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
        <Card.Body className="p-4">
          <Row>
            <Col xs={12} md={6}>
              <div className="mb-3 text-muted small">Total Balance</div>
              <h1 className="fw-bold mb-3">
                KES {(wallet.balance || 0).toLocaleString()}
              </h1>
              <div className="d-flex gap-2 align-items-center">
                {trend.status === 'up' && (
                  <Badge bg="danger" className="py-2 px-3 rounded-pill">
                    <FaChartLine className="me-1" /> {trend.percentage}% Higher Spending
                  </Badge>
                )}
                {trend.status === 'down' && (
                  <Badge bg="success" className="py-2 px-3 rounded-pill">
                    <FaChartLine className="me-1" /> {trend.percentage}% Lower Spending
                  </Badge>
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-md-end align-items-center mt-4 mt-md-0">
              <div className="d-flex flex-column flex-md-row gap-2">
                <Link to={`/wallet/${userId}/deposit`}>
                  <Button variant="primary" className="d-flex align-items-center px-4 py-2 fw-bold shadow-sm">
                    <FaMoneyBillWave className="me-2" /> Deposit
                  </Button>
                </Link>
                <Link to={`/wallet/${userId}/withdraw`}>
                  <Button variant="outline-primary" className="d-flex align-items-center px-4 py-2 fw-bold">
                    <FaMoneyBillAlt className="me-2" /> Withdraw
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-4">
      <Col xs={12} sm={12} md={6} lg={5} className="mb-4">
        <Card className="h-100 border-0 rounded-4 shadow-sm">
          <Card.Header className="bg-white border-0 pt-3 pt-sm-4 pb-0 px-3 px-sm-4">
            <h5 className="fw-bold fs-6 fs-sm-5">Quick Actions</h5>
          </Card.Header>
          <Card.Body className="px-2 px-sm-4">
            <Row className="g-2 g-sm-3">
              {quickAmounts.map((amount) => (
                <Col xs={12} sm={6} md={6} xl={6} key={amount}>
                  <Card
                    className="border-0 shadow-sm hover-lift"
                    onClick={() => handleQuickAction('deposit', amount)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="text-center p-2 py-sm-3">
                      <FaMoneyBillWave className="text-primary mb-1" size={16} />
                      <div className="fw-bold fs-6">KES {amount}</div>
                      <div className="small text-muted fs-7">Deposit</div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>

        <Col xs={12} lg={7}>
          <Card className="h-100 border-0 rounded-4 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold">Recent Transactions</h5>
              <Link to={`/wallet/${userId}/transactions`} className="text-decoration-none">
                View All <FaAngleRight size={12} className="ms-1" />
              </Link>
            </Card.Header>
            <Card.Body className="px-0">
              <ListGroup variant="flush">
                {transactions.slice(0, 5).map((transaction) => (
                  <ListGroup.Item key={transaction._id} className="px-4 py-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle p-2 me-3 ${
                          transaction.type === 'deposit' ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                        }`}>
                          {renderTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="fw-bold">
                            {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                          </div>
                          <div className="text-muted small">
                            {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className={transaction.type === 'deposit' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                        {transaction.type === 'deposit' ? '+' : '-'} KES {transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Transaction Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {activeAction?.type === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="display-5 fw-bold">KES {activeAction?.amount.toLocaleString()}</div>
            <p className="text-muted">
              {activeAction?.type === 'deposit' 
                ? 'Amount will be added to your wallet' 
                : 'Amount will be deducted from your wallet'}
            </p>
          </div>
          
          <Alert variant="info" className="d-flex align-items-center">
            <FaInfoCircle className="me-2" size={16} />
            <div>
              {activeAction?.type === 'deposit'
                ? 'Funds will be available immediately in your wallet'
                : 'Withdrawal processing may take 1-2 business days'}
            </div>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAction}>
            Confirm {activeAction?.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default WalletDetails;