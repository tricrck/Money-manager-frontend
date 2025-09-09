import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  RefreshCw,
  FileText,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { getUserStatement } from '@/actions/reportActions';

const Transactions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userStatement = useSelector(state => state.reports.userStatement);
  const { data: userStatementData, loading: userStatementLoading, error: userStatementError } = userStatement;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (userInfo) {
      dispatch(getUserStatement(userInfo?._id));
    }
  }, [dispatch, userInfo, navigate]);

  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const isAdmin = userInfo?.role === 'Admin';

  // Process real transactions from user statement
  const processTransactions = () => {
    if (!userStatementData || !userStatementData.transactions) {
      return [];
    }

    // Combine payment transactions and wallet transactions
    const paymentTransactions = userStatementData.transactions.map(transaction => ({
      _id: transaction._id,
      type: transaction.paymentPurpose === 'wallet_deposit' ? 'deposit' : 
            transaction.paymentPurpose === 'wallet_withdrawal' ? 'withdrawal' : 
            transaction.paymentPurpose === 'loan_payment' ? 'loan' : 'transfer',
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.createdAt,
      status: transaction.status === 'success' ? 'completed' : 
              transaction.status === 'failed' ? 'failed' : 'pending',
      paymentMethod: transaction.paymentMethod,
      reference: transaction.transactionId,
      userId: transaction.userId._id,
      userName: transaction.userId.name,
      category: transaction.paymentPurpose,
      currency: transaction.currency
    }));

    const walletTransactions = userStatementData.walletTransactions ? 
      userStatementData.walletTransactions.map(transaction => ({
        _id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        reference: transaction.paymentReference,
        userId: userInfo?._id,
        userName: userInfo?.name,
        category: transaction.type,
        currency: 'KES'
      })) : [];

    // Combine and deduplicate transactions
    const allTransactions = [...paymentTransactions, ...walletTransactions];
    const uniqueTransactions = allTransactions.filter((transaction, index, self) => 
      index === self.findIndex(t => t.reference === transaction.reference)
    );

    return uniqueTransactions;
  };

  const transactions = processTransactions();

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (isAdmin && transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      const matchesType = filterType === 'all' || transaction.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate statistics from real data
  const stats = {
    totalTransactions: userStatementData?.summary?.totalTransactions || 0,
    totalAmount: userStatementData?.summary?.totalAmount || 0,
    deposits: userStatementData?.summary?.totalDeposits || 0,
    withdrawals: userStatementData?.summary?.totalWithdrawals || 0,
    pending: userStatementData?.summary?.pendingTransactions || 0,
    completed: userStatementData?.summary?.successfulTransactions || 0,
    currentBalance: userStatementData?.summary?.currentBalance || 0,
    currency: 'KES' || userStatementData?.summary?.currency
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowUpDown className="h-4 w-4 text-blue-600" />;
      case 'loan':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'fee':
        return <DollarSign className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status === 'success' ? 'completed' : status;
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive'
    };
    return (
      <Badge variant={variants[normalizedStatus] || 'outline'} className="capitalize">
        {normalizedStatus}
      </Badge>
    );
  };

  const handleExport = (format) => {
    console.log('Export')
  };
const handleRefresh = () => {
    if (userInfo) {
      dispatch(getUserStatement(userInfo?._id));
    }
  };
  const StatsCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pending} pending
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.currency} {stats.totalAmount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            All transactions
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.currency} {stats.currentBalance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Available balance
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalTransactions > 0 ? 
              Math.round((stats.completed / stats.totalTransactions) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.completed} successful
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const FilterControls = () => (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdrawal">Withdrawal</SelectItem>
          <SelectItem value="transfer">Transfer</SelectItem>
          <SelectItem value="loan">Loan</SelectItem>
          <SelectItem value="fee">Fee</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="amount">Amount</SelectItem>
          <SelectItem value="type">Type</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="flex items-center gap-2"
      >
        {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        {sortOrder === 'asc' ? 'Asc' : 'Desc'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleExport('csv', transactions)}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel', transactions)}>
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf', transactions)}>
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={userStatementLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${userStatementLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );

  const TransactionTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction History</span>
          <Badge variant="secondary">{filteredTransactions.length} transactions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {userStatementLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
            <h3 className="text-lg font-medium mb-2">Loading transactions...</h3>
            <p className="text-muted-foreground">Please wait while we fetch your data.</p>
          </div>
        ) : userStatementError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2">Error loading transactions</h3>
            <p className="text-muted-foreground mb-4">There was an error fetching your transaction data.</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                {isAdmin && <TableHead>User</TableHead>}
                <TableHead>Reference</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-bold ${
                      transaction.type === 'deposit' ? 'text-green-600' : 
                      transaction.type === 'withdrawal' ? 'text-red-600' : 
                      'text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : 
                       transaction.type === 'withdrawal' ? '-' : ''}
                      {transaction.currency || 'KES'} {transaction.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      {getStatusBadge(transaction.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm">
                      {transaction.paymentMethod?.replace('_', ' ')}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="text-sm font-medium">{transaction.userName}</div>
                    </TableCell>
                  )}
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {transaction.reference}
                    </code>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTransaction(transaction)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {!userStatementLoading && !userStatementError && filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const TransactionDetail = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
      <Dialog open={!!transaction} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getTypeIcon(transaction.type)}
              Transaction Details - {transaction.reference}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(transaction.type)}
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className={`text-2xl font-bold mt-1 ${
                    transaction.type === 'deposit' ? 'text-green-600' : 
                    transaction.type === 'withdrawal' ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : 
                     transaction.type === 'withdrawal' ? '-' : ''}
                    {transaction.currency || 'KES'} {transaction.amount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(transaction.status)}
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                  <div className="mt-1">
                    <div className="font-medium">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <div className="mt-1 capitalize">
                    {transaction.paymentMethod?.replace('_', ' ')}
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User</label>
                    <div className="mt-1 font-medium">{transaction.userName}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                {transaction.description}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Reference ID</label>
              <div className="mt-1">
                <code className="bg-muted px-3 py-2 rounded text-sm">
                  {transaction.reference}
                </code>
              </div>
            </div>

            {transaction.category && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="mt-1 capitalize">
                  {transaction.category.replace('_', ' ')}
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Transaction
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Transaction
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage all system transactions' : 'View your transaction history'}
          </p>
          {userStatementData?.period && (
            <p className="text-sm text-muted-foreground mt-1">
              Period: {new Date(userStatementData.period.startDate).toLocaleDateString()} - {new Date(userStatementData.period.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={handleExport('pdf', transactions)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Filters */}
      <FilterControls />

      {/* Transaction Table */}
      <TransactionTable />

      {/* Transaction Detail Modal */}
      <TransactionDetail 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />
    </div>
  );
};

export default Transactions;