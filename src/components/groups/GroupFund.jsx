import React, { useState, useCallback, memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Smartphone,
  Banknote,
  ShieldCheck,
  Send,
  PlusCircle,
  ArrowRightLeft,
  Users,
  History,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

import {
  contributeFromWallet,
  recordCashContribution,
  recordMobileMoneyContribution,
  fundWallet,
  payMember,
  getGroupContributions,
  getMemberContributions
} from '../../actions/groupActions';

// Tab configurations for different scenarios
const TAB_SCENARIOS = {
  GROUP_MANAGEMENT: ['wallet', 'cash', 'mobile', 'fund', 'pay'], // Full admin/treasurer access
  USER_CONTRIBUTION: ['wallet'], // Regular user contribution only
  WALLET_FUNDING: ['fund'], // Only wallet funding
  PAYMENT_ONLY: ['pay'], // Only payment functionality
  CONTRIBUTION_ONLY: ['wallet', 'cash', 'mobile'], // Only contribution methods
  ADMIN_OPERATIONS: ['fund', 'pay'], // Only admin operations
};

// Tab metadata
const TAB_CONFIG = {
  wallet: {
    icon: Wallet,
    label: 'Wallet',
    title: 'Wallet Contribution',
    buttonText: 'Contribute',
    requiresAdmin: false,
  },
  cash: {
    icon: Banknote,
    label: 'Cash',
    title: 'Cash Contribution',
    buttonText: 'Record Cash',
    requiresAdmin: true,
  },
  mobile: {
    icon: Smartphone,
    label: 'Mobile Money',
    title: 'Mobile Money',
    buttonText: 'Record Payment',
    requiresAdmin: true,
  },
  fund: {
    icon: PlusCircle,
    label: 'Fund Group',
    title: 'Fund Group Wallet',
    buttonText: 'Fund Wallet',
    requiresAdmin: true,
  },
  pay: {
    icon: ArrowRightLeft,
    label: 'Pay Member',
    title: 'Pay Member',
    buttonText: 'Send Payment',
    requiresAdmin: true,
  },
};

// Individual tab components
const WalletTab = memo(({ amount, setAmount, onSubmit, isLoading, myloans }) => {
  const [customAllocation, setCustomAllocation] = useState(false);
  const [savingsPercentage, setSavingsPercentage] = useState(20);
  const [loanPercentage, setLoanPercentage] = useState(0);

  const numericAmount = parseFloat(amount) || 0;

  // Calculate loan information
  const loanInfo = useMemo(() => {
    if (!myloans || !Array.isArray(myloans) || myloans.length === 0) {
      return {
        hasLoans: false,
        totalDue: 0,
        nextPaymentDue: 0,
        loansCount: 0,
        loans: []
      };
    }

    // Handle both single loan object and array of loans
    const loansArray = Array.isArray(myloans) ? myloans : [myloans];
    
    const activeLoans = loansArray.filter(loan => 
      loan && 
      loan.status !== 'paid' && 
      loan.status !== 'closed' &&
      (loan.remainingBalance > 0 || loan.nextPaymentDue?.amount > 0)
    );

    const totalDue = activeLoans.reduce((sum, loan) => {
      return sum + (loan.nextPaymentDue?.amount || 0);
    }, 0);

    const nextPaymentDue = activeLoans.length > 0 ? 
      Math.min(...activeLoans.map(loan => loan.nextPaymentDue?.amount || 0).filter(amount => amount > 0)) : 0;

    return {
      hasLoans: activeLoans.length > 0,
      totalDue: Math.round(totalDue),
      nextPaymentDue: Math.round(nextPaymentDue),
      loansCount: activeLoans.length,
      loans: activeLoans
    };
  }, [myloans]);

  // Auto-calculate loan allocation based on available amount and due payments
  const autoLoanAllocation = useMemo(() => {
    if (!loanInfo.hasLoans || numericAmount <= 0) return 0;
    
    const remainingAfterSavings = numericAmount * (savingsPercentage / 100);
    const availableForLoans = numericAmount - remainingAfterSavings;
    
    // Suggest paying at least the minimum due, but not more than available
    const suggestedLoanPayment = Math.min(loanInfo.nextPaymentDue, availableForLoans * 0.5);
    
    return Math.round((suggestedLoanPayment / numericAmount) * 100);
  }, [numericAmount, loanInfo, savingsPercentage]);

  // Calculate final allocations
  const allocations = useMemo(() => {
    const finalLoanPercentage = customAllocation ? loanPercentage : autoLoanAllocation;
    const finalSavingsPercentage = customAllocation ? savingsPercentage : 20;
    const finalGroupPercentage = 100 - finalSavingsPercentage - finalLoanPercentage;

    return {
      savings: {
        percentage: finalSavingsPercentage,
        amount: numericAmount ? (numericAmount * (finalSavingsPercentage / 100)).toFixed(2) : '0.00'
      },
      group: {
        percentage: finalGroupPercentage,
        amount: numericAmount ? (numericAmount * (finalGroupPercentage / 100)).toFixed(2) : '0.00'
      },
      loans: {
        percentage: finalLoanPercentage,
        amount: numericAmount ? (numericAmount * (finalLoanPercentage / 100)).toFixed(2) : '0.00'
      }
    };
  }, [numericAmount, customAllocation, savingsPercentage, loanPercentage, autoLoanAllocation]);

  // Validation
  const isValidAllocation = useMemo(() => {
    const totalPercentage = allocations.savings.percentage + allocations.group.percentage + allocations.loans.percentage;
    return totalPercentage === 100 && allocations.group.percentage >= 0;
  }, [allocations]);

  const handlePercentageChange = (type, value) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    
    if (type === 'savings') {
      setSavingsPercentage(numValue);
      // Adjust loan percentage if total exceeds 100
      const remaining = 100 - numValue;
      if (loanPercentage > remaining) {
        setLoanPercentage(Math.max(0, remaining));
      }
    } else if (type === 'loans') {
      setLoanPercentage(numValue);
      // Adjust savings percentage if total exceeds 100
      const remaining = 100 - numValue;
      if (savingsPercentage > remaining) {
        setSavingsPercentage(Math.max(0, remaining));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Total Contribution Amount</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {/* Loan Information */}
      {loanInfo.hasLoans && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="flex-1 text-sm">
                <div className="font-medium text-orange-800">
                  Active Loans ({loanInfo.loansCount})
                </div>
                <div className="text-orange-700 mt-1">
                  Next payment due: KES {loanInfo.nextPaymentDue.toLocaleString()}
                  {loanInfo.loansCount > 1 && (
                    <div className="text-xs mt-1">
                      Total due across all loans: KES {loanInfo.totalDue.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocation Method Toggle */}
      {loanInfo.hasLoans && numericAmount > 0 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!customAllocation ? "default" : "outline"}
              size="sm"
              onClick={() => setCustomAllocation(false)}
            >
              Auto Allocation
            </Button>
            <Button
              type="button"
              variant={customAllocation ? "default" : "outline"}
              size="sm"
              onClick={() => setCustomAllocation(true)}
            >
              Custom Allocation
            </Button>
          </div>

          {/* Custom Allocation Controls */}
          {customAllocation && (
            <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Savings %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={savingsPercentage}
                    onChange={(e) => handlePercentageChange('savings', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Loans %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={loanPercentage}
                    onChange={(e) => handlePercentageChange('loans', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Group allocation: {allocations.group.percentage}% (automatically calculated)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Allocation Breakdown */}
      {numericAmount > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Allocation Breakdown:</div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {allocations.savings.percentage}%
                </Badge>
                to <strong>Savings</strong>:
              </span>
              <span>KES {allocations.savings.amount}</span>
            </div>
            
            {loanInfo.hasLoans && allocations.loans.percentage > 0 && (
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs border-orange-300">
                    {allocations.loans.percentage}%
                  </Badge>
                  to <strong>Loans</strong>:
                </span>
                <span>KES {allocations.loans.amount}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Badge variant="default" className="text-xs">
                  {allocations.group.percentage}%
                </Badge>
                to <strong>Group</strong>:
              </span>
              <span>KES {allocations.group.amount}</span>
            </div>
          </div>
          
          {!isValidAllocation && (
            <div className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Invalid allocation: Total must equal 100%
            </div>
          )}
        </div>
      )}

      <Button 
        className="w-full mt-4" 
        onClick={onSubmit} 
        disabled={!numericAmount || isLoading || !isValidAllocation}
      >
        {isLoading ? (
          <LoadingSpinner text="Processing..." />
        ) : (
          <ButtonContent icon={Send} text="Contribute" />
        )}
      </Button>

      {/* Loan Payment Status */}
      {loanInfo.hasLoans && numericAmount > 0 && allocations.loans.percentage > 0 && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          This contribution will help with your loan payments
        </div>
      )}
    </div>
  );
});


const CashTab = memo(({ amount, setAmount, notes, setNotes, account, setAccount, onSubmit, isLoading }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
    <AccountSelector account={account} setAccount={setAccount} />
    <div className="space-y-2">
      <Label>Notes</Label>
      <Input
        placeholder="Transaction notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
    <Button 
      className="w-full mt-4" 
      onClick={onSubmit} 
      disabled={!amount || isLoading}
    >
      {isLoading ? (
        <LoadingSpinner text="Processing..." />
      ) : (
        <ButtonContent icon={Send} text="Record Cash" />
      )}
    </Button>
  </div>
));

const MobileTab = memo(({ amount, setAmount, notes, setNotes, reference, setReference, onSubmit, isLoading }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Transaction Reference</Label>
      <Input
        placeholder="e.g. MTN-MOMO-20250420-12345"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label>Notes</Label>
      <Input
        placeholder="Transaction notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
    <Button 
      className="w-full mt-4" 
      onClick={onSubmit} 
      disabled={!amount || !reference || isLoading}
    >
      {isLoading ? (
        <LoadingSpinner text="Processing..." />
      ) : (
        <ButtonContent icon={Send} text="Record Payment" />
      )}
    </Button>
  </div>
));

const FundTab = memo(({ amount, setAmount, notes, setNotes, account, setAccount, onSubmit, isLoading }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
    <AccountSelector account={account} setAccount={setAccount} />
    <div className="space-y-2">
      <Label>Notes</Label>
      <Input
        placeholder="Funding description (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
    <Button 
      className="w-full mt-4" 
      onClick={onSubmit} 
      disabled={!amount || isLoading}
    >
      {isLoading ? (
        <LoadingSpinner text="Processing..." />
      ) : (
        <ButtonContent icon={Send} text="Fund Wallet" />
      )}
    </Button>
  </div>
));

const PayTab = memo(({ 
  amount, 
  setAmount, 
  notes, 
  setNotes, 
  account, 
  setAccount, 
  targetMemberId, 
  setTargetMemberId, 
  members, 
  onSubmit, 
  isLoading 
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
    <AccountSelector account={account} setAccount={setAccount} />
    <div className="space-y-2">
      <Label>Member</Label>
      <Select value={targetMemberId} onValueChange={setTargetMemberId}>
        <SelectTrigger>
          <SelectValue placeholder="Select member" />
        </SelectTrigger>
        <SelectContent>
          {members?.map((member) => (
            <SelectItem key={member._id} value={member._id} className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label>Notes</Label>
      <Input
        placeholder="Payment description (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
    <Button 
      className="w-full mt-4" 
      onClick={onSubmit} 
      disabled={!amount || !targetMemberId || isLoading}
    >
      {isLoading ? (
        <LoadingSpinner text="Processing..." />
      ) : (
        <ButtonContent icon={Send} text="Send Payment" />
      )}
    </Button>
  </div>
));

// Reusable components
const AccountSelector = memo(({ account, setAccount }) => (
  <div className="space-y-2">
    <Label>Account</Label>
    <Select value={account} onValueChange={setAccount}>
      <SelectTrigger>
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="savingsAccount" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" /> Savings
        </SelectItem>
        <SelectItem value="loanAccount" className="flex items-center gap-2">
          <History className="h-4 w-4" /> Loan
        </SelectItem>
        <SelectItem value="interestEarnedAccount" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Interest
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
));

const LoadingSpinner = memo(({ text }) => (
  <span className="flex items-center gap-2">
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {text}
  </span>
));

const ButtonContent = memo(({ icon: Icon, text }) => (
  <span className="flex items-center gap-2">
    <Icon className="w-4 h-4" />
    {text}
  </span>
));

const GroupFund = ({ 
  isOpen, 
  onClose, 
  groupId, 
  currentUser, 
  isAdmin,
  myloans, 
  isTreasurer, 
  members,
  scenario = 'GROUP_MANAGEMENT', // New prop to control which tabs are shown
  defaultTab = null, // New prop to set default active tab
  title = 'Group Funds Management' // Customizable title
}) => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');
  const [account, setAccount] = useState('savingsAccount');
  const [targetMemberId, setTargetMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine available tabs based on scenario and permissions
  const getAvailableTabs = useCallback(() => {
    let scenarioTabs = TAB_SCENARIOS[scenario] || TAB_SCENARIOS.GROUP_MANAGEMENT;
    
    // Filter tabs based on user permissions
    const availableTabs = scenarioTabs.filter(tab => {
      const config = TAB_CONFIG[tab];
      if (!config) return false;
      
      // If tab requires admin privileges, check user permissions
      if (config.requiresAdmin) {
        return isAdmin || isTreasurer;
      }
      
      return true;
    });

    return availableTabs;
  }, [scenario, isAdmin, isTreasurer]);

  const availableTabs = getAvailableTabs();
  const [tab, setTab] = useState(defaultTab && availableTabs.includes(defaultTab) ? defaultTab : availableTabs[0]);

  const buildPayload = useCallback(() => {
    const numericAmount = Number(amount);
    const note = notes?.trim();
    const ref = reference?.trim();
    const acc = account;

    // Calculate loan information for wallet contributions
    const calculateWalletAllocations = () => {
      if (!myloans || numericAmount <= 0) {
        // Default allocation without loans
        return [
          {
            account: 'savingsAccount',
            amount: parseFloat((numericAmount * 0.2).toFixed(2))
          },
          {
            account: 'groupAccount',
            amount: parseFloat((numericAmount * 0.8).toFixed(2))
          }
        ];
      }

      // Handle loan information
      const loansArray = Array.isArray(myloans) ? myloans : [myloans];
      const activeLoans = loansArray.filter(loan => 
        loan && 
        loan.status !== 'paid' && 
        loan.status !== 'closed' &&
        (loan.remainingBalance > 0 || loan.nextPaymentDue?.amount > 0)
      );

      const hasActiveLoans = activeLoans.length > 0;
      const nextPaymentDue = hasActiveLoans ? 
        Math.min(...activeLoans.map(loan => loan.nextPaymentDue?.amount || 0).filter(amount => amount > 0)) : 0;

      // Calculate allocations
      const savingsAmount = numericAmount * 0.2; // 20% to savings
      
      let loanAmount = 0;
      if (hasActiveLoans && nextPaymentDue > 0) {
        // Auto-allocate for loan payment (up to 30% of contribution or minimum due, whichever is smaller)
        const maxLoanAllocation = numericAmount * 0.3;
        loanAmount = Math.min(nextPaymentDue, maxLoanAllocation);
      }
      
      const groupAmount = numericAmount - savingsAmount - loanAmount;

      const allocations = [
        {
          account: 'savingsAccount',
          amount: parseFloat(savingsAmount.toFixed(2))
        },
        {
          account: 'groupAccount',
          amount: parseFloat(groupAmount.toFixed(2))
        }
      ];

      // Add loan allocation if there's an amount to allocate
      if (loanAmount > 0) {
        allocations.push({
          account: 'loanAccount',
          amount: parseFloat(loanAmount.toFixed(2)),
          loanIds: activeLoans.map(loan => loan._id) // Include loan IDs for reference
        });
      }

      return allocations;
    };

    const payloadMap = {
      wallet: {
        totalAmount: numericAmount,
        verifiedBy: currentUser?._id,
        allocations: calculateWalletAllocations()
      },
      cash: {
        userId: currentUser?._id,
        amount: numericAmount,
        notes: note || 'Cash contribution',
        account: acc,
        timestamp: new Date().toISOString()
      },
      mobile: {
        memberId: currentUser?._id,
        amount: numericAmount,
        notes: note || 'Mobile money contribution',
        reference: ref || 'N/A',
        timestamp: new Date().toISOString()
      },
      fund: {
        userId: currentUser?._id,
        amount: numericAmount,
        account: acc,
        description: note || 'Group funding',
        timestamp: new Date().toISOString()
      },
      pay: {
        userId: currentUser?._id,
        amount: numericAmount,
        memberId: targetMemberId,
        account: acc,
        description: note || 'Payment to member',
        timestamp: new Date().toISOString()
      }
    };

    return payloadMap[tab] || {};
  }, [tab, amount, notes, reference, account, currentUser, targetMemberId, myloans]);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (tab === 'pay' && !targetMemberId) {
      toast({
        title: "Member Required",
        description: "Please select a member to pay",
        variant: "destructive"
      });
      return;
    }

    if (tab === 'mobile' && !reference) {
      toast({
        title: "Reference Required",
        description: "Please enter a mobile money reference",
        variant: "destructive"
      });
      return;
    }

    const payload = buildPayload();
    setIsLoading(true);

    try {
      const actionMap = {
        wallet: () => dispatch(contributeFromWallet(groupId, payload)),
        cash: () => dispatch(recordCashContribution(groupId, payload)),
        mobile: () => dispatch(recordMobileMoneyContribution(groupId, payload)),
        fund: () => dispatch(fundWallet(groupId, payload)),
        pay: () => dispatch(payMember(groupId, payload))
      };

      await actionMap[tab]?.();

      const successMessages = {
        wallet: `$${amount} contributed from your wallet`,
        cash: `$${amount} cash contribution recorded`,
        mobile: `$${amount} mobile payment recorded`,
        fund: `$${amount} added to group wallet`,
        pay: (() => {
          const memberName = members?.find(m => m._id === targetMemberId)?.name || 'Member';
          return `$${amount} sent to ${memberName}`;
        })()
      };

      toast({
        title: "Transaction Successful",
        description: successMessages[tab],
      });

      // Refresh data
      await Promise.all([
        dispatch(getGroupContributions(groupId)),
        dispatch(getMemberContributions(groupId, currentUser._id))
      ]);

      onClose();
      resetForm();
    } catch (err) {
      console.error('Error performing fund action:', err);
      toast({
        title: "Transaction Failed",
        description: err.message || "An error occurred during the transaction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [tab, amount, targetMemberId, reference, buildPayload, dispatch, groupId, currentUser, members, onClose]);

  const resetForm = useCallback(() => {
    setAmount('');
    setNotes('');
    setReference('');
    setAccount('savingsAccount');
    setTargetMemberId('');
    setTab(availableTabs[0]);
  }, [availableTabs]);

  const handleDialogClose = useCallback((open) => {
    if (!open) {
      resetForm();
      onClose();
    }
  }, [resetForm, onClose]);

  const renderTabContent = useCallback(() => {
    const props = {
      amount,
      setAmount,
      notes,
      setNotes,
      reference,
      setReference,
      account,
      setAccount,
      targetMemberId,
      setTargetMemberId,
      members,
      onSubmit: handleSubmit,
      isLoading,
      myloans: myloans
    };

    const componentMap = {
      wallet: <WalletTab {...props} />,
      cash: <CashTab {...props} />,
      mobile: <MobileTab {...props} />,
      fund: <FundTab {...props} />,
      pay: <PayTab {...props} />
    };

    return componentMap[tab];
  }, [tab, amount, notes, reference, account, targetMemberId, members, handleSubmit, isLoading]);

  const getUserRole = useCallback(() => {
    if (isAdmin) return 'Admin';
    if (isTreasurer) return 'Treasurer';
    return 'Member';
  }, [isAdmin, isTreasurer]);

  // Don't render if no tabs are available
  if (!availableTabs.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>{title}</span>
            <Badge variant="outline" className="ml-auto">
              {getUserRole()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="flex justify-center w-full">
            {availableTabs.map((tabKey) => {
              const config = TAB_CONFIG[tabKey];
              const Icon = config.icon;
              
              return (
                <TabsTrigger key={tabKey} value={tabKey} className="flex-col h-16 gap-1">
                  <Icon className="h-5 w-5" />
                  <span>{config.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={tab} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const config = TAB_CONFIG[tab];
                    const Icon = config?.icon;
                    return (
                      <>
                        {Icon && <Icon className="h-5 w-5" />}
                        <span>{config?.title}</span>
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-4">
                {renderTabContent()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GroupFund;
export { TAB_SCENARIOS };