import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  ArrowUpCircle,
  Smartphone,
  Banknote,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'

// Import child components
import MpesaWithdrawal from '../payments/MpesaWithdrawal'
import StripePayout from '../payments/StripePayout'
import { resetPaymentState } from '../../actions/paymentActions'
import { getWalletDetails } from '../../actions/walletActions'

const WithdrawForm = ({ userId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // State
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [isValidAmount, setIsValidAmount] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Redux selectors
  const walletDetails = useSelector((state) => state.walletDetails)
  const { wallet, loading: walletLoading, error: walletError } = walletDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Validate amount
  useEffect(() => {
    const num = parseFloat(amount)
    setIsValidAmount(num > 0 && !isNaN(num) && num <= (wallet?.balance || 0))
  }, [amount, wallet?.balance])

  // Handle amount input
  const handleAmountChange = e => {
    const val = e.target.value
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) setAmount(val)
  }

  // Open modal on submit
  const handleSubmit = e => {
    e.preventDefault()
    if (!isValidAmount || !paymentMethod) return
    setShowModal(true)
  }

  // Close modal and reset state on terminal
  const handleClose = () => {
    setShowModal(false)
    dispatch(resetPaymentState())
    // refresh wallet
    dispatch(getWalletDetails(userInfo?.user?._id || userId))
    setAmount('')
    setPaymentMethod('')
  }

  // Render payment component
  const renderPaymentComponent = () => {
    switch (paymentMethod) {
      case 'mpesa':
        return <MpesaWithdrawal amount={parseFloat(amount)} userId={userId} onClose={handleClose} />
      case 'stripe':
        return <StripePayout amount1={parseFloat(amount)} userId={userId} onClose={handleClose} />
      default:
        return null
    }
  }

  // Recent withdrawals
  const recent = wallet?.transactions
    ?.filter(tx => tx.type === 'withdrawal' && (paymentMethod === '' || tx.paymentMethod.toLowerCase().includes(paymentMethod)))
    .sort((a, b) => new Date(b.date) - new Date(a.date)) || []

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone },
    { id: 'stripe', name: 'Bank Transfer', icon: Banknote }
  ]

  return (
    <>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-sm text-red-500">
                {parseFloat(amount) > (wallet?.balance||0)
                  ? 'Amount exceeds available balance'
                  : 'Please enter a valid amount'}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Available balance: {formatCurrency(wallet?.balance||0, wallet?.currency)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Withdrawal Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                    <method.icon className="mr-2 h-5 w-5" />
                    {method.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={!isValidAmount || !paymentMethod}>
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {recent.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Withdrawals</h4>
            <div className="space-y-2">
              {recent.slice(0,3).map(tx => (
                <div key={tx._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <ArrowUpCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{tx.paymentMethod}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">-{formatCurrency(tx.amount, wallet?.currency)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={open => setShowModal(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Withdrawal - {formatCurrency(parseFloat(amount)||0, wallet?.currency)}</DialogTitle>
            <DialogDescription>Please complete your withdrawal using the selected method.</DialogDescription>
          </DialogHeader>

          {renderPaymentComponent()}

          <DialogClose asChild>
            <Button variant="outline" className="mt-4" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WithdrawForm
