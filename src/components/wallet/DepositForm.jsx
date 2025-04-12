import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form, ProgressBar, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletDetails } from '../../actions/walletActions';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaMobileAlt, FaCreditCard, FaCheckCircle, 
  FaUniversity, FaMoneyBillWave, FaLock, FaCoins, FaWallet,
  FaHistory, FaChevronRight
} from 'react-icons/fa';

const DepositForm = () => {
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const walletDetails = useSelector((state) => state.walletDetails);
  const { wallet, loading: walletLoading, error: walletError } = walletDetails;

  const recentDeposits = wallet.transactions
    .filter(tx => 
      tx.type === "deposit" &&
      (paymentMethod === '' || tx.paymentMethod === paymentMethod)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userId = userInfo?.user?._id;

  useEffect(() => {
    if (userInfo) {
      dispatch(getWalletDetails(userId));
    }
  }, [dispatch,  userId, userInfo]);

  useEffect(() => {
    validateAmount(amount);
  }, [amount]);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    setIsValidAmount(numValue > 0 && !isNaN(numValue));
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

  const proceedToPayment = () => {
    if (!isValidAmount || !paymentMethod) {
      return;
    }
    
    setShowToast(true);
    
    // Simulate loading and then redirect
    setTimeout(() => {
      if (paymentMethod === 'M-Pesa') {
        navigate(`/payment/mpesa/${userId}?amount=${amount}`);
      } else if (paymentMethod === 'Stripe') {
        navigate(`/payment/stripe/${userId}?amount=${amount}`);
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
    const presets = [500, 1000, 2500, 5000];
    return (
      <div className="d-flex flex-wrap gap-2 mb-3">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant={amount === preset.toString() ? "primary" : "outline-primary"}
            className="rounded-pill"
            onClick={() => setAmount(preset.toString())}
          >
            {formatCurrency(preset)}
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
        <Link to={`/wallet/${userId}`} className="btn btn-outline-secondary rounded-circle" onClick={() => setPaymentMethod('')}>
          <FaArrowLeft />
        </Link>
        <h2 className="mb-0">Deposit Funds</h2>
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
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">How much would you like to deposit?</Form.Label>
            <div className="input-group mb-3">
              <span className="input-group-text">Ksh</span>
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
                Please enter a valid amount greater than 0
              </Form.Text>
            )}
          </Form.Group>
          
          <div className="mb-4">
            <Form.Label className="fw-bold">Quick Select</Form.Label>
            {renderAmountPresets()}
          </div>
          
          {wallet && (
            <div className="bg-light p-3 rounded d-flex align-items-center mb-4">
              <FaWallet className="text-primary me-3" size={24} />
              <div>
                <div className="text-muted small">Current Balance</div>
                <div className="fw-bold">{formatCurrency(wallet.balance || 0)}</div>
              </div>
            </div>
          )}
          
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
            <span>Select Payment Method</span>
          </Card.Title>

          <div className="mb-4">
            <div className="alert alert-info d-flex align-items-center">
              <FaCoins className="me-2" />
              <div>Depositing: <strong>{formatCurrency(parseFloat(amount) || 0)}</strong></div>
            </div>
          </div>
          
          <Row className="g-2">
            <Col xs={6} md={6}>
              <Card 
                className={`h-100 border-0 shadow-sm ${paymentMethod === 'mpesa' ? 'border-primary bg-light' : ''}`}
                onClick={() => handlePaymentSelection('M-Pesa')}
                style={{ cursor: 'pointer', borderRadius: '0.8rem', transition: 'all 0.2s ease' }}
              >
                <Card.Body className="p-2 d-flex flex-column align-items-center text-center">
                  <div className={`rounded-circle d-flex justify-content-center align-items-center mb-3 ${paymentMethod === 'mpesa' ? 'bg-success' : 'bg-light'}`} 
                       style={{ width: '60px', height: '60px', transition: 'all 0.2s ease' }}>
                    <FaMobileAlt size={28} className={paymentMethod === 'mpesa' ? 'text-white' : 'text-success'} />
                  </div>
                  <h5>M-Pesa</h5>
                  <p className="text-muted small mb-0">Pay using mobile money</p>
                  {paymentMethod === 'mpesa' && (
                    <div className="mt-2">
                      <FaCheckCircle className="text-success" />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={6}>
              <Card 
                className={`h-100 border-0 shadow-sm ${paymentMethod === 'stripe' ? 'border-primary bg-light' : ''}`}
                onClick={() => handlePaymentSelection('Stripe')}
                style={{ cursor: 'pointer', borderRadius: '0.8rem', transition: 'all 0.2s ease' }}
              >
                <Card.Body className="p-2 d-flex flex-column align-items-center text-center">
                  <div className={`rounded-circle d-flex justify-content-center align-items-center mb-3 ${paymentMethod === 'stripe' ? 'bg-primary' : 'bg-light'}`} 
                       style={{ width: '60px', height: '60px', transition: 'all 0.2s ease' }}>
                    <FaCreditCard size={28} className={paymentMethod === 'stripe' ? 'text-white' : 'text-primary'} />
                  </div>
                  <h5>Card Payment</h5>
                  <p className="text-muted small mb-0">Pay with credit/debit card</p>
                  {paymentMethod === 'stripe' && (
                    <div className="mt-2">
                      <FaCheckCircle className="text-success" />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
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
            <span>Confirm Deposit</span>
          </Card.Title>
          
          <div className="bg-light p-4 rounded mb-4">
            <Row className="mb-3">
              <Col xs={6}>
                <div className="text-muted small">Amount</div>
                <div className="fw-bold fs-4">{formatCurrency(parseFloat(amount) || 0)}</div>
              </Col>
              <Col xs={6}>
                <div className="text-muted small">Payment Method</div>
                <div className="d-flex align-items-center">
                  {getPaymentMethodIcon(paymentMethod)}
                  <span className="ms-2 fw-bold">
                    {paymentMethod === 'mpesa' && 'M-Pesa'}
                    {paymentMethod === 'stripe' && 'Card Payment'}
                    {paymentMethod === 'bank' && 'Bank Transfer'}
                  </span>
                </div>
              </Col>
            </Row>
            
            {/* Transaction fee info - just for demo */}
            <Row>
              <Col xs={6}>
                <div className="text-muted small">Transaction Fee</div>
                <div className="fw-bold">$0.00</div>
              </Col>
              <Col xs={6}>
                <div className="text-muted small">Total</div>
                <div className="fw-bold">{formatCurrency(parseFloat(amount) || 0)}</div>
              </Col>
            </Row>
          </div>
          
          <div className="alert alert-info d-flex mb-4">
            <FaLock className="me-3 mt-1" />
            <div className="small">
              Your transaction is secure. Your payment information is encrypted and processed through our secure payment gateway.
            </div>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <Button 
              variant="outline-secondary" 
              onClick={() => {
                setPaymentMethod('');
                goToPreviousStep();
              }}
              className="px-4"
            >
              Back
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={proceedToPayment}
              className="py-3 px-5 order-1 order-md-2"
              style={{ borderRadius: '0.8rem' }}
              disabled={!isValidAmount || !paymentMethod}
            >
              Complete Deposit
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Recent Transactions Section */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-3">Recent Deposits</Card.Title>
          
          {recentDeposits.length > 0 ? (
            <div className="recent-transactions">
              {recentDeposits.map(deposit => (
                <div key={deposit.id} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle p-2 me-3">
                      {getPaymentMethodIcon(deposit.method)}
                    </div>
                    <div>
                      <div className="fw-bold">
                        {deposit.paymentMethod === 'M-Pesa' && 'M-Pesa Payment'}
                        {deposit.paymentMethod === 'Stripe' && 'Card Payment'}
                      </div>
                      <div className="text-muted small">{new Date(deposit.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-success">+{formatCurrency(deposit.amount)}</div>
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
              <p>No recent deposits found</p>
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
            <strong className="me-auto">Processing Payment</strong>
          </Toast.Header>
          <Toast.Body>
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Redirecting to payment gateway...</span>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default DepositForm;