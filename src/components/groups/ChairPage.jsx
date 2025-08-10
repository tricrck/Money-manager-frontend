import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Gavel,
  Users,
  TrendingUp,
  BarChart3,
  ClipboardList,
  FileText,
  Download,
  Filter,
  Shield,
  Award,
  Handshake
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getGroupLoans } from '../../actions/loanActions';
import LoanReviewForm from '../loans/LoanReviewForm';
import { LinkContainer } from 'react-router-bootstrap';

const ChairPage = ({ group }) => {
  const dispatch = useDispatch();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);


  const groupLoansList = useSelector((state) => state.groupLoansList);
  const { loading, error, loans } = groupLoansList;

  useEffect(() => {
    if (group) {
      dispatch(getGroupLoans(group._id));
    }
  }, [group, dispatch]);

  const personalLoans = loans?.filter(loan => loan?.loanType === "personal");

  const pendingDecisions = personalLoans?.filter(
    (loan) => loan?.status === 'pending'
  );
  console.log('Pending Decisions:', pendingDecisions);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Governance Dashboard */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group?.members?.filter(m => m.status === 'active').length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Out of {group?.members?.length || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Decisions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDecisions.length}</div>
            <p className="text-xs text-muted-foreground">
              Requiring chair action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Group Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">
              85% participation rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Governance Decisions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Pending Loan Decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Proposed By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDecisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted">
                    No pending personal loan decisions.
                  </TableCell>
                </TableRow>
              ) : (
              pendingDecisions.map((loan) => (
                <TableRow key={loan._id}>
                  <LinkContainer to={`/loans/${loan._id}`}>
                    <TableCell className="font-medium">{loan.purpose || 'Loan Request'}</TableCell>
                    </LinkContainer>
                    <TableCell>{loan.user?.name}</TableCell>
                    <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary">
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setShowReviewModal(true);
                      }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leadership Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Leadership Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Award className="h-6 w-6 mb-2" />
            Recognize Member
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Handshake className="h-6 w-6 mb-2" />
            Conflict Resolution
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <ClipboardList className="h-6 w-6 mb-2" />
            Annual Report
          </Button>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Group Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Contribution Compliance</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-muted-foreground">Chart would go here</p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Meeting Attendance</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-muted-foreground">Chart would go here</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <LoanReviewForm
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        loanId={selectedLoan?._id}
        loanDetails={selectedLoan}
        onReviewSuccess={() => {
          setShowReviewModal(false);
          setSelectedLoan(null);
        }}
      />
    </div>
  );
};

export default ChairPage;