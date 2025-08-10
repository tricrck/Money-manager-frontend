import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getUserLoans } from '../../actions/loanActions';
import { listMyGroups } from '../../actions/groupActions';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  Building2, Users, Search, Filter, SortAsc, SortDesc, Eye, Edit, Trash2, 
  Plus, Download, AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp, 
  MoreHorizontal, Calendar, UserPlus, Shield, Activity 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyLoansList = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const userLoansList = useSelector((state) => state.userLoansList);
  const { loading, error, loans } = userLoansList;

  const myGroups = useSelector((state) => state.myGroups);
  const { myGroups: myGroupsList = [] } = myGroups;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const isAdmin = userInfo?.user?.role === "Admin";

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserLoans(userInfo?.user?._id));
      dispatch(listMyGroups());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);


  // Filter and sort loans
  const filteredLoans = loans?.filter(loan => {
    const matchesSearch = loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loanType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.status?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesType = filterType === 'all' || loan.loanType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'applicationDate' || sortField === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
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
      pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
      approved: { variant: 'default', icon: CheckCircle, label: 'Approved' },
      disbursed: { variant: 'primary', icon: DollarSign, label: 'Disbursed' },
      active: { variant: 'default', icon: Activity, label: 'Active' },
      completed: { variant: 'default', icon: CheckCircle, label: 'Completed' },
      rejected: { variant: 'destructive', icon: AlertCircle, label: 'Rejected' },
      defaulted: { variant: 'destructive', icon: AlertCircle, label: 'Defaulted' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
          <p className="text-gray-600 mt-1">Manage and track your loan applications</p>
        </div>
        {myGroupsList.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <LinkContainer to="/loans/guarantors">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Manage Guarantors
            </Button>
          </LinkContainer>

          <LinkContainer to="/loans/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Apply for New Loan
            </Button>
          </LinkContainer>
        </div>
      )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hidden sm:inline">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold">{loans?.length || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hidden sm:inline">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold">
                  {loans?.filter(loan => loan.status === 'active').length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hidden sm:inline">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {loans?.filter(loan => loan.status === 'pending').length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(loans?.reduce((sum, loan) => sum + loan.principalAmount, 0) || 0)}
                </p>
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
                  placeholder="Search loans by purpose, type, or status..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Loan Applications ({sortedLoans.length})
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
                  : 'Get started by applying for your first loan'
                }
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableRow key={loan._id}>
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
                            <DropdownMenuContent align="end">
                             <LinkContainer to={`/loans/${loan._id}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              </LinkContainer>
                              {loan.status === 'pending' && (
                                <LinkContainer to={`/loans/${loan._id}/edit`}>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Application
                                </DropdownMenuItem>
                                </LinkContainer>
                              )}
                              {loan.status === 'active' && (
                                <LinkContainer to={`/loans/${loan._id}/repayment`}>
                                <DropdownMenuItem>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Make Payment
                                </DropdownMenuItem>
                                </LinkContainer>
                              )}
                              <DropdownMenuSeparator />
                              <LinkContainer to={`/loans/${loan._id}/repayment-schedule`}>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Statement
                              </DropdownMenuItem>
                              </LinkContainer>
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
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
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
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
};

export default MyLoansList;