import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, Navigate  } from 'react-router-dom';
import { 
  logout 
} from '../actions/userActions';
import { 
  LinkContainer 
} from 'react-router-bootstrap';
import { 
  Building2, 
  Users, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Shield,
  UserCheck,
  BarChart3,
  PieChart,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Bell,
  User,
  ChevronDown,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserDetails } from '../actions/userActions';
import { listGroups, listMyGroups } from '../actions/groupActions';
import { listUsers } from '../actions/userActions';
import { listLoans, getUserLoans } from '../actions/loanActions';
import { getWalletDetails } from '../actions/walletActions';
import Loader from './Loader';

const ProfessionalDashboard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const groupList = useSelector((state) => state.groupList);
  const { loading: loadingAll, error: errorAll, groups = [] } = groupList;

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const loanList = useSelector((state) => state.loanList);
  const { loading: loadingloans, error: errorloans, loans } = loanList;

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading: walletloading, error: walleterror, wallet } = walletDetails;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: loadingMy, error: errorMy, myGroups: activeGroups = [] } = myGroups;
  
  const userLoansList = useSelector((state) => state.userLoansList);
  const { loans: MyLoans } = userLoansList;

  useEffect(() => {
    if (!userInfo) {
      navigate('/home');
      return; // Exit early to prevent further execution
    }
    
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

  const logoutHandler = () => {
      dispatch(logout());
    };

  const isLoading = loading || loadingAll || loadingloans || walletloading || loadingMy;
  // assume `data` is the object you `console.log`-ed (so data.loans is the array)
  const allLoans = loans?.loans;

  // 1) Count how many are “pending” and how many are “active”
  const pendingLoans = allLoans?.filter(loan => loan.status === "pending").length;
  const activeLoans  = allLoans?.filter(loan => loan.status === "active");

  // 2) (Optional) Sum of principalAmount for pending and active loans
  const pendingTotalPrincipal = allLoans?.filter(loan => loan?.status === "pending")
    .reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0);

  const activeTotalPrincipal = allLoans?.filter(loan => loan?.status === "active")
    .reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0);

  // console.log("Pending loans count:", pendingLoans);
  // console.log("Active loans count: ", activeLoans);

  // console.log("Pending total principal amount:", pendingTotalPrincipal);
  // console.log("Active total principal amount: ", activeTotalPrincipal);


  const isAdmin = userInfo?.user?.role === 'Admin';
  const isGroupAdmin = ['Admin', 'Treasurer', 'Secretary'].includes(userInfo?.user?.role);

  // Navigation items based on role
 // In ProfessionalDashboard.jsx, update the getNavigationItems function:

const getNavigationItems = () => {
  const baseItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', key: 'dashboard' },
    { icon: Wallet, label: 'My Wallet', path: `/wallet/${userInfo?.user?._id}`, key: 'wallet' }, // Fixed path
    { icon: Users, label: 'My Groups', path: '/groups', key: 'groups' },
    { icon: CreditCard, label: 'My Loans', path: '/loans', key: 'loans' },
    { icon: FileText, label: 'Transactions', path: '/transactions', key: 'transactions' }
  ];

  const adminItems = [
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', key: 'analytics' },
    { icon: Users, label: 'User Management', path: '/admin/users', key: 'users' },
    { icon: Building2, label: 'Group Management', path: '/admin/groups', key: 'admin-groups' },
    { icon: CreditCard, label: 'Loans Management', path: '/admin/loans', key: 'admin-loans' },
    { icon: Shield, label: 'System Settings', path: '/admin/settings', key: 'settings' }
  ];

  const groupAdminItems = [
    { icon: Users, label: 'Group Management', path: '/group-admin/manage', key: 'group-manage' },
    { icon: FileText, label: 'Group Reports', path: '/group-admin/reports', key: 'group-reports' },
    { icon: TrendingUp, label: 'Group Analytics', path: '/group-admin/analytics', key: 'group-analytics' }
  ];

  if (isAdmin) {
    return [...baseItems, ...adminItems];
  } else if (isGroupAdmin) {
    return [...baseItems, ...groupAdminItems];
  }
  return baseItems;
};

  function getNewGroupsThisMonth(groups) {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentYear = now.getFullYear();

    return groups?.filter(group => {
      const createdAt = new Date(group.createdAt);
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    }).length;
  }
  function getDepositsThisMonth(wallet) {
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
  }

  // Admin-specific calculations
  const totalUsers = users?.length || 0;
  const totalGroups = groups?.length || 0;
  const totalLoansAmount = allLoans?.reduce((sum, loan) => sum + (loan?.principalAmount || 0), 0) || 0;
  const totalActiveLoans = activeLoans?.length || 0;
  const totalPendingLoans = pendingLoans || 0;
  const totalApprovedLoans = allLoans?.filter(loan => loan.status === 'approved').length || 0;
  const totalRejectedLoans = allLoans?.filter(loan => loan.status === 'rejected').length || 0;
  
  // Monthly growth calculations
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

  const getSystemHealth = () => {
    const healthMetrics = {
      activeUsers: users?.filter(user => user.status === 'active').length || 0,
      activeGroups: groups?.filter(group => group.status === 'active').length || 0,
      pendingApprovals: allLoans?.filter(loan => loan.status === 'pending').length || 0,
      systemLoad: Math.floor(Math.random() * 100) // Mock system load
    };
    return healthMetrics;
  };

  const systemHealth = getSystemHealth();


  const navigationItems = getNavigationItems();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold text-primary">Money Manager</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigationItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.key}
              onClick={() => {
                setCurrentPath(item.path);
                setSidebarOpen(false);
                navigate(item.path);

              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={userInfo?.user?.profilePicture} />
                <AvatarFallback>{userInfo?.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{userInfo?.user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{userInfo?.user?.role}</span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <LinkContainer to="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            </LinkContainer>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem  onClick={logoutHandler}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const DashboardContent = () => {
    return (
      <div className="space-y-8">
        {/* Enhanced Header with Greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {userInfo?.user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's what's happening with your finances today
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Today's Date</p>
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
        {!isLoading ? (
           <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isAdmin ? (
            // Admin Stats Cards
            <>
            <LinkContainer to="/admin/users" className="hover:cursor-pointer">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-100 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-500/10"></div>
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
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10"></div>
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
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-500/10"></div>
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

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-rose-50 to-pink-100 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-pink-500/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-rose-800">System Health</CardTitle>
                  <div className="p-2 bg-rose-500 rounded-lg">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-rose-900 mb-1">
                    {systemHealth.systemLoad}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-rose-600" />
                    <p className="text-xs text-rose-700 font-medium">
                      {systemHealth.pendingApprovals} pending approvals
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            // Regular User Stats Cards (existing)
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

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105">
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

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100 hover:scale-105">
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

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-100 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-500/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-orange-800">Pending Loans</CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-orange-900 mb-1">
                {MyLoans?.filter(loan => loan.status === 'pending').length || 0}
              </div>
              <p className="text-xs text-orange-700 font-medium">
                Awaiting approval
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
              Overview
            </TabsTrigger>
            <TabsTrigger value="groups" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              My Groups
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Recent Activity - Enhanced */}
              <Card className="md:col-span-2 border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Recent wallet Activity
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/wallet/${userInfo?.user?._id}/transactions`)} >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {wallet?.transactions
                          ?.slice() // clone to avoid mutating original
                          .sort((a, b) => new Date(b.date) - new Date(a.date)) // latest to oldest
                          .slice(0, 2)
                          .map((transaction, index) => (
                      <div key={`${transaction.id}-${index}`} className="group flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className={`p-3 rounded-full mr-4 ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingUp className="h-5 w-5 rotate-180" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className={`text-right ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <p className="text-lg font-bold">
                            {transaction.type === 'deposit' ? '+' : '-'}Ksh {transaction.amount?.toLocaleString()}
                          </p>
                          <Badge variant={transaction.type === 'deposit' ? 'default' : 'destructive'} className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No recent transactions</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full justify-start h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all" onClick={() => navigate('/loans/create')} >
                    <CreditCard className="mr-3 h-5 w-5" />
                    Apply for Loan
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <Users className="mr-3 h-5 w-5 text-blue-600" />
                    Join New Group
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-green-50 hover:border-green-200 transition-all">
                    <Wallet className="mr-3 h-5 w-5 text-green-600" />
                    Deposit Funds
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-purple-50 hover:border-purple-200 transition-all">
                    <BarChart3 className="mr-3 h-5 w-5 text-purple-600" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Financial Summary Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Monthly Summary
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
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">Group Meeting</p>
                        <p className="text-xs text-yellow-600">Tomorrow, 2:00 PM</p>
                      </div>
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800">Loan Payment Due</p>
                        <p className="text-xs text-blue-600">In 5 days</p>
                      </div>
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Monthly Contribution</p>
                        <p className="text-xs text-green-600">Due in 10 days</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
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
                          <span className="text-sm font-medium text-green-800">Balance</span>
                        </div>
                        <span className="text-lg font-bold text-green-900">Ksh {group.totalFunds?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                      View Details
                      <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                    </Button>
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
      </>
      ) : (
        <>
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
        </>
      )}
    </div>
  );
};


  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">Money Manager</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
         {children || <DashboardContent />}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;