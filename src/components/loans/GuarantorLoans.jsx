import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  getGuarantorLoans, 
  guarantorApproval
} from '../../actions/loanActions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle,
  XCircle,
  Clock,
  User,
  DollarSign,
  Shield,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const GuarantorLoans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [processingLoanId, setProcessingLoanId] = useState(null);


  const guarantorLoans = useSelector((state) => state.guarantorLoans);
  const { loading, error, loans } = guarantorLoans;

  const loanGuarantorApproval = useSelector((state) => state.guarantorLoans);
  const { loading: loadingApproval, success: approvalSuccess, error: approvalError } = guarantorLoans;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(getGuarantorLoans(userInfo?.user?._id));
    }
  }, [dispatch, userInfo]);

  const guarantorId = userInfo?.user?._id;

  useEffect(() => {
  if (!loadingApproval && processingLoanId) {
    setProcessingLoanId(null);
  }
}, [loadingApproval]);

  // Approve handler
  const handleApprove = async (loanId) => {
    setProcessingLoanId(loanId);
    const approvalData = {
      approved: true,
      approvalDate: new Date().toISOString(),
    };

    dispatch(guarantorApproval(loanId, guarantorId, approvalData));
  };

  // Reject handler
  const handleReject = async (loanId) => {
    setProcessingLoanId(loanId);
    const approvalData = {
      approved: false,
      approvalDate: new Date().toISOString(),
    };

    dispatch(guarantorApproval(loanId, guarantorId, approvalData));
  };

  // Revert handler (for changing previously rejected loans back to pending)
  const handleRevert = async (loanId) => {
    const loan = loans?.result?.find(l => l._id === loanId);

    if (!loan) return;

    const currentGuarantor = loan?.guarantors?.find(g => g.user?._id === guarantorId);

    setProcessingLoanId(loanId);
    const approvalData = {
      approved: !currentGuarantor?.approved, // toggle logic if needed
      approvalDate: undefined,
    };

    dispatch(guarantorApproval(loanId, guarantorId, approvalData));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Loans You Guarantee
          </CardTitle>
          <CardDescription>
            Review and approve/reject loan requests where you are listed as a guarantor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loans?.result?.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending guarantees</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any pending loan guarantee requests
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Loan Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Your Status</TableHead>
                  <TableHead>Loan Status</TableHead>
                  <TableHead className="text-right w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans?.result?.map((loan) => {
                  const guarantor = loan?.guarantors.find(g => g.user?._id === userInfo.user?._id);
                  const isPending = guarantor?.approvalDate === undefined || guarantor?.approvalDate === null;
                  const isApproved = guarantor?.approved === true && guarantor?.approvalDate !== undefined;
                  const isRejected = guarantor?.approved === false && guarantor?.approvalDate !== undefined;
                 const isProcessing = loadingApproval;
                 console.log('Processing Loan ID:', loadingApproval);
                  console.log('Current Loan ID:', loan?._id);
                  const isLoanApproved = loan?.status === 'approved';
                  const isLoading = loading || loadingApproval;
                  
                  // Debug logging
                
                  return (
                    <TableRow key={loan?._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{loan?.user?.name}</div>
                            <div className="text-sm text-muted-foreground">{loan?.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan?.purpose}</div>
                          <div className="text-sm text-muted-foreground">
                            {loan?.loanType} loan • {loan?.repaymentPeriod} months
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(loan?.principalAmount)}</div>
                        <div className="text-sm text-muted-foreground">
                          Total: {formatCurrency(loan?.totalRepayableAmount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isPending ? (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </Badge>
                        ) : isApproved ? (
                          <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </Badge>
                        ) : isRejected ? (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            Unknown
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan?.status === 'pending' ? 'secondary' : 'default'}>
                          {loan?.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(loan?._id)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              >
                                {isProcessing ? (
                                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(loan?._id)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                              >
                                {isProcessing ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                Approve
                              </Button>
                            </>
                          )}
                          
                          {(isRejected || isApproved) && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevert(loan?._id)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                              >
                                {isProcessing ? (
                                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                ) : (
                                  <RotateCcw className="w-4 h-4" />
                                )}
                                Revert/Reconsider
                              </Button>
                            </>
                          )}
                          
                          {isLoanApproved && (
                            <div className="flex items-center justify-end text-sm text-green-600 font-medium px-3">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </div>
                          )}
                          
                          {!isPending && !isRejected && !isApproved && (
                            <div className="flex items-center justify-end text-sm text-gray-500 font-medium px-3">
                              <Clock className="w-4 h-4 mr-2" />
                              Status Unknown
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuarantorLoans;