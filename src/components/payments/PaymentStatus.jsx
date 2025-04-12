import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, Badge, Button, Spinner, ProgressBar, 
  Row, Col, Container, Accordion, Modal
} from 'react-bootstrap';
import { 
  FaSync, FaCheckCircle, FaTimesCircle, FaHourglassHalf, 
  FaExclamationTriangle, FaMobileAlt, FaMoneyBillWave, 
  FaClock, FaHistory, FaBell, FaBellSlash, FaQuestionCircle,
  FaShieldAlt, FaReceipt, FaUserClock, FaIdCard
} from 'react-icons/fa';
import { queryMpesaTransaction, checkMpesaWithdrawalStatus } from '../../actions/paymentActions';

const PaymentStatus = ({ id, status, type = 'payment', userId }) => {
  // Use refs for values that shouldn't trigger re-renders
  const initialCheckDone = useRef(false);
  
  // State variables
  const [lastChecked, setLastChecked] = useState(new Date());
  const [isExpired, setIsExpired] = useState(false);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  
  const dispatch = useDispatch();
  
  // Memoize selectors to prevent re-renders
  const mpesaQuery = useSelector((state) => state.mpesaQuery);
  const mpesaWithdrawalStatus = useSelector((state) => state.mpesaWithdrawalStatus);
  
  // Choose the correct state based on transaction type
  const transactionState = type === 'payment' ? mpesaQuery : mpesaWithdrawalStatus;
  const { loading, error, transaction } = transactionState || {};
  
  // Combine props status with redux state
  const currentStatus = transaction?.status || status;
  const resultDesc = transaction?.resultDesc || '';
  const amount = transaction?.amount || 0;
  const phoneNumber = transaction?.phoneNumber;
  const transactionDate = transaction?.created || new Date().toISOString();

  // Memoize status check function to prevent recreation on every render
  const checkStatus = useCallback(() => {
    if (id) {
      if (type === 'payment') {
        dispatch(queryMpesaTransaction(id));
      } else {
        dispatch(checkMpesaWithdrawalStatus(id));
      }
      setLastChecked(new Date());
      setAnimateRefresh(true);
      setTimeout(() => setAnimateRefresh(false), 1000);
    }
  }, [dispatch, id, type]);

  // Determine if transaction is in a terminal state
  const isTerminalState = useCallback(() => {
    return ['success', 'completed', 'failed', 'cancelled'].some(
      s => currentStatus?.toLowerCase().includes(s)
    );
  }, [currentStatus]);

  // Set up countdown timer for expiry - with proper dependency array
  useEffect(() => {
    if (!autoCheckEnabled || isExpired) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsExpired(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoCheckEnabled, isExpired]); // Only these dependencies are needed

  // Initial status check - using ref to prevent multiple calls
  useEffect(() => {
    if (!id || initialCheckDone.current) return;
    
    checkStatus();
    initialCheckDone.current = true;
  }, [id, checkStatus]);
  
  // Set up polling for auto-check with proper dependency checks
  useEffect(() => {
    // Don't set up polling if conditions aren't met
    if (!id || !autoCheckEnabled || isExpired || isTerminalState()) {
      return;
    }
    
    const intervalId = setInterval(checkStatus, 10000);
    
    return () => clearInterval(intervalId);
  }, [id, checkStatus, autoCheckEnabled, isExpired, isTerminalState]);
  
  // Format remaining time for display - memoized to prevent recalculation
  const formatTimeRemaining = useCallback(() => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [remainingTime]);
  
  // Get status badge variant and icon - memoized
  const getStatusDisplay = useCallback(() => {
    switch (currentStatus?.toLowerCase()) {
      case 'completed':
      case 'success':
        return { 
          variant: 'success', 
          icon: <FaCheckCircle />, 
          text: 'Successful',
          bgClass: 'bg-success bg-opacity-10 border-success',
          progressVariant: 'success'
        };
      case 'failed':
      case 'cancelled':
        return { 
          variant: 'danger', 
          icon: <FaTimesCircle />, 
          text: currentStatus?.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Failed',
          bgClass: 'bg-danger bg-opacity-10 border-danger',
          progressVariant: 'danger'
        };
      case 'pending':
        return { 
          variant: 'warning', 
          icon: <FaHourglassHalf />, 
          text: 'Pending',
          bgClass: 'bg-warning bg-opacity-10 border-warning',
          progressVariant: 'warning'
        };
      case 'processing':
        return { 
          variant: 'info', 
          icon: <FaSync />, 
          text: 'Processing',
          bgClass: 'bg-info bg-opacity-10 border-info',
          progressVariant: 'info'
        };
      default:
        return { 
          variant: 'secondary', 
          icon: <FaExclamationTriangle />, 
          text: 'Unknown',
          bgClass: 'bg-secondary bg-opacity-10 border-secondary',
          progressVariant: 'secondary'
        };
    }
  }, [currentStatus]);
  
  // Calculate once per render instead of in every place used
  const statusDisplay = getStatusDisplay();
  const progressPercentage = 100 - (remainingTime / (24 * 60 * 60) * 100);
  
  // Memoize date formatting
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  }, []);

  return (
    <Container className="px-0">
      <Card className="shadow border-0 mb-4">
        {/* Top status bar - Changes color based on status */}
        <div className={`card-status-strip ${statusDisplay.bgClass}`} style={{ height: '8px' }}></div>

        <Card.Body className="pb-0">
          {/* Transaction type and status header */}
          <Row className="mb-4 align-items-center">
            <Col xs={7}>
              <h4 className="fw-bold mb-0">
                {type === 'payment' ? 'M-Pesa Payment' : 'M-Pesa Withdrawal'}
              </h4>
              <p className="text-muted small mb-0">Ref: {id}</p>
            </Col>
            <Col xs={5} className="text-end">
              <Badge 
                bg={statusDisplay.variant} 
                className="fs-6 p-2 d-inline-flex align-items-center gap-1"
              >
                {statusDisplay.icon} <span>{statusDisplay.text}</span>
              </Badge>
            </Col>
          </Row>

          {/* Main transaction details */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">
                    <FaReceipt className="me-2 text-primary" /> Transaction Details
                  </h5>
                  <div className="transaction-detail">
                    <Row className="mb-3">
                      <Col xs={2} className="text-center">
                        <span className="icon-circle bg-light">
                          <FaIdCard className="text-primary" />
                        </span>
                      </Col>
                      <Col>
                        <div className="small text-muted">Transaction ID</div>
                        <div className="fw-bold">{id}</div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={2} className="text-center">
                        <span className="icon-circle bg-light">
                          <FaMoneyBillWave className="text-success" />
                        </span>
                      </Col>
                      <Col>
                        <div className="small text-muted">Amount</div>
                        <div className="fw-bold">KES {amount.toLocaleString()}</div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={2} className="text-center">
                        <span className="icon-circle bg-light">
                          <FaMobileAlt className="text-info" />
                        </span>
                      </Col>
                      <Col>
                        <div className="small text-muted">Phone Number</div>
                        <div className="fw-bold">{phoneNumber || 'N/A'}</div>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={2} className="text-center">
                        <span className="icon-circle bg-light">
                          <FaClock className="text-warning" />
                        </span>
                      </Col>
                      <Col>
                        <div className="small text-muted">Date</div>
                        <div className="fw-bold">{formatDate(transactionDate)}</div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">
                    <FaShieldAlt className="me-2 text-primary" /> Status Monitoring
                  </h5>

                  {/* Last checked time */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="small text-muted">Last Checked</div>
                      <div>{lastChecked.toLocaleString()}</div>
                    </div>
                    <Button 
                      variant="light" 
                      className={`rounded-circle p-2 ${animateRefresh ? 'rotate-animation' : ''}`}
                      onClick={checkStatus} 
                      disabled={loading}
                      title="Refresh status"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaSync />
                      )}
                    </Button>
                  </div>

                  {/* Auto check toggle */}
                  {!isTerminalState() && !isExpired && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          {autoCheckEnabled ? 
                            <FaBell className="text-primary me-2" /> : 
                            <FaBellSlash className="text-muted me-2" />
                          }
                          <span>Auto-check Status</span>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={autoCheckEnabled}
                            onChange={() => setAutoCheckEnabled(!autoCheckEnabled)}
                            id="autoCheckSwitch"
                          />
                        </div>
                      </div>
                      <div className="small text-muted mb-2">
                        {autoCheckEnabled ? 
                          "System will automatically check for updates every 10 seconds." : 
                          "Automatic status checking is disabled."
                        }
                      </div>
                    </div>
                  )}

                  {/* Expiry countdown timer */}
                  {!isTerminalState() && !isExpired && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FaUserClock className="text-warning me-2" />
                          <span>Time Remaining</span>
                        </div>
                        <div className="countdown-timer fw-bold text-warning">
                          {formatTimeRemaining()}
                        </div>
                      </div>
                      <ProgressBar 
                        now={progressPercentage} 
                        variant={statusDisplay.progressVariant}
                        className="mb-2"
                        style={{ height: '8px' }}
                      />
                      <div className="small text-muted">
                        Auto-check expires in {formatTimeRemaining()}
                      </div>
                    </div>
                  )}

                  {/* Expired notice */}
                  {isExpired && (
                    <div className="alert alert-warning d-flex align-items-center">
                      <FaExclamationTriangle className="me-2" /> 
                      <div>
                        <strong>Auto-checking expired</strong>
                        <div>Please check manually or contact support</div>
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center">
                      <FaExclamationTriangle className="me-2" /> 
                      <div>
                        <strong>Error checking status</strong>
                        <div>{error}</div>
                      </div>
                    </div>
                  )}

                  {/* Success, completed, or failed message */}
                  {isTerminalState() && (
                    <div className={`alert alert-${statusDisplay.variant} d-flex align-items-center`}>
                      {statusDisplay.icon} 
                      <div className="ms-2">
                        <strong>{statusDisplay.text}</strong>
                        <div>{resultDesc || `Transaction ${statusDisplay.text.toLowerCase()}`}</div>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action buttons */}
          <Row className="mb-3">
            <Col xs={12}>
              <div className="d-flex justify-content-between">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={checkStatus} 
                  disabled={loading}
                  className="d-flex align-items-center"
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> 
                      Checking Status...
                    </>
                  ) : (
                    <>
                      <FaSync className="me-2" /> Refresh Status
                    </>
                  )}
                </Button>
                
                <div>
                  <Button 
                    variant="outline-secondary" 
                    className="ms-2"
                    onClick={() => setShowInfoModal(true)}
                  >
                    <FaQuestionCircle className="me-2" /> Help
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Additional information accordion */}
          <Accordion className="mb-4">
            <Accordion.Item eventKey="0" className="border-0 shadow-sm">
              <Accordion.Header>
                <FaHistory className="me-2" /> Transaction History & Details
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={12}>
                    <h6 className="fw-bold">Transaction Timeline</h6>
                    <div className="transaction-timeline">
                      <div className="timeline-item">
                        <div className="timeline-marker bg-success"></div>
                        <div className="timeline-content">
                          <div className="fw-bold">Transaction Initiated</div>
                          <div className="small text-muted">{formatDate(transactionDate)}</div>
                        </div>
                      </div>
                      
                      <div className="timeline-item">
                        <div className="timeline-marker bg-primary"></div>
                        <div className="timeline-content">
                          <div className="fw-bold">Last Status Check</div>
                          <div className="small text-muted">{lastChecked.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      {['completed', 'success'].some(s => currentStatus?.toLowerCase().includes(s)) && (
                        <div className="timeline-item">
                          <div className="timeline-marker bg-success"></div>
                          <div className="timeline-content">
                            <div className="fw-bold">Transaction Completed</div>
                            <div className="small text-muted">{transaction?.updated ? formatDate(transaction.updated) : lastChecked.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                      
                      {['failed', 'cancelled'].some(s => currentStatus?.toLowerCase().includes(s)) && (
                        <div className="timeline-item">
                          <div className="timeline-marker bg-danger"></div>
                          <div className="timeline-content">
                            <div className="fw-bold">Transaction {statusDisplay.text}</div>
                            <div className="small text-muted">{transaction?.updated ? formatDate(transaction.updated) : lastChecked.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                
                {resultDesc && (
                  <Row className="mt-3">
                    <Col md={12}>
                      <div className="p-3 bg-light rounded">
                        <h6 className="fw-bold">Response Details</h6>
                        <p className="mb-0">{resultDesc}</p>
                      </div>
                    </Col>
                  </Row>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>

        <Card.Footer className="bg-light p-3">
          <div className="d-flex align-items-center">
            <div className={`status-indicator bg-${statusDisplay.variant}`} style={{ width: '12px', height: '12px', borderRadius: '50%', marginRight: '10px' }}></div>
            <div>
              {['completed', 'success'].some(s => currentStatus?.toLowerCase().includes(s)) ? 
                <span className="fw-bold text-success">Transaction completed successfully. The amount has been processed.</span> : 
                <span>If your transaction is not completed, please wait or contact our support team for assistance.</span>
              }
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Help Modal */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>M-Pesa Transaction Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Understanding Transaction Status</h5>
          <ul className="list-unstyled">
            <li className="mb-2 d-flex align-items-center">
              <Badge bg="success" className="me-2 p-2"><FaCheckCircle /></Badge>
              <span><strong>Successful:</strong> The transaction has been completed successfully.</span>
            </li>
            <li className="mb-2 d-flex align-items-center">
              <Badge bg="warning" className="me-2 p-2"><FaHourglassHalf /></Badge>
              <span><strong>Pending:</strong> The transaction is being processed but not yet complete.</span>
            </li>
            <li className="mb-2 d-flex align-items-center">
              <Badge bg="info" className="me-2 p-2"><FaSync /></Badge>
              <span><strong>Processing:</strong> We've received the transaction and are processing it.</span>
            </li>
            <li className="mb-2 d-flex align-items-center">
              <Badge bg="danger" className="me-2 p-2"><FaTimesCircle /></Badge>
              <span><strong>Failed:</strong> The transaction could not be completed.</span>
            </li>
          </ul>
          
          <h5 className="mt-4">Frequently Asked Questions</h5>
          <Accordion flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>How long does it take to process a transaction?</Accordion.Header>
              <Accordion.Body>
                Most transactions are processed within a few minutes. However, some transactions may take up to 24 hours to complete depending on network conditions.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>What should I do if my transaction fails?</Accordion.Header>
              <Accordion.Body>
                If your transaction fails, first check that you have sufficient funds and that you've entered the correct details. You can try again or contact our support team for assistance.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How do I contact support?</Accordion.Header>
              <Accordion.Body>
                You can contact our support team via email at support@example.com or call our customer service at +254 XXX XXX XXX during business hours.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS for this component */}
      <style jsx>{`
        .card-status-strip {
          border-top-left-radius: 0.25rem;
          border-top-right-radius: 0.25rem;
        }
        
        .icon-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .rotate-animation {
          animation: rotate 1s linear;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .countdown-timer {
          font-family: monospace;
          padding: 4px 8px;
          border-radius: 4px;
          background: #f8f9fa;
        }
        
        .timeline-item {
          display: flex;
          margin-bottom: 15px;
          position: relative;
        }
        
        .timeline-item:not(:last-child):before {
          content: '';
          position: absolute;
          left: 7px;
          top: 20px;
          bottom: -15px;
          width: 2px;
          background: #dee2e6;
        }
        
        .timeline-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          margin-right: 15px;
          margin-top: 5px;
        }
        
        .status-indicator {
          display: inline-block;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default PaymentStatus;