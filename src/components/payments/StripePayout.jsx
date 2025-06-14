import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { initiateStripePayout } from "../../actions/paymentActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const StripePayout = ({ amount1, userId, onClose }) => {
  const dispatch = useDispatch();
  
  const [amount, setAmount] = useState(amount1 || "");
  const [destination, setDestination] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [withdrawalPurpose, setWithdrawalPurpose] = useState("loan_repayment");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!amount || amount <= 0 || isNaN(amount)) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }
    
    if (!destination.trim()) {
      setError("Please enter a destination account");
      return false;
    }
    
    setError("");
    return true;
  };

  const handlePayout = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payoutData = {
        amount: parseFloat(amount),
        currency,
        destination: destination.trim(),
        withdrawalPurpose,
        description: description.trim() || `Payout of ${amount} ${currency}`,
        metadata: {
          userId
        }
      };

      await dispatch(initiateStripePayout(payoutData));
      
      // Close modal on success if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "An error occurred while processing the payout");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (validated && error) {
        validateForm();
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>Transfer funds from your wallet to your account.</CardDescription>
        </CardHeader>

        <form onSubmit={handlePayout}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                className={validated && (!amount || amount <= 0) ? "border-red-500" : ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="USD"
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination Account *</Label>
              <Input
                id="destination"
                placeholder="e.g., acct_1234567890"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={validated && !destination.trim() ? "border-red-500" : ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdrawalPurpose">Withdrawal Purpose</Label>
              <select
                id="withdrawalPurpose"
                value={withdrawalPurpose}
                onChange={(e) => setWithdrawalPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="loan_repayment">Loan Repayment</option>
                <option value="business_payment">Business Payment</option>
                <option value="personal_transfer">Personal Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Payout"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default StripePayout;