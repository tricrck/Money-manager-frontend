import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Building2,
  Trash2,
  UserMinus, 
  Users, 
  ArrowLeft,
  Settings, 
  Plus, 
  AlertCircle,
  CheckCircle,
  Check,
  Clock,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  Eye,
  Edit,
  FileText,
  UserPlus,
  Download,
  Filter,
  History,
  Shield,
  Target,
  Percent,
  CalendarDays,
  HandCoins,
  Receipt,
  X,
  User,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Area, AreaChart } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { getGroupDetails, reviewJoinRequest, getJoinRequests } from '../../actions/groupActions';
import GroupSettingsEditor from './GroupSettingsEditor';
import GroupMembers from './GroupMembers';
import { formatCurrency } from '@/lib/utils'
import GroupFund from './GroupFund';

const GroupDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSettingsEditor, setShowSettingsEditor] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [memberModalRef, setMemberModalRef] = useState(null);
  const { id } = useParams();

  

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  

  // State for filters and views
  const [activeTab, setActiveTab] = useState('overview');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

   useEffect(() => {
    if (userInfo && id) {
      dispatch(getGroupDetails(id));
      dispatch(getJoinRequests(id));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, id, refreshTrigger]);

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading, error, group } = groupDetails;

  const groupReviewJoinRequest = useSelector((state) => state.groupReviewJoinRequest);
  const { loading: joinRequestloading, error: joinRequesterror, joinRequest, success: joinRequestsuccess } = groupReviewJoinRequest;
  
  const { joinRequests = [], loading: loadingRequests, error: errorRequests } = useSelector(
      (state) => state.groupGetJoinRequests || {}
    );

  console.log("Test approval", joinRequestloading, joinRequesterror, joinRequest, joinRequestsuccess)

  // Check if current user is admin
  const isAdmin = group?.admins?.some(admin => admin._id === userInfo?.user?._id);
  const isOwner = group?.createdBy?._id === userInfo?.user?._id; 
  const currentMember = group?.members?.find(member => member.user._id === userInfo?.user?._id);

  // Function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Updated modal handlers
  const handleModalClose = () => {
    setShowMembersModal(false);
    // Trigger refresh by updating the state
    triggerRefresh();
  };

  const handleMemberAdded = () => {
    setShowMembersModal(false);
    triggerRefresh();
  };


  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get group type badge
  const getGroupTypeBadge = (type) => {
    const typeConfig = {
      chama: { color: 'bg-blue-100 text-blue-800', icon: Users },
      investment: { color: 'bg-green-100 text-green-800', icon: TrendingUp },
      savings: { color: 'bg-purple-100 text-purple-800', icon: DollarSign },
      default: { color: 'bg-gray-100 text-gray-800', icon: Building2 }
    };
    
    const config = typeConfig[type] || typeConfig.default;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Other'}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      suspended: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Activity };
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </Badge>
    );
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const methodIcons = {
      wallet: Wallet,
      cash: Banknote,
      mobile_money: Smartphone,
      bank_transfer: CreditCard,
      default: DollarSign
    };
    
    return methodIcons[method] || methodIcons.default;
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!group) return {};
    
    const totalBalance = (group.savingsAccount?.balance || 0) + 
                        (group.loanAccount?.balance || 0) + 
                        (group.interestEarnedAccount?.balance || 0);
    
    const totalContributions = group.members?.reduce((sum, member) => 
      sum + (member.contributions?.total || 0), 0) || 0;
    
    const activeMembers = group.members?.filter(m => m.status === 'active').length || 0;
    
    const recentTransactions = group.transactions?.filter(t => {
      const transactionDate = new Date(t.date);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return transactionDate >= thirtyDaysAgo;
    }).length || 0;

    return {
      totalBalance,
      savingsBalance: group.savingsAccount?.balance || 0,
      loanBalance: group.loanAccount?.balance || 0,
      interestEarned: group.interestEarnedAccount?.balance || 0,
      finesBalance: group.finesAccount?.balance || 0,
      totalContributions,
      activeMembers,
      totalMembers: group.members?.length || 0,
      recentTransactions,
      totalTransactions: group.transactions?.length || 0,
      avgContribution: activeMembers ? totalContributions / activeMembers : 0
    };
  };

  const stats = calculateStats();

  // Prepare chart data
  const prepareAccountBalanceData = () => {
    if (!group) return [];
    
    return [
      { name: 'Savings', value: group.savingsAccount?.balance || 0, color: '#10b981' },
      { name: 'Loans', value: group.loanAccount?.balance || 0, color: '#f59e0b' },
      { name: 'Interest', value: group.interestEarnedAccount?.balance || 0, color: '#3b82f6' },
      { name: 'Fines', value: group.finesAccount?.balance || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const prepareContributionTrendData = () => {
    if (!group?.transactions) return [];
    
    const contributionTransactions = group.transactions
      .filter(t => t.type === 'contribution')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let runningTotal = 0;
    return contributionTransactions.map(transaction => {
      runningTotal += transaction.amount;
      return {
        date: formatDate(transaction.date),
        amount: runningTotal,
        transaction: transaction.amount
      };
    });
  };

  const prepareMemberContributionData = () => {
    if (!group?.members) return [];
    
    return group?.members
      .map(member => ({
        name: member?.user?.name.length > 15 ? 
          member?.user?.name.substring(0, 15) + '...' : 
          member?.user?.name,
        contributions: member?.contributions?.total || 0
      }))
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 8);
  };

  // Filter transactions
  const getFilteredTransactions = () => {
    if (!group?.transactions) return [];
    
    return group.transactions
      .filter(transaction => {
        if (transactionFilter === 'all') return true;
        return transaction.type === transactionFilter;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Filter members
  const getFilteredMembers = () => {
    if (!group?.members) return [];
    
    return group.members.filter(member => {
      if (memberFilter === 'all') return true;
      return member.status === memberFilter;
    });
  };

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}
          <p className="text-xs text-muted-foreground">Across all accounts</p></div>

          <Button onClick={() => setShowFundModal(true)} className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="h-4 w-4 mr-2" /> Add Funds
          </Button>
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Account</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.savingsBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Main savings pool
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeMembers}</div>
          <p className="text-xs text-muted-foreground">
            Out of {stats.totalMembers} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalContributions)}</div>
          <p className="text-xs text-muted-foreground">
            From all members
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // Overview Tab Component
  const OverviewTab = () => {
    const accountData = prepareAccountBalanceData();
    const trendData = prepareContributionTrendData();

    return (
      <div className="space-y-6">
        <StatsCards />
        
        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Account Balances
              </CardTitle>
            </CardHeader>
            <CardContent>
              {accountData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={accountData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {accountData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No balance data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Contribution Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No contribution data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Group Settings Overview */}
        <Card>
          <div></div>
          <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Group Settings Overview
                </CardTitle>

                {/* Edit button - now opens complete settings editor */}
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettingsEditor(true)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                )}
              </div>
            </CardHeader>

            

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Contribution Schedule
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{group?.settings?.contributionSchedule?.frequency || 'Not set'}</p>
                  <p>{formatCurrency(group?.settings?.contributionSchedule?.amount)} due on day {group?.settings?.contributionSchedule?.dueDay}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" />
                  Loan Settings
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Max multiplier: {group?.settings?.loanSettings?.maxLoanMultiplier}x</p>
                  <p>Interest rate: {group?.settings?.loanSettings?.interestRate}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" />
                  Meeting Schedule
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{group?.settings?.meetingSchedule?.frequency || 'Not set'}</p>
                  <p>Day {group?.settings?.meetingSchedule?.dayOfMonth} at {group?.settings?.meetingSchedule?.time}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Members Tab Component
  const MembersTab = () => {
    const filteredMembers = getFilteredMembers();
    const contributionData = prepareMemberContributionData();

    return (
      <div className="space-y-6">
        {/* Member Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeMembers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Average Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgContribution)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Member Contributions Chart */}
        {contributionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Member Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="contributions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Members ({filteredMembers.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={memberFilter} onValueChange={setMemberFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              {isAdmin && (
                  <Button 
                    size="sm" 
                    onClick={() => memberModalRef?.openAddModal?.()}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers?.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {member.user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.user?.name}</div>
                      <div className="text-sm text-muted-foreground">{member.user?.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined {formatDate(member.joinedDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(member.status)}
                        {member.role === 'admin' && (
                          <Badge className="bg-purple-100 text-purple-800 border-0">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(member.contributions?.total || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.contributions?.history?.length || 0} contributions
                      </div>
                    </div>
                    
                    {/* Add action buttons for admins */}
                    {(isAdmin || isOwner) && member.user?._id !== userInfo?.user?._id && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => memberModalRef?.openEditModal?.(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => memberModalRef?.openRemoveDialog?.(member)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Leave button for current user */}
                    {member.user?._id === userInfo?.user?._id && !isOwner && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => memberModalRef?.openLeaveDialog?.()}
                        className="text-destructive hover:text-destructive"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
      </div>
    );
  };

  // Transactions Tab Component
  const TransactionsTab = () => {
    const filteredTransactions = getFilteredTransactions();

    return (
      <div className="space-y-6">
        {/* Transaction Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentTransactions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(group?.transactions?.reduce((sum, t) => sum + t.amount, 0) || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Average Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalTransactions ? 
                  (group?.transactions?.reduce((sum, t) => sum + t.amount, 0) || 0) / stats.totalTransactions : 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="contribution">Contributions</SelectItem>
                  <SelectItem value="loan">Loans</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="fine">Fines</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Receipt className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No transactions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const PaymentIcon = getPaymentMethodIcon(transaction.method);
                      const member = group.members.find(m => m.user?._id === transaction.member);
                      
                      return (
                        <TableRow key={transaction._id}>
                          <TableCell className="font-medium">
                            {formatDateTime(transaction.date)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {member?.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{member?.user?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm capitalize">
                                {transaction.method?.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {transaction.reference && (
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Reference: {transaction.reference}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const JoinRequestsTab = () => {
    const [decisionLoading, setDecisionLoading] = useState(null);

    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    };

    const handleDecision = async (requestId, decision) => {
      setDecisionLoading(requestId);
      await dispatch(reviewJoinRequest(group._id, requestId, decision));
      triggerRefresh();
      setDecisionLoading(null);
    };

    console.log('Join Requests type shii', joinRequests)

    if (joinRequests?.joinRequests?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Join Requests</h3>
          <p className="text-gray-500 text-center max-w-md">
            When people request to join your group, their requests will appear here for your review.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Join Requests</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {joinRequests?.joinRequests?.length} pending
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {joinRequests?.joinRequests?.map((req) => (
            <div
              key={req._id}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.requestedBy.username}`}
                      alt={req.requestedBy.name}
                      className="w-12 h-12 rounded-full ring-2 ring-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {req.requestedBy.name}
                    </h3>
                    <p className="text-gray-500 text-sm">@{req.requestedBy.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(req.requestedAt)}
                </div>
              </div>

              {/* Message */}
              {req.message ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Request Message</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-200">
                    <p className="text-gray-700 leading-relaxed">{req.message}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Request Message</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-200">
                    <p className="text-gray-500 italic">No message provided</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  disabled={decisionLoading === req.requestedBy._id}
                  onClick={() => handleDecision(req.requestedBy._id, 'reject')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                >
                  {decisionLoading === req.requestedBy._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
                
                <button
                  disabled={decisionLoading === req.requestedBy._id}
                  onClick={() => handleDecision(req.requestedBy._id, 'approve')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-150"
                >
                  {decisionLoading === req.requestedBy._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderContent = () => {
    if (activeTab === 'members') return <MembersTab />;
    if (activeTab === 'transactions') return <TransactionsTab />;
    if (activeTab === 'requests') return <JoinRequestsTab />;
    return <OverviewTab />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Group not found</h3>
        <p className="text-sm text-muted-foreground">Please check the link or try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="space-x-2 flex items-center">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {getGroupTypeBadge(group.groupType)}
          {getStatusBadge(group.isActive ? 'active' : 'suspended')}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="requests">Join Requests</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <div>
          {renderContent()}
        </div>
      </Tabs>
      {/* Group Members Modal */}
      <GroupMembers
        ref={setMemberModalRef}
        group={group}
        isOpen={showMembersModal}
        onClose={handleModalClose}
        onMemberAdded={() => {
          setShowMembersModal(false);
        }}
        currentUser={userInfo?.user}
        isAdmin={isAdmin}
        isOwner={isOwner}
       />
          {/* Group Settings Editor Modal */}
            <GroupSettingsEditor
              group={group}
              isOpen={showSettingsEditor}
              onClose={() => setShowSettingsEditor(false)}
              onSave={(updatedSettings) => {
                dispatch(getGroupDetails(group._id));
              }}
            />

            <GroupFund
              isOpen={showFundModal}
              onClose={() => setShowFundModal(false)}
              groupId={group._id}
              currentUser={userInfo?.user}
              isAdmin={isAdmin}
              isTreasurer={currentMember?.role === 'treasurer'}
            />
    </div>
  );
};

export default GroupDetails;
