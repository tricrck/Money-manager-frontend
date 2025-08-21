import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Plus,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Activity,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinkContainer } from 'react-router-bootstrap';
import { ChevronDown } from 'lucide-react';
import { getUserDetails } from '../actions/userActions';
import { listGroups, listMyGroups } from '../actions/groupActions';
import { listUsers } from '../actions/userActions';
import { listLoans, getUserLoans } from '../actions/loanActions';
import { getWalletDetails } from '../actions/walletActions';
import Loader from './Loader';

const DashboardContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const groupList = useSelector((state) => state.groupList);
  const { loading: groupLoading, error: groupError, groups = [] } = groupList;

  const userList = useSelector((state) => state.userList);
  const { loading: userLoading, error: userError, users = [] } = useSelector((state) => state.userList);

  const loanList = useSelector((state) => state.loanList);
  const { loading:loanloading, error:loanlisterror, loans } = loanList;

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading: walletLoading, error: walletError, wallet } = useSelector((state) => state.walletDetails);

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: myGroupsloading, error: myGroupsError, myGroups: activeGroups = [] } = myGroups;

  const userLoansList = useSelector((state) => state.userLoansList);
  const { loading: MyloansLoading, error: MyloansError, loans: MyLoans } = userLoansList;


  useEffect(() => {
      if (userInfo?.user) {
        dispatch(getUserDetails(userInfo.user._id));
        dispatch(getWalletDetails(userInfo.user._id));
        dispatch(listMyGroups());
        dispatch(getUserLoans(userInfo.user._id));
        if (userInfo.user.role === 'Admin') {
          dispatch(listGroups());
          dispatch(listUsers());
          dispatch(listLoans());
        }
      }
    }, [dispatch, userInfo, navigate]);

  // Calculate upcoming events
  const upcomingLoanEvents = [];
  const now = new Date();

  MyLoans.forEach(loan => {
    loan.repaymentSchedule.forEach(installment => {
      if (!installment.paid && new Date(installment.dueDate) > now) {
        upcomingLoanEvents.push({
          loanId: loan._id,
          group: loan.group?.name || 'Personal',
          installmentNumber: installment.installmentNumber,
          dueDate: new Date(installment.dueDate),
          totalAmount: installment.totalAmount,
          status: 'pending'
        });
      }
    });
  });

  const upcomingGroupEvents = [];

  activeGroups.forEach(group => {
    const groupName = group.name;
    const now = new Date();
    const next6Months = new Date();
    next6Months.setMonth(now.getMonth() + 6);

    // Contributions
    const contributionSchedule = group.settings?.contributionSchedule;
    if (contributionSchedule) {
      const dueDay = contributionSchedule.dueDay;
      let date = new Date(now);

      for (let i = 0; i < 6; i++) {
        date.setMonth(now.getMonth() + i);
        date.setDate(dueDay);
        if (date > now && date < next6Months) {
          upcomingGroupEvents.push({
            groupId: group._id,
            group: groupName,
            type: 'contribution',
            dueDate: new Date(date),
            amount: contributionSchedule.amount,
            frequency: contributionSchedule.frequency
          });
        }
      }
    }

    // Meetings
    const meetingSchedule = group.settings?.meetingSchedule;
    if (meetingSchedule) {
      const dayOfMonth = meetingSchedule.dayOfMonth;
      let date = new Date(now);

      for (let i = 0; i < 6; i++) {
        date.setMonth(now.getMonth() + i);
        date.setDate(dayOfMonth);
        const [hour, minute] = meetingSchedule.time.split(':').map(Number);
        date.setHours(hour, minute, 0, 0);

        if (date > now && date < next6Months) {
          upcomingGroupEvents.push({
            groupId: group._id,
            group: groupName,
            type: 'meeting',
            dueDate: new Date(date),
            frequency: meetingSchedule.frequency,
            time: meetingSchedule.time
          });
        }
      }
    }
  });

  const allUpcomingEvents = [...upcomingLoanEvents, ...upcomingGroupEvents];
  const latestevents = allUpcomingEvents.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

  // Helper functions
  const isAdmin = userInfo?.user?.role === 'Admin';
  const allLoans = loans?.loans;
  const pendingLoans = allLoans?.filter(loan => loan.status === "pending").length;
  const activeLoans = allLoans?.filter(loan => loan.status === "active");

  const getNewGroupsThisMonth = (groups) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return groups?.filter(group => {
      const createdAt = new Date(group.createdAt);
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  };

  const getDepositsThisMonth = (wallet) => {
    if (!wallet?.transactions) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const depositsThisMonth = wallet.transactions
      .filter(tx => 
        tx.type === "deposit" &&
        new Date(tx.date).getMonth() === currentMonth &&
        new Date(tx.date).getFullYear() === currentYear
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    return depositsThisMonth.toLocaleString();
  };

  // Admin-specific calculations
  const totalUsers = users?.length || 0;
  const totalGroups = groups?.length || 0;
  const totalLoansAmount = allLoans?.reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0) || 0;

  const getNewUsersThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return users?.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length || 0;
  };

  const getMonthlyLoanVolume = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return allLoans?.filter(loan => {
      const createdAt = new Date(loan.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0) || 0;
  };

  if (userLoading || groupLoading || walletLoading || loanloading || myGroupsloading || MyloansLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
        <Loader />
        </div>
    );
    }

    if (userError || groupError || walletError || loanlisterror || myGroupsError || MyloansError) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        {userError && <p>User Error: {userError}</p>}
        {groupError && <p>Group Error: {groupError}</p>}
        {walletError && <p>Wallet Error: {walletError}</p>}
        {loanError && <p>Loan Error: {loanError}</p>}
        </div>
    );
    }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Greeting */}
      <div className="relative overflow-hidden rounded-2xl p-8 border-1">
        <div className="absolute inset-0"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userInfo?.user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-black text-lg">
                Here's what's happening with your finances today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-black text-sm">Today's Date</p>
                <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Enhanced Stats Cards with Better Visual Hierarchy */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin ? (
          // Admin Stats Cards
          <>
            <LinkContainer to="/admin/users" className="hover:cursor-pointer">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-1 hover:scale-105">
                <div className="absolute inset-0"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-emerald-800">Total Users</CardTitle>
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-emerald-900 mb-1">
                    {totalUsers.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <p className="text-xs text-emerald-700 font-medium">
                      +{getNewUsersThisMonth()} new this month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </LinkContainer>

            <LinkContainer to="/admin/groups" className="hover:cursor-pointer">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-1 hover:scale-105">
                <div className="absolute inset-0"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-blue-800">Total Groups</CardTitle>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {totalGroups.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Plus className="h-3 w-3 text-blue-600" />
                    <p className="text-xs text-blue-700 font-medium">
                      +{getNewGroupsThisMonth(groups)} created this month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </LinkContainer>

            <LinkContainer to="/admin/loans" className="hover:cursor-pointer">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-1 hover:scale-105">
                <div className="absolute inset-0"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-purple-800">Total Loans</CardTitle>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-purple-900 mb-1">
                    Ksh {totalLoansAmount.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3 text-purple-600" />
                    <p className="text-xs text-purple-700 font-medium">
                      Ksh {getMonthlyLoanVolume().toLocaleString()} this month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </LinkContainer>
          </>
        ) : (
          // Regular User Stats Cards
          <>
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-green-800">Wallet Balance</CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-green-900 mb-1">
                  Ksh {wallet?.balance?.toLocaleString() || 0}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-700 font-medium">
                    +Ksh {getDepositsThisMonth(wallet)} this month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden sm:inline relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-800">Active Groups</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-blue-900 mb-1">
                  {activeGroups?.length || 0}
                </div>
                <div className="flex items-center space-x-1">
                  <Plus className="h-3 w-3 text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">
                    +{getNewGroupsThisMonth(activeGroups)} joined this month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden sm:inline relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-500/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-purple-800">Active Loans</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-purple-900 mb-1">
                  {MyLoans?.filter(loan => loan.status === 'active').length || 0}
                </div>
                <p className="text-xs text-purple-700 font-medium">
                  Loans in progress
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Enhanced Main Content with Modern Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Activity className="w-4 h-4 mr-2" />
            <span className='hidden sm:inline'>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2" />
            <span className='hidden sm:inline'>My Groups</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-2" />
            <span className='hidden sm:inline'>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Financial Summary Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className='hidden sm:inline'>Monthly Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Total Deposits</span>
                    <span className="text-lg font-bold text-green-900">Ksh {getDepositsThisMonth(wallet)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Active Groups</span>
                    <span className="text-lg font-bold text-blue-900">{activeGroups?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">Loan Applications</span>
                    <span className="text-lg font-bold text-purple-900">{MyLoans?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {latestevents?.map((event, idx) => {
                  const now = new Date();
                  const due = new Date(event.dueDate);
                  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                  const isTomorrow = diffDays === 1;
                  const displayTime = event.time ? `${event.time}` : '';

                  let bgColor = '';
                  let borderColor = '';
                  let textColor = '';
                  let title = '';
                  let subtitle = '';
                  let Icon;

                  if (event.type === 'meeting') {
                    bgColor = 'bg-yellow-50';
                    borderColor = 'border-yellow-400';
                    textColor = 'text-yellow-800';
                    title = 'Group Meeting';
                    subtitle = isTomorrow ? `Tomorrow, ${displayTime}` : `In ${diffDays} days, ${displayTime}`;
                    Icon = Clock;
                  } else if (event.type === 'contribution') {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-400';
                    textColor = 'text-green-800';
                    title = 'Monthly Contribution';
                    subtitle = `Due in ${diffDays} days`;
                    Icon = CheckCircle;
                  } else if (event.totalAmount) {
                    bgColor = 'bg-blue-50';
                    borderColor = 'border-blue-400';
                    textColor = 'text-blue-800';
                    title = 'Loan Payment Due';
                    subtitle = `In ${diffDays} days`;
                    Icon = AlertCircle;
                  } else {
                    return null;
                  }

                  return (
                    <div key={idx} className={`flex items-center p-3 ${bgColor} rounded-lg border-l-4 ${borderColor}`}>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                        <p className={`text-xs ${textColor.replace('800', '600')}`}>{subtitle}</p>
                      </div>
                      <Icon className={`w-4 h-4 ${textColor.replace('800', '600')}`} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Your Groups</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeGroups?.map((group) => (
              <Card key={group._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-bold">{group.name}</span>
                    <Badge variant={group.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                      {group.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Members</span>
                      </div>
                      <span className="text-lg font-bold text-blue-900">{group.members?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Savings Balance</span>
                      </div>
                      <span className="text-lg font-bold text-green-900">Ksh {group.savingsAccount?.balance?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                  <LinkContainer to={`/groups/${group._id}`}>
                    <Button variant="outline" className="w-full mt-6 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                      View Details
                      <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                    </Button>
                  </LinkContainer>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No groups yet</p>
                <p className="text-gray-400 text-sm">Join your first group to get started</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="divide-y">
                {wallet?.transactions?.map((transaction, index) => (
                  <div key={`${transaction._id}-${index}`} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}Ksh {transaction.amount?.toLocaleString()}
                      </div>
                      <Badge variant={transaction.type === 'deposit' ? 'default' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No transactions yet</p>
                    <p className="text-gray-400 text-sm">Your transaction history will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;