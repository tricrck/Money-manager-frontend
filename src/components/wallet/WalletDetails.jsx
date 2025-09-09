import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getWalletDetails } from '../../actions/walletActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History, 
  WalletCards,
  CreditCard,
  Smartphone
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DepositForm from './DepositForm'
import WithdrawForm from './WithdrawForm'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

const WalletDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const walletDetails = useSelector((state) => state.walletDetails)
  const { loading, error, wallet = {} } = walletDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userId = userInfo?._id && userInfo._id !== "unidentified" 
      ? userInfo?._id
      : userInfo?.user?._id;

  // Quick action transaction amounts
  const quickAmounts = [100, 500, 1000, 5000]

  // Safe access to transactions with default empty array
  const transactions = Array.isArray(wallet?.transactions)
  ? [...wallet.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  : [];
  const balance = wallet.balance || 0
  const currency = wallet.currency || 'KES'

  useEffect(() => {
    if (userInfo) {
      dispatch(getWalletDetails(userId))
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userId, userInfo])

  

  // Calculate totals safely
  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  if (loading) return <WalletDetailsSkeleton />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 items-start justify-between sm:flex-row sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Wallet Dashboard</h1>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={() => navigate(`/wallet/${userId}/transactions`)}
        >
          <History className="mr-2 h-4 w-4" />
          View All Transactions
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hidden md:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <WalletCards className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated just now
            </p>
          </CardContent>
        </Card>

        <Card className="hidden md:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalDeposits)}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time deposits
            </p>
          </CardContent>
        </Card>

        <Card className="hidden md:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalWithdrawals)}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time withdrawals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <div className="h-4 w-4" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <ArrowDownCircle className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-[800px] mx-auto p-6">
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Add money to your wallet using M-Pesa or credit/debit card
                  </DialogDescription>
                </DialogHeader>
                <DepositForm userId={userId} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-[800px] mx-auto p-6">
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Transfer money from your wallet to your bank account or mobile money
                  </DialogDescription>
                </DialogHeader>
                <WithdrawForm userId={userId} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((amount) => (
                <Dialog key={amount}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-16">
                      {formatCurrency(amount)}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Deposit {formatCurrency(amount)}</DialogTitle>
                    </DialogHeader>
                    <DepositForm userId={userId} defaultAmount={amount} />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-16">
                    <Smartphone className="mr-2 h-4 w-4" />
                    M-Pesa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Deposit via M-Pesa</DialogTitle>
                  </DialogHeader>
                  <DepositForm userId={userId} defaultMethod="M-Pesa" />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-16">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Deposit via Card</DialogTitle>
                  </DialogHeader>
                  <DepositForm userId={userId} defaultMethod="Stripe" />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {tx.type === 'deposit' ? (
                        <ArrowDownCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowUpCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{tx.description || 'Transaction'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {tx.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(tx.amount || 0)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {tx.paymentMethod || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}

const WalletDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4 mt-2" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12 mt-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default WalletDetails