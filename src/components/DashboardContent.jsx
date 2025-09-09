import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import PhoneVerification from '../components/users/PhoneVerification';

// OPTIMIZATION 1: Memoized Components
const StatCard = React.memo(({ title, value, subtitle, icon: Icon, bgColor, textColor, hoverEffect = true, linkTo }) => {
  const content = (
    <Card className={`relative overflow-hidden group transition-all duration-300 border-0 ${bgColor} ${hoverEffect ? 'hover:scale-105 hover:shadow-lg' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
        <div className={`p-2 ${textColor.replace('text-', 'bg-').replace('800', '500')} rounded-lg`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className={`text-3xl font-bold ${textColor.replace('800', '900')} mb-1`}>
          {value}
        </div>
        {subtitle && (
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-3 w-3 ${textColor.replace('800', '600')}`} />
            <p className={`text-xs ${textColor.replace('800', '700')} font-medium`}>
              {subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return linkTo ? (
    <LinkContainer to={linkTo} className="hover:cursor-pointer">
      {content}
    </LinkContainer>
  ) : content;
});

const GroupCard = React.memo(({ group }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
      <CardTitle className="flex items-center justify-between">
        <span className="text-lg font-bold">{group.name}</span>
        <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
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
          <span className="text-lg font-bold text-green-900">
            Ksh {group.savingsAccount?.balance?.toLocaleString() || 0}
          </span>
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
));

const TransactionRow = React.memo(({ transaction, index }) => (
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
));

const DashboardContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // OPTIMIZATION 2: State Management - Only fetch what's needed initially
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  // Redux selectors
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading: userDetailsloading, error: userDetailserror, user } = userDetails;

  const groupList = useSelector((state) => state.groupList);
  const { loading: groupLoading, error: groupError, groups = [] } = groupList;

  const userList = useSelector((state) => state.userList);
  const { loading: userLoading, error: userError, users = [] } = userList;

  const loanList = useSelector((state) => state.loanList);
  const { loading: loanloading, error: loanlisterror, loans } = loanList;

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading: walletLoading, error: walletError, wallet } = walletDetails;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: myGroupsloading, error: myGroupsError, myGroups: activeGroups = [] } = myGroups;

  const userLoansList = useSelector((state) => state.userLoansList);
  const { loading: MyloansLoading, error: MyloansError, loans: MyLoans = [] } = userLoansList;

  const isAdmin = userInfo?.role === 'Admin';

  // OPTIMIZATION 3: Memoized calculations to prevent recalculation on every render
  const calculations = useMemo(() => {
    const allLoans = loans?.loans || [];
    const pendingLoans = allLoans.filter(loan => loan.status === "pending").length;
    const activeLoans = allLoans.filter(loan => loan.status === "active");
    
    // Date calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const getNewGroupsThisMonth = (groupsArray) => {
      return groupsArray?.filter(group => {
        const createdAt = new Date(group.createdAt);
        return (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      }).length || 0;
    };

    const getDepositsThisMonth = () => {
      if (!wallet?.transactions) return 0;

      const depositsThisMonth = wallet.transactions
        .filter(tx => 
          tx.type === "deposit" &&
          new Date(tx.date).getMonth() === currentMonth &&
          new Date(tx.date).getFullYear() === currentYear
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      return depositsThisMonth.toLocaleString();
    };

    // Admin calculations
    const totalUsers = users?.length || 0;
    const totalGroups = groups?.length || 0;
    const totalLoansAmount = allLoans.reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0);

    const getNewUsersThisMonth = () => {
      return users?.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      }).length || 0;
    };

    const getMonthlyLoanVolume = () => {
      return allLoans?.filter(loan => {
        const createdAt = new Date(loan.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      }).reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0) || 0;
    };

    return {
      allLoans,
      pendingLoans,
      activeLoans,
      totalUsers,
      totalGroups,
      totalLoansAmount,
      newGroupsThisMonth: getNewGroupsThisMonth(groups),
      newActiveGroupsThisMonth: getNewGroupsThisMonth(activeGroups),
      depositsThisMonth: getDepositsThisMonth(),
      newUsersThisMonth: getNewUsersThisMonth(),
      monthlyLoanVolume: getMonthlyLoanVolume(),
      activeUserLoans: MyLoans?.filter(loan => loan.status === 'active').length || 0
    };
  }, [loans, wallet, users, groups, activeGroups, MyLoans]);

  // OPTIMIZATION 4: Memoized upcoming events calculation
  const upcomingEvents = useMemo(() => {
    const upcomingLoanEvents = [];
    const upcomingGroupEvents = [];
    const now = new Date();

    // Process loan events
    MyLoans?.forEach(loan => {
      loan.repaymentSchedule?.forEach(installment => {
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

    // Process group events
    const next6Months = new Date();
    next6Months.setMonth(now.getMonth() + 6);

    activeGroups?.forEach(group => {
      const groupName = group.name;

      // Contributions
      const contributionSchedule = group.settings?.contributionSchedule;
      if (contributionSchedule) {
        const dueDay = contributionSchedule.dueDay;
        let date = new Date(now);

        for (let i = 0; i < 6; i++) {
          date = new Date(now);
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
          date = new Date(now);
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
    return allUpcomingEvents
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [MyLoans, activeGroups]);

  // OPTIMIZATION 5: Optimized useEffect with proper dependencies
  useEffect(() => {
    if (userInfo?._id || !dataLoaded) {
      const loadData = async () => {
        // Load essential data first
        console.log('Loading dashboard data...', userInfo?._id);
        const essentialPromises = [
          dispatch(getUserDetails(userInfo?._id)),
          dispatch(getWalletDetails(userInfo?._id)),
          dispatch(listMyGroups()),
          dispatch(getUserLoans(userInfo?._id))
        ];

        // Load admin data separately if needed
        if (isAdmin) {
          essentialPromises.push(
            dispatch(listGroups()),
            dispatch(listUsers()),
            dispatch(listLoans())
          );
        }

        try {
          await Promise.all(essentialPromises);
          setDataLoaded(true);
          // ✅ Check verification status after loading
          
          if (!userInfo?.isVerified) {
            const skipped = sessionStorage.getItem('skipPhoneVerification');
            console.log('User Info after loading:', skipped, userInfo?.isVerified);
            if (!skipped) {
              setShowPhoneVerification(true);
            }
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      };

      loadData();
    }
  }, [dispatch, userInfo, isAdmin, dataLoaded]);

   // ✅ Function to handle skip
  const handleSkipVerification = () => {
    sessionStorage.setItem('skipPhoneVerification', 'true');
    setShowPhoneVerification(false);
  };

  // OPTIMIZATION 6: Lazy loading for non-critical tabs
  const loadTabData = useCallback((tabName) => {
    setActiveTab(tabName);
    // You can add lazy loading logic here for tab-specific data
  }, []);

  // Loading state
  if (userLoading || groupLoading || walletLoading || loanloading || myGroupsloading || MyloansLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Error state
  if (userError || groupError || walletError || loanlisterror || myGroupsError || MyloansError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        {userError && <p>User Error: {userError}</p>}
        {groupError && <p>Group Error: {groupError}</p>}
        {walletError && <p>Wallet Error: {walletError}</p>}
        {loanlisterror && <p>Loan Error: {loanlisterror}</p>}
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 border-1">
        <div className="absolute inset-0"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userInfo?.name?.split(' ')[0]}! 👋
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin ? (
          <>
            <StatCard
              title="Total Users"
              value={calculations.totalUsers.toLocaleString()}
              subtitle={`+${calculations.newUsersThisMonth} new this month`}
              icon={Users}
              bgColor="from-emerald-50 to-green-100"
              textColor="text-emerald-800"
              linkTo="/admin/users"
            />
            <StatCard
              title="Total Groups"
              value={calculations.totalGroups.toLocaleString()}
              subtitle={`+${calculations.newGroupsThisMonth} created this month`}
              icon={Building2}
              bgColor="from-blue-50 to-indigo-100"
              textColor="text-blue-800"
              linkTo="/admin/groups"
            />
            <StatCard
              title="Total Loans"
              value={`Ksh ${calculations.totalLoansAmount.toLocaleString()}`}
              subtitle={`Ksh ${calculations.monthlyLoanVolume.toLocaleString()} this month`}
              icon={CreditCard}
              bgColor="from-purple-50 to-violet-100"
              textColor="text-purple-800"
              linkTo="/admin/loans"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Wallet Balance"
              value={`Ksh ${wallet?.balance?.toLocaleString() || 0}`}
              subtitle={`+Ksh ${calculations.depositsThisMonth} this month`}
              icon={Wallet}
              bgColor="bg-gradient-to-br from-green-50 to-emerald-100"
              textColor="text-green-800"
            />
            <StatCard
              title="Active Groups"
              value={activeGroups?.length || 0}
              subtitle={`+${calculations.newActiveGroupsThisMonth} joined this month`}
              icon={Users}
              bgColor="bg-gradient-to-br from-blue-50 to-indigo-100"
              textColor="text-blue-800"
            />
            <StatCard
              title="Active Loans"
              value={calculations.activeUserLoans}
              subtitle="Loans in progress"
              icon={CreditCard}
              bgColor="bg-gradient-to-br from-purple-50 to-violet-100"
              textColor="text-purple-800"
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={loadTabData} className="space-y-6">
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
                    <span className="text-lg font-bold text-green-900">Ksh {calculations.depositsThisMonth}</span>
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
                <div className="space-y-3">
                  {upcomingEvents?.length > 0 ? upcomingEvents.map((event, idx) => {
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
                  }) : (
                    <p className="text-gray-500 text-center py-4">No upcoming events</p>
                  )}
                </div>
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
            {activeGroups?.length > 0 ? (
              activeGroups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))
            ) : (
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
                {wallet?.transactions?.length > 0 ? (
                  wallet.transactions.map((transaction, index) => (
                    <TransactionRow key={`${transaction._id}-${index}`} transaction={transaction} index={index} />
                  ))
                ) : (
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
    {showPhoneVerification && (
        <PhoneVerification
          isOpen={showPhoneVerification}
          onClose={handleSkipVerification} // close = skip
          userInfo={userInfo}
        />
      )}
    </>
  );
};

export default DashboardContent;