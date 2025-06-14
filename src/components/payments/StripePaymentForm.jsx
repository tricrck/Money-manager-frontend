import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { initiateStripePayment } from "../../actions/paymentActions";

const StripePaymentForm = ({ amount, currency, description, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  // Get userId from Redux store (adjust the path based on your store structure)
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userId = userInfo?.user?._id;
  
  const [cardComplete, setCardComplete] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

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

     // Check if Stripe is being blocked
    try {
      // Test Stripe connectivity
      await stripe.createToken({ type: 'card' });
    } catch (connectivityError) {
      if (connectivityError.message.includes('Failed to fetch')) {
        onError("Payment service blocked by browser extension or firewall. Please disable ad blockers and try again.");
        return;
      }
    }
  
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      onError("Invalid payment amount");
      return;
    }
  
    setProcessing(true);
    setError(null);
  
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
      setError(errorMessage);
      onError(errorMessage);
      console.error("Payment error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
          <CardDescription>Enter your credit or debit card.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" value={`$${amount}`} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card">Credit Card</Label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#dc3545",
                  },
                },
                hidePostalCode: true,
              }}
              onChange={(e) => {
                setCardComplete(e.complete);
                if (e.error) {
                  setError(e.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            type="submit" 
            disabled={!stripe || processing || !cardComplete} 
            className={processing ? "opacity-50 cursor-not-allowed" : ""}
          >
            {processing ? "Processing..." : "Pay Now"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default StripePaymentForm;