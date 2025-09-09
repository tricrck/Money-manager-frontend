// React hooks
import React, { useState, useEffect } from 'react';

// Redux (if you're using it)
import { useDispatch, useSelector } from 'react-redux';

// Navigation (React Router)
import { useNavigate } from 'react-router-dom';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons (from lucide-react)
import { 
  RefreshCw, 
  Download, 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Settings, 
  Filter, 
  MoreHorizontal, 
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Your existing imports
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
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { getAdminAnalytics, getAdminTransactionReport, getRealtimeMetrics } from '@/actions/reportActions';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
);



const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const userStatement = useSelector(state => state.reports.userStatement);
  const { data: userStatementData, loading: userStatementLoading, error: userStatementError } = userStatement;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const {
    data: transactionReport,
    loading: adminTransactionsLoading,
    error: adminTransactionsError
  } = useSelector(state => state.reports.adminTransactions);

  const {
    data: analyticsData,
    loading: adminAnalyticsLoading,
    error: adminAnalyticsError
  } = useSelector(state => state.reports.adminAnalytics);

  const {
    data: realtimeMetrics,
    loading: realtimeMetricsLoading,
    error: realtimeMetricsError
  } = useSelector(state => state.reports.realtimeMetrics);


  // Chart initialization
  useEffect(() => {
  let hourlyChart = null;
  let paymentChart = null;

  if (!userInfo) {
     navigate('/login');
     return;
    }
  
  if (userInfo?.role === 'Admin') {
    dispatch(getAdminTransactionReport());
    dispatch(getAdminAnalytics());
    dispatch(getRealtimeMetrics()); 
    }
   

  // Destroy existing charts first
  const hourlyCanvas = document.getElementById('hourlyChart');
  const paymentCanvas = document.getElementById('paymentChart');
  
  if (hourlyCanvas) {
    const existingHourlyChart = Chart.getChart(hourlyCanvas);
    if (existingHourlyChart) {
      existingHourlyChart.destroy();
    }
  }
  
  if (paymentCanvas) {
    const existingPaymentChart = Chart.getChart(paymentCanvas);
    if (existingPaymentChart) {
      existingPaymentChart.destroy();
    }
  }

  // Create Hourly Pattern Chart
  const hourlyCtx = hourlyCanvas?.getContext('2d');
  if (hourlyCtx) {
    hourlyChart = new Chart(hourlyCtx, {
      type: 'line',
      data: {
        labels: analyticsData?.hourlyPattern.map(h => `${h._id}:00`),
        datasets: [{
          label: 'Transactions',
          data: analyticsData?.hourlyPattern.map(h => h.count),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'category'
          },
          y: {
            type: 'linear',
            beginAtZero: true
          }
        }
      }
    });
  }

  // Create Payment Method Chart
  const paymentCtx = paymentCanvas?.getContext('2d');
  if (paymentCtx) {
    paymentChart = new Chart(paymentCtx, {
      type: 'doughnut',
      data: {
        labels: analyticsData?.paymentMethodPerformance.map(p => p._id),
        datasets: [{
          data: analyticsData?.paymentMethodPerformance.map(p => p.totalTransactions),
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  // Cleanup function
  return () => {
    if (hourlyChart) {
      hourlyChart.destroy();
    }
    if (paymentChart) {
      paymentChart.destroy();
    }
  };
}, [analyticsData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      // In real implementation, call your API functions here
      // await dispatch(getAdminAnalytics());
      // await dispatch(getAdminTransactionReport());
      // await dispatch(getRealtimeMetrics());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and analyze your transaction performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Today's Transactions</p>
                <p className="text-3xl font-bold">{realtimeMetrics?.transactionMetrics.totalTransactionsToday}</p>
              </div>
              <CreditCard className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Today's Amount</p>
                <p className="text-3xl font-bold">{formatCurrency(realtimeMetrics?.transactionMetrics.totalAmountToday)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold">{realtimeMetrics?.transactionMetrics.activeUsers}</p>
              </div>
              <Users className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">{analyticsData?.paymentMethodPerformance[0]?.successRate || 0}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hourly Transaction Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas id="hourlyChart" width="400" height="200"></canvas>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas id="paymentChart" width="400" height="200"></canvas>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Cards */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{transactionReport?.summary.totalTransactions}</p>
                      <p className="text-sm text-gray-600">Total Transactions</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{transactionReport?.summary.successfulTransactions}</p>
                      <p className="text-sm text-gray-600">Successful</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{transactionReport?.summary.failedTransactions}</p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{transactionReport?.summary.pendingTransactions}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Transaction Growth</p>
                        <p className="text-2xl font-bold text-red-600">{analyticsData?.growthRates.transactionGrowth}%</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Amount Growth</p>
                        <p className="text-2xl font-bold text-red-600">{analyticsData?.growthRates.amountGrowth.toFixed(2)}%</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uptime</span>
                    <span>{Math.floor(realtimeMetrics?.systemHealth.uptime / 60)} minutes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{((realtimeMetrics?.systemHealth.memoryUsage.heapUsed / realtimeMetrics?.systemHealth.memoryUsage.heapTotal) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(realtimeMetrics?.systemHealth.memoryUsage.heapUsed / realtimeMetrics?.systemHealth.memoryUsage.heapTotal) * 100}%`}}></div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">Last updated: {formatDate(realtimeMetrics?.lastUpdated || new Date().toISOString())}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionReport?.recentTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.transactionId.substring(0, 20)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.userId.name}</p>
                          <p className="text-sm text-gray-500">{transaction.userId.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Users by Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Total Transactions</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Average Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData?.topUsers.map((userStats, index) => (
                    <TableRow key={userStats._id}>
                      <TableCell className="font-bold">#{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{userStats.user[0].name}</p>
                          <p className="text-sm text-gray-500">{userStats.user[0].email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={userStats.user[0].role === 'Admin' ? 'default' : 'secondary'}>
                          {userStats.user[0].role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{userStats.totalTransactions}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(userStats.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(userStats.avgAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Total Transactions</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Average Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData?.paymentMethodPerformance.map((method) => (
                    <TableRow key={method._id}>
                      <TableCell className="font-medium">{method._id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{method.totalTransactions}</span>
                          <div className="flex text-xs text-gray-500">
                            ({method.successfulTransactions} success, {method.failedTransactions} failed)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.successRate}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{width: `${method.successRate}%`}}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(method.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(method.avgAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;