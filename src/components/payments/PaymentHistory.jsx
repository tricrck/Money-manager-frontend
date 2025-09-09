import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Form, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaArrowLeft, FaFileDownload, FaEye } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { queryMpesaTransaction, getStripePaymentDetails } from '../../actions/paymentActions';

const PaymentHistory = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    paymentType: 'all',
    status: 'all',
    purpose: 'all'
  });

  // Get user info from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Get payment history from Redux store
  const paymentHistory = useSelector((state) => state.paymentHistory);
  const { loading: paymentLoading, error: paymentError, payments: paymentData } = paymentHistory || {};

  const userId = params.userId || userInfo?._id;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    fetchPaymentHistory();
  }, [userInfo, userId, navigate, dispatch]);

  useEffect(() => {
    if (paymentData) {
      setPayments(paymentData);
    }
    if (paymentLoading !== undefined) {
      setLoading(paymentLoading);
    }
    if (paymentError) {
      setError(paymentError);
    }
  }, [paymentData, paymentLoading, paymentError]);

  const fetchPaymentHistory = () => {
    // Build query parameters for filtering
    const params = new URLSearchParams();
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
    if (filter.paymentType !== 'all') params.append('paymentType', filter.paymentType);
    if (filter.status !== 'all') params.append('status', filter.status);
    if (filter.purpose !== 'all') params.append('purpose', filter.purpose);
    
    // Dispatch the appropriate action to fetch payment history
    dispatch({
      type: 'PAYMENT_HISTORY_REQUEST',
      payload: {
        userId,
        queryParams: params.toString()
      }
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchPaymentHistory();
  };

  const resetFilters = () => {
    setFilter({
      startDate: '',
      endDate: '',
      paymentType: 'all',
      status: 'all',
      purpose: 'all'
    });
    // Trigger a re-fetch with reset filters
    fetchPaymentHistory();
  };
  
  const exportToCSV = () => {
    // Implementation for exporting data to CSV
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      "Date,Transaction ID,Type,Amount,Status,Purpose\n" + 
      payments.map(payment => {
        return `${new Date(payment.createdAt).toLocaleDateString()},${payment.transactionId},"${payment.paymentType}",${payment.amount},${payment.status},${payment.paymentPurpose}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewPaymentDetails = (payment) => {
    // Dispatch the appropriate action based on payment type
    if (payment.paymentType === 'mpesa') {
      dispatch(queryMpesaTransaction(payment.transactionId));
    } else if (payment.paymentType === 'stripe') {
      dispatch(getStripePaymentDetails(payment.transactionId));
    }
    
    // Navigate to the payment details page
    navigate(`/payments/${payment.paymentType === 'mpesa' ? 'mpesa' : 'stripe'}/status/${payment.transactionId}`);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'succeeded':
        return <Badge bg="success">Completed</Badge>;
      case 'pending':
      case 'processing':
        return <Badge bg="warning">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatPurpose = (purpose) => {
    if (!purpose) return 'N/A';
    // Replace underscores with spaces and capitalize each word
    return purpose
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Container className="py-5">
      <Link to="/dashboard" className="btn btn-light my-3">
        <FaArrowLeft /> Back to Dashboard
      </Link>
      <h2 className="mb-4">Payment History</h2>

      <Card className="mb-4">
        <Card.Header>
          <FaFilter className="me-2" />
          Filter Payments
        </Card.Header>
        <Card.Body>
          <Form onSubmit={applyFilters}>
            <Row>
              <Col md={3}>
                <Form.Group controlId="startDate" className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={filter.startDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="endDate" className="mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={filter.endDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="paymentType" className="mb-3">
                  <Form.Label>Payment Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="paymentType"
                    value={filter.paymentType}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="stripe">Stripe</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="status" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="purpose" className="mb-3">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    as="select"
                    name="purpose"
                    value={filter.purpose}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="wallet_deposit">Wallet Deposit</option>
                    <option value="loan_repayment">Loan Repayment</option>
                    <option value="loan_disbursement">Loan Disbursement</option>
                    <option value="contribution">Group Contribution</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={resetFilters} className="me-2">
                Reset
              </Button>
              <Button type="submit" variant="primary">
                <FaSearch className="me-2" />
                Apply Filters
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={exportToCSV}>
          <FaFileDownload className="me-2" />
          Export to CSV
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : payments.length === 0 ? (
        <Alert variant="info">No payment records found.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>{payment.transactionId}</td>
                  <td>{payment.paymentType}</td>
                  <td>
                    {payment.currency || 'KES'} {payment.amount.toLocaleString()}
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>{formatPurpose(payment.paymentPurpose)}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => viewPaymentDetails(payment)}
                    >
                      <FaEye /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default PaymentHistory;