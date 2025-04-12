import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { FaMobileAlt, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { initiateMpesaWithdrawal } from '../../actions/paymentActions';
import { getWalletDetails } from '../../actions/walletActions';
import { Link, useParams } from 'react-router-dom';

const MpesaWithdrawal = ({ history, match }) => {
  const params = useParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(0);
  const [withdrawalPurpose, setWithdrawalPurpose] = useState('loan_disbursement');
  const [reason, setReason] = useState('BusinessPayment');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();

  const walletDetails = useSelector((state) => state.walletDetails);
  const { wallet } = walletDetails;

  const mpesaWithdrawal = useSelector((state) => state.mpesaWithdrawal);
  const { loading, error, success, withdrawal } = mpesaWithdrawal;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userId = params.userId || userInfo?.user?._id;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (wallet && wallet.user && wallet.user._id !== userId) {
          dispatch(getWalletDetails(userId));
      }
    }
  }, [dispatch, history, userId, wallet, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    const withdrawalData = {
      phoneNumber,
      amount: Number(amount),
      reason,
      withdrawalPurpose,
      relatedItemId: wallet._id,
      metadata: { userId },
      description,
    };
    dispatch(initiateMpesaWithdrawal(withdrawalData));
  };

  return (
    <Container className="py-5">
      <Link to={`/wallet/${userId}`} className="btn btn-light my-3">
        <FaArrowLeft /> Back to Wallet
      </Link>
      <h2 className="mb-4">
        <FaMobileAlt /> M-Pesa Withdrawal
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Withdrawal initiated successfully! Check your phone to confirm.
        </Alert>
      )}
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="amount" className="mb-3">
              <Form.Label>Amount (KES)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                max={wallet?.balance}
              />
              {wallet?.balance && (
                <Form.Text className="text-muted">
                  Available balance: KES {wallet.balance.toLocaleString()}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="withdrawalPurpose" className="mb-3">
              <Form.Label>Withdrawal Purpose</Form.Label>
              <Form.Control
                as="select"
                value={withdrawalPurpose}
                onChange={(e) => setWithdrawalPurpose(e.target.value)}
              >
                <option value="loan_disbursement">Loan Disbursement</option>
                <option value="wallet_withdrawal">Wallet Withdrawal</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="reason" className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="BusinessPayment">Business Payment</option>
                <option value="SalaryPayment">Salary Payment</option>
                <option value="PromotionPayment">Promotion Payment</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter withdrawal description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Processing...' : (
                <>
                  <FaMoneyBillWave /> Initiate Withdrawal
                </>
              )}
            </Button>
          </Col>
          <Col md={6}>
            {success && withdrawal && (
              <div className="border p-3 rounded">
                <h5>Withdrawal Details</h5>
                <p>
                  <strong>Transaction ID:</strong> {withdrawal.transactionId}
                </p>
                <p>
                  <strong>Amount:</strong> KES {withdrawal.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Phone Number:</strong> {withdrawal.phoneNumber}
                </p>
                <p>
                  <strong>Status:</strong> Pending
                </p>
                <Button
                  variant="info"
                  onClick={() => history.push(`/payments/withdrawal/status/${withdrawal.transactionId}`)}
                >
                  Check Withdrawal Status
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default MpesaWithdrawal;