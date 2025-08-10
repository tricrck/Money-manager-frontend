import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getWalletDetails } from '../../actions/walletActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowLeft,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Calendar,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  DollarSign,
  CreditCard,
  RefreshCw
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

const TransactionHistory = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  const walletDetails = useSelector((state) => state.walletDetails)
  const { loading, error, wallet } = walletDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userId = params?.userId || userInfo?.user?._id

  useEffect(() => {
    if (userInfo) {
      dispatch(getWalletDetails(userId))
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userId, userInfo])

  // Memoized filtered and sorted transactions for performance
  const filteredTransactions = useMemo(() => {
    if (!wallet?.transactions) return []
    
    let filtered = [...wallet.transactions]
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter)
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(term) ||
        t.paymentMethod?.toLowerCase().includes(term) ||
        t.paymentReference?.toLowerCase().includes(term)
      )
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let compareA, compareB
      
      switch (sortField) {
        case 'amount':
          compareA = a.amount
          compareB = b.amount
          break
        case 'type':
          compareA = a.type
          compareB = b.type
          break
        case 'date':
        default:
          compareA = new Date(a.date)
          compareB = new Date(b.date)
      }
      
      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    return filtered
  }, [wallet?.transactions, filter, searchTerm, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filter, sortField, sortDirection])

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="h-5 w-5 text-green-500" />
      case 'withdrawal':
        return <ArrowUpCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getTransactionBadge = (type) => {
    switch (type) {
      case 'deposit':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300">Deposit</Badge>
      case 'withdrawal':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300">Withdrawal</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getTotalAmount = (type) => {
    if (!wallet?.transactions) return 0
    return wallet.transactions
      .filter(t => type === 'all' || t.type === type)
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilter('all')
    setSortField('date')
    setSortDirection('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filter !== 'all' || sortField !== 'date' || sortDirection !== 'desc'

  const renderPagination = () => {
    if (totalPages <= 1) return null
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (loading) return <TransactionHistorySkeleton />

  return (
    <div className="min-h-screen">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-8">
              {/* <Button 
                variant="outline" 
                size="sm"
                className="shrink-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button> */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transaction History</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track your financial transactions
                </p>
              </div>
            </div>
            <Link to={`/wallet/statements`} className="flex items-center space-x-2 text-blue-600 hover:underline">
            <Button variant="outline" size="sm" className="shrink-0">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredTransactions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {filter === 'all' ? 'All types' : `${filter}s only`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalAmount('deposit'))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Money added to wallet
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(getTotalAmount('withdrawal'))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Money withdrawn from wallet
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters & Search
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
                {/* Search Bar */}
                <div className="flex items-center relative">
                  {/* Search Icon Far Left */}
                  <div className="mr-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Input with Cancel Button */}
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search transactions, payment methods, or references..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-4 pr-10 h-11 border-2 focus:border-blue-500 transition-colors w-full"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortField} onValueChange={setSortField}>
                    <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={`${itemsPerPage}`} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="h-11 border-2 hover:border-blue-500 transition-colors"
                  >
                    {sortDirection === 'asc' ? (
                      <><SortAsc className="mr-2 h-4 w-4" />Ascending</>
                    ) : (
                      <><SortDesc className="mr-2 h-4 w-4" />Descending</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Transactions 
                  {filteredTransactions.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({filteredTransactions.length} found)
                    </span>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">No transactions found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'No transactions match your current filters'}
                    </p>
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="mt-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset filters
                      </Button>
                    )}
                  </div>
                ) : (
                  currentTransactions.map((tx, index) => (
                    <div 
                      key={tx._id} 
                      className="group relative overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="shrink-0 mt-1">
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <p className="font-medium text-foreground truncate">{tx.description || 'Transaction'}</p>
                                {getTransactionBadge(tx.type)}
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {tx.paymentMethod && (
                                  <div className="flex items-center space-x-1">
                                    <CreditCard className="h-3 w-3" />
                                    <Badge variant="outline" className="text-xs">
                                      {tx.paymentMethod}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              {tx.paymentReference && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Ref: {tx.paymentReference}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className={`text-lg font-semibold ${
                              tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tx.status || 'Completed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

const TransactionHistorySkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-9 w-20" />
              <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48 mt-2" />
              </div>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-11 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-11 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Skeleton className="h-5 w-5 rounded-full mt-1" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-48 mb-2" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory