import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Shield
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Redux actions
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  checkVerificationStatus,
  logout
} from '../../actions/userActions';

const PhoneVerification = ({ isOpen, onClose, userInfo }) => {
  const [step, setStep] = useState('send'); // 'send' | 'verify'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [localMessage, setLocalMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux slices
  const sendState = useSelector((state) => state.sendOTP);
  const verifyState = useSelector((state) => state.verifyOTP);
  const resendState = useSelector((state) => state.resendOTP);
  const checkState = useSelector((state) => state.checkVerificationStatus);

  // Unified status handling
  const loading =
    sendState.loading ||
    verifyState.loading ||
    resendState.loading ||
    checkState.loading;

  const error =
    sendState.error ||
    verifyState.error ||
    resendState.error ||
    checkState.error;

  const success =
    sendState.message ||
    verifyState.verified?.message ||
    resendState.message;

  const verified =
    verifyState.verified?.status === true ||
    checkState.verified?.status === true;

  // Timer
  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'verify') {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timeLeft, step]);

  // Check verification status on mount
  useEffect(() => {
    if (userInfo?.phoneNumber) {
      dispatch(checkVerificationStatus(userInfo?.phoneNumber));
    }
  }, [dispatch, userInfo]);

  // If verified → close modal + reload
  useEffect(() => {
    if (verified) {
      setLocalMessage('✅ Phone number verified successfully');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    }
  }, [verified, onClose]);

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (success || error || localMessage) {
      const timer = setTimeout(() => {
        setLocalMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error, localMessage]);

  // Format mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers
  const handleSendOTP = () => {
    if (!userInfo?.phoneNumber) return;
    dispatch(sendOTP(userInfo?.phoneNumber));
    setStep('verify');
    setTimeLeft(600);
    setCanResend(false);
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setLocalMessage('❌ Enter a valid 6-digit code');
      return;
    }
    dispatch(verifyOTP(userInfo?.phoneNumber, otpCode));
  };

  const handleResendOTP = () => {
    dispatch(resendOTP(userInfo?.phoneNumber));
    setTimeLeft(600);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative transition-transform animate-in fade-in slide-in-from-bottom-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Verify Phone Number</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerts */}
        {(error || success || localMessage) && (
          <Alert
            className={`mb-4 ${
              error
                ? 'border-red-200 bg-red-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            {error ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription
              className={`${
                error ? 'text-red-800' : 'text-green-800'
              } font-medium`}
            >
              {typeof (error || success || localMessage) === 'object'
                ? JSON.stringify(error || success || localMessage)
                : error || success || localMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Steps */}
        {step === 'send' ? (
          <div className="space-y-4">
            <div className="text-center">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                We need to verify your phone number to secure your account.
              </p>
              <p className="font-medium text-gray-800">
                {userInfo?.phoneNumber}
              </p>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <div className="text-center pt-4 border-t">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Not your number? Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Enter the 6-digit code sent to</p>
              <p className="font-medium text-gray-800 mb-4">
                {userInfo?.phoneNumber}
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-2 justify-center mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold transition-transform"
                />
              ))}
            </div>

            {/* Timer */}
            {timeLeft > 0 && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            {/* Resend */}
            <div className="text-center pt-4 border-t">
              <button
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                className={`text-sm ${
                  canResend
                    ? 'text-blue-600 hover:underline'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {canResend ? 'Resend Code' : 'Wait until timer ends to resend'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;