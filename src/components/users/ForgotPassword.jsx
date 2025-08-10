import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendResetLink } from '@/actions/userActions'; // Update path as necessary
import { ArrowLeft, Mail, CheckCircle2, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';


const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { loading, error, message } = useSelector(state => state.passwordResetLink || {});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!validateEmail(email)) return;

    dispatch(sendResetLink(email));
    setShowSuccess(true);
    setResendCooldown(60);
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      dispatch(sendResetLink(email));
      setResendCooldown(60);
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
          </Alert>
        )}
        {showSuccess && message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">{message}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Forgot Password?</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email and we'll send you password reset instructions.
            </CardDescription>
            <button
              type="button"
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center space-x-2 text-sm text-blue-600 mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading || showSuccess}
                  className="h-12"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || showSuccess}
                className="w-full h-12 mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </form>

            {showSuccess && (
              <Button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                variant="outline"
                className="w-full h-12"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend Instructions'
                )}
              </Button>
            )}

            <p className="text-xs text-center text-gray-500">
              For security, reset instructions will only be sent to registered email addresses.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;