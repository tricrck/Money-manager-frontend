import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Search,
  ArrowUpRight,
  Timer,
  Bell,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LinkContainer } from 'react-router-bootstrap';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getUserDetails } from '../actions/userActions';
import { listMyGroups } from '../actions/groupActions';
import { getUserLoans } from '../actions/loanActions';
import { getWalletDetails } from '../actions/walletActions';
import { getUserEventsAction } from '../actions/eventActions';
import Loader from './Loader';

// Optimized components with better styling
const QuickStatCard = React.memo(
  ({ title, value, subtitle, icon: Icon, trend, linkTo, onClick }) => {
    const content = (
      <Card
        className="
          group relative overflow-hidden border shadow-sm 
          hover:shadow-md transition-all duration-300 cursor-pointer 
          transform hover:-translate-y-1 
          bg-card text-card-foreground
        "
      >
        {/* subtle theme overlay */}
        <div className="absolute inset-0 bg-muted/5"></div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div
              className="
                p-3 rounded-xl bg-muted/20 backdrop-blur-sm 
                group-hover:bg-muted/30 transition-colors
              "
            >
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            {trend && (
              <div
                className="
                  flex items-center gap-1 rounded-full px-3 py-1 
                  bg-muted/20 backdrop-blur-sm
                "
              >
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium">{trend}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );

    if (linkTo) {
      return <LinkContainer to={linkTo}>{content}</LinkContainer>;
    }

    return onClick ? <div onClick={onClick}>{content}</div> : content;
  }
);

const GroupCard = React.memo(({ group }) => (
  <Card
    className="
      group hover:shadow-xl transition-all duration-300 
      border shadow-sm hover:-translate-y-1 
      bg-card text-card-foreground
    "
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle
            className="
              text-lg font-bold transition-colors
              group-hover:text-primary
            "
          >
            {group.name}
          </CardTitle>

          <Badge
            variant={group.status === "active" ? "default" : "secondary"}
            className={`
              ${group.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : ""}
            `}
          >
            {group.status}
          </Badge>
        </div>

        <div
          className="
            p-2 rounded-lg transition-colors
            bg-muted group-hover:bg-muted/70
          "
        >
          <Building2 className="w-5 h-5 text-primary" />
        </div>
      </div>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg p-3 text-center bg-muted/40">
          <Users className="w-4 h-4 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold">{group.members?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Members</div>
        </div>

        <div className="rounded-lg p-3 text-center bg-muted/40">
          <Wallet className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold">
            {group.savingsAccount?.balance
              ? `${(group.savingsAccount.balance / 1000).toFixed(0)}K`
              : "0"}
          </div>
          <div className="text-xs text-muted-foreground">Balance</div>
        </div>
      </div>

      <LinkContainer to={`/groups/${group._id}`}>
        <Button
          variant="outline"
          className="
            w-full transition-all
            group-hover:bg-muted/50 
            group-hover:border-muted 
            group-hover:text-primary
          "
        >
          View Group
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </LinkContainer>
    </CardContent>
  </Card>
));



const EventCard = React.memo(({ event }) => {
  const dueDate = new Date(event.dueDate);
  const now = new Date();
  const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0;
  const isDueToday = diffDays === 0;
  const isDueTomorrow = diffDays === 1;

  let containerClasses = "bg-card border text-card-foreground";
  let badgeVariant = "secondary"; // <-- ✅ just plain JS
  let Icon = Clock;

  if (isOverdue) {
    containerClasses = "bg-destructive/10 border-destructive text-destructive";
    badgeVariant = "destructive";
    Icon = AlertCircle;
  } else if (isDueToday || isDueTomorrow) {
    containerClasses = "bg-warning/10 border-warning text-warning-foreground";
    badgeVariant = "outline";
    Icon = Timer;
  } else if (event.type === "loan_payment") {
    containerClasses = "border-primary text-primary";
    badgeVariant = "default";
    Icon = CreditCard;
  }

  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return numAmount > 1000
      ? `${(numAmount / 1000).toFixed(1)}K`
      : numAmount.toFixed(0);
  };

  const getAmountFromDescription = (description) => {
    const match = description.match(/Amount: ([\d.]+)/);
    return match ? formatAmount(match[1]) : "";
  };

  const amount = getAmountFromDescription(event.description);

  const getTimeText = () => {
    if (isOverdue) return `${Math.abs(diffDays)} days overdue`;
    if (isDueToday) return "Due today";
    if (isDueTomorrow) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${containerClasses}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon Bubble */}
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm">{event.title}</h4>
            {amount && (
              <span className="text-sm font-bold">KES {amount}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant}>{getTimeText()}</Badge>
            <span className="text-xs text-muted-foreground truncate">
              {event.loan?.principalAmount
                ? `Loan: KES ${event.loan.principalAmount}`
                : event.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});


const TransactionItem = React.memo(({ transaction }) => (
  <div
    className="
      flex items-center gap-4 p-4 
      transition-colors rounded-lg
      hover:bg-muted/50
    "
  >
    <div
      className={`
        p-3 rounded-full
        ${
          transaction.type === "deposit"
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : "bg-red-500/10 text-red-600 dark:text-red-400"
        }
      `}
    >
      <TrendingUp
        className={`h-5 w-5 ${
          transaction.type === "withdrawal" ? "rotate-180" : ""
        }`}
      />
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-semibold text-foreground truncate">
        {transaction.description}
      </p>
      <p className="text-sm text-muted-foreground">
        {new Date(transaction.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>

    <div className="text-right">
      <div
        className={`
          text-lg font-bold
          ${
            transaction.type === "deposit"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        `}
      >
        {transaction.type === "deposit" ? "+" : "-"}KES{" "}
        {(transaction.amount || 0).toLocaleString()}
      </div>
    </div>
  </div>
));


const DashboardContent = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');

  // Redux selectors
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading: walletLoading, wallet } = walletDetails;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: myGroupsLoading, myGroups: activeGroups = [] } = myGroups;

  const userLoansList = useSelector((state) => state.userLoansList);
  const { loading: userLoansLoading, loans: userLoans = [] } = userLoansList;

  const eventsState = useSelector((state) => state.events);
  const { loading: eventsLoading, events = [] } = eventsState;

  // Optimized calculations using events data
  const dashboardStats = useMemo(() => {
    const activeLoans = userLoans.filter(loan => loan.status === 'active');
    const pendingEvents = events.filter(event => event.status === 'pending');
    const overdueEvents = events.filter(event => {
      const dueDate = new Date(event.dueDate);
      return dueDate < new Date() && event.status === 'pending';
    });

    // Calculate total loan amounts from events
    const totalUpcomingPayments = pendingEvents
      .filter(event => event.type === 'loan_payment')
      .reduce((sum, event) => {
        const match = event.description.match(/Amount: ([\d.]+)/);
        return sum + (match ? parseFloat(match[1]) : 0);
      }, 0);

    return {
      walletBalance: wallet?.balance || 0,
      activeGroups: activeGroups.length,
      activeLoans: activeLoans.length,
      pendingPayments: pendingEvents.length,
      overduePayments: overdueEvents.length,
      upcomingPaymentAmount: totalUpcomingPayments,
      monthlyDeposits: wallet?.transactions?.filter(tx => {
        const txDate = new Date(tx.date);
        const now = new Date();
        return tx.type === 'deposit' && 
               txDate.getMonth() === now.getMonth() && 
               txDate.getFullYear() === now.getFullYear();
      }).reduce((sum, tx) => sum + tx.amount, 0) || 0
    };
  }, [wallet, activeGroups, userLoans, events]);

  // Get upcoming events (sorted by due date)
  const upcomingEvents = useMemo(() => {
    return events
      .filter(event => event.status === 'pending')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6);
  }, [events]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return wallet?.transactions?.slice(0, 5) || [];
  }, [wallet?.transactions]);

  useEffect(() => {
    if (userInfo?._id) {
      const loadEssentialData = async () => {
        try {
          await Promise.all([
            dispatch(getUserDetails(userInfo._id)),
            dispatch(getWalletDetails(userInfo._id)),
            dispatch(listMyGroups()),
            dispatch(getUserLoans(userInfo._id)),
            dispatch(getUserEventsAction())
          ]);
        } catch (error) {
          console.error('Dashboard load error:', error);
        }
      };

      loadEssentialData();
    }
  }, [dispatch, userInfo]);

  

  if (walletLoading || myGroupsLoading || userLoansLoading || eventsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl">
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userInfo?.name?.split(' ')[0]}
              </h1>
              <p className="text-lg opacity-90">
                Manage your groups and track your financial goals
              </p>
              {dashboardStats.overduePayments > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {dashboardStats.overduePayments} overdue payment{dashboardStats.overduePayments !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-blue-200 text-sm">Today</p>
                <p className="text-xl font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard
            title="Wallet Balance"
            value={`KES ${(dashboardStats.walletBalance / 1000).toFixed(1)}K`}
            subtitle={`+KES ${(dashboardStats.monthlyDeposits / 1000).toFixed(1)}K this month`}
            icon={Wallet}
            trend={dashboardStats.monthlyDeposits > 0 ? `+${((dashboardStats.monthlyDeposits / 1000).toFixed(1))}K this month` : null}
            linkTo="/wallet"
          />
          <QuickStatCard
            title="Active Groups"
            value={dashboardStats.activeGroups}
            subtitle="Groups you're part of"
            icon={Users}
            linkTo="/groups"
          />
          <QuickStatCard
            title="Active Loans"
            value={dashboardStats.activeLoans}
            subtitle="Loans in progress"
            icon={CreditCard}
            linkTo="/loans"
          />
          <QuickStatCard
            title="Pending Payments"
            value={dashboardStats.pendingPayments}
            subtitle={`KES ${(dashboardStats.upcomingPaymentAmount / 1000).toFixed(1)}K total`}
            icon={Clock}
            trend={dashboardStats.overduePayments > 0 ? `${dashboardStats.overduePayments} overdue` : null}
            
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList
            className="
              grid w-full grid-cols-3 h-12 p-1 rounded-xl
              bg-muted
            "
          >
            <TabsTrigger
              value="overview"
              className="
                rounded-lg font-medium
                data-[state=active]:bg-background 
                data-[state=active]:text-foreground
                data-[state=active]:shadow-sm
                text-muted-foreground
              "
            >
              <Zap className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="groups"
              className="
                rounded-lg font-medium
                data-[state=active]:bg-background 
                data-[state=active]:text-foreground
                data-[state=active]:shadow-sm
                text-muted-foreground
              "
            >
              <Building2 className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>

            <TabsTrigger
              value="activity"
              className="
                rounded-lg font-medium
                data-[state=active]:bg-background 
                data-[state=active]:text-foreground
                data-[state=active]:shadow-sm
                text-muted-foreground
              "
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Upcoming Events */}
              <div className="lg:col-span-3">
                <Card className="border shadow-sm">
                  <CardHeader
                    className="
                      flex flex-row items-center justify-between
                      bg-muted/50 dark:bg-muted/30
                      rounded-t-lg
                    "
                  >
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Upcoming Events
                    </CardTitle>
                    <Badge variant="secondary">
                      {upcomingEvents.length} pending
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event) => (
                          <EventCard key={event._id} event={event} />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-muted-foreground">No upcoming events</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Groups</h2>
              <LinkContainer to="/groups/join">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Join Group
              </Button>
              </LinkContainer>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeGroups.length > 0 ? (
                activeGroups.map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No groups yet</h3>
                  <p className="text-gray-500 mb-6">Join or create your first group to get started with collaborative savings</p>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Group
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <TransactionItem key={`${transaction._id}-${index}`} transaction={transaction} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions yet</h3>
                      <p className="text-gray-500">Your transaction history will appear here</p>
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