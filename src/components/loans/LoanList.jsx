import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { listLoans } from '../../actions/loanActions';

import { 
  Building2, Users, Search, Filter, SortAsc, SortDesc, Eye, Edit, Trash2, 
  Plus, Download, AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp, 
  MoreHorizontal, Calendar, UserPlus, Shield, Activity, FileText, 
  CheckSquare, XCircle, PauseCircle, RefreshCw, User, Mail, Phone,
  CreditCard, Banknote, AlertTriangle, Settings, Archive
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import LoanReviewForm from '../loans/LoanReviewForm';
import LoanDisbursementForm from './LoanDisbursementForm';

const LoanList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const loanList = useSelector((state) => state.loanList);
  const { loading, error, loans } = loanList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo?.role === 'Admin') {
      dispatch(listLoans());
    } else if (userInfo && userInfo?.role !== 'Admin') {
      navigate('/unauthorized');
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  // Filter and sort loans
  const filteredLoans = loans?.loans?.filter(loan => {
    const matchesSearch = loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loanType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesType = filterType === 'all' || loan.loanType === filterType;
    
    // Priority filter based on overdue payments and high amounts
    let matchesPriority = true;
    if (filterPriority === 'high') {
      const overdueCount = getOverdueCount(loan.repaymentSchedule);
      const isHighAmount = loan.principalAmount > 1000000; // Above 1M KES
      matchesPriority = overdueCount > 0 || isHighAmount || loan.status === 'defaulted';
    } else if (filterPriority === 'medium') {
      const overdueCount = getOverdueCount(loan.repaymentSchedule);
      matchesPriority = loan.status === 'pending' || (overdueCount === 0 && loan.status === 'active');
    } else if (filterPriority === 'low') {
      matchesPriority = loan.status === 'completed' || loan.status === 'approved';
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  }) || [];

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'applicationDate' || sortField === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortField === 'user') {
      aVal = a.user?.name || '';
      bVal = b.user?.name || '';
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const paginatedLoans = sortedLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedLoans.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      approved: { variant: 'default', icon: CheckCircle, label: 'Approved', color: 'bg-blue-100 text-blue-800' },
      disbursed: { variant: 'default', icon: DollarSign, label: 'Disbursed', color: 'bg-green-100 text-green-800' },
      active: { variant: 'default', icon: Activity, label: 'Active', color: 'bg-green-100 text-green-800' },
      completed: { variant: 'default', icon: CheckCircle, label: 'Completed', color: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected', color: 'bg-red-100 text-red-800' },
      defaulted: { variant: 'destructive', icon: AlertTriangle, label: 'Defaulted', color: 'bg-red-100 text-red-800' },
      suspended: { variant: 'secondary', icon: PauseCircle, label: 'Suspended', color: 'bg-gray-100 text-gray-800' }
    };  
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (loan) => {
    const overdueCount = getOverdueCount(loan.repaymentSchedule);
    const isHighAmount = loan.principalAmount > 1000000;
    
    if (overdueCount > 0 || loan.status === 'defaulted' || isHighAmount) {
      return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
    } else if (loan.status === 'pending') {
      return <Badge variant="secondary" className="text-xs">Medium Priority</Badge>;
    }
    return null;
  };

  const getLoanTypeIcon = (type) => {
    return type === 'business' ? <Building2 className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getOverdueCount = (repaymentSchedule) => {
    const today = new Date();
    return repaymentSchedule?.filter(installment => 
      !installment.paid && new Date(installment.dueDate) < today
    ).length || 0;
  };

  const getNextPaymentDate = (repaymentSchedule) => {
    const nextPayment = repaymentSchedule?.find(installment => !installment.paid);
    return nextPayment ? moment(nextPayment.dueDate).format('MMM DD, YYYY') : 'N/A';
  };

  const handleSelectLoan = (loanId) => {
    setSelectedLoans(prev => 
      prev.includes(loanId) 
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLoans.length === paginatedLoans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(paginatedLoans.map(loan => loan._id));
    }
  };

  const getStatsData = () => {
    const stats = {
      total: loans?.loans?.length || 0,
      pending: loans?.loans?.filter(loan => loan.status === 'pending').length || 0,
      active: loans?.loans?.filter(loan => loan.status === 'active').length || 0,
      defaulted: loans?.loans?.filter(loan => loan.status === 'defaulted').length || 0,
      totalAmount: loans?.loans?.reduce((sum, loan) => sum + loan.principalAmount, 0) || 0,
      overdue: loans?.loans?.filter(loan => getOverdueCount(loan.repaymentSchedule) > 0).length || 0
    };
    return stats;
  };

  const stats = getStatsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all loan applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/reports')}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Defaulted</p>
                <p className="text-2xl font-bold text-red-600">{stats.defaulted}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-lg font-bold">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by borrower name, email, purpose, or loan type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="defaulted">Defaulted</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortField}-${sortDirection}`} onValueChange={(value) => {
              const [field, direction] = value.split('-');
              setSortField(field);
              setSortDirection(direction);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applicationDate-desc">Newest First</SelectItem>
                <SelectItem value="applicationDate-asc">Oldest First</SelectItem>
                <SelectItem value="principalAmount-desc">Highest Amount</SelectItem>
                <SelectItem value="principalAmount-asc">Lowest Amount</SelectItem>
                <SelectItem value="user-asc">Borrower A-Z</SelectItem>
                <SelectItem value="user-desc">Borrower Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedLoans.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedLoans.length} loans selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowBulkActions(!showBulkActions)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Selected
                </Button>
                <Button size="sm" variant="outline">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Selected
                </Button>
                <Button size="sm" variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedLoans([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Loan Applications ({sortedLoans.length})
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowBulkActions(!showBulkActions)}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Bulk Actions
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedLoans.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No loans found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No loan applications available'
                }
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedLoans.length === paginatedLoans.length && paginatedLoans.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLoans.map((loan) => {
                    const overdueCount = getOverdueCount(loan.repaymentSchedule);
                    const paidInstallments = loan.repaymentSchedule?.filter(inst => inst.paid).length || 0;
                    const totalInstallments = loan.repaymentSchedule?.length || 0;
                    const progressPercentage = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;
                    
                    return (
                      <TableRow key={loan._id} className={selectedLoans.includes(loan._id) ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLoans.includes(loan._id)}
                            onCheckedChange={() => handleSelectLoan(loan._id)}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {loan.group?.name || 'Unknown Group'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {loan.user?.name}
                              </div>
                              {loan.user?.phone && (
                                <div className="text-xs text-gray-400">
                                  {loan.user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {getLoanTypeIcon(loan.loanType)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {loan.purpose}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {loan.loanType} loan • {loan.repaymentPeriod} months
                              </div>
                              {loan.interestRate && (
                                <div className="text-xs text-gray-400">
                                  {loan.interestRate}% {loan.interestType?.replace('_', ' ')} interest
                                </div>
                              )}
                              {getPriorityBadge(loan)}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {formatCurrency(loan.principalAmount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total: {formatCurrency(loan.totalRepayableAmount)}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(loan.status)}
                            {overdueCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {overdueCount} Overdue
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {getNextPaymentDate(loan.repaymentSchedule)}
                            </div>
                            {loan.repaymentSchedule && (
                              <div className="text-gray-500">
                                {formatCurrency(loan.repaymentSchedule.find(inst => !inst.paid)?.totalAmount || 0)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {paidInstallments}/{totalInstallments} payments
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round(progressPercentage)}% complete
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {moment(loan.applicationDate).format('MMM DD, YYYY')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {moment(loan.applicationDate).fromNow()}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Loan Actions</DropdownMenuLabel>
                              <Link to={`/admin/loans/${loan._id}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Full Details
                              </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem onClick={() => navigate(`/admin/users/${loan.user?._id}`)}>
                                <User className="mr-2 h-4 w-4" />
                                View Borrower Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              
                              {loan.status === 'pending' && (
                                <>
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                         setSelectedLoan(loan);
                                         setShowReviewModal(true);
                                      }}
                                      >
                                      Review
                                   </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              {loan.status === 'approved' && (
                                <>
                                  <DropdownMenuItem>
                                    <PauseCircle className="mr-2 h-4 w-4" />
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                         setSelectedLoan(loan);
                                         setShowDisburseModal(true);
                                      }}
                                      >
                                        Disburse Loan
                                      </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              
                              {loan.status === 'active' && (
                                <>
                                  <DropdownMenuItem>
                                    <PauseCircle className="mr-2 h-4 w-4" />
                                    Suspend Loan
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Restructure Loan
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              
                              <DropdownMenuItem onClick={() => navigate(`/admin/loan-statement/${loan._id}`)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Statement
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/admin/loan-history/${loan._id}`)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Archive className="mr-2 h-4 w-4" />
                                Archive Loan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, sortedLoans.length)} of{' '}
                    {sortedLoans.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 7) {
                          page = i + 1;
                        } else if (currentPage <= 4) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          page = totalPages - 6 + i;
                        } else {
                          page = currentPage - 3 + i;
                        }
                        return (
                          <Button
                            key={page}
                            size="sm"
                            variant={page === currentPage ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <LoanReviewForm
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        loanId={selectedLoan?._id}
        loanDetails={selectedLoan}
        onReviewSuccess={() => {
          setShowReviewModal(false);
          setSelectedLoan(null);
        }}
      />

      <LoanDisbursementForm
        show={showDisburseModal}
        onHide={() => setShowDisburseModal(false)}
        loanId={selectedLoan?._id}
        loanDetails={selectedLoan}
        onDisburseSuccess={() => {
          setShowDisburseModal(false);
          setSelectedLoan(null);
        }}
      />
    </div>
  );
};

export default LoanList;