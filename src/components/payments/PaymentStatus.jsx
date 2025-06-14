import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { queryMpesaTransaction, checkMpesaWithdrawalStatus } from '../../actions/paymentActions'
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const PaymentStatus = ({ id, status, type = 'payment', userId }) => {
  const initialCheckDone = useRef(false);
  const dispatch = useDispatch();
  
  // Memoize selectors to prevent re-renders
  const mpesaQuery = useSelector((state) => state.mpesaQuery);
  const mpesaWithdrawalStatus = useSelector((state) => state.mpesaWithdrawalStatus);
  
  // Choose the correct state based on transaction type
  const transactionState = type === 'payment' ? mpesaQuery : mpesaWithdrawalStatus;
  const { loading, error, transaction } = transactionState || {};
  
  // Combine props status with redux state
  const currentStatus = transaction?.status || status;
  const resultDesc = transaction?.resultDesc || '';

  // Memoize status check function
  const checkStatus = useCallback(() => {
    if (id) {
      if (type === 'payment') {
        dispatch(queryMpesaTransaction(id));
      } else {
        dispatch(checkMpesaWithdrawalStatus(id));
      }
    }
  }, [dispatch, id, type]);

  // Determine if transaction is in a terminal state
  const isTerminalState = useCallback(() => {
    return ['success', 'completed', 'failed', 'cancelled'].some(
      s => currentStatus?.toLowerCase().includes(s)
    );
  }, [currentStatus]);

  // Initial status check
  useEffect(() => {
    if (!id || initialCheckDone.current) return;
    
    checkStatus();
    initialCheckDone.current = true;
  }, [id, checkStatus]);
  
  // Set up polling for auto-check
 useEffect(() => {
    if (!id || isTerminalState()) return;

    let intervalId;
    const timeoutId = setTimeout(() => {
      checkStatus(); // First check after 25s
      intervalId = setInterval(checkStatus, 10000); // Then every 10s
    }, 25000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, checkStatus, isTerminalState]);

  
  // Get status display info
  const getStatusDisplay = useCallback(() => {
    if (loading || (!isTerminalState() && !resultDesc)) {
      return { 
        icon: <RefreshCw className="h-5 w-5 animate-spin" />, 
        text: 'Processing topup...',
        bgClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
        color: 'text-blue-600 dark:text-blue-400',
        iconColor: 'text-blue-500'
      };
    }

    switch (currentStatus?.toLowerCase()) {
      case 'completed':
      case 'success':
        return { 
          icon: <CheckCircle className="h-5 w-5" />, 
          text: resultDesc || 'The service request is processed successfully',
          bgClass: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
          color: 'text-green-600 dark:text-green-400',
          iconColor: 'text-green-500'
        };
      case 'failed':
      case 'cancelled':
        return { 
          icon: <XCircle className="h-5 w-5" />, 
          text: resultDesc || 'Request cancelled by user',
          bgClass: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
          color: 'text-red-600 dark:text-red-400',
          iconColor: 'text-red-500'
        };
      default:
        return { 
          icon: <AlertTriangle className="h-5 w-5" />, 
          text: resultDesc || 'Processing topup...',
          bgClass: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
          color: 'text-yellow-600 dark:text-yellow-400',
          iconColor: 'text-yellow-500'
        };
    }
  }, [currentStatus, resultDesc, loading, isTerminalState]);

  const statusDisplay = getStatusDisplay();

  return (
    <Card className={`w-full transition-all duration-300 ${statusDisplay.bgClass}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className={statusDisplay.iconColor}>
            {statusDisplay.icon}
          </div>
          Transaction Status
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className={`text-sm ${statusDisplay.color} leading-relaxed`}>
          {statusDisplay.text}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;