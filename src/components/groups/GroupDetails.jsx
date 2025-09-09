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
  Loader2,
  LayoutDashboard,
  UserSquare2,
  NotebookPen,    
  UserRoundCog,
  Handshake,
  PiggyBank
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
import { getGroupLoans } from '@/actions/loanActions';
import GroupSettingsEditor from './GroupSettingsEditor';
import GroupMembers from './GroupMembers';
import { formatCurrency } from '@/lib/utils'
import GroupFund from './GroupFund';
import ChairPage from './ChairPage';
import SecretaryPage from './SecretaryPage';
import TreasurerPage from './TreasurerPage';
import GroupTransferOwnership from './GroupTransferOwnership';
import GroupLoans from './GroupLoans';


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
      dispatch(getGroupLoans(id));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, id, refreshTrigger]);

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading, error, group } = groupDetails;

  const groupReviewJoinRequest = useSelector((state) => state.groupReviewJoinRequest);
  const { loading: joinRequestloading, error: joinRequesterror, joinRequest, success: joinRequestsuccess } = groupReviewJoinRequest;

  const groupLoansList = useSelector((state) => state.groupLoansList);
  const { loading: loansLoading, error: loansError, loans } = groupLoansList;
  
  const { joinRequests = [], loading: loadingRequests, error: errorRequests } = useSelector(
      (state) => state.groupGetJoinRequests || {}
    );

  // console.log("Test approval", joinRequestloading, joinRequesterror, joinRequest, joinRequestsuccess)
  console.log("Group details", group)

  // Check if current user is admin
  const isAdmin = group?.admins?.some(admin => admin._id === userInfo?._id);
  const isOwner = group?.createdBy?._id === userInfo?._id; 
  const currentMember = group?.members?.find(member => member.user?._id === userInfo?._id);
  const Role = currentMember?.role;

  const myloans = loans?.filter(
        (loan) => loan?.loanType === 'personal' && loan?.user?._id === userInfo?._id && (loan?.status === 'disbursed' || loan?.status === 'active')
    );



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
    
    // Calculate total balance from all account types
    const totalBalance = (group.groupAccount?.balance || 0) + 
                        (group.savingsAccount?.balance || 0) + 
                        (group.loanAccount?.balance || 0) + 
                        (group.interestEarnedAccount?.balance || 0) +
                        (group.finesAccount?.balance || 0);
    
    // Calculate total contributions from all members
    const totalContributions = group.members?.reduce((sum, member) => 
      sum + (member.contributions?.total || 0), 0) || 0;
    
    // Count active members (filter out members with null user)
    const activeMembers = group.members?.filter(m => 
      m.status === 'active' && m.user !== null
    ).length || 0;
    
    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = group.transactions?.filter(t => {
      if (!t.date) return false;
      const transactionDate = new Date(t.date);
      return transactionDate >= thirtyDaysAgo && transactionDate <= new Date();
    }).length || 0;
    
    // Calculate contribution statistics
    const memberContributions = group.members?.map(m => m.contributions?.total || 0) || [];
    const contributingMembers = group.members?.filter(m => 
      (m.contributions?.total || 0) > 0
    ).length || 0;
    
    // Calculate average contribution per contributing member
    const avgContributionPerContributor = contributingMembers > 0 
      ? totalContributions / contributingMembers 
      : 0;
    
    // Calculate average contribution per active member
    const avgContributionPerActive = activeMembers > 0 
      ? totalContributions / activeMembers 
      : 0;
    
    // Calculate recent activity metrics
    const recentContributions = group.transactions?.filter(t => {
      if (!t.date || t.type !== 'contribution') return false;
      const transactionDate = new Date(t.date);
      return transactionDate >= thirtyDaysAgo;
    }).length || 0;
    
    // Calculate loan statistics
    const loanTransactions = group.transactions?.filter(t => t.type === 'loan') || [];
    const activeLoanAmount = group.loanAccount?.balance || 0;
    
    // Get member participation rate
    const participationRate = group.members?.length > 0 
      ? (contributingMembers / group.members.length) * 100 
      : 0;
    
    return {
      // Account balances
      totalBalance: Math.round(totalBalance * 100) / 100, // Round to 2 decimal places
      groupBalance: group.groupAccount?.balance || 0,
      savingsBalance: group.savingsAccount?.balance || 0,
      loanBalance: group.loanAccount?.balance || 0,
      interestEarned: group.interestEarnedAccount?.balance || 0,
      finesBalance: group.finesAccount?.balance || 0,
      
      // Member statistics
      totalMembers: group.members?.length || 0,
      activeMembers,
      contributingMembers,
      participationRate: Math.round(participationRate * 10) / 10, // Round to 1 decimal place
      
      // Contribution statistics
      totalContributions: Math.round(totalContributions * 100) / 100,
      avgContributionPerActive: Math.round(avgContributionPerActive * 100) / 100,
      avgContributionPerContributor: Math.round(avgContributionPerContributor * 100) / 100,
      
      // Transaction statistics
      totalTransactions: group.transactions?.length || 0,
      recentTransactions,
      recentContributions,
      
      // Additional metrics
      activeLoanAmount,
      totalLoanTransactions: loanTransactions.length,
      
      // Group settings info
      monthlyContributionTarget: group.settings?.contributionSchedule?.amount || 0,
      contributionFrequency: group.settings?.contributionSchedule?.frequency || 'unknown',
      
      // Calculated health metrics
      avgBalancePerMember: activeMembers > 0 ? Math.round((totalBalance / activeMembers) * 100) / 100 : 0,
      contributionCompletionRate: group.settings?.contributionSchedule?.amount > 0 
        ? Math.round((avgContributionPerActive / group.settings.contributionSchedule.amount) * 1000) / 10 
        : 0
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

        {/* Total Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
              <p className="text-xs text-muted-foreground">Across all accounts</p>
              <Button
                onClick={() => setShowFundModal(true)}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Funds
              </Button>
            </div>
            
          </CardContent>
        </Card>

        {/* Savings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.savingsBalance)}</div>
            <p className="text-xs text-muted-foreground">Main savings pool</p>
          </CardContent>
        </Card>

        {/* Loans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loan Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.activeLoanAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalLoanTransactions} loan transactions
            </p>
          </CardContent>
        </Card>

        {/* Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats.totalMembers} total • {stats.participationRate}% contributing
            </p>
          </CardContent>
        </Card>

        {/* Contributions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalContributions)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.avgContributionPerActive)} per active member
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentContributions} contributions in last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Contribution Target */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribution Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyContributionTarget)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.contributionFrequency} • {stats.contributionCompletionRate}% complete
            </p>
          </CardContent>
        </Card>

        {/* Avg Balance Per Member */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Balance / Member</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgBalancePerMember)}</div>
            <p className="text-xs text-muted-foreground">Based on active members</p>
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
        {/* Group Settings and Type-Specific Information */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* General Group Settings */}
          <Card>
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
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
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

          {/* Type-Specific Information */}
          {group?.groupType === 'chama' && group?.chamaData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Chama Cycle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Cycle Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4" />
                        Current Cycle
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        Cycle {group.chamaData.currentCycle}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4" />
                        Next Recipient
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(() => {
                          const nextRecipient = group?.chamaData?.payoutOrder?.find(p => !p.hasPaidOut);
                          const member = group?.members?.find(m => m.user?._id === nextRecipient?.memberId);
                          return member ? member.user.name : 'All cycles completed';
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Cycle Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Settings className="h-4 w-4" />
                      Cycle Settings
                    </div>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Shuffle Order:</span>
                        <span>{group.chamaData.cycleSettings?.shuffleOrder ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Payouts:</span>
                        <span>{group.chamaData.cycleSettings?.allowEmergencyPayouts ? 'Allowed' : 'Not Allowed'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Penalty Amount:</span>
                        <span>{(group.chamaData.cycleSettings?.penaltyAmount * 100) || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Payout Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <PieChart className="h-4 w-4" />
                      Payout Progress
                    </div>
                    <div className="space-y-2">
                      {group?.chamaData?.payoutOrder?.map((payout, index) => {
                        const member = group?.members?.find(m => m.user?._id === payout.memberId);
                        return (
                          <div key={payout.memberId} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${payout.hasPaidOut ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-sm">{member?.user?.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payout.hasPaidOut ? formatCurrency(payout.amount || 0) : 'Pending'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {group?.groupType === 'sacco' && group?.saccoData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  SACCO Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <PieChart className="h-4 w-4" />
                        Share Capital
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Total Shares: {group.saccoData.shareCapitalAccount?.totalShares || 0}</p>
                        <p>Share Value: {formatCurrency(group.saccoData.shareCapitalAccount?.shareValue || 0)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Percent className="h-4 w-4" />
                        Dividends
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Last Rate: {group.saccoData.dividendAccount?.lastDividendRate || 0}%</p>
                        <p>Balance: {formatCurrency(group.saccoData.dividendAccount?.balance || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {group?.groupType === 'table_banking' && group?.tableBankingData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HandCoins className="h-5 w-5" />
                  Table Banking Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Shield className="h-4 w-4" />
                        Social Rules
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Attendance Requirement: {(group.tableBankingData.socialRules?.attendanceRequirement * 100) || 80}%</p>
                        <p>Absence Penalty: {formatCurrency(group.tableBankingData.socialRules?.penaltyForAbsence || 0)}</p>
                        <p>Max Absences: {group.tableBankingData.socialRules?.maxConsecutiveAbsences || 2}</p>
                        <p>Late Payment Penalty: {(group.tableBankingData.socialRules?.latePaymentPenalty * 100) || 5}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {group?.groupType === 'investment_club' && group?.investmentClubData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Investment Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4" />
                        Risk & Returns
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Risk Tolerance: {group.investmentClubData.investmentStrategy?.riskTolerance || 'Moderate'}</p>
                        <p>Annual Target: {group.investmentClubData.investmentStrategy?.targetReturns?.annualTarget || 12}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <PieChart className="h-4 w-4" />
                        Diversification
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Max Single Investment: {(group.investmentClubData.investmentStrategy?.diversificationRules?.maxSingleInvestment * 100) || 25}%</p>
                        <p>Min Investment Types: {group.investmentClubData.investmentStrategy?.diversificationRules?.minInvestmentTypes || 3}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                <div key={member._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg">
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
                    {(isAdmin || isOwner) && member.user?._id !== userInfo?._id && (
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
                    {member.user?._id === userInfo?._id && !isOwner && (
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
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-md border">
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
    if (activeTab === 'chair') return <ChairPage group={group} />;
    if (activeTab === 'secretary') return <SecretaryPage group={group} />;
    if (activeTab === 'treasurer') return <TreasurerPage group={group} />;
    if (activeTab === 'ownership') return <GroupTransferOwnership group={group} />;
    if (activeTab === 'loans') return <GroupLoans loans={loans} userInfo={userInfo} Role={Role} />;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button className="hidden md:block" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div className="space-x-2 flex items-center">
          <h1 className="text-muted-foreground">{group.name}</h1>
          {getGroupTypeBadge(group.groupType)}
          {getStatusBadge(group.isActive ? 'active' : 'suspended')}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-5 sm:flex sm:justify-start sm:space-x-2 rounded-xl bg-muted shadow-sm p-1">
          <TabsTrigger value="overview" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <Users className="h-5 w-5" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <UserPlus className="h-5 w-5" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <FileText className="h-5 w-5" />
            <span className="hidden sm:inline">Transactions</span>
          </TabsTrigger>
          {Role === "chair" &&(
          <TabsTrigger value="chair" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <UserSquare2 className="h-5 w-5" />
            <span className="hidden sm:inline">Chair</span>
          </TabsTrigger>
          )}
          {Role == "secretary" &&(
          <TabsTrigger value="secretary" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
             <NotebookPen className="h-5 w-5" />
            <span className="hidden sm:inline">Secretary</span>
          </TabsTrigger>
          )}
          {Role == "treasurer" &&(
          <TabsTrigger value="treasurer" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <Wallet className="h-5 w-5" />
            <span className="hidden sm:inline">Treasurer</span>
          </TabsTrigger>
          )}
          {Role == "admin" &&(
          <TabsTrigger value="ownership" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <UserRoundCog className="h-5 w-5" />
            <span className="hidden sm:inline">Transfer Ownership</span>
          </TabsTrigger>
          )}
           <TabsTrigger value="loans" className="w-full flex flex-col items-center sm:flex-row sm:gap-2 sm:justify-center">
            <Handshake className="h-5 w-5" />
            <span className="hidden sm:inline">Group Loans</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
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
        currentUser={userInfo}
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
              scenario="USER_CONTRIBUTION" 
              defaultTab="wallet"
              title="Make a Contribution"
              isOpen={showFundModal}
              onClose={() => setShowFundModal(false)}
              groupId={group._id}
              currentUser={userInfo}
              isAdmin={isAdmin}
              myloans={myloans}
              isTreasurer={currentMember?.role === 'treasurer'}
            />
    </div>
  );
};

export default GroupDetails;
