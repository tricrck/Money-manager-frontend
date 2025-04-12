import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Spinner, Card, Row, Col, Form } from "react-bootstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { initiateStripePayment } from "../../actions/paymentActions";
import {
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaInfoCircle
} from "react-icons/fa";

const StripePaymentForm = ({
  amount,
  currency,
  description,
  userId,
  onSuccess,
  onError,
  disabled
}) => {
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [focused, setFocused] = useState(false);

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  // Format currency symbol
  const getCurrencySymbol = (curr) => {
    switch (curr.toLowerCase()) {
      case "usd": return "$";
      case "eur": return "€";
      case "gbp": return "£";
      case "kes": return "KSh";
      default: return "$";
    }
  };

  // Card element style
  const cardElementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "'Source Sans Pro', 'Helvetica', sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#aab7c4",
        },
        iconColor: "#0d6efd",
      },
      invalid: {
        color: "#dc3545",
        iconColor: "#dc3545"
      },
      complete: {
        color: "#198754",
        iconColor: "#198754"
      }
    },
    hidePostalCode: true,
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (process.env.NODE_ENV !== 'development' && navigator.webdriver) {
      onError("Browser automation detected");
      return;
    }
  
    if (!stripe || !elements) {
      onError("Payment system not ready - please wait");
      return;
    }
  
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      onError("Invalid payment amount");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      let paymentMethodId;
      if (process.env.NODE_ENV === 'development') {
        paymentMethodId = "pm_card_visa";
      } else {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)
        });
  
        if (error) throw error;
        paymentMethodId = paymentMethod.id;
      }
  
      const validCurrencies = ['usd', 'eur', 'gbp', 'kes'];
      const selectedCurrency = currency?.toLowerCase();
      if (!validCurrencies.includes(selectedCurrency)) {
        throw new Error(`Unsupported currency: ${currency}`);
      }
  
      const minAmount = selectedCurrency === 'kes' ? 100 : 0.5;
      if (amountValue < minAmount) {
        throw new Error(`Minimum amount is ${minAmount} ${currency.toUpperCase()}`);
      }
  
      await dispatch(
        initiateStripePayment({
          amount: amountValue,
          currency: selectedCurrency,
          paymentMethodId,
          description: description || `Payment of ${amount} ${currency.toUpperCase()}`,
          paymentPurpose: "wallet_deposit",
          metadata: { userId }
        })
      );
  
      elements.getElement(CardElement).clear();
      onSuccess();
    } catch (err) {
      const errorMessage = err.message || "Payment failed. Please check your card details.";
      setCardError(errorMessage);
      onError(errorMessage);
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <FaCreditCard className="text-primary me-2" /> Card Details
          </h5>
        </Card.Header>
        <Card.Body>
          <div 
            className={`card-element-container p-3 border rounded mb-3 ${focused ? 'border-primary shadow-sm' : ''} ${cardError ? 'border-danger' : ''} ${cardComplete && !cardError ? 'border-success' : ''}`}
            style={{ transition: 'all 0.2s ease' }}
          >
            <CardElement 
              options={cardElementStyle} 
              onChange={handleCardChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
          
          {cardError && (
            <div className="text-danger mb-3 d-flex align-items-center">
              <FaExclamationCircle className="me-2" />
              <small>{cardError}</small>
            </div>
          )}

          <div className="d-flex justify-content-between mb-3">
            <div className="d-flex align-items-center text-muted">
              <FaLock className="me-1" size={14} />
              <small>Secure Payment</small>
            </div>
            <div className="d-flex align-items-center text-muted">
              <FaShieldAlt className="me-1" size={14} />
              <small>Protected by SSL</small>
            </div>
          </div>

          <div className="payment-summary bg-light p-3 rounded mb-4">
            <Row>
              <Col>
                <div className="text-muted mb-1">Amount</div>
                <h4 className="d-flex align-items-center mb-0">
                  <FaMoneyBillWave className="text-success me-2" />
                  {getCurrencySymbol(currency)}{amount || "0"}
                </h4>
              </Col>
              {description && (
                <Col xs="auto">
                  <div className="text-muted mb-1">Description</div>
                  <div className="small">{description}</div>
                </Col>
              )}
            </Row>
          </div>

          <div className="d-grid">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={!stripe || isProcessing || !amount || !cardComplete || disabled}
              className="py-3 position-relative overflow-hidden"
            >
              {isProcessing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing Payment...
                </>
              ) : (
                <>
                  {cardComplete ? <FaCheckCircle className="me-2" /> : <FaCreditCard className="me-2" />}
                  Pay {getCurrencySymbol(currency)}{amount || "0"}
                </>
              )}
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="bg-white border-top-0">
          <div className="d-flex align-items-center justify-content-center text-muted small">
            <FaInfoCircle className="me-2" size={14} />
            <span>We never store your card details</span>
          </div>
        </Card.Footer>
      </Card>

      <div className="text-center mt-3">
        <img 
          src="/images/payment-methods.png" 
          alt="Supported Payment Methods" 
          style={{ maxHeight: "24px", opacity: 0.7 }}
          className="d-none d-md-inline-block"
        />
      </div>
    </form>
  );
};

export default StripePaymentForm;