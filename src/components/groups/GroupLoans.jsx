import React from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  ClipboardList,
  FileImage
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

const GroupLoans = ({ loans, userInfo, Role }) => {
   let groupLoans;

    if (Role !== 'treasurer' && Role !== 'admin' && Role !== 'chair') {
    groupLoans = loans.filter(
        (loan) => loan.loanType === 'personal' && loan.user._id === userInfo?._id
    );
    } else {
    groupLoans = loans;
    }


  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Loans Overview
        </CardTitle>
        <Button variant="outline" size="sm">
          <ClipboardList className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Guarantors</TableHead>
              <TableHead>Collateral</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groupLoans.map((loan) => (
              <TableRow key={loan._id}>
                <TableCell className="font-medium">
                  {loan.user.name}
                  <div className="text-xs text-muted-foreground">{loan.user.email}</div>
                </TableCell>

                <TableCell>KES {loan.principalAmount.toLocaleString()}</TableCell>

                <TableCell>
                  {loan.status === 'disbursed' ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Disbursed
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {loan.nextPaymentDue ? (
                    <>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(loan.nextPaymentDue.dueDate)}
                      </div>
                      <div className="text-sm">KES {loan.nextPaymentDue.amount.toFixed(2)}</div>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-xs">N/A</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {loan.guarantors.map((g) => (
                      <span
                        key={g._id}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          g.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {g.approved ? '✓' : '✗'} {g.user.slice(-4)}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm font-medium">{loan.collateral.description}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    KES {loan.collateral.value.toLocaleString()}
                  </div>
                  {loan.collateral.documents?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {loan.collateral.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          <FileImage className="h-4 w-4 text-blue-500" />
                        </a>
                      ))}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {groupLoans.length === 0 && (
          <div className="text-center text-muted-foreground py-6">No group loans found.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupLoans;