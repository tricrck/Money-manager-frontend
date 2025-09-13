import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  User, 
  SortAsc, 
  SortDesc, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  UserCheck,
  UserX,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Globe
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { listUsers, deleteUser } from '../../actions/userActions';

// Enhanced Filters Component
const EnhancedUserFilters = ({ 
  users = [], 
  onFilterChange,
  onExport,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [verificationStatus, setVerificationStatus] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Available options
  const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Meru', 'Thika', 'Malindi'];
  const languages = ['English', 'Swahili', 'Kikuyu', 'Luhya', 'Luo', 'Kalenjin', 'Kamba', 'Kisii'];
  const roles = ['Admin', 'Treasurer', 'Secretary', 'Member'];

  const quickFilters = [
    { value: 'all', label: 'All Users', icon: Users },
    { value: 'active', label: 'Active Users', icon: CheckCircle },
    { value: 'verified', label: 'Verified Users', icon: Shield },
    { value: 'unverified', label: 'Unverified', icon: Clock },
    { value: 'admins', label: 'Administrators', icon: Shield },
    { value: 'inactive', label: 'Inactive Users', icon: UserX }
  ];

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (quickFilter !== 'all') count++;
    if (selectedRoles.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    if (selectedCounties.length > 0) count++;
    if (selectedLanguages.length > 0) count++;
    if (verificationStatus !== 'all') count++;
    
    setActiveFiltersCount(count);
  }, [searchTerm, quickFilter, selectedRoles, selectedStatuses, selectedCounties, selectedLanguages, verificationStatus]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      searchTerm,
      quickFilter,
      selectedRoles,
      selectedStatuses,
      selectedCounties,
      selectedLanguages,
      verificationStatus
    });
  }, [searchTerm, quickFilter, selectedRoles, selectedStatuses, selectedCounties, selectedLanguages, verificationStatus]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setQuickFilter('all');
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setSelectedCounties([]);
    setSelectedLanguages([]);
    setVerificationStatus('all');
  };

  // Multi-select component
  const MultiSelect = ({ options, selected, onSelectionChange, placeholder, icon: Icon }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[150px]">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="truncate">
              {selected.length === 0 
                ? placeholder 
                : selected.length === 1 
                  ? selected[0] 
                  : `${selected.length} selected`
              }
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => {
              if (selected.includes(option)) {
                onSelectionChange(selected.filter(item => item !== option));
              } else {
                onSelectionChange([...selected, option]);
              }
            }}
          >
            <input 
              type="checkbox" 
              checked={selected.includes(option)}
              onChange={() => {}}
              className="mr-2"
            />
            {option}
          </DropdownMenuItem>
        ))}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSelectionChange([])}>
              Clear Selection
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Filters
            {/* {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )} */}
          </CardTitle>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Quick Filters */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative col-span-full md:col-span-1">
            <input
              type="text"
              placeholder="Search users by name, email, phone, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="col-span-full md:col-span-2">
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <Button
                    key={filter.value}
                    variant={quickFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickFilter(filter.value)}
                    className="h-8"
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <MultiSelect
                options={roles}
                selected={selectedRoles}
                onSelectionChange={setSelectedRoles}
                placeholder="Roles"
                icon={Shield}
              />

              <MultiSelect
                options={counties}
                selected={selectedCounties}
                onSelectionChange={setSelectedCounties}
                placeholder="Counties"
                icon={MapPin}
              />

              <MultiSelect
                options={languages}
                selected={selectedLanguages}
                onSelectionChange={setSelectedLanguages}
                placeholder="Languages"
                icon={Globe}
              />

              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearAllFilters} size="sm">
              Clear All
            </Button>
            {activeFiltersCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {users.length} users match filters
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onRefresh} size="sm">
              Refresh
            </Button>
            <Button variant="outline" onClick={onExport} size="sm">
              Export Filtered
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users = [] } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete, loading: deleteLoading } = userDelete;

  // State for filtering and sorting
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (userInfo?.role === 'Admin') {
      dispatch(listUsers());
    } else {
      navigate('/dashboard');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  // Apply filters to users
  const applyFilters = (users, filters) => {
    return users.filter(user => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phoneNumber?.includes(filters.searchTerm) ||
          user.username?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Quick filter
      if (filters.quickFilter && filters.quickFilter !== 'all') {
        switch (filters.quickFilter) {
          case 'active':
            if (!user.isActive) return false;
            break;
          case 'verified':
            if (!user.isVerified) return false;
            break;
          case 'unverified':
            if (user.isVerified) return false;
            break;
          case 'admins':
            if (!['Admin', 'Treasurer', 'Secretary'].includes(user.role)) return false;
            break;
          case 'inactive':
            if (user.isActive) return false;
            break;
        }
      }

      // Role filter
      if (filters.selectedRoles?.length > 0) {
        if (!filters.selectedRoles.includes(user.role)) return false;
      }

      // County filter
      if (filters.selectedCounties?.length > 0) {
        if (!user.county || !filters.selectedCounties.includes(user.county)) return false;
      }

      // Language filter
      if (filters.selectedLanguages?.length > 0) {
        if (!user.language || !filters.selectedLanguages.includes(user.language)) return false;
      }

      // Verification status filter
      if (filters.verificationStatus && filters.verificationStatus !== 'all') {
        if (filters.verificationStatus === 'verified' && !user.isVerified) return false;
        if (filters.verificationStatus === 'unverified' && user.isVerified) return false;
      }

      return true;
    });
  };

  // Filter and sort users
  const processedUsers = applyFilters(users, filters)
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'county':
          aValue = a.county?.toLowerCase() || '';
          bValue = b.county?.toLowerCase() || '';
          break;
        default:
          aValue = a[sortField] || '';
          bValue = b[sortField] || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      Admin: { color: 'bg-red-100 text-red-800', icon: Shield },
      Treasurer: { color: 'bg-green-100 text-green-800', icon: CreditCard },
      Secretary: { color: 'bg-blue-100 text-blue-800', icon: Edit },
      Member: { color: 'bg-gray-100 text-gray-800', icon: User },
      default: { color: 'bg-gray-100 text-gray-800', icon: User }
    };
    
    const config = roleConfig[role] || roleConfig.default;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {role}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive, isVerified) => {
    if (!isActive) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          <UserX className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      );
    }
    
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-0">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-0">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  // Handle user deletion
  const handleDelete = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    verified: users.filter(u => u.isVerified).length,
    admins: users.filter(u => u.role === 'Admin').length,
    members: users.filter(u => u.role === 'Member').length,
    treasurers: users.filter(u => u.role === 'Treasurer').length,
    secretaries: users.filter(u => u.role === 'Secretary').length
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const exportUsers = () => {
    const exportData = processedUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phoneNumber || 'N/A',
        Username: user.username || 'N/A',
        Role: user.role,
        Status: user.isActive ? 'Active' : 'Inactive',
        Verified: user.isVerified ? 'Yes' : 'No',
        County: user.county || 'N/A',
        Language: user.language || 'N/A',
        'Date Joined': formatDate(user.createdAt)
      }));

      const headers = Object.keys(exportData[0]).join(',');
      const csvContent = exportData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      ).join('\n');
      
      const csv = headers + '\n' + csvContent;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Statistics Cards
  const StatsCards = () => (
    <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.active} active, {stats.total - stats.active} inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.verified}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total ? ((stats.verified / stats.total) * 100).toFixed(1) : 0}% verification rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.admins}</div>
          <p className="text-xs text-muted-foreground">
            {stats.treasurers} treasurers, {stats.secretaries} secretaries
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Members</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.members}</div>
          <p className="text-xs text-muted-foreground">
            Regular platform members
          </p>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all users across the platform
          </p>
        </div>
        <div className="hidden sm:inline flex items-center gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <StatsCards />
      
      {/* Enhanced Filters */}
      <EnhancedUserFilters
        users={processedUsers}
        onFilterChange={setFilters}
        onExport={exportUsers}
        onRefresh={() => dispatch(listUsers())}
      />

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({processedUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead 
                    className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Contact
                      {sortField === 'email' && (
                        sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      {sortField === 'role' && (
                        sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead 
                    className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('county')}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      {sortField === 'county' && (
                        sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Joined
                      {sortField === 'createdAt' && (
                        sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No users found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters or search terms
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.profilePicture} alt={user.name} />
                            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            {user.username && (
                              <div className="text-sm text-muted-foreground">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-xs">{user.email}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{user.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(user.isActive, user.isVerified)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.county && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{user.county}</span>
                          </div>
                        )}
                        {user.language && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <span>{user.language}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/users/${user._id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/users/${user._id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user._id, user.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={user._id === userInfo?._id}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-4 items-center justify-between mt-4 sm:flex-row">
              {/* Info text */}
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, processedUsers.length)} of {processedUsers.length} users
              </div>

              {/* Pagination controls */}
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserList;