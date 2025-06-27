import React, { useState } from 'react';
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
  History
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
import { toast } from "sonner"

import {
  contributeFromWallet,
  recordCashContribution,
  recordMobileMoneyContribution,
  fundWallet,
  payMember,
  getGroupContributions,
  getMemberContributions
} from '../../actions/groupActions';

const GroupFund = ({ isOpen, onClose, groupId, currentUser, isAdmin, isTreasurer, members }) => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');
  const [account, setAccount] = useState('savingsAccount');
  const [targetMemberId, setTargetMemberId] = useState('');
  const [tab, setTab] = useState('wallet');
  const [isLoading, setIsLoading] = useState(false);

  const buildPayload = () => {
    const numericAmount = Number(amount);
    const note = notes?.trim();
    const ref = reference?.trim();
    const acc = account;

    switch (tab) {
      case 'wallet':
        return {
          amount: numericAmount,
          notes: note || 'Wallet contribution',
          timestamp: new Date().toISOString()
        };

      case 'cash':
        return {
          userId: currentUser?._id,
          amount: numericAmount,
          notes: note || 'Cash contribution',
          account: acc,
          timestamp: new Date().toISOString()
        };

      case 'mobile':
        return {
          memberId: currentUser?._id,
          amount: numericAmount,
          notes: note || 'Mobile money contribution',
          reference: ref || 'N/A',
          timestamp: new Date().toISOString()
        };

      case 'fund':
        return {
          userId: currentUser?._id,
          amount: numericAmount,
          account: acc,
          description: note || 'Group funding',
          timestamp: new Date().toISOString()
        };

      case 'pay':
        return {
          userId: currentUser?._id,
          amount: numericAmount,
          memberId: targetMemberId,
          account: acc,
          description: note || 'Payment to member',
          timestamp: new Date().toISOString()
        };

      default:
        return {};
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    };

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
      switch (tab) {
        case 'wallet':
          await dispatch(contributeFromWallet(groupId, payload));
          toast({
            title: "Contribution Successful",
            description: `$${amount} contributed from your wallet`,
          });
          break;
        case 'cash':
          await dispatch(recordCashContribution(groupId, payload));
          toast({
            title: "Cash Recorded",
            description: `$${amount} cash contribution recorded`,
          });
          break;
        case 'mobile':
          await dispatch(recordMobileMoneyContribution(groupId, payload));
          toast({
            title: "Mobile Payment Recorded",
            description: `$${amount} mobile payment recorded`,
          });
          break;
        case 'fund':
          await dispatch(fundWallet(groupId, payload));
          toast({
            title: "Wallet Funded",
            description: `$${amount} added to group wallet`,
          });
          break;
        case 'pay':
          await dispatch(payMember(groupId, payload));
          const memberName = members.find(m => m._id === targetMemberId)?.name || 'Member';
          toast({
            title: "Payment Sent",
            description: `$${amount} sent to ${memberName}`,
          });
          break;
        default:
          break;
      }

      await dispatch(getGroupContributions(groupId));
      await dispatch(getMemberContributions(groupId, currentUser._id));
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
  };

  const resetForm = () => {
    setAmount('');
    setNotes('');
    setReference('');
    setAccount('savingsAccount');
    setTargetMemberId('');
    setTab('wallet');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Group Funds Management</span>
            <Badge variant="outline" className="ml-auto">
              {isAdmin ? 'Admin' : isTreasurer ? 'Treasurer' : 'Member'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="flex justify-center w-full">
            <TabsTrigger value="wallet" className="flex-col h-16 gap-1">
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </TabsTrigger>
            {(isAdmin || isTreasurer) && (
              <>
                <TabsTrigger value="cash" className="flex-col h-16 gap-1">
                    <Banknote className="h-5 w-5" />
                    <span>Cash</span>
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex-col h-16 gap-1">
                    <Smartphone className="h-5 w-5" />
                    <span>Mobile Money</span>
                </TabsTrigger>
                <TabsTrigger value="fund" className="flex-col h-16 gap-1">
                  <PlusCircle className="h-5 w-5" />
                  <span>Fund Group</span>
                </TabsTrigger>
                <TabsTrigger value="pay" className="flex-col h-16 gap-1">
                  <ArrowRightLeft className="h-5 w-5" />
                  <span>Pay Member</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value={tab} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  {tab === 'wallet' && <Wallet className="h-5 w-5" />}
                  {tab === 'cash' && <Banknote className="h-5 w-5" />}
                  {tab === 'mobile' && <Smartphone className="h-5 w-5" />}
                  {tab === 'fund' && <PlusCircle className="h-5 w-5" />}
                  {tab === 'pay' && <ArrowRightLeft className="h-5 w-5" />}
                  <span className="capitalize">
                    {tab === 'wallet' && 'Wallet Contribution'}
                    {tab === 'cash' && 'Cash Contribution'}
                    {tab === 'mobile' && 'Mobile Money'}
                    {tab === 'fund' && 'Fund Group Wallet'}
                    {tab === 'pay' && 'Pay Member'}
                  </span>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-4">
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

                {['fund', 'pay', 'cash'].includes(tab) && (
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
                )}

                {tab === 'pay' && (
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
                )}

                {tab === 'mobile' && (
                  <div className="space-y-2">
                    <Label>Transaction Reference</Label>
                    <Input
                      placeholder="e.g. MTN-MOMO-20250420-12345"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    placeholder={
                      tab === 'wallet' ? 'Contribution notes (optional)' :
                      tab === 'fund' ? 'Funding description (optional)' :
                      tab === 'pay' ? 'Payment description (optional)' :
                      'Transaction notes (optional)'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={handleSubmit} 
                  disabled={!amount || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {tab === 'wallet' && 'Contribute'}
                      {tab === 'cash' && 'Record Cash'}
                      {tab === 'mobile' && 'Record Payment'}
                      {tab === 'fund' && 'Fund Wallet'}
                      {tab === 'pay' && 'Send Payment'}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GroupFund;