import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  DollarSign,
  CreditCard,
  Calendar,
  Save,
  X,
  AlertCircle,
  Info,
  CalendarDays,
  Settings,
  Percent
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateGroup } from '../../actions/groupActions';

const GroupSettingsEditor = ({ 
  group, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const dispatch = useDispatch();
  
  // Local state for all settings
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('contributions');

  // Initialize settings from group data
  useEffect(() => {
    if (group?.settings) {
      setSettings({
        contributionSchedule: group.settings.contributionSchedule || settings.contributionSchedule,
        loanSettings: group.settings.loanSettings || settings.loanSettings,
        meetingSchedule: group.settings.meetingSchedule || settings.meetingSchedule,
      });
    }
  }, [group]);

  // Handle contribution changes
  const handleContributionChange = (field, value) => {
    setSettings({
      ...settings,
      contributionSchedule: {
        ...settings.contributionSchedule,
        [field]: field === 'amount' || field === 'dueDay' ? Number(value) : value,
      },
    });
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle loan settings changes
  const handleLoanSettingsChange = (field, value) => {
    setSettings({
      ...settings,
      loanSettings: {
        ...settings.loanSettings,
        [field]: typeof value === 'boolean' ? value : Number(value),
      },
    });
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle meeting schedule changes
  const handleMeetingScheduleChange = (field, value) => {
    setSettings({
      ...settings,
      meetingSchedule: {
        ...settings.meetingSchedule,
        [field]: field === 'dayOfMonth' ? Number(value) : value,
      },
    });
  };

  // Validate all settings
  const validateSettings = () => {
    let isValid = true;
    const newErrors = {};

    // Validate contribution settings
    if (settings.contributionSchedule.amount <= 0) {
      newErrors.amount = 'Contribution amount must be greater than 0';
      isValid = false;
    }

    if (settings.contributionSchedule.dueDay < 1 || settings.contributionSchedule.dueDay > 31) {
      newErrors.dueDay = 'Due day must be between 1 and 31';
      isValid = false;
    }

    // Validate loan settings
    if (settings.loanSettings.interestRate < 0 || settings.loanSettings.interestRate > 100) {
      newErrors.interestRate = 'Interest rate must be between 0 and 100';
      isValid = false;
    }

    if (settings.loanSettings.maxLoanMultiplier <= 0 || settings.loanSettings.maxLoanMultiplier > 20) {
      newErrors.maxLoanMultiplier = 'Loan multiplier must be between 1 and 20';
      isValid = false;
    }

    if (settings.loanSettings.maxRepaymentPeriod < 1 || settings.loanSettings.maxRepaymentPeriod > 60) {
      newErrors.maxRepaymentPeriod = 'Repayment period must be between 1 and 60 months';
      isValid = false;
    }

    // Validate meeting schedule
    if (settings.meetingSchedule.dayOfMonth < 1 || settings.meetingSchedule.dayOfMonth > 31) {
      newErrors.dayOfMonth = 'Day of month must be between 1 and 31';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateSettings()) {
      return;
    }

    setLoading(true);
    
    try {
      const updatedGroup = {
        ...group,
        settings: settings
      };

      await dispatch(updateGroup(updatedGroup));
      
      if (onSave) {
        onSave(settings);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating group settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset to original values
    if (group?.settings) {
      setSettings({
        contributionSchedule: group.settings.contributionSchedule || settings.contributionSchedule,
        loanSettings: group.settings.loanSettings || settings.loanSettings,
        meetingSchedule: group.settings.meetingSchedule || settings.meetingSchedule,
      });
    }
    setErrors({});
    onClose();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Edit Group Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contributions" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Contributions
              </TabsTrigger>
              <TabsTrigger value="loans" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Loans
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Meetings
              </TabsTrigger>
            </TabsList>

            {/* Contribution Settings Tab */}
            <TabsContent value="contributions" className="space-y-6">
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
                  {settings.contributionSchedule.frequency.charAt(0).toUpperCase() + settings.contributionSchedule.frequency.slice(1)} contribution: {formatCurrency(settings.contributionSchedule.amount)} due on day {settings.contributionSchedule.dueDay}
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Loan Settings Tab */}
            <TabsContent value="loans" className="space-y-6">
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
                    className={errors.maxRepaymentPeriod ? "border-red-500" : ""}
                  />
                  {errors.maxRepaymentPeriod && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.maxRepaymentPeriod}
                    </p>
                  )}
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

              <Alert>
                <Percent className="h-4 w-4" />
                <AlertDescription>
                  Max loan: {settings.loanSettings.maxLoanMultiplier}x contributions at {settings.loanSettings.interestRate}% interest
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Meeting Schedule Tab */}
            <TabsContent value="meetings" className="space-y-6">
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
                    className={errors.dayOfMonth ? "border-red-500" : ""}
                  />
                  {errors.dayOfMonth && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.dayOfMonth}
                    </p>
                  )}
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
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupSettingsEditor;