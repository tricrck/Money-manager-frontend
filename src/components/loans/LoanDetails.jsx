import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getLoanDetails } from '../../actions/loanActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  DollarSign,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Percent,
  Shield,
  Target,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,

} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { getGroupDetails } from '../../actions/groupActions';
import LoanReviewForm from '../loans/LoanReviewForm';
import LoanDisbursementForm from './LoanDisbursementForm'

const LoanDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loanId } = useParams()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);


  const loanDetails = useSelector((state) => state.loanDetails)
  const { loading, error, loan = {} } = loanDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading: groupDetailsloading, error:groupDetailserror, group } = groupDetails;

  useEffect(() => {
    if (userInfo) {
      dispatch(getLoanDetails(loanId))
    } else {
      navigate('/login')
    }
    
  }, [dispatch, navigate, loanId, userInfo])

  useEffect(() => {
    if (loan?.group) {
      dispatch(getGroupDetails(loan?.group._id))
    }
  }, [dispatch, loan]);





  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
      case 'disbursed':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Disbursed</Badge>
      case 'repaid':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Repaid</Badge>
      case 'defaulted':
        return <Badge className="bg-gray-800 hover:bg-gray-900">Defaulted</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'disbursed':
        return <DollarSign className="h-4 w-4" />
      case 'repaid':
        return <CheckCircle className="h-4 w-4" />
      case 'defaulted':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Safe access to loan properties
  const repaymentSchedule = Array.isArray(loan?.repaymentSchedule) 
    ? loan.repaymentSchedule.sort((a, b) => a.installmentNumber - b.installmentNumber)
    : []
  
  const guarantors = Array.isArray(loan?.guarantors) ? loan.guarantors : []
  const collateral = loan?.collateral || {}
  const user = loan?.user || {}

  // Calculate progress
  const totalRepayable = loan?.totalRepayableAmount || 0
  const amountRepaid = loan?.amountRepaid || 0
  const remainingAmount = totalRepayable - amountRepaid
  const repaymentProgress = totalRepayable > 0 ? (amountRepaid / totalRepayable) * 100 : 0

  // Count paid installments
  const paidInstallments = repaymentSchedule.filter(installment => installment.paid).length
  const totalInstallments = repaymentSchedule.length

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
    setIsImageDialogOpen(true)
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === collateral.documents.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? collateral.documents.length - 1 : prevIndex - 1
    )
  }

  // Check user permissions
  const canReview = () => {
    const userRole = userInfo?.role;
    const groupRole = group?.members?.find(m => m.user && m.user._id === userInfo?._id)?.role || "none";
    
    // Admin can review all loans
    if (userRole === 'Admin') return true;
    
    // Chair can review loans
    if (groupRole === 'chair') return true;
    
    return false;
  };

  const canDisburse = () => {
    const userRole = userInfo?.role;
    const groupRole = group?.members?.find(m => m.user && m.user._id === userInfo?._id)?.role || "none";

    
    // Admin can disburse all loans
    if (userRole === 'Admin') return true;
    
    // Treasurer can disburse loans
    if (groupRole === 'treasurer') return true;
    
    return false;
  };

  const shouldShowReviewButton = () => {
    return loan.status === 'pending' && canReview();
  };

  const shouldShowDisburseButton = () => {
    return loan.status === 'approved' && canDisburse();
  };

  if (loading) return <LoanDetailsSkeleton />
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Loan Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(loan.status)}
          {getStatusBadge(loan.status)}
        </div>
      </div>

      {/* Action Buttons */}
      {(shouldShowReviewButton() || shouldShowDisburseButton()) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="font-medium">
                  {shouldShowReviewButton() && "This loan requires review"}
                  {shouldShowDisburseButton() && "This loan is approved for disbursement"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {shouldShowReviewButton() && (
                  <Button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Review Loan
                  </Button>
                )}
                {shouldShowDisburseButton() && (
                  <Button
                    onClick={() => setShowDisburseModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Disburse Loan
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Principal Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(loan.principalAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Original loan amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repayable</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRepayable)}
            </div>
            <p className="text-xs text-muted-foreground">
              Including interest & fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Repaid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(amountRepaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {repaymentProgress.toFixed(1)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(remainingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Information Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan Type</p>
                <p className="text-sm capitalize">{loan.loanType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-sm">{loan.interestRate}% ({loan.interestType})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Repayment Period</p>
                <p className="text-sm">{loan.repaymentPeriod} months</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Fee</p>
                <p className="text-sm">{formatCurrency(loan.processingFee || 0)}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Application Date</p>
              <p className="text-sm">{new Date(loan.applicationDate).toLocaleDateString()}</p>
            </div>
            {loan.purpose && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Purpose</p>
                  <p className="text-sm">{loan.purpose}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrower & Group Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Borrower</p>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            
            {group?.name && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Group</p>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{group?.name}</p>
                      <p className="text-xs text-muted-foreground">{group?.description}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {guarantors.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Guarantors ({guarantors.length})
                  </p>
                  <div className="space-y-2">
                    {guarantors.map((guarantor) => (
                      <div key={guarantor._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {guarantor.user?.name?.charAt(0) || 'G'}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium">{guarantor.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{guarantor.user?.email}</p>
                          </div>
                        </div>
                        <Badge variant={guarantor.approved ? "default" : "secondary"} className="text-xs">
                          {guarantor.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Collateral Information */}
      {collateral.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Collateral Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{collateral.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
                <p className="text-sm font-bold">{formatCurrency(collateral.value || 0)}</p>
              </div>
            </div>
            
            {collateral.documents && collateral.documents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {collateral.documents.map((doc, index) => (
                    <div 
                      key={index}
                      className="relative h-24 w-24 rounded-md overflow-hidden border cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleImageClick(index)}
                    >
                      <img 
                        src={doc} 
                        alt={`Collateral document ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          {/* Image Slideshow Dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
              <div className="relative w-full h-full">
                <button 
                  className="absolute top-4 right-4 z-50 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center justify-center h-[80vh]">
                  <img 
                    src={collateral.documents[currentImageIndex]} 
                    alt={`Collateral document ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button 
                    className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 z-50"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 z-50"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {collateral.documents.length}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      )}

      {/* Repayment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Repayment Schedule</span>
            <Badge variant="outline">
              {paidInstallments}/{totalInstallments} paid
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {repaymentSchedule.length === 0 ? (
              <p className="text-sm text-muted-foreground">No repayment schedule available</p>
            ) : (
              repaymentSchedule.map((installment) => {
                const isOverdue = new Date(installment.dueDate) < new Date() && !installment.paid
                const daysUntilDue = Math.ceil((new Date(installment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                
                return (
                  <div key={installment._id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    installment.paid ? 'bg-green-50 border-green-200' : 
                    isOverdue ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        installment.paid ? 'bg-green-500' : 
                        isOverdue ? 'bg-red-500' : 'bg-gray-400'
                      }`}>
                        <span className="text-xs font-medium text-white">
                          {installment.installmentNumber}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Installment #{installment.installmentNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(installment.dueDate).toLocaleDateString()}
                          {!installment.paid && !isOverdue && daysUntilDue > 0 && (
                            <span className="ml-2">({daysUntilDue} days remaining)</span>
                          )}
                          {isOverdue && (
                            <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {formatCurrency(installment.totalAmount || 0)}
                      </p>
                      <div className="flex space-x-2 text-xs text-muted-foreground">
                        <span>Principal: {formatCurrency(installment.principalAmount || 0)}</span>
                        <span>Interest: {formatCurrency(installment.interestAmount || 0)}</span>
                      </div>
                      {installment.paid && (
                        <Badge className="mt-1 bg-green-500 hover:bg-green-600 text-xs">
                          Paid
                        </Badge>
                      )}
                      {installment.lateFee > 0 && (
                        <p className="text-xs text-red-600">
                          Late Fee: {formatCurrency(installment.lateFee)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
      <LoanReviewForm
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        loanId={loan?._id}
        loanDetails={loan}
        onReviewSuccess={() => {
          setShowReviewModal(false);
          setSelectedLoan(null);
        }}
      />

      <LoanDisbursementForm
        show={showDisburseModal}
        onHide={() => setShowDisburseModal(false)}
        loanId={loan?._id}
        loanDetails={loan}
        onDisburseSuccess={() => {
          setShowDisburseModal(false);
          setSelectedLoan(null);
        }}
      />
    </div>
  )
}

const LoanDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4 mt-2" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2 mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoanDetails