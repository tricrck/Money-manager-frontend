import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  DollarSign, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Smartphone,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Filter,
  HandCoins,
  Receipt
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { disburseLoan, getGroupLoans } from '../../actions/loanActions';

const TreasurerPage = ({ group }) => {
  const dispatch = useDispatch();

  // Group loans
  const groupLoansList = useSelector((state) => state.groupLoansList);
  const { loading, error, loans } = groupLoansList;

  // Loan disbursement status
  const loanDisburse = useSelector((state) => state.loanDisburse);
  const { loading: loadingDisburse, error: errorDisburse, success: successDisburse } = loanDisburse;

  // Fetch loans when group is available
  useEffect(() => {
    if (group) {
      dispatch(getGroupLoans(group._id));
    }
  }, [group, dispatch, successDisburse]); // refetch on disburse success

  // Filter approved personal loans
  const approvedLoans = loans?.filter(
    (loan) => loan?.loanType === 'personal' && loan.status === 'approved'
  );

  // Disbursement form state
  const [loanIdToDisburse, setLoanIdToDisburse] = useState(null);
  const [disbursedAmount, setDisbursedAmount] = useState('');

  // Calculate treasury stats
  const treasuryStats = {
    totalFunds: (group?.savingsAccount?.balance || 0) + (group?.interestEarnedAccount?.balance || 0),
    pendingContributions: group?.transactions?.filter(t => t.type === 'contribution' && t.status === 'pending').length || 0,
    pendingWithdrawals: group?.transactions?.filter(t => t.type === 'dividend' && t.status === 'pending').length || 0,
    recentActivity: group?.transactions?.slice(0, 5) || []
  };

  const submitDisbursement = (e) => {
    e.preventDefault();
    const disbursementData = {
      disbursedAmount: Number(disbursedAmount),
      disbursementDate: new Date().toISOString(),
      status: 'disbursed',
    };
    dispatch(disburseLoan(loanIdToDisburse, disbursementData));
    setLoanIdToDisburse(null); // Close/disengage the form
    setDisbursedAmount('');
  };


  return (
    <div className="space-y-6">
      {/* Treasury Dashboard */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(treasuryStats?.totalFunds)}</div>
            <p className="text-xs text-muted-foreground">
              Available for disbursement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Contributions</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treasuryStats?.pendingContributions}</div>
            <p className="text-xs text-muted-foreground">
              Need verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treasuryStats?.pendingWithdrawals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Approved Personal Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Approved Loans for Disbursement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedLoans?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No approved loans to disburse.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedLoans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell>{loan?.user?.name}</TableCell>
                    <TableCell>{formatCurrency(loan.principalAmount)}</TableCell>
                    <TableCell>{new Date(loan.approvalDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {loanIdToDisburse === loan._id ? (
                        <form onSubmit={submitDisbursement} className="flex gap-2">
                          <input
                            type="number"
                            value={disbursedAmount}
                            onChange={(e) => setDisbursedAmount(e.target.value)}
                            placeholder="Amount"
                            required
                            className="border rounded px-2 py-1 w-24 text-sm"
                          />
                          <Button type="submit" size="sm">Confirm</Button>
                        </form>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLoanIdToDisburse(loan._id);
                            setDisbursedAmount(loan.amount); // prefill
                          }}
                        >
                          Disburse
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Financial Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treasuryStats?.recentActivity.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.method.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financial Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Financial Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <FileText className="h-6 w-6 mb-2" />
            Monthly Statement
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <TrendingUp className="h-6 w-6 mb-2" />
            Contribution Report
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <DollarSign className="h-6 w-6 mb-2" />
            Loan Portfolio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerPage;