import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form, ProgressBar, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletDetails } from '../../actions/walletActions';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaMobileAlt, FaCreditCard, FaCheckCircle, 
  FaUniversity, FaMoneyBillWave, FaLock, FaCoins, FaWallet,
  FaHistory, FaChevronRight, FaExclamationTriangle, FaInfoCircle
} from 'react-icons/fa';

const WithdrawForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId;
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [withdrawalFee, setWithdrawalFee] = useState(0);
  const [recentWithdrawals, setRecentWithdrawals] = useState([
    { id: 1, date: '2025-04-07', amount: 1500, method: 'mpesa', status: 'completed' },
    { id: 2, date: '2025-03-28', amount: 3000, method: 'stripe', status: 'completed' }
  ]); // Demo data - would be fetched from API

  const dispatch = useDispatch();

  const walletDetails = useSelector((state) => state.walletDetails);
  const { wallet, loading: walletLoading, error: walletError } = walletDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      dispatch(getWalletDetails(userInfo.user._id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    validateAmount(amount);
  }, [amount, wallet]);

  // Calculate withdrawal fee based on method (for demonstration)
  useEffect(() => {
    if (paymentMethod === 'mpesa') {
      setWithdrawalFee(parseFloat(amount) * 0.01); // 1% fee
    } else if (paymentMethod === 'stripe') {
      setWithdrawalFee(2.5); // $2.50 flat fee
    } else if (paymentMethod === 'bank') {
      setWithdrawalFee(3); // $3 flat fee
    } else {
      setWithdrawalFee(0);
    }
  }, [paymentMethod, amount]);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    const maxAmount = wallet?.balance || 0;
    
    setIsValidAmount(
      numValue > 0 && 
      !isNaN(numValue) && 
      numValue <= maxAmount
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    // Automatically move to next step after small delay for better UX
    setTimeout(() => setStep(3), 300);
  };

  const goToNextStep = () => {
    if (step === 1 && isValidAmount) {
      setStep(2);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const proceedToWithdrawal = () => {
    if (!isValidAmount || !paymentMethod) {
      return;
    }
    
    setShowToast(true);
    
    // Simulate loading and then redirect
    setTimeout(() => {
      if (paymentMethod === 'mpesa') {
        navigate(`/payment/mpesawithdraw?amount=${amount}`);
      } else if (paymentMethod === 'stripe') {
        navigate(`/payment/stripe/payout?amount=${amount}`);
      } else if (paymentMethod === 'bank') {
        navigate(`/payment/bank/withdraw?amount=${amount}`);
      }
    }, 1500);
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'mpesa': return <FaMobileAlt className="text-success" />;
      case 'stripe': return <FaCreditCard className="text-primary" />;
      case 'bank': return <FaUniversity className="text-info" />;
      default: return <FaMoneyBillWave />;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center mb-4">
      <ProgressBar className="w-75">
        <ProgressBar 
          variant={step >= 1 ? "success" : "secondary"} 
          now={step >= 1 ? 33.3 : 0} 
          key={1} 
        />
        <ProgressBar 
          variant={step >= 2 ? "success" : "secondary"} 
          now={step >= 2 ? 33.3 : 0} 
          key={2} 
        />
        <ProgressBar 
          variant={step >= 3 ? "success" : "secondary"} 
          now={step >= 3 ? 33.4 : 0} 
          key={3} 
        />
      </ProgressBar>
    </div>
  );

  const renderAmountPresets = () => {
    if (!wallet?.balance) return null;
    
    // Calculate preset values based on available balance
    const maxBalance = wallet.balance;
    const presets = [
      Math.round(maxBalance * 0.25),
      Math.round(maxBalance * 0.5),
      Math.round(maxBalance * 0.75),
      maxBalance
    ].filter(val => val > 0);
    
    return (
      <div className="d-flex flex-wrap gap-2 mb-3">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant={amount === preset.toString() ? "primary" : "outline-primary"}
            className="rounded-pill"
            onClick={() => setAmount(preset.toString())}
          >
            {preset === maxBalance ? 'Max' : formatCurrency(preset)}
          </Button>
        ))}
      </div>
    );
  };

  if (walletLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to={`/wallet/${userId}`} className="btn btn-outline-secondary rounded-circle">
          <FaArrowLeft />
        </Link>
        <h2 className="mb-0">Withdraw Funds</h2>
        <div className="w-40px"></div> {/* For balanced layout */}
      </div>

      {walletError && <Alert variant="danger">{walletError}</Alert>}
      
      {renderStepIndicator()}
      
      {/* Step 1: Amount Entry */}
      <Card 
        className={`mb-4 shadow-sm border-0 ${step === 1 ? 'd-block' : 'd-none'}`}
        style={{ borderRadius: '1rem' }}
      >
        <Card.Body className="p-4">
          <Card.Title className="d-flex align-items-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '32px', height: '32px' }}>1</div>
            <span>Enter Amount</span>
          </Card.Title>
          
          {wallet && (
            <div className="bg-light p-3 rounded d-flex align-items-center mb-4">
              <FaWallet className="text-primary me-3" size={24} />
              <div>
                <div className="text-muted small">Available Balance</div>
                <div className="fw-bold fs-4">{formatCurrency(wallet.balance || 0)}</div>
              </div>
            </div>
          )}
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">How much would you like to withdraw?</Form.Label>
            <div className="input-group mb-3">
              <span className="input-group-text">$</span>
              <Form.Control
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="form-control-lg text-end"
                style={{ fontSize: '1.5rem' }}
                isInvalid={amount !== '' && !isValidAmount}
              />
            </div>
            {amount !== '' && !isValidAmount && (
              <Form.Text className="text-danger">
                {parseFloat(amount) <= 0 ? 
                  'Please enter a valid amount greater than 0' : 
                  `Amount exceeds your available balance of ${formatCurrency(wallet?.balance || 0)}`
                }
              </Form.Text>
            )}
          </Form.Group>
          
          <div className="mb-4">
            <Form.Label className="fw-bold">Quick Select</Form.Label>
            {renderAmountPresets()}
          </div>
          
          <div className="d-grid">
            <Button 
              variant="primary" 
              size="lg"
              disabled={!isValidAmount}
              onClick={goToNextStep}
              className="py-3"
              style={{ borderRadius: '0.8rem' }}
            >
              Continue <FaChevronRight className="ms-2" />
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Step 2: Payment Method Selection */}
      <Card 
        className={`mb-4 shadow-sm border-0 ${step === 2 ? 'd-block' : 'd-none'}`}
        style={{ borderRadius: '1rem' }}
      >
        <Card.Body className="p-4">
          <Card.Title className="d-flex align-items-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '32px', height: '32px' }}>2</div>
            <span>Select Withdrawal Method</span>
          </Card.Title>

          <div className="mb-4">
            <div className="alert alert-info d-flex align-items-center">
              <FaCoins className="me-2" />
              <div>Withdrawing: <strong>{formatCurrency(parseFloat(amount) || 0)}</strong></div>
            </div>
          </div>
          
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Card 
                className={`h-100 border-0 shadow-sm ${paymentMethod === 'mpesa' ? 'border-primary bg-light' : ''}`}
                onClick={() => handlePaymentSelection('mpesa')}
                style={{ cursor: 'pointer', borderRadius: '0.8rem', transition: 'all 0.2s ease' }}
              >
                <Card.Body className="p-3 d-flex flex-column align-items-center text-center">
                  <div className={`rounded-circle d-flex justify-content-center align-items-center mb-3 ${paymentMethod === 'mpesa' ? 'bg-success' : 'bg-light'}`} 
                       style={{ width: '60px', height: '60px', transition: 'all 0.2s ease' }}>
                    <FaMobileAlt size={28} className={paymentMethod === 'mpesa' ? 'text-white' : 'text-success'} />
                  </div>
                  <h5>M-Pesa</h5>
                  <p className="text-muted small mb-0">Withdraw to mobile wallet</p>
                  {paymentMethod === 'mpesa' && (
                    <div className="mt-2">
                      <FaCheckCircle className="text-success" />
                    </div>
                  )}
                  <div className="mt-2 small text-danger">1% fee</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card 
                className={`h-100 border-0 shadow-sm ${paymentMethod === 'stripe' ? 'border-primary bg-light' : ''}`}
                onClick={() => handlePaymentSelection('stripe')}
                style={{ cursor: 'pointer', borderRadius: '0.8rem', transition: 'all 0.2s ease' }}
              >
                <Card.Body className="p-3 d-flex flex-column align-items-center text-center">
                  <div className={`rounded-circle d-flex justify-content-center align-items-center mb-3 ${paymentMethod === 'stripe' ? 'bg-primary' : 'bg-light'}`} 
                       style={{ width: '60px', height: '60px', transition: 'all 0.2s ease' }}>
                    <FaCreditCard size={28} className={paymentMethod === 'stripe' ? 'text-white' : 'text-primary'} />
                  </div>
                  <h5>Card/Debit Card</h5>
                  <p className="text-muted small mb-0">Withdraw to linked card</p>
                  {paymentMethod === 'stripe' && (
                    <div className="mt-2">
                      <FaCheckCircle className="text-success" />
                    </div>
                  )}
                  <div className="mt-2 small text-danger">$2.50 fee</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card 
                className={`h-100 border-0 shadow-sm ${paymentMethod === 'bank' ? 'border-primary bg-light' : ''}`}
                onClick={() => handlePaymentSelection('bank')}
                style={{ cursor: 'pointer', borderRadius: '0.8rem', transition: 'all 0.2s ease' }}
              >
                <Card.Body className="p-3 d-flex flex-column align-items-center text-center">
                  <div className={`rounded-circle d-flex justify-content-center align-items-center mb-3 ${paymentMethod === 'bank' ? 'bg-info' : 'bg-light'}`} 
                       style={{ width: '60px', height: '60px', transition: 'all 0.2s ease' }}>
                    <FaUniversity size={28} className={paymentMethod === 'bank' ? 'text-white' : 'text-info'} />
                  </div>
                  <h5>Cash Request</h5>
                  <p className="text-muted small mb-0">Group Treasure direct withdrawal</p>
                  {paymentMethod === 'bank' && (
                    <div className="mt-2">
                      <FaCheckCircle className="text-success" />
                    </div>
                  )}
                  <div className="mt-2 small text-danger">$3.00 fee</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="alert alert-warning mt-4 d-flex">
            <FaExclamationTriangle className="me-2 mt-1" />
            <div className="small">
              Withdrawal processing times may vary by location of your Treasurer. Bank transfers typically take 1-2 business days, card withdrawals 24-48 hours, and M-Pesa within minutes.
            </div>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={goToPreviousStep}
              className="px-4"
            >
              Back
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Step 3: Confirmation */}
      <Card 
        className={`mb-4 shadow-sm border-0 ${step === 3 ? 'd-block' : 'd-none'}`}
        style={{ borderRadius: '1rem' }}
      >
        <Card.Body className="p-4">
          <Card.Title className="d-flex align-items-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '32px', height: '32px' }}>3</div>
            <span>Confirm Withdrawal</span>
          </Card.Title>
          
          <div className="bg-light p-4 rounded mb-4">
            <Row className="mb-3">
              <Col xs={6}>
                <div className="text-muted small">Withdrawal Amount</div>
                <div className="fw-bold fs-4">{formatCurrency(parseFloat(amount) || 0)}</div>
              </Col>
              <Col xs={6}>
                <div className="text-muted small">Withdrawal Method</div>
                <div className="d-flex align-items-center">
                  {getPaymentMethodIcon(paymentMethod)}
                  <span className="ms-2 fw-bold">
                    {paymentMethod === 'mpesa' && 'M-Pesa'}
                    {paymentMethod === 'stripe' && 'Card'}
                    {paymentMethod === 'bank' && 'Bank Account'}
                  </span>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col xs={6}>
                <div className="text-muted small">Withdrawal Fee</div>
                <div className="fw-bold text-danger">-{formatCurrency(withdrawalFee || 0)}</div>
              </Col>
              <Col xs={6}>
                <div className="text-muted small">You'll Receive</div>
                <div className="fw-bold text-success">{formatCurrency((parseFloat(amount) || 0) - withdrawalFee)}</div>
              </Col>
            </Row>
          </div>
          
          <div className="alert alert-info d-flex mb-4">
            <FaInfoCircle className="me-3 mt-1" />
            <div className="small">
              Please ensure your withdrawal details are correct. After confirming, you'll need to verify this transaction through the selected payment method.
            </div>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <Button 
              variant="outline-secondary" 
              onClick={goToPreviousStep}
              className="px-4 order-2 order-md-1"
            >
              Back
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={proceedToWithdrawal}
              className="py-3 px-5 order-1 order-md-2"
              style={{ borderRadius: '0.8rem' }}
              disabled={!isValidAmount || !paymentMethod}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Recent Transactions Section */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-3">Recent Withdrawals</Card.Title>
          
          {recentWithdrawals.length > 0 ? (
            <div className="recent-transactions">
              {recentWithdrawals.map(withdrawal => (
                <div key={withdrawal.id} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle p-2 me-3">
                      {getPaymentMethodIcon(withdrawal.method)}
                    </div>
                    <div>
                      <div className="fw-bold">
                        {withdrawal.method === 'mpesa' && 'M-Pesa Withdrawal'}
                        {withdrawal.method === 'stripe' && 'Card Withdrawal'}
                        {withdrawal.method === 'bank' && 'Bank Withdrawal'}
                      </div>
                      <div className="text-muted small">{new Date(withdrawal.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-danger">-{formatCurrency(withdrawal.amount)}</div>
                    <div className="small">
                      <span className="badge bg-success">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <FaHistory size={32} className="mb-3" />
              <p>No recent withdrawals found</p>
            </div>
          )}
          
          <div className="text-center mt-3">
            <Link to={`/transactions/${userId}`} className="btn btn-light">
              View All Transactions
            </Link>
          </div>
        </Card.Body>
      </Card>
      
      {/* Toast notification */}
      <ToastContainer position="bottom-center" className="mb-4">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Processing Withdrawal</strong>
          </Toast.Header>
          <Toast.Body>
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Preparing your withdrawal...</span>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default WithdrawForm;