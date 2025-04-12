import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form, ProgressBar, Spinner, Toast, ToastContainer, Badge } from 'react-bootstrap';
import { 
  FaMobileAlt, FaMoneyBillWave, FaArrowLeft, FaHistory, FaWallet,
  FaCheckCircle, FaExclamationTriangle, FaSync, FaLock, FaInfoCircle,
  FaChevronRight, FaUniversity, FaCreditCard, FaCoins
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { initiateMpesaPayment, resetPaymentState, queryMpesaTransaction } from '../../actions/paymentActions';
import { getWalletDetails } from '../../actions/walletActions';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import PaymentStatus from './PaymentStatus';

const MpesaPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialAmount = queryParams.get('amount') || '';

  // Form states
  const [amount, setAmount] = useState(initialAmount);
  const [paymentPurpose] = useState('wallet_deposit');
  const [description, setDescription] = useState('Wallet deposit via M-Pesa');
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [savedTransactions, setSavedTransactions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [step, setStep] = useState(1);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(!!initialAmount);

  const dispatch = useDispatch();

  // Redux state selectors
  const walletDetails = useSelector((state) => state.walletDetails);
  const { wallet, loading: walletLoading } = walletDetails;

  const mpesaPayment = useSelector((state) => state.mpesaPayment);
  const { loading, error, success, payment: paymentWithoutStatus } = mpesaPayment;
  
  const payment = paymentWithoutStatus ? {
    ...paymentWithoutStatus,
    status: paymentWithoutStatus.ResponseCode === "0" ? "success" : "failed"
  } : null;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [phoneNumber, setPhoneNumber] = useState(userInfo?.user?.phoneNumber || '');

  const userId = userInfo?.user?._id;

  // Check if user is logged in and fetch wallet details
  useEffect(() => {
    if (userInfo) {
      dispatch(getWalletDetails(userId));
      
      // Load saved transactions from localStorage
      const savedTxns = JSON.parse(localStorage.getItem(`mpesa_transactions_${userId}`) || '[]');
      setSavedTransactions(savedTxns);
    }
  }, [dispatch,  userId, userInfo]);

  // Validate phone number
  useEffect(() => {
    const kenyanPhoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    setIsValidPhoneNumber(kenyanPhoneRegex.test(phoneNumber));
  }, [phoneNumber]);

  // Validate amount
  useEffect(() => {
    const numValue = parseFloat(amount);
    setIsValidAmount(numValue > 0 && !isNaN(numValue));
  }, [amount]);

  // Handle successful payment initiation
  useEffect(() => {
    if (success && payment && payment.transactionId) {
      setShowPaymentStatus(true);
      
      // Save transaction to localStorage for persistence
      const transaction = {
        transactionId: payment.transactionId,
        amount: Number(amount),
        phoneNumber: phoneNumber,
        timestamp: new Date().toISOString(),
        status: payment.status || 'PENDING',
        type: 'payment'
      };
      
      const savedTxns = JSON.parse(localStorage.getItem(`mpesa_transactions_${userId}`) || '[]');
      const updatedTxns = [transaction, ...savedTxns.filter(t => t.transactionId !== transaction.transactionId)];
      localStorage.setItem(`mpesa_transactions_${userId}`, JSON.stringify(updatedTxns.slice(0, 10))); // Keep last 10 transactions
      setSavedTransactions(updatedTxns);
    }
  }, [success, payment, amount, phoneNumber, userId]);

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    
    if (!isValidPhoneNumber || !isValidAmount) {
      return;
    }
    
    setShowToast(true);

    // Format phone number to ensure it starts with 254
    const formattedPhone = phoneNumber.startsWith('254') 
      ? phoneNumber 
      : '254' + phoneNumber.replace(/^0/, '');
    
    const paymentData = {
      userId,
      phoneNumber: formattedPhone,
      amount: Number(amount),
      paymentPurpose,
      relatedItemId: wallet?._id,
      relatedItemModel: 'Wallet',
      metadata: { userId, description },
      description,
    };
    
    setTimeout(() => {
      dispatch(initiateMpesaPayment(paymentData));
    }, 1000);
  };

  // Check a saved transaction status
  const checkSavedTransaction = (transactionId) => {
    dispatch(queryMpesaTransaction(transactionId));
    setShowPaymentStatus(true);
  };

  // Clear current payment view and return to form
  const resetPaymentView = () => {
    setShowPaymentStatus(false);
    dispatch(resetPaymentState());
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(value);
  };

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center mb-4">
      <ProgressBar className="w-75">
        <ProgressBar 
          variant={step >= 1 ? "success" : "secondary"} 
          now={step >= 1 ? 50 : 0} 
          key={1} 
        />
        <ProgressBar 
          variant={step >= 2 ? "success" : "secondary"} 
          now={step >= 2 ? 50 : 0} 
          key={2} 
        />
      </ProgressBar>
    </div>
  );

  // Amount presets
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
        <Link to={`/deposit/${userId}`} className="btn btn-outline-secondary rounded-circle">
          <FaArrowLeft />
        </Link>
        <h2 className="mb-0">
          <FaMobileAlt className="me-2" /> M-Pesa Payment
        </h2>
        <div className="w-40px"></div> {/* For balanced layout */}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {!showPaymentStatus ? (
        <>
          {renderStepIndicator()}
          
          {/* Step 1: Payment Details */}
          <Card 
            className={`mb-4 shadow-sm border-0 ${step === 1 ? 'd-block' : 'd-none'}`}
            style={{ borderRadius: '1rem' }}
          >
            <Card.Body className="p-4">
              <Card.Title className="d-flex align-items-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '32px', height: '32px' }}>1</div>
                <span>Enter Payment Details</span>
              </Card.Title>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Amount (KES)</Form.Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">KES</span>
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
              
              <Form.Group controlId="phoneNumber" className="mb-4">
                <Form.Label className="fw-bold">M-Pesa Phone Number</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaMobileAlt /></span>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 0712345678 or 254712345678"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    isInvalid={phoneNumber !== '' && !isValidPhoneNumber}
                    className="form-control-lg"
                  />
                </div>
                <Form.Text className={phoneNumber !== '' && !isValidPhoneNumber ? "text-danger" : "text-muted"}>
                  Enter your M-Pesa registered phone number (e.g. 0712345678)
                </Form.Text>
              </Form.Group>
              
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
                  disabled={!isValidAmount || !isValidPhoneNumber}
                  onClick={() => setStep(2)}
                  className="py-3"
                  style={{ borderRadius: '0.8rem' }}
                >
                  Continue <FaChevronRight className="ms-2" />
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Step 2: Confirmation */}
          <Card 
            className={`mb-4 shadow-sm border-0 ${step === 2 ? 'd-block' : 'd-none'}`}
            style={{ borderRadius: '1rem' }}
          >
            <Card.Body className="p-4">
              <Card.Title className="d-flex align-items-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '32px', height: '32px' }}>2</div>
                <span>Confirm Payment</span>
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
                      <FaMobileAlt className="text-success" />
                      <span className="ms-2 fw-bold">M-Pesa</span>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={6}>
                    <div className="text-muted small">Phone Number</div>
                    <div className="fw-bold">{phoneNumber}</div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-muted small">Total</div>
                    <div className="fw-bold">{formatCurrency(parseFloat(amount) || 0)}</div>
                  </Col>
                </Row>
              </div>
              
              <div className="alert alert-info d-flex mb-4">
                <FaInfoCircle className="me-3 mt-1" />
                <div className="small">
                  You will receive an M-Pesa prompt on your phone. Enter your M-Pesa PIN to complete the transaction.
                </div>
              </div>
              
              <div className="alert alert-light d-flex mb-4">
                <FaLock className="me-3 mt-1" />
                <div className="small">
                  Your transaction is secure. We never store your M-Pesa PIN.
                </div>
              </div>
              
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setStep(1)}
                  className="px-4 order-2 order-md-1"
                >
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={submitHandler}
                  className="py-3 px-5 order-1 order-md-2"
                  style={{ borderRadius: '0.8rem' }}
                  disabled={loading || !isValidAmount || !isValidPhoneNumber}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" className="me-2" aria-hidden="true" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Payment <FaCheckCircle className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Row className="mb-4">
          <Col lg={8}>
            {payment && (
              <PaymentStatus
                id={payment.transactionId}
                status={payment.status || 'PENDING'}
                type="payment"
                navigateToWallet={true}
                userId={userId}
              />
            )}
            
            <Button 
              variant="outline-secondary" 
              className="mt-3"
              onClick={resetPaymentView}
            >
              Make Another Payment
            </Button>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-4">
                <div className="alert alert-success mb-4">
                  <div className="d-flex">
                    <FaCheckCircle className="me-3 mt-1" size={24} />
                    <div>
                      <h5 className="mb-1">M-Pesa Prompt Sent</h5>
                      <p className="mb-0">Check your phone for the payment prompt and enter your M-Pesa PIN to complete the transaction.</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <FaMobileAlt size={64} className="text-success mb-3" />
                  <h5>Please follow these steps:</h5>
                </div>
                
                <ol className="mb-4">
                  <li className="mb-2">Check your phone for M-Pesa prompt.</li>
                  <li className="mb-2">Enter your M-Pesa PIN to authorize payment.</li>
                  <li className="mb-2">Wait for confirmation message from M-Pesa.</li>
                  <li>Your wallet will be updated automatically once payment is confirmed.</li>
                </ol>
                
                <div className="alert alert-light d-flex mb-0">
                  <FaInfoCircle className="me-3 mt-1" />
                  <div className="small">
                    If you don't receive a prompt within 60 seconds, click "Check Status" or try again.
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Recent Transactions Section */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-3">
            <FaHistory className="me-2" /> Recent M-Pesa Transactions
          </Card.Title>
          
          {savedTransactions.length > 0 ? (
            <div className="recent-transactions">
              {savedTransactions.map(txn => (
                <div key={txn.transactionId} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <FaMobileAlt className="text-success" />
                    </div>
                    <div>
                      <div className="fw-bold">M-Pesa Payment</div>
                      <div className="text-muted small">{new Date(txn.timestamp).toLocaleDateString()}</div>
                      <div className="small text-truncate" style={{ maxWidth: '200px' }}>{txn.transactionId}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-success">+{formatCurrency(txn.amount)}</div>
                    <div className="small">
                      <Badge bg={txn.status === 'success' || txn.status === 'COMPLETED' ? 'success' : txn.status === 'PENDING' ? 'warning' : 'secondary'}>
                        {txn.status === 'PENDING' ? 'Pending' : txn.status === 'success' || txn.status === 'COMPLETED' ? 'Completed' : txn.status}
                      </Badge>
                      <Button 
                        variant="link" 
                        size="sm"
                        className="ms-2 p-0"
                        onClick={() => checkSavedTransaction(txn.transactionId)}
                      >
                        Check
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <FaHistory size={32} className="mb-3" />
              <p>No recent transactions found</p>
            </div>
          )}
          
          <div className="text-center mt-3">
            <Link to={'/wallet'} className="btn btn-light">
              <FaWallet className="me-2" /> Go to Wallet
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
              <span>Sending M-Pesa payment request...</span>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MpesaPayment;