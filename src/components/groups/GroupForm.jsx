import React, { useEffect, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  DollarSign, 
  CreditCard, 
  Calendar,
  Check,
  Save,
  X,
  Settings,
  Info,
  ClipboardList,
  Percent,
  Building2,
  HandCoins,
  CalendarDays,
  Target,
  Shield,
  AlertCircle,
  CheckCircle
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
import { createGroup, updateGroup, getGroupDetails } from '../../actions/groupActions';
import { formatCurrency } from '@/lib/utils';


 // Step 1: Basic Information
  const BasicInfoStep = memo(({ name, setName, nameError, groupType, setGroupType, description, setDescription }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Basic Group Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && ( // Use nameError here
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {nameError} {/* Use nameError here */}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupType">Group Type</Label>
          <Select value={groupType} onValueChange={setGroupType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chama">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Chama
                </div>
              </SelectItem>
              <SelectItem value="investment">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Investment Club  
                </div>
              </SelectItem>
              <SelectItem value="savings">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Savings Group
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your group's purpose and goals"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  ));
 // Step 2: Contribution Settings
  const ContributionStep = memo(({ settings, handleContributionChange, errors, formatCurrency }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Contribution Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select 
              value={settings.contributionSchedule.frequency} 
              onValueChange={(value) => handleContributionChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              placeholder="0"
              value={settings.contributionSchedule.amount}
              onChange={(e) => handleContributionChange('amount', e.target.value)}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDay">Due Day of Month</Label>
          <Input
            id="dueDay"
            type="number"
            min="1"
            max="31"
            value={settings.contributionSchedule.dueDay}
            onChange={(e) => handleContributionChange('dueDay', e.target.value)}
            className={errors.dueDay ? "border-red-500" : ""}
          />
          {errors.dueDay && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.dueDay}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Day of the month when contributions are due (1-31)
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Monthly contribution: {formatCurrency(settings.contributionSchedule.amount)} due on day {settings.contributionSchedule.dueDay}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  ));

  // Step 3: Loan Settings
  const LoanSettingsStep = memo(({ settings, handleLoanSettingsChange, errors }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Loan Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxLoanMultiplier">Maximum Loan Multiplier *</Label>
            <Input
              id="maxLoanMultiplier"
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={settings.loanSettings.maxLoanMultiplier}
              onChange={(e) => handleLoanSettingsChange('maxLoanMultiplier', e.target.value)}
              className={errors.maxLoanMultiplier ? "border-red-500" : ""}
            />
            {errors.maxLoanMultiplier && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.maxLoanMultiplier}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Times contribution amount members can borrow
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%) *</Label>
            <Input
              id="interestRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.loanSettings.interestRate}
              onChange={(e) => handleLoanSettingsChange('interestRate', e.target.value)}
              className={errors.interestRate ? "border-red-500" : ""}
            />
            {errors.interestRate && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.interestRate}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxRepaymentPeriod">Max Repayment Period (months)</Label>
            <Input
              id="maxRepaymentPeriod"
              type="number"
              min="1"
              max="60"
              value={settings.loanSettings.maxRepaymentPeriod}
              onChange={(e) => handleLoanSettingsChange('maxRepaymentPeriod', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processingFee">Processing Fee (%)</Label>
            <Input
              id="processingFee"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={settings.loanSettings.processingFee}
              onChange={(e) => handleLoanSettingsChange('processingFee', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="latePaymentFee">Late Payment Fee (%)</Label>
          <Input
            id="latePaymentFee"
            type="number"
            min="0"
            max="20"
            step="0.1"
            value={settings.loanSettings.latePaymentFee}
            onChange={(e) => handleLoanSettingsChange('latePaymentFee', e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Guarantors</Label>
              <p className="text-sm text-muted-foreground">
                Members need guarantors for loans
              </p>
            </div>
            <Switch
              checked={settings.loanSettings.requiresGuarantors}
              onCheckedChange={(checked) => handleLoanSettingsChange('requiresGuarantors', checked)}
            />
          </div>

          {settings.loanSettings.requiresGuarantors && (
            <div className="space-y-2">
              <Label htmlFor="guarantorsRequired">Number of Guarantors Required</Label>
              <Input
                id="guarantorsRequired"
                type="number"
                min="1"
                max="5"
                value={settings.loanSettings.guarantorsRequired}
                onChange={(e) => handleLoanSettingsChange('guarantorsRequired', e.target.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  ));

  // Step 4: Meeting Schedule
  const MeetingScheduleStep = memo(({ settings, handleMeetingScheduleChange }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Meeting Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Meeting Frequency</Label>
            <Select 
              value={settings.meetingSchedule.frequency} 
              onValueChange={(value) => handleMeetingScheduleChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfMonth">Day of Month</Label>
            <Input
              id="dayOfMonth"
              type="number"
              min="1"
              max="31"
              value={settings.meetingSchedule.dayOfMonth}
              onChange={(e) => handleMeetingScheduleChange('dayOfMonth', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Meeting Time</Label>
            <Input
              id="time"
              type="time"
              value={settings.meetingSchedule.time}
              onChange={(e) => handleMeetingScheduleChange('time', e.target.value)}
            />
          </div>
        </div>

        <Alert>
          <CalendarDays className="h-4 w-4" />
          <AlertDescription>
            {settings.meetingSchedule.frequency.charAt(0).toUpperCase() + settings.meetingSchedule.frequency.slice(1)} meetings on day {settings.meetingSchedule.dayOfMonth} at {settings.meetingSchedule.time}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  ));

  // Step 5: Review & Submit
  const ReviewStep = memo(({ name, groupType, description, settings, formatCurrency }) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Review & Submit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Basic Information
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline">{groupType}</Badge>
              </div>
              {description && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium max-w-xs text-right">{description}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Contribution Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Contributions
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequency:</span>
                <span className="font-medium capitalize">{settings.contributionSchedule.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{formatCurrency(settings.contributionSchedule.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Day:</span>
                <span className="font-medium">Day {settings.contributionSchedule.dueDay}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loan Settings Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Loan Settings
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Loan:</span>
                <span className="font-medium">{settings.loanSettings.maxLoanMultiplier}x contributions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-medium">{settings.loanSettings.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee:</span>
                <span className="font-medium">{settings.loanSettings.processingFee}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guarantors:</span>
                <span className="font-medium">
                  {settings.loanSettings.requiresGuarantors 
                    ? `${settings.loanSettings.guarantorsRequired} required`
                    : 'Not required'
                  }
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Meeting Schedule Review */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meeting Schedule
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequency:</span>
                <span className="font-medium capitalize">{settings.meetingSchedule.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day of Month:</span>
                <span className="font-medium">{settings.meetingSchedule.dayOfMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{settings.meetingSchedule.time}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ));


const GroupForm = () => {
  const { id } = useParams();
  const groupId = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [groupType, setGroupType] = useState('chama');
  const [description, setDescription] = useState('');
  const [settings, setSettings] = useState({
    contributionSchedule: {
      frequency: 'monthly',
      amount: 0,
      dueDay: 1,
    },
    loanSettings: {
      maxLoanMultiplier: 3,
      interestRate: 10,
      maxRepaymentPeriod: 12,
      latePaymentFee: 5,
      processingFee: 1,
      requiresGuarantors: true,
      guarantorsRequired: 2,
    },
    meetingSchedule: {
      frequency: 'monthly',
      dayOfMonth: 15,
      time: '18:00',
    },
  });

  // Form validation state
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  // Redux state
  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading: loadingDetails, error: errorDetails, group } = groupDetails;

  const groupCreate = useSelector((state) => state.groupCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = groupCreate;

  const groupUpdate = useSelector((state) => state.groupUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = groupUpdate;

  const isEditing = !!groupId;
  const loading = loadingCreate || loadingUpdate || loadingDetails;
  const error = errorCreate || errorUpdate || errorDetails;

  // Load existing group data if editing
  useEffect(() => {
    if (successCreate || successUpdate) {
      navigate('/groups');
    }

    if (groupId) {
      if (!group || group._id !== groupId) {
        dispatch(getGroupDetails(groupId));
      } else {
        setName(group.name);
        setGroupType(group.groupType);
        setDescription(group.description);
        setSettings(group.settings || settings);
      }
    }
  }, [dispatch, groupId, group, successCreate, successUpdate, navigate]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      setValidated(true);
      return;
    }

    const groupData = {
      name,
      groupType,
      description,
      settings,
    };

    if (groupId) {
      dispatch(updateGroup({ _id: groupId, ...groupData }));
    } else {
      dispatch(createGroup(groupData));
    }
  };

  // Input change handlers
  const handleContributionChange = useCallback((field, value) => {
    setSettings(prev => ({
      ...prev,
      contributionSchedule: {
        ...prev.contributionSchedule,
        [field]: field === 'amount' || field === 'dueDay' ? Number(value) : value,
      },
    }));
  }, []);

  const handleLoanSettingsChange = useCallback((field, value) => {
    setSettings(prev => ({
      ...prev,
      loanSettings: {
        ...prev.loanSettings,
        [field]: typeof value === 'boolean' ? value : Number(value),
      },
    }));
  }, []);

  const handleMeetingScheduleChange = useCallback((field, value) => {
    setSettings(prev => ({
      ...prev,
      meetingSchedule: {
        ...prev.meetingSchedule,
        [field]: field === 'dayOfMonth' ? Number(value) : value,
      },
    }));
  }, []);

  // Progress navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Step validation
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    if (step === 1) {
      if (!name.trim()) {
        newErrors.name = 'Group name is required';
        isValid = false;
      }
      if (name.length > 100) {
        newErrors.name = 'Group name must be less than 100 characters';
        isValid = false;
      }
    } 
    else if (step === 2) {
      if (settings.contributionSchedule.amount <= 0) {
        newErrors.amount = 'Contribution amount must be greater than 0';
        isValid = false;
      }
      if (settings.contributionSchedule.dueDay < 1 || settings.contributionSchedule.dueDay > 31) {
        newErrors.dueDay = 'Due day must be between 1 and 31';
        isValid = false;
      }
    }
    else if (step === 3) {
      if (settings.loanSettings.interestRate < 0 || settings.loanSettings.interestRate > 100) {
        newErrors.interestRate = 'Interest rate must be between 0 and 100';
        isValid = false;
      }
      if (settings.loanSettings.maxLoanMultiplier <= 0 || settings.loanSettings.maxLoanMultiplier > 20) {
        newErrors.maxLoanMultiplier = 'Loan multiplier must be between 1 and 20';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Progress calculation
  const calculateProgress = () => {
    return ((currentStep - 1) / 4) * 100;
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep name={name} setName={setName} nameError={errors.name} groupType={groupType} setGroupType={setGroupType} description={description} setDescription={setDescription} />;
      case 2:
        return <ContributionStep settings={settings} handleContributionChange={handleContributionChange} errors={errors} formatCurrency={formatCurrency} />;
      case 3:
        return <LoanSettingsStep settings={settings} handleLoanSettingsChange={handleLoanSettingsChange} errors={errors} />;
      case 4:
        return <MeetingScheduleStep settings={settings} handleMeetingScheduleChange={handleMeetingScheduleChange} />;
      case 5:
        return <ReviewStep name={name} groupType={groupType} description={description} settings={settings} formatCurrency={formatCurrency} />;
      default:
        return <BasicInfoStep name={name} setName={setName} errors={errors} groupType={groupType} setGroupType={setGroupType} description={description} setDescription={setDescription} />;
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Users },
    { number: 2, title: 'Contributions', icon: DollarSign },
    { number: 3, title: 'Loans', icon: CreditCard },
    { number: 4, title: 'Meetings', icon: Calendar },
    { number: 5, title: 'Review', icon: Check }
  ];

  if (loadingDetails && groupId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading group details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {isEditing ? 'Edit Group' : 'Create New Group'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update your group settings' : 'Set up your savings group'}
          </p>
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isActive ? 'bg-primary text-primary-foreground border-primary' : 
                        isCompleted ? 'bg-green-500 text-white border-green-500' : 
                        'bg-muted text-muted-foreground border-muted-foreground/20'}
                    `}>
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
            <Progress value={calculateProgress()} className="h-2" />
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
        {renderCurrentStep()}
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
              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update Group' : 'Create Group'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupForm;