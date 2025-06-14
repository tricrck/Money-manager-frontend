import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Search, 
  SortAsc, 
  SortDesc, 
  Eye, 
  Settings, 
  Plus, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Wallet,
  Target,
  Award,
  TrendingDown,
  ChevronDown
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
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { listMyGroups } from '../../actions/groupActions';
import Loader from '../Loader';

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const myGroups = useSelector((state) => state.myGroups);
  const { loading, error, myGroups: myGroupsList = [] } = myGroups;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyGroups());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  // Helper function to get group balance from savingsAccount
  const getGroupBalance = (group) => {
    return group.savingsAccount?.balance || 0;
  };

  // Helper function to get group status based on activity
  const getGroupStatus = (group) => {
    return group.status;
  };

  // Filter and sort groups
  const processedGroups = myGroupsList
    .filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || group.groupType === filterType;
      const status = getGroupStatus(group);
      const matchesStatus = filterStatus === 'all' || status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'members':
          aValue = a.members?.length || 0;
          bValue = b.members?.length || 0;
          break;
        case 'balance':
          aValue = getGroupBalance(a);
          bValue = getGroupBalance(b);
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Toggle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get group type badge
  const getGroupTypeBadge = (type) => {
    const typeConfig = {
      chama: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Users },
      investment: { color: 'bg-green-100 text-green-800 border-green-200', icon: TrendingUp },
      savings: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: DollarSign },
      default: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Building2 }
    };
    
    const config = typeConfig[type] || typeConfig.default;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Other'}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      inactive: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
      default: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Activity }
    };
    
    const config = statusConfig[status] || statusConfig.default;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </Badge>
    );
  };

  // Calculate statistics
  const stats = {
    total: myGroupsList.length,
    active: myGroupsList.filter(g => getGroupStatus(g) === 'active').length,
    inactive: myGroupsList.filter(g => getGroupStatus(g) === 'inactive').length,
    totalBalance: myGroupsList.reduce((sum, g) => sum + getGroupBalance(g), 0),
    totalMembers: myGroupsList.reduce((sum, g) => sum + (g.members?.length || 0), 0),
    avgBalance: myGroupsList.length ? (myGroupsList.reduce((sum, g) => sum + getGroupBalance(g), 0) / myGroupsList.length) : 0,
    totalContributions: myGroupsList.reduce((sum, group) => {
      const memberContributions = group.members?.reduce((memberSum, member) => 
        memberSum + (member.contributions?.total || 0), 0) || 0;
      return sum + memberContributions;
    }, 0)
  };

  // Prepare chart data
  const prepareGroupTypeData = () => {
    const typeCount = {};
    myGroupsList.forEach(group => {
      const type = group.groupType || 'other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    const colors = {
      chama: '#3b82f6',
      investment: '#10b981',
      savings: '#8b5cf6',
      other: '#6b7280'
    };
    
    return Object.keys(typeCount).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: typeCount[type],
      color: colors[type] || colors.other
    }));
  };

  const prepareBalanceData = () => {
    return myGroupsList
      .map(group => ({
        name: group.name.length > 15 ? group.name.substring(0, 15) + '...' : group.name,
        balance: getGroupBalance(group),
        members: group.members?.length || 0
      }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);
  };

  const prepareContributionData = () => {
    return myGroupsList
      .map(group => {
        const totalContributions = group.members?.reduce((sum, member) => 
          sum + (member.contributions?.total || 0), 0) || 0;
        return {
          name: group.name.length > 15 ? group.name.substring(0, 15) + '...' : group.name,
          contributions: totalContributions,
          members: group.members?.length || 0
        };
      })
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 5);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Statistics Cards
  const StatsCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Groups</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.active} active, {stats.inactive} inactive
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Group savings balance
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Contributions</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalContributions)}</div>
          <p className="text-xs text-muted-foreground">
            Total contributed
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            Connected members
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // Filters and Search
  const FiltersSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-20"
                placeholder="Search groups by name or description..."
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Group Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="chama">Chama</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {processedGroups.map((group) => {
        const myMembership = group.members?.find(member => member.user === userInfo?.user?._id);
        const myContributions = myMembership?.contributions?.total || 0;
        const groupStatus = getGroupStatus(group);
        
        return (
          <Card key={group._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{group.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {group.description || 'No description provided'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/groups/${group._id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/groups/${group._id}/edit`)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {getGroupTypeBadge(group.groupType)}
                  {getStatusBadge(groupStatus)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Group Balance</p>
                    <p className="font-semibold text-green-600">{formatCurrency(getGroupBalance(group))}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Members</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {group.members?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">My Contributions</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(myContributions)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">My Role</p>
                    <Badge variant="outline" className="text-xs">
                      {myMembership?.role || 'Member'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created {formatDate(group.createdAt)}
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Open Group
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Groups Overview ({processedGroups.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Group Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Type & Status</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('members')}
                >
                  <div className="flex items-center gap-2">
                    Members
                    {sortField === 'members' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('balance')}
                >
                  <div className="flex items-center gap-2">
                    Group Balance
                    {sortField === 'balance' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>My Contribution</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No groups found</p>
                      {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? (
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters
                        </p>
                      ) : (
                        <Button onClick={() => navigate('/groups/join')} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Join a Group
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                processedGroups.map((group) => {
                  const myMembership = group.members?.find(member => member.user === userInfo?._id);
                  const myContributions = myMembership?.contributions?.total || 0;
                  const groupStatus = getGroupStatus(group);
                  
                  return (
                    <TableRow key={group._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{group.name}</div>
                          {group.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {group.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getGroupTypeBadge(group.groupType)}
                          {getStatusBadge(groupStatus)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{group.members?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(getGroupBalance(group))}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(myContributions)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/groups/${group._id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/groups/${group._id}/settings`)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
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
  );

  // Charts Section
  const ChartsSection = () => {
    const groupTypeData = prepareGroupTypeData();
    const balanceData = prepareBalanceData();
    const contributionData = prepareContributionData();

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Group Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={groupTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {groupTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Group Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="balance" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              My Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={contributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="contributions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Loader message="Loading your groups..." />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            My Groups
          </h1>
          <p className="text-muted-foreground">
            Manage and view your group memberships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/groups/join')}>
            <Plus className="h-4 w-4 mr-2" />
            Join Group
          </Button>
          <Button onClick={() => navigate('/groups/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <StatsCards />
      
      {myGroupsList.length > 0 && (
        <>
          <ChartsSection />
          <FiltersSection />
          {viewMode === 'grid' ? <GridView /> : <TableView />}
        </>
      )}

      {myGroupsList.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't joined any groups yet. Start by creating a new group or joining an existing one.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => navigate('/groups/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={() => navigate('/groups/join')}>
                <Plus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupList;