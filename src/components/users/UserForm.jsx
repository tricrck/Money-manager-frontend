import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  X
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

const UserForm = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditing = Boolean(userId);

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

  // Redux state
  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister } = userRegister;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading: loadingDetails, error: errorDetails, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
  

  // Show success message
  useEffect(() => {
    if (successUpdate) {
      // Redirect to /profile after short delay
      const timer = setTimeout(() => {
        setMessage(null);
        navigate('/profile');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successUpdate]);

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
    
    // Validate password match for registration
    if (!isEditing && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    // Validate phone
    if (!validatePhone(phoneNumber)) {
      return;
    }
    
    if (isEditing) {
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
    } else {
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

  const loading = loadingRegister || loadingUpdate || loadingDetails;
  const error = errorRegister || errorUpdate || errorDetails;

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
              {isEditing ? <User className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
              {isEditing ? "Edit User Profile" : "Create New Account"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isEditing
                ? "Update user information and preferences"
                : "Fill in your details to create a new account"}
            </p>
          </div>
        </div>


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
               {isEditing &&(
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isEditing}
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
              {isEditing &&(
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

        {/* Security Section (Registration only) */}
        {!isEditing && (
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
                  {isEditing ? 'Updating...' : 'Creating Account...'}
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update User' : 'Create Account'}
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