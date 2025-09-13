import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Shield, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { login, initiateSocialAuth } from '../../actions/userActions';
import { LinkContainer } from 'react-router-bootstrap';
import PhoneVerification from './PhoneVerification';

const LoginFormSkeleton = () => (
  <div className="flex items-center justify-center">
    <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-2">
          <Skeleton className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </CardContent>
    </Card>
  </div>
);

// Social Login Component (embedded)
const SocialLogin = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, socialAuthProvider } = userLogin || {};

  const handleSocialLogin = (provider) => {
    dispatch(initiateSocialAuth(provider));
  };

  const isProviderLoading = (provider) => {
    return loading && socialAuthProvider === provider;
  };

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google */}
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="h-12 relative transition-all duration-200 hover:bg-gray-50"
        >
          {isProviderLoading('google') ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        {/* Facebook */}
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
          className="h-12 relative transition-all duration-200 hover:bg-gray-50"
        >
          {isProviderLoading('facebook') ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </>
          )}
        </Button>

        {/* Twitter/X */}
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('twitter')}
          disabled={loading}
          className="h-12 relative transition-all duration-200 hover:bg-gray-50"
        >
          {isProviderLoading('twitter') ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
              Continue with X (Twitter)
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        By continuing, you agree to our{' '}
        <button className="underline hover:text-foreground transition-colors duration-200">
          Terms of Service
        </button>
        {' '}and{' '}
        <button className="underline hover:text-foreground transition-colors duration-200">
          Privacy Policy
        </button>
      </p>
    </div>
  );
};

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState({
    phoneNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading: userLoading, error: Usererror, userInfo } = userLogin || {};

  // Add this useEffect to handle navigation when userInfo is available
  useEffect(() => {
    if (!userLoading && userInfo) {
      // Check phone verification
      if (!userInfo?.isVerified && !sessionStorage.getItem('skipPhoneVerification')) {
        setShowPhoneVerification(true);
       }
      navigate('/dashboard');
    }
  }, [userLoading, userInfo, navigate]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check for remembered credentials
      const savedPhone = localStorage.getItem('rememberedPhone');
      if (savedPhone) {
        setCredentials(prev => ({ ...prev, phoneNumber: savedPhone }));
        setRememberMe(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
        if (remaining === 0) {
          setLockoutTime(null);
          setLoginAttempts(0);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!credentials.phoneNumber.trim()) {
      setError('Phone Number is required');
      return false;
    }
    if (!credentials.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (lockoutTime && Date.now() < lockoutTime) {
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Format phone number (remove spaces, dashes, etc.)
      const formattedPhone = credentials.phoneNumber.replace(/[^0-9]/g, '');
      
      // Increment login attempts counter
      setLoginAttempts(prev => prev + 1);

      // Dispatch login action
      dispatch(login(formattedPhone, credentials.password));
      // Start logging in
      setLoggingIn(userLoading);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedPhone', credentials.phoneNumber);
      } else {
        localStorage.removeItem('rememberedPhone');
      }
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setError(`Login failed: ${Usererror || 'An error occurred'}`);

      // Lock out after 5 attempts
      if (newAttempts >= 5) {
        const lockoutDuration = 5 * 60 * 1000; // 5 minutes
        setLockoutTime(Date.now() + lockoutDuration);
        setError('Too many failed attempts. Account locked for 5 minutes.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipVerification = () => {
    sessionStorage.setItem('skipPhoneVerification', 'true');
    setShowPhoneVerification(false);
  };

  const isLockedOut = lockoutTime && Date.now() < lockoutTime;
  const lockoutRemaining = isLockedOut ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;

  if (isLoading) {
    return <LoginFormSkeleton />;
  }

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-lg">
        {/* Success Message */}
        {loggingIn && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 animate-in slide-in-from-top-2 duration-300">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription className="text-blue-700 font-medium">
              Logging in, please wait...
            </AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        {Usererror && (
          <Alert className="mb-6 border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 font-medium"> 
              {Usererror}
              {loginAttempts > 0 && loginAttempts < 5 && (
                <span className="block text-sm mt-1 text-red-600">
                  Attempt {loginAttempts} of 5
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-8">
            {/* Logo/Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Sign in to your Money Manager account
              </CardDescription>
            </div>

            {/* Register Link */}
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
              >
                Create one now
              </button>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  {error}
                  {loginAttempts > 0 && loginAttempts < 5 && (
                    <span className="block text-sm mt-1 text-red-600">
                      Attempt {loginAttempts} of 5
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Lockout Timer */}
            {isLockedOut && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700 font-medium">
                  Account locked. Try again in {Math.floor(lockoutRemaining / 60)}:
                  {String(lockoutRemaining % 60).padStart(2, '0')}
                </AlertDescription>
              </Alert>
            )}

            {/* Traditional Login Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or sign in with phone
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={credentials.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={isSubmitting || isLockedOut}
                  className="h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-base"
                  placeholder="Enter your Phone Number format 07XXXXXXXX"
                  pattern="^07[0-9]{8}$"
                  title="Phone number must start with 07 and be followed by 8 digits"
                  autoComplete="tel"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    disabled={isSubmitting || isLockedOut}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-base pr-12"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || isLockedOut}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isSubmitting || isLockedOut}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Remember me
                  </Label>
                </div>
                <LinkContainer to={'/forgot-password'}>
                  <button
                    type="button"
                    disabled={loggingIn || isLockedOut}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                  >
                    Forgot password?
                  </button>
                </LinkContainer>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loggingIn || isLockedOut}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingIn ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Social Login Section */}
            <SocialLogin />

            {/* Security Notice */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500 leading-relaxed">
                Protected by advanced encryption. Your data is secure with us.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <button className="text-blue-600 hover:text-blue-700 underline" onClick={() => navigate('/terms')}>
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-blue-600 hover:text-blue-700 underline" onClick={() => navigate('/privacy')}>
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>

    {showPhoneVerification && (
        <PhoneVerification
          isOpen={showPhoneVerification}
          onClose={handleSkipVerification}
          userInfo={userInfo}
        />
      )}
    </>
  );
};

export default LoginForm;