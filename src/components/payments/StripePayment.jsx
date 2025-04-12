import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import StripePaymentForm from "./StripePaymentForm"; // We'll create this as a separate component

// Load Stripe outside of component render to avoid recreating the Stripe object on every render
// Replace with your actual publishable key from your Stripe dashboard
// In your Stripe initialization (StripePayment.js), add loader options:
const stripePromise = loadStripe("pk_test_51PGcjzEOhVuARvtZlWNTVWf60XLOrYe0DFMg8ydY1RRm7whictVl2k0k1IvGprxySk9XcTbP1D0gDXebMxVGSopV00c3t6Poly", {
  betas: [],
  advancedFraudSignals: false // Disables r.stripe.com tracking
});
const StripePayment = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [description, setDescription] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error: paymentError, paymentIntent } = useSelector((state) => state.stripePayment);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  
  const userId = userInfo?.user?._id;
  

  // Parse amount from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const amountParam = searchParams.get("amount");
    if (amountParam) {
      setAmount(amountParam);
    }
  }, [location.search]);

  // Set error from Redux state
  useEffect(() => {
    if (paymentError) {
      setError(paymentError);
    }
  }, [paymentError]);

  // Set success state if payment intent is successful
  useEffect(() => {
    if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentSuccess(true);
      
      // Redirect to a success page or back to the previous page after a delay
      setTimeout(() => {
        navigate("/wallet", { state: { success: true } });
      }, 2000);
    }
  }, [paymentIntent, navigate]);

  // Stripe appearance options
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0d6efd',
    },
  };

  // Options for the Elements provider
  const options = {
    appearance,
    currency: currency,
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0 d-flex align-items-center">
                <FaMoneyBillWave className="me-2" /> Make Payment
              </h2>
            </Card.Header>
            <Card.Body>
              {paymentSuccess && (
                <Alert variant="success" className="d-flex align-items-center">
                  <FaCheckCircle className="me-2" size={20} />
                  <div>
                    <strong>Payment Successful!</strong> Redirecting to confirmation page...
                  </div>
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" size={20} />
                  <div>{error}</div>
                </Alert>
              )}

              <Form className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <Form.Control
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                      step="0.01"
                      readOnly={!!paymentSuccess}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={!!paymentSuccess}
                  >
                    <option value="usd">USD - US Dollar</option>
                    <option value="eur">EUR - Euro</option>
                    <option value="gbp">GBP - British Pound</option>
                    <option value="kes">KES - Kenyan Shilling</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Add a note to this payment"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!!paymentSuccess}
                  />
                </Form.Group>
              </Form>

              <div className="mb-2">
                <label className="form-label d-flex align-items-center">
                  <FaCreditCard className="me-2" /> Card Information
                </label>
              </div>

              {/* Wrap the Stripe form in the Elements provider */}
              <Elements stripe={stripePromise} options={options}>
                <StripePaymentForm 
                  amount={amount}
                  currency={currency}
                  description={description}
                  userId={userId}
                  onSuccess={() => setPaymentSuccess(true)}
                  onError={(msg) => setError(msg)}
                  disabled={paymentSuccess || loading}
                />
              </Elements>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StripePayment;