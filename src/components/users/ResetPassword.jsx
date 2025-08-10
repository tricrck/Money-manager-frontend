import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Eye, EyeOff, Lock, CheckCircle2, AlertTriangle, Loader2, ArrowLeft
} from 'lucide-react';

import { resetPassword } from '@/actions/userActions'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [strength, setStrength] = useState({ score: 0, feedback: [] });

  const { loading, error: reduxError, success } = useSelector((state) => state.passwordReset || {});

  useEffect(() => {
    if (reduxError) setError(reduxError);
  }, [reduxError]);

  useEffect(() => {
    if (success) {
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [success, navigate]);

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;
    if (password.length >= 8) score += 1; else feedback.push('Min 8 characters');
    if (/[a-z]/.test(password)) score += 1; else feedback.push('Lowercase letter');
    if (/[A-Z]/.test(password)) score += 1; else feedback.push('Uppercase letter');
    if (/\d/.test(password)) score += 1; else feedback.push('Number');
    if (/[^A-Za-z0-9]/.test(password)) score += 1; else feedback.push('Special character');
    return { score, feedback };
  };

  const getStrengthColor = (score) => ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][score] || 'bg-gray-300';
  const getStrengthLabel = (score) => ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score] || '';

  const handleChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (field === 'newPassword') setStrength(checkPasswordStrength(value));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwords.newPassword || !passwords.confirmPassword) {
      return setError('All fields are required');
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (strength.score < 3) {
      return setError('Password is too weak');
    }
    dispatch(resetPassword(token, passwords.newPassword));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        {submitted && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              Password reset successful! Redirecting to login...
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-600">Create a new password below.</CardDescription>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-sm text-blue-600 mt-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </button>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwords.newPassword && (
                  <div className="text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Strength</span>
                      <span className={`font-semibold ${strength.score < 3 ? 'text-red-500' : 'text-green-600'}`}>
                        {getStrengthLabel(strength.score)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor(strength.score)}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    {strength.feedback.length > 0 && (
                      <p className="text-gray-500 mt-1">Required: {strength.feedback.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwords.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;