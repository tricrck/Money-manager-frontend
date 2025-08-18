import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import Loader from './Loader';
import DashboardContent from './DashboardContent';
import usePushNotifications from './usePushNotifications';

const ProfessionalDashboard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Initialize push notifications
  usePushNotifications();

  useEffect(() => {
    if (!userInfo) {
      navigate('/home');
      return;
    }
  }, [userInfo, navigate]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/home');
  };

  const isAdmin = userInfo?.user?.role === 'Admin';
  const isGroupAdmin = ['Admin', 'Treasurer', 'Secretary'].includes(userInfo?.user?.role);

  // Navigation items based on role
  const getNavigationItems = () => {
    const personalFinanceItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard', key: 'dashboard' },
      { icon: Wallet, label: 'My Wallet', path: `/wallet/${userInfo?.user?._id}`, key: 'wallet' },
      { icon: FileText, label: 'Transactions', path: '/transactions', key: 'transactions' }
    ];

    const groupItems = [
      { icon: Users, label: 'My Groups', path: '/groups', key: 'groups' },
      { icon: CreditCard, label: 'My Loans', path: '/loans', key: 'loans' }
    ];

    const adminItems = [
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', key: 'analytics' },
      { icon: Users, label: 'User Management', path: '/admin/users', key: 'users' },
      { icon: Building2, label: 'Group Management', path: '/admin/groups', key: 'admin-groups' },
      { icon: CreditCard, label: 'Loans Management', path: '/admin/loans', key: 'admin-loans' },
      { icon: Shield, label: 'System Settings', path: '/admin/settings', key: 'settings' },
      { icon: FileText, label: 'System Logs', path: '/admin/logs', key: 'logs' }
    ];

    const groupAdminItems = [
      { icon: Users, label: 'Group Management', path: '/group-admin/manage', key: 'group-manage' },
      { icon: FileText, label: 'Group Reports', path: '/group-admin/reports', key: 'group-reports' },
      { icon: TrendingUp, label: 'Group Analytics', path: '/group-admin/analytics', key: 'group-analytics' }
    ];

    return {
      personalFinance: personalFinanceItems,
      groupFinance: groupItems,
      administration: isAdmin ? adminItems : (isGroupAdmin ? groupAdminItems : [])
    };
  };

  const navigationItems = getNavigationItems();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        onClick={() => {
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
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold text-primary">Money Manager</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Personal Finance
          </p>
          {navigationItems.personalFinance.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}
        </div>

        {navigationItems.groupFinance.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Group Finance
            </p>
            {navigationItems.groupFinance.map((item) => (
              <NavItem key={item.key} item={item} />
            ))}
          </div>
        )}

        {navigationItems.administration.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </p>
            {navigationItems.administration.map((item) => (
              <NavItem key={item.key} item={item} />
            ))}
          </div>
        )}
      </div>

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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  // Redirect if not authenticated
  if (!userInfo) {
    return null; // The useEffect will handle the redirect
  }

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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
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
          
          {/* Mobile user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userInfo?.user?.profilePicture} />
                  <AvatarFallback>{userInfo?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userInfo?.user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{userInfo?.user?.role}</p>
              </div>
              <DropdownMenuSeparator />
              <LinkContainer to="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </LinkContainer>
              <DropdownMenuItem onClick={logoutHandler}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {/* Show DashboardContent when on dashboard route, otherwise show children */}
          {location.pathname === '/dashboard' ? <DashboardContent /> : children}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;