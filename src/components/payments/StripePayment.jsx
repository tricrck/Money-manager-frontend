import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Load Stripe outside of component render
const stripePromise = loadStripe("pk_test_51PGcjzEOhVuARvtZlWNTVWf60XLOrYe0DFMg8ydY1RRm7whictVl2k0k1IvGprxySk9XcTbP1D0gDXebMxVGSopV00c3t6Poly", {
  betas: [],
  advancedFraudSignals: false // Disables r.stripe.com tracking
});
const StripePayment = ({  userId, amount, onComplete, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>
        <StripePaymentForm
          amount={amount}
          currency="usd"
          description={`Deposit of $${amount}`}
          onSuccess={() => {
            onComplete?.();
          }}
          onError={(err) => {
            alert(err);
          }}
        />
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </Elements>
  );
};

export default StripePayment;