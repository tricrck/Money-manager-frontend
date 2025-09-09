import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initiateMpesaPayment, resetPaymentState } from '../../actions/paymentActions'
import {
  Smartphone,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { formatCurrency } from '@/lib/utils'
import PaymentStatus from './PaymentStatus'

const MpesaPayment = ({
  userId,
  amount,
  onComplete,
  onClose
}) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentInitiated, setPaymentInitiated] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const mpesaPayment = useSelector((state) => state.mpesaPayment)
  const { loading, error, success, payment: paymentWithoutStatus } = mpesaPayment

  // Enhanced payment object with status based on ResponseCode
  const payment = paymentWithoutStatus ? {
    ...paymentWithoutStatus,
    status: paymentWithoutStatus.ResponseCode === "0" ? "success" : "failed"
  } : null;
  

  // Set initial phone number from user info
  useEffect(() => {
    if (userInfo?.phoneNumber) {
      setPhoneNumber(userInfo?.phoneNumber)
    }
  }, [userInfo])

  // Validate phone number
  useEffect(() => {
    const kenyanPhoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/
    setIsValidPhoneNumber(kenyanPhoneRegex.test(phoneNumber))
  }, [phoneNumber])

  // Handle payment status changes
  useEffect(() => {
    if (loading) {
      setIsSubmitting(true)
    }

    if (success && payment) {
      setPaymentInitiated(true)
      setIsSubmitting(false)
      toast.success("Payment Initiated")
    }

    if (error) {
      setIsSubmitting(false)
      toast.error("Payment failed.")
    }
  }, [loading, success, error, payment])

  const handleSubmit = () => {
    if (!isValidPhoneNumber || !amount || amount <= 0) return

    const formattedPhone = phoneNumber.startsWith('254')
      ? phoneNumber
      : '254' + phoneNumber.replace(/^0/, '')

    const paymentData = {
      userId,
      phoneNumber: formattedPhone,
      amount: Number(amount),
      paymentPurpose: 'wallet_deposit',
      description: 'Wallet deposit via M-Pesa',
      metadata: {
        userId: userInfo?._id || userId
      }
    }

    dispatch(initiateMpesaPayment(paymentData))
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
    if (value === '' || /^\d*$/.test(value)) {
      setPhoneNumber(value)
    }
  }
  

  if (paymentInitiated && payment) {
    return (
      <div className="space-y-4">
          <PaymentStatus
            id={payment.transactionId}
            status={payment.status || 'PENDING'}
            type="payment"
            navigateToWallet={true}
            userId={userId}
          />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Show read-only amount */}
      <div className="space-y-2">
        <Label>Amount (KES)</Label>
        <Input value={formatCurrency(amount, 'KES')} readOnly disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">M-Pesa Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="e.g. 0712345678"
        />
        {!isValidPhoneNumber && phoneNumber && (
          <p className="flex items-center text-sm text-red-500">
            <AlertCircle className="mr-1 h-4 w-4" />
            Please enter a valid Kenyan phone number
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isValidPhoneNumber || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Request Payment'
          )}
        </Button>
      </div>
    </div>
  )
}

export default MpesaPayment