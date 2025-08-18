import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../actions/userActions';
import { listMyGroups, listUserGroups } from '../../actions/groupActions';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Languages,
  Shield,
  CheckCircle2,
  XCircle,
  Bell,
  MessageSquare,
  Calendar,
  Edit,
  Users,
  Clock,
  AlertTriangle,
  MapPin,
  UserCog,
  CreditCard,
  Settings
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: loadingMy, error: errorMy, myGroups: myGroupsList = [] } = myGroups;

  const { loading: LoadingUser, error: errorUser, userGroups } = useSelector((state) => state.userGroups);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const userId = id;
  
  useEffect(() => {
    if (userInfo?.user?._id === userId) {
      // Logged-in user's own profile
      dispatch(getUserDetails(userId));
      dispatch(listMyGroups());
    } else {
      // Visiting another user’s profile
      dispatch(getUserDetails(userId));
      dispatch(listUserGroups(userId));
    }
  }, [dispatch, userId, userInfo]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case 'Admin':
        return 'destructive';
      case 'Manager':
        return 'default';
      case 'Member':
        return 'secondary';
      case 'User':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusVariant = (status) => {
    return status ? 'default' : 'warning';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
      <AlertTriangle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );

  const GroupCard = ({ group }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{group.name}</h4>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{group.groupType}</Badge>
              <Badge variant={group.isActive ? 'default' : 'warning'}>
                {group.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <div>{group.members.length} members</div>
            <div>Created: {new Date(group.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <div className="text-center py-8">No user data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{user?.name?.split(' ')[0] || 'User'}</h1>
        </div>
        <button
          onClick={() => navigate(`/users/${user._id}/edit`)}
          className="p-2 hover:text-blue-600 text-muted-foreground"
          title="Edit"
        >
          <Edit className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user.profilePicture} className="object-cover" />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              {user.username && (
                <CardDescription className="text-primary">
                  @{user.username}
                </CardDescription>
              )}
              <CardDescription className="text-sm mt-1">{user.email}</CardDescription>
              <Badge variant={getRoleVariant(user.role)} className="mt-3">
                {user.role}
              </Badge>
            </CardContent>
            <Separator />
            <CardFooter className="grid grid-cols-2 gap-4 p-4">
              <div className="space-y-1 text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(user.isActive)}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm text-muted-foreground">Verified</p>
                {user.isVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                )}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-secondary p-3">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Groups</p>
                  <p className="font-medium">{myGroupsList.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-secondary p-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="groups">
                <Users className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Groups</span>
              </TabsTrigger>
              <TabsTrigger value="account">
                <Settings className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Account</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-lg">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <Badge variant={getRoleVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    {user.username && (
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary p-2 rounded-lg">
                          <UserCog className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Username</p>
                          <p className="font-medium">@{user.username}</p>
                        </div>
                      </div>
                    )}
                    {user.county && (
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary p-2 rounded-lg">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">County</p>
                          <p className="font-medium">{user.county}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Languages className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <p className="font-medium">{user.language || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className={user.notificationPreferences?.email ? 'border-primary' : ''}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${user.notificationPreferences?.email ? 'bg-primary/10 text-primary' : 'bg-secondary'}`}>
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className={`text-sm ${user.notificationPreferences?.email ? 'text-primary' : 'text-muted-foreground'}`}>
                            {user.notificationPreferences?.email ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className={user.notificationPreferences?.sms ? 'border-primary' : ''}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${user.notificationPreferences?.sms ? 'bg-primary/10 text-primary' : 'bg-secondary'}`}>
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className={`text-sm ${user.notificationPreferences?.sms ? 'text-primary' : 'text-muted-foreground'}`}>
                            {user.notificationPreferences?.sms ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className={user.notificationPreferences?.push ? 'border-primary' : ''}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${user.notificationPreferences?.push ? 'bg-primary/10 text-primary' : 'bg-secondary'}`}>
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Push</p>
                          <p className={`text-sm ${user.notificationPreferences?.push ? 'text-primary' : 'text-muted-foreground'}`}>
                            {user.notificationPreferences?.push ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Group Memberships</CardTitle>
                    <Badge variant="outline">{myGroupsList.length} groups</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingMy ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-[88px] w-full" />
                      ))}
                    </div>
                  ) : errorMy ? (
                    <ErrorMessage message={errorMy} />
                  ) : myGroupsList && myGroupsList.length ? (
                    <div className="space-y-4">
                      {myGroupsList.map((group) => (
                        <GroupCard key={group._id} group={group} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">No groups assigned</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This user is not a member of any groups yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Details about the user's account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-2 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Created</p>
                      <p className="font-medium">
                        {user.createdAt ? formatDate(user.createdAt) : 'Not available'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-2 rounded-lg">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">
                        {user.updatedAt ? formatDate(user.updatedAt) : 'Not available'}
                      </p>
                    </div>
                  </div>
                  {user.idNumber && (
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-lg">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Number</p>
                        <p className="font-medium">{user.idNumber}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;