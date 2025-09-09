import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initiateMpesaWithdrawal, resetPaymentState } from '../../actions/paymentActions'
import { getWalletDetails } from '../../actions/walletActions'
import {
  Smartphone,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import PaymentStatus from './PaymentStatus'

// Receives amount (number), userId (string), and onClose callback from parent modal
const MpesaWithdrawal = ({ amount, userId, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusObj, setStatusObj] = useState(null)

  const dispatch = useDispatch()
  const walletDetails = useSelector((state) => state.walletDetails)
  const { wallet, loading: walletLoading, error: walletError } = walletDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const mpesaState = useSelector(state => state.mpesaWithdrawal)
  const { loading, error, success, withdrawal: rawWithdrawal } = mpesaState

  // Build enriched withdrawal status
  const withdrawal = rawWithdrawal && {
    ...rawWithdrawal,
    status: rawWithdrawal.ResponseCode === '0' ? 'success' : 'failed'
  }

  // Initialize phone from userInfo
  useEffect(() => {
    if (userInfo?.phoneNumber) setPhoneNumber(userInfo?.phoneNumber)
  }, [userInfo])

  // Validate Kenyan phone
  useEffect(() => {
    const regex = /^(?:254|\+254|0)?(7\d{8})$/
    setIsValidPhone(regex.test(phoneNumber))
  }, [phoneNumber])

  // Handle state changes from redux
  useEffect(() => {
    if (loading) setIsSubmitting(true)
    if (!loading && success && withdrawal) {
      setStatusObj(withdrawal)
      setIsSubmitting(false)
      toast.success('Withdrawal Initiated')
      // invoke parent close with success data
      onClose(true, withdrawal)
      // refresh wallet
      dispatch(getWalletDetails(userId))
      dispatch(resetPaymentState())
    }
    if (!loading && error) {
      setIsSubmitting(false)
      toast.error('Withdrawal failed')
      onClose(false)
    }
  }, [loading, success, error, withdrawal, dispatch, onClose, userId])

  const numericAmount = amount
  const isValidAmount = numericAmount > 0 && numericAmount <= (wallet?.balance || 0)

  const handleSubmit = e => {
    e.preventDefault()
    if (!isValidPhone || !isValidAmount) return
    const formatted = phoneNumber.startsWith('254')
      ? phoneNumber
      : '254' + phoneNumber.replace(/^0/, '')

    dispatch(initiateMpesaWithdrawal({
      phoneNumber: formatted,
      amount: numericAmount,
      reason: 'BusinessPayment',
      withdrawalPurpose: 'loan_repayment', // <- updated purpose
      relatedItemId: 'order' + formatted,            // <- updated related ID
      metadata: { userId },                // <- unchanged
    }))

  }

  if (walletLoading) return <Loader2 className="animate-spin m-auto" />
  if (walletError) return (
    <div className="text-center text-red-500">
      <p>Unable to load wallet</p>
      <Button onClick={() => dispatch(getWalletDetails(userId))}>Retry</Button>
    </div>
  )

  // Show status component if already initiated
  if (statusObj) {
    return (
      <PaymentStatus
        id={statusObj.transactionId}
        status={statusObj.status || 'PENDING'}
        type="withdrawal"
        navigateToWallet={false}
        userId={userId}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Withdraw (KES)</Label>
        <Input value={formatCurrency(numericAmount, 'KES')} readOnly disabled />
        {!isValidAmount && (
          <p className="text-sm text-red-500">
            <AlertCircle className="inline-block mr-1" />
            {numericAmount > (wallet?.balance || 0)
              ? 'Amount exceeds balance'
              : 'Invalid amount'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={e => /^[0-9]*$/.test(e.target.value) && setPhoneNumber(e.target.value)}
          placeholder="07XXXXXXXX"
        />
        {!isValidPhone && phoneNumber && (
          <p className="text-sm text-red-500">
            <AlertCircle className="inline-block mr-1" />Invalid Kenyan number
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!isValidPhone || !isValidAmount || isSubmitting}
        >{isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Confirm'}</Button>
      </div>
    </form>
  )
}

export default MpesaWithdrawal