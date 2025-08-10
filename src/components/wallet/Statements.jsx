import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileText,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Wallet,
  Activity,
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { getMyStatement } from '@/actions/reportActions';

const Statements = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const myStatement = useSelector(state => state.reports.myStatement);
  const { data: statementData, loading, error } = myStatement;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statementType, setStatementType] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [status, setStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState([{
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    key: 'selection',
  }]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
      return;
    }
    loadStatement();
  }, [dispatch, userInfo, navigate]);

  const loadStatement = async () => {
    try {
      const params = {
        type: statementType,
        ...(statementType === 'custom' && customDateRange[0].from && customDateRange[0].to && {
          startDate: customDateRange[0].from.toISOString(),
          endDate: customDateRange[0].to.toISOString()
        }),
        ...(paymentMethod && paymentMethod !== 'all' && { paymentMethod }),
        ...(status && status !== 'all' && { status })
      };

      await dispatch(getMyStatement(params));
    } catch (error) {
      console.error('Error loading statement:', error);
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!statementData?.transactions) return [];
    
    return statementData.transactions.filter(transaction => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.transactionId?.toLowerCase().includes(searchLower) ||
        transaction.paymentMethod?.toLowerCase().includes(searchLower) ||
        transaction.paymentPurpose?.toLowerCase().includes(searchLower)
      );
    });
  }, [statementData?.transactions, searchTerm]);

  const handleGenerateStatement = () => {
    loadStatement();
  };

  const handleExportStatement = (exportFormat) => {
    if (!statementData) return;

    const { transactions, summary, period } = statementData;
    const fileName = `statement_${period.type}_${new Date().toISOString().split('T')[0]}`;

    switch (exportFormat) {
      case 'csv':
        exportToCSV(transactions, fileName);
        break;
      case 'excel':
        exportToExcel(transactions, summary, fileName);
        break;
      case 'pdf':
        exportToPDF(statementData, fileName);
        break;
      default:
        break;
    }
  };

  const exportToCSV = (transactions, fileName) => {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Status', 'Payment Method', 'Reference'];
    const csvData = transactions.map(transaction => [
      new Date(transaction.createdAt).toLocaleDateString(),
      transaction.paymentPurpose || 'N/A',
      transaction.description || 'N/A',
      transaction.amount || 0,
      transaction.status || 'N/A',
      transaction.paymentMethod || 'N/A',
      transaction.transactionId || 'N/A'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (transactions, summary, fileName) => {
    const workbook = XLSX.utils.book_new();
    
    const summaryData = [
      ['Statement Summary', ''],
      ['Total Transactions', summary.totalTransactions || 0],
      ['Total Amount', summary.totalAmount || 0],
      ['Total Deposits', summary.totalDeposits || 0],
      ['Total Withdrawals', summary.totalWithdrawals || 0],
      ['Successful Transactions', summary.successfulTransactions || 0],
      ['Failed Transactions', summary.failedTransactions || 0],
      ['Pending Transactions', summary.pendingTransactions || 0],
      ['Current Balance', summary.currentBalance || 0],
      ['Currency', summary.currency || 'N/A']
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    const transactionData = transactions.map(transaction => ({
      Date: new Date(transaction.createdAt).toLocaleDateString(),
      Type: transaction.paymentPurpose || 'N/A',
      Description: transaction.description || 'N/A',
      Amount: transaction.amount || 0,
      Status: transaction.status || 'N/A',
      'Payment Method': transaction.paymentMethod || 'N/A',
      Reference: transaction.transactionId || 'N/A',
      Currency: transaction.currency || 'N/A'
    }));
    
    const transactionSheet = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(workbook, transactionSheet, 'Transactions');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPDF = (statementData, fileName) => {
    const doc = new jsPDF();
    const { period, summary, transactions } = statementData;

    doc.setFontSize(20);
    doc.text('Financial Statement', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`User: ${userInfo?.user?.name || 'N/A'}`, 20, 35);
    doc.text(`Period: ${new Date(period.startDate).toLocaleDateString()} - ${new Date(period.endDate).toLocaleDateString()}`, 20, 45);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);

    doc.setFontSize(16);
    doc.text('Summary', 20, 75);
    
    const summaryData = [
      ['Total Transactions', (summary.totalTransactions || 0).toString()],
      ['Total Amount', `${summary.currency || 'N/A'} ${(summary.totalAmount || 0).toLocaleString()}`],
      ['Total Deposits', `${summary.currency || 'N/A'} ${(summary.totalDeposits || 0).toLocaleString()}`],
      ['Total Withdrawals', `${summary.currency || 'N/A'} ${(summary.totalWithdrawals || 0).toLocaleString()}`],
      ['Current Balance', `${summary.currency || 'N/A'} ${(summary.currentBalance || 0).toLocaleString()}`],
      ['Success Rate', `${summary.totalTransactions > 0 ? ((summary.successfulTransactions / summary.totalTransactions) * 100).toFixed(1) : 0}%`]
    ];

    autoTable(doc, {
      head: [['Metric', 'Value']],
      body: summaryData,
      startY: 85,
      theme: 'striped'
    });

    doc.setFontSize(16);
    doc.text('Transactions', 20, doc.lastAutoTable.finalY + 20);

    const transactionData = transactions.slice(0, 50).map(transaction => [
      new Date(transaction.createdAt).toLocaleDateString(),
      transaction.paymentPurpose || 'N/A',
      (transaction.description || 'N/A').substring(0, 30) + '...',
      `${transaction.currency || 'N/A'} ${(transaction.amount || 0).toLocaleString()}`,
      transaction.status || 'N/A',
      transaction.paymentMethod || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Date', 'Type', 'Description', 'Amount', 'Status', 'Method']],
      body: transactionData,
      startY: doc.lastAutoTable.finalY + 30,
      theme: 'striped',
      styles: { fontSize: 8 }
    });

    doc.save(`${fileName}.pdf`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      success: 'default',
      pending: 'secondary',
      failed: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize text-xs">
        {status}
      </Badge>
    );
  };

  const StatementHeader = () => (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Financial Statements</h1>
          <p className="text-sm text-muted-foreground">
            View your financial statement and transaction history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleGenerateStatement}
            disabled={loading}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Generate Statement</span>
            <span className="sm:hidden">Generate</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const FilterPanel = () => (
    <Card className={`mb-6 transition-all duration-300 ${showFilters || 'hidden sm:block'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Statement Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Statement Type</label>
            <Select value={statementType} onValueChange={setStatementType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {statementType === 'custom' && (
          <div className="pt-4 border-t">
            <label className="text-sm font-medium mb-2 block">Custom Date Range</label>
            <div className="flex justify-center">
              <DateRange
                editableDateInputs={true}
                onChange={item => setCustomDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={customDateRange}
                className="border rounded-lg"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SummaryCards = () => {
    if (!statementData?.summary) return null;

    const { summary } = statementData;
    
    const cards = [
      {
        title: "Total Transactions",
        value: summary.totalTransactions || 0,
        subtitle: `${summary.pendingTransactions || 0} pending`,
        icon: FileText
      },
      {
        title: "Total Amount",
        value: `${summary.currency || 'N/A'} ${(summary.totalAmount || 0).toLocaleString()}`,
        subtitle: "All transactions",
        icon: DollarSign
      },
      {
        title: "Current Balance",
        value: `${summary.currency || 'N/A'} ${(summary.currentBalance || 0).toLocaleString()}`,
        subtitle: "Available balance",
        icon: Wallet
      },
      {
        title: "Success Rate",
        value: `${summary.totalTransactions > 0 ? Math.round((summary.successfulTransactions / summary.totalTransactions) * 100) : 0}%`,
        subtitle: `${summary.successfulTransactions || 0} successful`,
        icon: TrendingUp
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const StatementContent = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-8 sm:p-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
              <h3 className="text-lg font-medium mb-2">Generating Statement...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we process your request.</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="p-8 sm:p-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-medium mb-2">Error Loading Statement</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleGenerateStatement} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!statementData) {
      return (
        <Card>
          <CardContent className="p-8 sm:p-12">
            <div className="text-center">
              <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Statement Generated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate your statement to view your financial data.
              </p>
              <Button onClick={handleGenerateStatement} size="sm">
                Generate Statement
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs sm:text-sm">Transactions</TabsTrigger>
          <TabsTrigger value="breakdown" className="text-xs sm:text-sm">Breakdown</TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <SummaryCards />
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Transaction Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="w-4 h-4" />
                        <span className="text-sm">Deposits</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">
                          {statementData.summary.currency || 'N/A'} {(statementData.summary.totalDeposits || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-sm">Withdrawals</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">
                          {statementData.summary.currency || 'N/A'} {(statementData.summary.totalWithdrawals || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Transaction Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'success', label: 'Successful', icon: CheckCircle, count: statementData.summary.successfulTransactions },
                      { status: 'pending', label: 'Pending', icon: Clock, count: statementData.summary.pendingTransactions },
                      { status: 'failed', label: 'Failed', icon: XCircle, count: statementData.summary.failedTransactions }
                    ].map(({ status, label, icon: Icon, count }) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{label}</span>
                        </div>
                        <div className="font-bold text-sm">{count || 0}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Transaction History</span>
                <Badge variant="secondary" className="text-xs">
                  {filteredTransactions.length} transactions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[80px]">Type</TableHead>
                      <TableHead className="min-w-[120px]">Description</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[80px]">Method</TableHead>
                      <TableHead className="min-w-[120px]">Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-sm">{(transaction.paymentPurpose || 'N/A').replace('_', ' ')}</span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm max-w-[200px] truncate">
                            {transaction.description || 'No description'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-bold text-sm ${
                            (transaction.amount || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {(transaction.amount || 0) > 0 ? '+' : ''}
                            {transaction.currency || 'N/A'} {Math.abs(transaction.amount || 0).toLocaleString()}
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
                            {(transaction.paymentMethod || 'N/A').replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded max-w-[100px] block truncate">
                            {transaction.transactionId || 'N/A'}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statementData.paymentMethodBreakdown || {}).map(([method, data]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="capitalize text-sm">{method.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">
                          {statementData.summary.currency || 'N/A'} {(data.amount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.count || 0} transactions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statementData.statusBreakdown || {}).map(([status, data]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="capitalize text-sm">{status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">
                          {statementData.summary.currency || 'N/A'} {(data.amount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.count || 0} transactions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { format: 'csv', label: 'Export as CSV', description: 'Comma-separated values format' },
                    { format: 'excel', label: 'Export as Excel', description: 'Microsoft Excel (.xlsx)' },
                    { format: 'pdf', label: 'Export as PDF', description: 'Download a printable PDF' }
                  ].map(({ format, label, description }) => (
                    <Card key={format} className="p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{label}</h4>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                      <Button
                        className="mt-4"
                        size="sm"
                        onClick={() => handleExportStatement(format)}
                      >
                        Download
                      </Button>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Only the first 50 transactions are included in PDF export for brevity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6">
      <StatementHeader />
      <FilterPanel />
      <StatementContent />
    </div>
  );
};

export default Statements;
