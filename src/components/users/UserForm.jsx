import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Camera, 
  Shield, 
  Bell, 
  Globe,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
  UserPlus,
  Upload,
  UploadCloud,
  Loader2,
  X,
  Users,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { register, updateUser, getUserDetails, login, uploadProfilePicture } from '../../actions/userActions';
import { getInvitationDetails, acceptExternalInvitation } from '../../actions/groupActions';

const UserForm = () => {
  const { id: userId } = useParams();
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Determine the mode of operation
  const isEditing = Boolean(userId);
  const isExternalInvitation = Boolean(invitationToken && !userId);
  const isRegularRegistration = !userId && !invitationToken;

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [profilePicture, setProfilePicture] = useState('@favicon.ico');
  const [role, setRole] = useState('Member');
  const [language, setLanguage] = useState('English');
  const [isActive, setIsActive] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: true,
    email: true,
    push: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  
  // UI state
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Redux state - User actions
  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister } = userRegister;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading: loadingDetails, error: errorDetails, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Redux state - Invitation actions
  const invitationDetailsState = useSelector((state) => state.invitationDetails);
  const { 
    loading: loadingInvitation, 
    error: errorInvitation, 
    invitation 
  } = invitationDetailsState;

  const acceptInvitationState = useSelector((state) => state.acceptExternalInvitation);
  const { 
    loading: submittingInvitation, 
    error: submitInvitationError, 
    success: invitationSuccess, 
    invitation: joinedData 
  } = acceptInvitationState;

  // Check if current user is admin
  const isAdmin = userInfo?.role === 'Admin';

  // Counties list
  const counties = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", 
    "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", 
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", 
    "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi", 
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", 
    "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", 
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
  ];

  const roles = ['Member', 'Admin', 'Moderator'];
  const languages = ['English', 'Swahili'];

  // Load invitation details if external invitation
  useEffect(() => {
    if (isExternalInvitation) {
      dispatch(getInvitationDetails(invitationToken));
    }
  }, [dispatch, invitationToken, isExternalInvitation]);

  // Load user data when editing
  useEffect(() => {
    if (isEditing) {
      if (!user || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
        setUsername(user.username || '');
        setIdNumber(user.idNumber || '');
        setCounty(user.county || 'Nairobi');
        setProfilePicture(user.profilePicture || '');
        setRole(user.role || 'Member');
        setLanguage(user.language || 'English');
        setIsActive(user.isActive !== undefined ? user.isActive : true);
        setNotificationPreferences(user.notificationPreferences || {
          sms: true,
          email: true,
          push: true
        });
      }
    }
  }, [dispatch, userId, user, isEditing]);

  // Handle successful invitation acceptance
  useEffect(() => {
    if (invitationSuccess && joinedData) {
      // Store auth token if returned
      if (joinedData.token) {
        localStorage.setItem('token', joinedData.token);
      }

      // Redirect to group page
      navigate(`/groups/${joinedData.group.id}`, {
        state: { message: 'Successfully joined the group!' }
      });
    }
  }, [invitationSuccess, joinedData, navigate]);

  // Show success message for regular updates
  useEffect(() => {
    if (successUpdate && !isExternalInvitation) {
      const timer = setTimeout(() => {
        setMessage(null);
        navigate('/profile');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successUpdate, isExternalInvitation]);

  useEffect(() => {
    if (isExternalInvitation && invitation) {
      setEmail(invitation.invitedEmail || '');
      if (invitation.invitedUsername) {
        setUsername(invitation.invitedUsername);
      }
    }
  }, [invitation, isExternalInvitation]);

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^(254|0)[17][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid Kenyan phone number (e.g., 0701234567)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Remove non-digits
    value = value.replace(/\D/g, '');
    
    // Format based on Kenyan phone patterns
    if (value.startsWith('254')) {
      // Allow as is
    } else if (value.startsWith('0')) {
      // Allow as is - will be converted on submit if needed
    } else if (value.length > 0) {
      // Add leading zero if user starts typing without it
      value = '0' + value;
    }
    
    // Limit length
    if (value.startsWith('254')) {
      value = value.slice(0, 12);
    } else {
      value = value.slice(0, 10);
    }
    
    setPhoneNumber(value);
    if (value.length > 9) {
      validatePhone(value);
    }
  };

  const handleNotificationChange = (type, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Validate password match for registration and invitations
    if ((isRegularRegistration || isExternalInvitation) && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    // Validate phone
    if (!validatePhone(phoneNumber)) {
      return;
    }
    
    if (isEditing) {
      // Handle user update
      const updateData = { 
        _id: userId, 
        name, 
        email, 
        phoneNumber, 
        username, 
        idNumber,
        county,
        profilePicture,
        language,
        notificationPreferences
      };

      // Only admins can update role and isActive status
      if (isAdmin) {
        updateData.role = role;
        updateData.isActive = isActive;
      }

      dispatch(updateUser(updateData));
    } else if (isExternalInvitation) {
      // Handle external invitation acceptance
      const invitationData = {
        name,
        email,
        phoneNumber,
        password,
        username
      };
      
      dispatch(acceptExternalInvitation(invitationToken, invitationData)).then(() => {
        return dispatch(login(phoneNumber, password));
      }).then(() => {
        navigate('/');
      }).catch(error => {
        console.error('Registration or login failed:', error);
      });
    } else {
      // Handle regular registration
      dispatch(register({ 
        name, 
        email, 
        phoneNumber, 
        password
      })).then(() => {
        return dispatch(login(phoneNumber, password));
      }).then(() => {
        navigate('/');
      }).catch(error => {
        console.error('Registration or login failed:', error);
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      // Dispatch the upload action
      dispatch(uploadProfilePicture(user._id, formData));

      // Reset state on success
      setSelectedFile(null);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Get appropriate loading and error states
  const getLoadingState = () => {
    if (isEditing) return loadingUpdate || loadingDetails;
    if (isExternalInvitation) return loadingInvitation || submittingInvitation;
    return loadingRegister;
  };

  const getErrorState = () => {
    if (isEditing) return errorUpdate || errorDetails;
    if (isExternalInvitation) return errorInvitation || submitInvitationError;
    return errorRegister;
  };

  const loading = getLoadingState();
  const error = getErrorState();

  // Loading state for invitation details
  if (isExternalInvitation && loadingInvitation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  // Invalid invitation
  if (isExternalInvitation && errorInvitation && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground mb-4">{errorInvitation}</p>
            <Button onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state for editing user
  if (loadingDetails && userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  // Get page title and description
  const getPageInfo = () => {
    if (isEditing) {
      return {
        title: "Edit User Profile",
        description: "Update user information and preferences",
        icon: <User className="h-6 w-6" />
      };
    } else if (isExternalInvitation) {
      return {
        title: `Join ${invitation?.group?.name}`,
        description: `You've been invited by ${invitation?.inviter?.name} to join as a ${invitation?.role}`,
        icon: <Users className="h-6 w-6" />
      };
    } else {
      return {
        title: "Create New Account",
        description: "Fill in your details to create a new account",
        icon: <UserPlus className="h-6 w-6" />
      };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        {/* Back Button (left-aligned only if editing) */}
        {isEditing && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Centered Heading */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {pageInfo.icon}
            {pageInfo.title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pageInfo.description}
          </p>
        </div>
      </div>

      {/* Invitation Info Card (for external invitations) */}
      {isExternalInvitation && invitation && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-1">Group Invitation</h3>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Group:</strong> {invitation.group?.name}
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Role:</strong> {invitation.role}
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Invited by:</strong> {invitation.inviter?.name}
                </p>
                {invitation.message && (
                  <div className="mt-3 p-3 bg-blue-100 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Message:</strong> {invitation.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      {message && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={submitHandler} className="space-y-6">
        {/* User Status Card (Edit mode only) */}
        {isEditing && isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status</span>
                  <div className="flex gap-2">
                    <Badge variant={user.isVerified ? "default" : "secondary"}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Picture Upload (Edit mode only, non-admin) */}
        {isEditing && !isAdmin && (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-lg space-y-6 flex flex-col items-center">
              {/* Avatar Preview */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewImage || user.profilePicture} className="object-cover" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                {previewImage && (
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Choose File */}
              <div className="w-full flex flex-col items-center gap-2">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="profilePicture"
                  className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Choose Image</span>
                  </div>
                </Label>
                <p className="text-sm text-muted-foreground text-center">
                  {selectedFile ? selectedFile.name : "JPG, PNG or GIF (max 5MB)"}
                </p>
              </div>

              {/* Upload Button */}
              {selectedFile && (
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Upload</span>
                    </>
                  )}
                </Button>
              )}

              {/* Error */}
              {uploadError && (
                <Alert variant="destructive" className="w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload Error</AlertTitle>
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            {(isEditing || isExternalInvitation) && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isEditing || isExternalInvitation}
                  placeholder="Choose a username"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  required
                  placeholder="0701234567"
                  className={`pl-10 ${phoneError ? "border-red-500" : ""}`}
                />
              </div>
              {phoneError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {phoneError}
                </p>
              )}
            </div>

            {(isEditing || isExternalInvitation) && (
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required={isEditing}
                  placeholder="Enter your ID number"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Section (Registration and External Invitation) */}
        {(isRegularRegistration || isExternalInvitation) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Set up a secure password for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location & Preferences (Edit mode only) */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Preferences
              </CardTitle>
              <CardDescription>
                Your location and language preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Select value={county} onValueChange={setCounty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((countyName) => (
                        <SelectItem key={countyName} value={countyName}>
                          {countyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {lang}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEditing && isAdmin && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={previewImage || user.profilePicture} className="object-cover" />
                        <AvatarFallback>
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      {previewImage && (
                        <button
                          onClick={() => setPreviewImage(null)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="profilePicture">Profile Picture</Label>
                      <div className="flex gap-2">
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <Label
                          htmlFor="profilePicture"
                          className="flex-1 cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Choose Image</span>
                          </div>
                        </Label>
                        {selectedFile && (
                          <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="gap-2"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="h-4 w-4" />
                                <span>Upload</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile
                          ? selectedFile.name
                          : "JPG, PNG or GIF (max 5MB)"}
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Upload Error</AlertTitle>
                      <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Controls (Edit mode and admin only) */}
        {isEditing && isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Controls
              </CardTitle>
              <CardDescription>
                Administrative settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((roleName) => (
                        <SelectItem key={roleName} value={roleName}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {roleName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Account Status</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      {isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Preferences (Edit mode only) */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms" className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="sms"
                    checked={notificationPreferences.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif" className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={notificationPreferences.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push" className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    id="push"
                    checked={notificationPreferences.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already have an account link (for external invitations) */}
        {isExternalInvitation && (
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-medium text-primary"
                  onClick={() => navigate(`/login?token=${invitationToken}`)}
                >
                  Login here instead
                </Button>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : isExternalInvitation ? 'Joining Group...' : 'Creating Account...'}
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update User' : isExternalInvitation ? 'Create Account & Join Group' : 'Create Account'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default UserForm;