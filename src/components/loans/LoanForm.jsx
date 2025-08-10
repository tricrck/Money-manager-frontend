import React, { useEffect, useState, memo, useCallback, useRef, use, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  DollarSign, 
  Shield, 
  Users,
  Check,
  Save,
  X,
  Calculator,
  Info,
  ClipboardList,
  Percent,
  Building2,
  HandCoins,
  CalendarDays,
  Target,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2,
  Plus,
  User,
  CreditCard
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createLoan, updateLoan, getLoanDetails, uploadCollateralDocuments, loanUpdateReset, removeCollateralDocument  } from '../../actions/loanActions';
import { listUsers } from '../../actions/userActions';
import { listGroups, listMyGroups, getGroupDetails } from '../../actions/groupActions';
import { formatCurrency } from '@/lib/utils';

// Step 1: Loan Details
const LoanDetailsStep = memo(({
  formData,
  handleChange,
  errors,
  formatCurrency,
  onCalculate,
  isAdmin,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Loan Details
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-6">

      {/* Loan Type & Principal */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="loanType">Loan Type</Label>
          <Select
            value={formData.loanType}
            onValueChange={(value) =>
              handleChange({ target: { name: "loanType", value } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Loan
                </div>
              </SelectItem>
              {isAdmin && (
              <SelectItem value="group">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Group Loan
                </div>
              </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="principalAmount">Principal Amount (KES) *</Label>
          <Input
            id="principalAmount"
            name="principalAmount"
            type="number"
            min="100"
            placeholder="1000"
            value={formData.principalAmount}
            onChange={handleChange}
            className={errors.principalAmount ? "border-red-500" : ""}
          />
          {errors.principalAmount && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.principalAmount}
            </p>
          )}
        </div>
      </div>

      {/* Repayment Period */}
      <div className="space-y-2">
        <Label htmlFor="repaymentPeriod">Repayment Period (months) *</Label>
        <select
          id="repaymentPeriod"
          name="repaymentPeriod"
          value={formData.repaymentPeriod}
          onChange={handleChange}
          className={`w-full rounded-md px-3 py-2 border ${
            errors.repaymentPeriod ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a period</option>
          <option value="1">1 month</option>
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
        </select>
        {errors.repaymentPeriod && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.repaymentPeriod}
          </p>
        )}
      </div>

      {/* Interest Type */}
      <div className="space-y-2">
        <Label htmlFor="interestType">Interest Type</Label>
        <Select
          value={formData.interestType}
          onValueChange={(value) =>
            handleChange({ target: { name: "interestType", value } })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select interest type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple Interest</SelectItem>
            <SelectItem value="reducing_balance">Reducing Balance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loan Purpose */}
      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose of Loan</Label>
        <Textarea
          id="purpose"
          name="purpose"
          placeholder="Describe the purpose of this loan"
          value={formData.purpose}
          onChange={handleChange}
          className="min-h-[80px]"
        />
      </div>

      {/* Action */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={onCalculate}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          Calculate Loan Preview
        </Button>
      </div>
    </CardContent>
  </Card>
));


// Step 2: Collateral Information
const CollateralStep = memo(({ 
  formData, 
  handleNestedChange, 
  errors, 
  handleFileUpload, 
  removeDocument 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Collateral Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="collateralDescription">Collateral Description *</Label>
        <Textarea
          id="collateralDescription"
          name="description"
          placeholder="Describe the collateral being offered"
          value={formData.collateral.description}
          onChange={(e) => handleNestedChange('collateral', e)}
          className={`min-h-[100px] ${errors.collateralDescription ? "border-red-500" : ""}`}
        />
        {errors.collateralDescription && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.collateralDescription}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="collateralValue">Estimated Value (KES)</Label>
        <Input
          id="collateralValue"
          name="value"
          type="number"
          min="0"
          placeholder="0"
          value={formData.collateral.value}
          onChange={(e) => handleNestedChange('collateral', e)}
          className={errors.collateralValue ? "border-red-500" : ""}
        />
        {errors.collateralValue && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.collateralValue}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Supporting Documents</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop files here, or click to select
          </p>
          <Input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="document-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('document-upload')?.click()}
          >
            Choose Files
          </Button>
        </div>

        {formData.collateral.documents.length > 0 && (
         <div className="space-y-2">
          <Label>Uploaded Documents</Label>
          <div className="space-y-2">
            {formData.collateral.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <img
                  src={doc.preview || doc }
                  alt={`Document ${index + 1}`}
                  className="h-20 w-auto rounded shadow"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                 onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  removeDocument(index);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </CardContent>
  </Card>
));

// Step 3: Borrower and Guarantors
const PartiesStep = memo(({ 
  formData, 
  handleChange, 
  users,
  group, 
  groups, 
  errors,
  addGuarantor,
  updateGuarantor,
  removeGuarantor,
  isAdmin,
  userInfo
}) => {
  // 1️⃣ Build a flat, de‑duplicated list of { _id, name, email }
  const allOptions = useMemo(() => {
    const map = new Map();
    // flat users
    users.forEach(u => map.set(u._id, u));
    // nested group members
    group?.members?.forEach(m => {
      if (m.user?._id) {
        map.set(m.user._id, m.user);
      }
    });
    return Array.from(map.values());
  }, [users, group?.members]);

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Borrower & Guarantors
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="user">Borrower *</Label>
            {isAdmin ? (
              <Select
                value={formData.user}
                onValueChange={(value) =>
                  handleChange({ target: { name: "user", value } })
                }
              >
                <SelectTrigger className={errors.user ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select borrower" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                value={userInfo.user.name}
                disabled
                className="bg-gray-100"
              />
            )}
            {errors.user && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.user}
              </p>
            )}
        </div>
          <div className="space-y-2">
            <Label htmlFor="group">Group *</Label>
            <Select value={formData.group} onValueChange={(value) => handleChange({ target: { name: 'group', value } })}>
              <SelectTrigger className={errors.group ? "border-red-500" : ""}>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group._id} value={group._id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.group && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.group}
              </p>
            )}
          </div>
      </div>

      <Separator />
 
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Guarantors</Label>
          <Button type="button" onClick={addGuarantor} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Guarantor
          </Button>
        </div>

        {formData?.guarantors?.length > 0 ? (
          <div className="space-y-3">
            {formData.guarantors.map((guarantor, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Select value={guarantor.user} onValueChange={v => updateGuarantor(index, 'user', v)}>
                        <SelectTrigger>
                          <SelectValue>
                            {(() => {
                              const u = allOptions.find(u => u._id === guarantor.user);
                              return u ? `${u.name} (${u.email})` : 'Select guarantor';
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {allOptions.map(u => (
                            <SelectItem key={u._id} value={u._id}>
                              {u.name} ({u.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={guarantor.approved ? "default" : "secondary"}>
                        {guarantor.approved ? "Approved" : "Pending"}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuarantor(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No guarantors added yet</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)});

// Step 4: Review
const ReviewStep = memo(({ 
  formData, 
  users, 
  groups, 
  formatCurrency, 
  calculationResults 
}) => {
  const getBorrowerName = () => {
    const user = users.find(u => u._id === formData.user);
    return user ? `${user.name} (${user.email})` : 'Not selected';
  };

  const getGroupName = () => {
    const group = groups.find(g => g._id === formData.group);
    return group ? group.name : 'Not selected';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Review & Submit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loan Details Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Loan Details
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline" className="capitalize">{formData.loanType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Principal Amount:</span>
                <span className="font-medium">{formatCurrency(formData.principalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-medium">{formData.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repayment Period:</span>
                <span className="font-medium">{formData.repaymentPeriod} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Type:</span>
                <span className="font-medium capitalize">{formData.interestType.replace('_', ' ')}</span>
              </div>
              {formData.processingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <span className="font-medium">{formatCurrency(formData.processingFee)}</span>
                </div>
              )}
            </div>
          </div>

          {calculationResults && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Loan Calculation
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Interest:</span>
                    <span className="font-medium">{formatCurrency(calculationResults.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Repayable:</span>
                    <span className="font-medium text-primary">{formatCurrency(calculationResults.totalRepayable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span className="font-medium">{formatCurrency(calculationResults.monthlyPayment)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Collateral Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Collateral
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="font-medium max-w-xs text-right">
                  {formData.collateral.description || 'No description'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Value:</span>
                <span className="font-medium">{formatCurrency(formData.collateral.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Documents:</span>
                <span className="font-medium">{formData.collateral.documents.length} file(s)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Parties Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Parties
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Borrower:</span>
                <span className="font-medium max-w-xs text-right">{getBorrowerName()}</span>
              </div>
              {formData.loanType === 'group' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Group:</span>
                  <span className="font-medium">{getGroupName()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guarantors:</span>
                <span className="font-medium">{formData.guarantors.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

// Main LoanForm Component
const LoanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  

  // UI state
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redux state
  const { loading: loadingDetails, error: errorDetails, loan } = useSelector((state) => state.loanDetails);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, loan: createdLoan } = useSelector((state) => state.loanCreate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate, loan: UpdatedLoan = [] } = useSelector((state) => state.loanUpdate);
  const { loading: loadingUsers, users = [] } = useSelector((state) => state.userList);
  const { loading: loadingGroups, groups: Allgroups = [] } = useSelector((state) => state.groupList);
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const myGroups = useSelector((state) => state.myGroups);
  const { myGroups: myGroupsList = [] } = myGroups;


  const groupDetails = useSelector((state) => state.groupDetails);
  const { group } = groupDetails;

  const loanDocumentUpload = useSelector((state) => state.loanDocumentUpload);
  const { loading: loanDocumentUploadloading, success: successloanDocumentUpload, error:errorloanDocumentUpload, document = [] } = loanDocumentUpload;

  const isEditMode = Boolean(id);
  const loading = loadingCreate || loadingUpdate || loadingDetails || loanDocumentUploadloading;
  const error = errorCreate || errorUpdate || errorDetails || errorloanDocumentUpload;
  const isAdmin = userInfo?.user?.role === "Admin";

  const loanId = createdLoan?._id || loan?._id || id;


  // const groups = Allgroups || myGroupsList;
  const groups = isAdmin ? Allgroups : myGroupsList

  const [formData, setFormData] = useState({
    loanType: 'personal',
    principalAmount: 0,
    repaymentPeriod: 0,
    interestRate: 10,
    interestType: 'simple',
    processingFee: 0,
    purpose: '',
    collateral: {
      description: '',
      value: 0,
      documents: [],
    },
    user: userInfo?.user?._id || '',
    group: groups[0]?._id,
    guarantors: [],
    noteText: '',
  });

  const groupId = formData?.group;

  useEffect(() => {
    if (groupId){
      dispatch(getGroupDetails(groupId));
    }
  }, [dispatch, groupId]);

   // Load initial data
  useEffect(() => {
    if (loanId && isEditMode) {
      dispatch(getLoanDetails(loanId));
    }
    if (!isAdmin && userInfo?.user?._id) {
      handleChange({ target: { name: "user", value: userInfo.user._id } });
      dispatch(listMyGroups());
    } else {
      dispatch(listUsers());
      dispatch(listGroups());
    }
  }, [dispatch, loanId, isEditMode, isAdmin, userInfo]);


  // Set form values when loan details are loaded
  useEffect(() => {
    if (loanId && loan) {
      setFormData({
        loanType: loan.loanType || 'personal',
        principalAmount: loan.principalAmount || 0,
        repaymentPeriod: loan.repaymentPeriod || 0,
        interestType: loan.interestType || 'simple',
        purpose: loan.purpose || '',
        collateral: loan.collateral || {
          description: '',
          value: 0,
          documents: [],
        },
        user: loan.user?._id || '',
        group: loan.group?._id || '',
        guarantors:(loan.guarantors || []).map(g => ({
          user: typeof g.user === 'object' ? g.user?._id : g.user,
          approved: !!g.approved
        })),
        noteText: '',
      });
      setIsDirty(false);
    }
  }, [isEditMode, loan]);

  useEffect(() => {
    if (successUpdate) {
      navigate('/loans');
      dispatch(loanUpdateReset());
    }
  }, [successUpdate, navigate]);

  // Handle success actions
  useEffect(() => {
    if (successloanDocumentUpload && document) {
      const { documents } = formData.collateral;

        const alreadyUploaded = documents.filter(d => typeof d === 'string' || d.url);
        const uploadedUrls = document.uploadedFiles;

        // Combine new uploaded URLs with already-uploaded ones
        const finalDocuments = [
            ...alreadyUploaded.map(d => (typeof d === 'string' ? d : d.url)),
            ...uploadedUrls
          ];

        setFormData(prev => ({
          ...prev,
          collateral: {
            ...prev.collateral,
            documents: finalDocuments
          }
        }));
    }
  }, [successloanDocumentUpload, document]);

  useEffect(() => {
    if (successCreate && createdLoan) {
      setCurrentStep(3); // move to step 3 ONLY after successful loan creation
    }
  }, [successCreate, createdLoan]);

  useEffect(() => {
    if (errorCreate) {
      // Optionally show a toast or alert
      console.error('Loan creation failed:', errorCreate);
    }
  }, [errorCreate]);


  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  }, []);

  const handleNestedChange = useCallback((parent, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
    setIsDirty(true);
  }, []);

  // Handle file uploads
  const handleFileUpload = useCallback((files) => {
    const newDocuments = Array.from(files).map(file => ({
      file, // local File object
      preview: URL.createObjectURL(file) // optional: for preview
    }));

    setFormData(prev => ({
      ...prev,
      collateral: {
        ...prev.collateral,
        documents: [...prev.collateral.documents, ...newDocuments]
      }
    }));
    setIsDirty(true);
  }, []);



  const removeDocument = useCallback((index) => {
  setFormData(prev => {
    const newDocuments = [...prev.collateral.documents];
    const removedDoc = newDocuments[index];
    newDocuments.splice(index, 1);
    return {
      ...prev,
      collateral: {
        ...prev.collateral,
        documents: newDocuments
      }
    };
  });

  // Dispatch after state update
  if (typeof formData.collateral.documents[index] === 'string') {
    dispatch(removeCollateralDocument(loanId, formData.collateral.documents[index]));
  }

  setIsDirty(true);
}, [dispatch, loanId, formData.collateral.documents]);


  // Handle guarantors
  const addGuarantor = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      guarantors: [...prev.guarantors, { user: '', approved: false }]
    }));
    setIsDirty(true);
  }, []);

  const updateGuarantor = useCallback((index, field, value) => {
    setFormData(prev => {
      const updatedGuarantors = [...prev.guarantors];
      updatedGuarantors[index] = { ...updatedGuarantors[index], [field]: value };
      return {
        ...prev,
        guarantors: updatedGuarantors
      };
    });
    setIsDirty(true);
  }, []);

  const removeGuarantor = useCallback((index) => {
    setFormData(prev => {
      const updatedGuarantors = [...prev.guarantors];
      updatedGuarantors.splice(index, 1);
      return {
        ...prev,
        guarantors: updatedGuarantors
      };
    });
    setIsDirty(true);
  }, []);

  // Step validation
  const validateStep = (step) => {
    const errors = {};
    
    switch(step) {
      case 1:
        if (!formData.principalAmount || formData.principalAmount < 100) {
          errors.principalAmount = 'Please enter a valid loan amount';
        }
        if (!formData.repaymentPeriod || formData.repaymentPeriod < 1) {
          errors.repaymentPeriod = 'Repayment period must be at least 12 month';
        }
        if (formData.interestRate < 0 || formData.interestRate > 100) {
          errors.interestRate = 'Interest rate must be between 0% and 100%';
        }
        break;
      case 3:
        if (!formData.collateral.description.trim()) {
          errors.collateralDescription = 'Collateral description is required';
        }
        if (formData.collateral.value < 0) {
          errors.collateralValue = 'Collateral value cannot be negative';
        }
        break;
      case 2:
        if (!formData.user) {
          errors.user = 'Please select a borrower';
        }
        if (formData.loanType === 'group' && !formData.group) {
          errors.group = 'Group is required for group loans';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate loan repayment preview
const calculateLoanPreview = useCallback(() => {
  if (!validateStep(1)) return;

  const principal = parseFloat(formData.principalAmount);
  const rate = parseFloat(formData.interestRate);
  const term = parseInt(formData.repaymentPeriod);
  const fee = parseFloat(formData.processingFee) || 0;
  
  let totalInterest = 0;
  let monthlyPayment = 0;
  let totalRepayable = 0;

  if (formData.interestType === 'simple') {
    // Simple Interest: I = P * R * T / 100
    totalInterest = (principal * rate * term) / 100;
    totalRepayable = principal + totalInterest + fee;
    monthlyPayment = totalRepayable / term;
  } else {
    // Reducing Balance: Monthly Payment = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      totalRepayable = (monthlyPayment * term) + fee;
      totalInterest = totalRepayable - principal - fee;
    } else {
      monthlyPayment = principal / term;
      totalRepayable = principal + fee;
      totalInterest = 0;
    }
  }

  const results = {
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayable: Math.round(totalRepayable * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    effectiveRate: principal > 0 ? Math.round((totalInterest / principal) * 100 * 100) / 100 : 0
  };

  setCalculationResults(results);
  setShowCalculation(true);
}, [formData, validateStep]);

const validateDocuments = () => {
  const { documents } = formData.collateral;
  const isValid = documents.every(doc => typeof doc === 'string');
  return isValid;
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate all steps
  const allStepsValid = [1, 2, 3].every(step => validateStep(step));
  if (!allStepsValid) {
    // Find first invalid step
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        break;
      }
    }
    return;
  }
  if (!loanId) {
    alert("Please complete the loan creation step first.");
    setCurrentStep(2); // Return to step 2 where loan is created
    return; // ⛔ Stop here
  }
  
  // Validate documents
  if (!validateDocuments()) {
    alert("Please ensure all documents are properly uploaded.");
    return;
  }

  // Prepare form data for submission
  const submitData = {
    ...formData,
    principalAmount: parseFloat(formData.principalAmount),
    repaymentPeriod: parseInt(formData.repaymentPeriod),
    interestRate: parseFloat(formData.interestRate),
    processingFee: parseFloat(formData.processingFee) || 0,
    collateral: {
      ...formData.collateral,
      value: parseFloat(formData.collateral.value) || 0
    }
  };

  dispatch(updateLoan(loanId, submitData));
  
};

// Navigation between steps
const nextStep = async () => {
  if (!validateStep(currentStep)) return;
  if (currentStep === 2 && !isEditMode) {
    const submitData = {
        ...formData,
        principalAmount: parseFloat(formData.principalAmount),
        repaymentPeriod: parseInt(formData.repaymentPeriod),
        collateral: {
          ...formData.collateral,
          value: parseFloat(formData.collateral.value) || 0
        }
      };
    // Dispatch and wait for result
    dispatch(createLoan(submitData)); // Wait for Redux to handle success
    return;
  }

  if (currentStep === 3) {
    // Split documents: already uploaded vs to upload
    const { documents } = formData.collateral;
    const toUpload = documents.filter(d => d.file);

    if (toUpload.length > 0) {
      const form = new FormData();
      toUpload.forEach(doc => form.append('documents', doc.file));

      dispatch(uploadCollateralDocuments(loanId, form));
    }
  }
  setCurrentStep(prev => Math.min(prev + 1, 4));
};



const prevStep = () => {
  setCurrentStep(prev => Math.max(prev - 1, 1));
};

const goToStep = (step) => {
  setCurrentStep(step);
};

// This component is now inline in the main render

// Calculation Results Dialog
const CalculationDialog = ({ open, onClose, results, formatCurrency }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Loan Calculation Results
        </DialogTitle>
        <DialogDescription>
          Preview of loan repayment terms based on current inputs
        </DialogDescription>
      </DialogHeader>
      
      {results && (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Monthly Payment</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(results.monthlyPayment)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 border rounded">
                <p className="text-xs text-muted-foreground">Total Interest</p>
                <p className="font-semibold">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div className="text-center p-2 border rounded">
                <p className="text-xs text-muted-foreground">Total Repayable</p>
                <p className="font-semibold">{formatCurrency(results.totalRepayable)}</p>
              </div>
            </div>
            
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-xs text-muted-foreground">Effective Interest Rate</p>
              <p className="font-semibold text-blue-600">{results.effectiveRate}%</p>
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              These calculations are estimates. Final terms may vary based on approval and additional fees.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <DialogFooter>
        <Button onClick={onClose} variant="outline">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Render current step content
const renderStepContent = () => {
  switch (currentStep) {
    case 1:
      return (
        <LoanDetailsStep
          formData={formData}
          handleChange={handleChange}
          errors={validationErrors}
          formatCurrency={formatCurrency}
          onCalculate={calculateLoanPreview}
          isAdmin={isAdmin}
        />
      );
    case 3:
      return (
        <CollateralStep
          formData={formData}
          handleNestedChange={handleNestedChange}
          errors={validationErrors}
          handleFileUpload={handleFileUpload}
          removeDocument={removeDocument}
        />
      );
    case 2:
      return (
        <PartiesStep
          formData={formData}
          handleChange={handleChange}
          users={users}
          group={group}
          groups={groups}
          errors={validationErrors}
          addGuarantor={addGuarantor}
          updateGuarantor={updateGuarantor}
          removeGuarantor={removeGuarantor}
          isAdmin={isAdmin}
          userInfo={userInfo}
        />
      );
    case 4:
      return (
        <ReviewStep
          formData={formData}
          users={users}
          groups={groups}
          formatCurrency={formatCurrency}
          calculationResults={calculationResults}
        />
      );
    default:
      return null;
  }
};

// Main render
return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button className="hidden sm:inline" variant="ghost" onClick={() => navigate('/loans')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            {isEditMode ? 'Edit Loan' : 'Create New Loan'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode && loan 
              ? `Editing loan #${loan._id?.substring(0, 5)} for ${loan.user?.name}` 
              : 'Set up your loan application'
            }
          </p>
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              {[
                { number: 1, title: 'Loan Details', icon: FileText },
                { number: 2, title: 'Parties', icon: Users },
                { number: 3, title: 'Collateral', icon: Shield },
                { number: 4, title: 'Review', icon: ClipboardList }
              ].map((step) => {
                const IconComponent = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors cursor-pointer
                      ${isActive ? 'bg-primary text-primary-foreground border-primary' : 
                        isCompleted ? 'bg-green-500 text-white border-green-500' : 
                        'bg-muted text-muted-foreground border-muted-foreground/20'}
                    `}
                    onClick={() => goToStep(step.number)}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <IconComponent className="h-4 w-4" />
                      )}
                    </div>
                    <div className="text-xs font-medium text-center">
                      <div>{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
      </form>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading || !isDirty}>
                  {loading ? (
                    loanDocumentUploadloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditMode ? 'Uploading Documents...' : 'Uploading Documents...'}
                      </>
                    ) : (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    )
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditMode ? 'Update Loan' : 'Create Loan'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results Dialog */}
      <CalculationDialog
        open={showCalculation}
        onClose={() => setShowCalculation(false)}
        results={calculationResults}
        formatCurrency={formatCurrency}
      />
    </div>
);
};

// Set display name for debugging
LoanForm.displayName = 'LoanForm';

export default LoanForm;