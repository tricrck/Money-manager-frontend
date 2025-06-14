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
import { Skeleton } from '@/components/ui/skeleton';
import { login } from '../../actions/userActions';
import { set } from 'lodash';

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


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading: userLoading, error: Usererror, userInfo } = userLogin || {};


    // Add this useEffect to handle navigation when userInfo is available
  useEffect(() => {
    if (!userLoading && userInfo) {
      setSuccessMessage('Login successful! Redirecting...');
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

  const isLockedOut = lockoutTime && Date.now() < lockoutTime;
  const lockoutRemaining = isLockedOut ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;

  if (isLoading) {
    return <LoginFormSkeleton />;
  }

  return (
    <div className="flex items-center justify-center">
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

            <div className="space-y-6">
              {/* Email Field */}
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
                
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  disabled={isSubmitting || isLockedOut}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || isLockedOut}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>

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
  );
};

export default LoginForm;