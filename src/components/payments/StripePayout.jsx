import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { FaCreditCard, FaMoneyBillWave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { initiateStripePayout } from '../../actions/paymentActions';
import { getWalletDetails } from '../../actions/walletActions';
import { Link, useParams } from 'react-router-dom';

const StripePayout = ({ history }) => {
  const params = useParams();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [withdrawalPurpose, setWithdrawalPurpose] = useState('wallet_withdrawal');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');

  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const dispatch = useDispatch();

  const { wallet } = useSelector((state) => state.walletDetails);
  const { loading, error, success, payout } = useSelector((state) => state.stripePayout);
  const { userInfo } = useSelector((state) => state.userLogin);

  const userId = params.userId || userInfo?.user?._id;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (!wallet || wallet.user?._id !== userId) {
      dispatch(getWalletDetails(userId));
    }
  }, [dispatch, history, userId, wallet, userInfo]);

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
    }
  }, [success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (amount <= 0 || isNaN(amount) || !destination) {
      setValidated(true);
      return;
    }

    const payoutData = {
      amount: parseFloat(amount),
      currency,
      destination,
      withdrawalPurpose,
      description,
      metadata: {
        userId
      }
    };

    dispatch(initiateStripePayout(payoutData));
  };

  return (
    <Container className="py-4">
      <Link to="/wallet" className="btn btn-outline-secondary mb-3">
        <FaArrowLeft /> Back to Wallet
      </Link>

      <h3 className="text-primary mb-4">Initiate Stripe Payout</h3>

      {error && <Alert variant="danger"><FaExclamationTriangle className="me-2" />{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={submitHandler} className="shadow p-4 rounded bg-light">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaMoneyBillWave /></InputGroup.Text>
              <Form.Control
                required
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </InputGroup>
            <Form.Text muted>Must be greater than 0</Form.Text>
          </Col>

          <Col md={6}>
            <Form.Label>Currency</Form.Label>
            <Form.Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toLowerCase())}
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="kes">KES</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Destination (Bank/Card ID)</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter destination ID"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Col>

          <Col md={6}>
            <Form.Label>Withdrawal Purpose</Form.Label>
            <Form.Select
              value={withdrawalPurpose}
              onChange={(e) => setWithdrawalPurpose(e.target.value)}
            >
              <option value="wallet_withdrawal">Wallet Withdrawal</option>
              <option value="refund">Refund</option>
              <option value="manual_transfer">Manual Transfer</option>
            </Form.Select>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Add any notes for this payout..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="d-grid">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Process Payout'}
          </Button>
        </div>
      </Form>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-success">
            <FaCheckCircle className="me-2" /> Payout Processed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your payout of <strong>${payout?.amount}</strong> to destination <strong>{payout?.destination}</strong> has been successfully initiated.</p>
          <p>Status: <strong>{payout?.status}</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StripePayout;