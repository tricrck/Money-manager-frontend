import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  ArrowDownCircle,
  CreditCard,
  Smartphone,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'

// Import child components
import MpesaPayment from '../payments/MpesaPayment'
import StripePayment from '../payments/StripePayment'
import { resetPaymentState } from '../../actions/paymentActions'
import { getWalletDetails } from '../../actions/walletActions'

const DepositForm = ({ userId, defaultAmount = '', defaultMethod = '' }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // State management
  const [paymentMethod, setPaymentMethod] = useState(defaultMethod || '')
  const [amount, setAmount] = useState(defaultAmount || '')
  const [isValidAmount, setIsValidAmount] = useState(!!defaultAmount)
  const [step, setStep] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Redux selectors
  const walletDetails = useSelector((state) => state.walletDetails)
  const { wallet, loading: walletLoading, error: walletError } = walletDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const mpesaQuery = useSelector((state) => state.mpesaQuery);
  const { transaction } = mpesaQuery || {};

  // Filter recent deposits based on payment method
  const recentDeposits = wallet?.transactions
    ?.filter(tx => 
      tx.type === "deposit" &&
      (paymentMethod === '' || tx.paymentMethod === paymentMethod)
    )
    ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []

  // Payment methods configuration
  const paymentMethods = [
    { id: 'M-Pesa', name: 'M-Pesa', icon: Smartphone },
    { id: 'Stripe', name: 'Credit/Debit Card', icon: CreditCard }
  ]

  // Validate amount whenever it changes
  useEffect(() => {
    const numValue = parseFloat(amount)
    setIsValidAmount(numValue > 0 && !isNaN(numValue))
  }, [amount])

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValidAmount || !paymentMethod) return
    setShowModal(true)
  }

  // Handle amount input with decimal validation
  const handleAmountChange = (e) => {
    const value = e.target.value
    // Allow empty string, digits, and up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
  }

  // Handle payment completion
  const handlePaymentComplete = (success, data) => {
    if (success) {
      setShowToast(true)
      setShowModal(false)
      setStep(1)
      setAmount('')
      setPaymentMethod('')
      // Optionally refresh wallet data or navigate
      dispatch(getWalletDetails(userInfo?.user?._id || userId));
      // Navigate to wallet page or show success message
    }
  }
  const onClose = () => {
      // Only clear if successful, but preserve transaction ID for status component
      const terminalStatuses = ['success', 'completed', 'failed', 'cancelled'];
  
      if (terminalStatuses.includes(transaction?.status?.toLowerCase())) {
        dispatch(resetPaymentState());
        handlePaymentComplete(true, transaction);
      } 
    }

  // Render payment component based on selected method
  const renderPaymentComponent = () => {
    switch (paymentMethod) {
      case 'M-Pesa':
        return (
          <MpesaPayment
            amount={parseFloat(amount)}
            userId={userId}
            onComplete={handlePaymentComplete}
            onClose={onClose}
          />
        )
      case 'Stripe':
        return (
          <StripePayment
            amount={parseFloat(amount)}
            userId={userId}
            onComplete={handlePaymentComplete}
            onClose={onClose}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="space-y-4">
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className={!isValidAmount && amount ? 'border-red-500' : ''}
              />
              {!isValidAmount && amount && (
                <p className="text-sm text-red-500">Please enter a valid amount</p>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup 
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-4"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label 
                      htmlFor={method.id} 
                      className="flex items-center cursor-pointer"
                    >
                      <method.icon className="mr-2 h-5 w-5" />
                      {method.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={!isValidAmount || !paymentMethod}
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Recent Deposits Section */}
        {recentDeposits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Deposits</h4>
            <div className="space-y-2">
              {recentDeposits.slice(0, 3).map((tx) => (
                <div 
                  key={tx._id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ArrowDownCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{tx.paymentMethod}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(tx.amount, wallet?.currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Complete Payment - {formatCurrency(parseFloat(amount) || 0, wallet?.currency)}
            </DialogTitle>
            <DialogDescription>
              Please complete your payment using the selected method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {renderPaymentComponent()}
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4"onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Success Toast - Simple implementation */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <ArrowDownCircle className="h-5 w-5" />
            <span>Deposit successful!</span>
          </div>
        </div>
      )}
    </>
  )
}

export default DepositForm