import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfessionalDashboard from './components/Dashboard';
// Import chat components
import FloatingChatButton from './components/chat/FloatingChatButton';
import ChatPage from './components/chat/ChatPage';
// Import all your existing components
import LoanList from './components/loans/LoanList';
import LoanForm from './components/loans/LoanForm';
import LoanDetails from './components/loans/LoanDetails';
import LoanReviewForm from './components/loans/LoanReviewForm';
import LoanDisbursementForm from './components/loans/LoanDisbursementForm';
import LoanRepaymentForm from './components/loans/LoanRepaymentForm';
import LoanStatistics from './components/loans/LoanStatistics';
import MyLoanList from './components/loans/MyLoanList';
import LoanGuarantorLoans from './components/loans/GuarantorLoans';

import GroupList from './components/groups/GroupList';
import GroupForm from './components/groups/GroupForm';
import GroupDetails from './components/groups/GroupDetails';
import GroupMembers from './components/groups/GroupMembers';
import GroupAccounts from './components/groups/GroupAccounts';
import GroupTransferOwnership from './components/groups/GroupTransferOwnership';
import AllGroupList from './components/groups/AllGroupList';
import JoinGroups from './components/groups/JoinGroups'

import WalletDetails from './components/wallet/WalletDetails';
import DepositForm from './components/wallet/DepositForm';
import WithdrawForm from './components/wallet/WithdrawForm';
import TransactionHistory from './components/wallet/TransactionHistory';
import Statements from './components/wallet/Statements';

import PaymentHistory from './components/payments/PaymentHistory';
import MpesaPayment from './components/payments/MpesaPayment';
import MpesaWithdrawal from './components/payments/MpesaWithdrawal';
import PaymentStatus from './components/payments/PaymentStatus';
import StripePayment from './components/payments/StripePayment';
import StripePayout from './components/payments/StripePayout';
import Transactions from './components/payments/Transactions';

import AdminAnalytics from './components/payments/AdminAnalytics';
import AdminSettings from './components/admin/AdminSettings';

import LoginForm from './components/users/LoginForm';
import ForgotPassword from './components/users/ForgotPassword';
import ResetPassword from './components/users/ResetPassword'
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import UserDetails from './components/users/UserDetails';
import Home from './components/public/Home';
import HowItWorksPage from './components/public/HowItWorksPage';
import './index.css';
import UserDistributionMap from './components/users/UserDistributionMap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogsPage from './components/admin/LogsPage';
import AuthRedirectHandler from './components/users/AuthRedirectHandler';
import AuthErrorPage from './components/users/AuthErrorPage';
import SupportManagementPage from './components/admin/SupportManagementPage';
import SessionManager from './components/admin/SessionManager';

// Layout wrapper component for dashboard pages
const DashboardLayout = ({ children }) => {
  return <ProfessionalDashboard>{children}</ProfessionalDashboard>;
};

// Layout wrapper component for public pages
const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4">
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  const location = useLocation();
  
  // Don't show floating chat on login/register pages
  const hideFloatingChat = ['/login', '/register', '/home', '/how-it-works', '/admin/support', '/chat'].includes(location.pathname);
  return (
    <>
    <Routes>
      {/* Root redirect to dashboard */}
      <Route path="/" element={<ProfessionalDashboard />} />
      
      {/* Public Routes - use traditional layout */}
      <Route
            path="/home"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
      <Route path="/login" element={
        <PublicLayout>
          <LoginForm />
        </PublicLayout>
      } />
      <Route path="/register" element={
        <PublicLayout>
          <UserForm />
        </PublicLayout>
      } />
      <Route
        path="/how-it-works"
        element={
          <>
            <Header />
            <HowItWorksPage />
            <Footer />
          </>
        }
      />

      <Route path="/auth/success" element={<AuthRedirectHandler />} />
      <Route path="/auth/error" element={<AuthErrorPage />} />

      {/* Chat Routes */}
      <Route path="/chat" element={
          <DashboardLayout>
            <ChatPage />
          </DashboardLayout>
        } />

      {/* Dashboard Routes - use dashboard layout */}
      <Route path="/dashboard" element={<ProfessionalDashboard />} />
      
      {/* User Routes */}
      <Route path="/profile" element={
        <DashboardLayout>
          <UserDetails />
        </DashboardLayout>
      } />
      <Route path="/forgot-password" element={
        <PublicLayout>
          <ForgotPassword />
        </PublicLayout>
      } />
      <Route path="/reset-password/:token" element={
        <PublicLayout>
          <ResetPassword />
        </PublicLayout>
      } />
      <Route path="/users" element={
        <DashboardLayout>
          <UserList />
        </DashboardLayout>
      } />
      <Route path="/users/:id" element={
        <DashboardLayout>
          <UserDetails />
        </DashboardLayout>
      } />
      <Route path="/users/:id/edit" element={
        <DashboardLayout>
          <UserForm />
        </DashboardLayout>
      } />
      <Route path="/admin/user/:id/edit" element={
        <DashboardLayout>
          <UserForm />
        </DashboardLayout>
      } />

      {/* Loan Routes */}
      <Route path="/loans" element={
        <DashboardLayout>
          <MyLoanList />
        </DashboardLayout>
      } />
      <Route path="/loans/create" element={
        <DashboardLayout>
          <LoanForm />
        </DashboardLayout>
      } />
      <Route path="/loans/statistics" element={
        <DashboardLayout>
          <LoanStatistics />
        </DashboardLayout>
      } />
      <Route path="/loans/guarantors" element={
        <DashboardLayout>
          <LoanGuarantorLoans />
        </DashboardLayout>
      } />
      <Route path="/loans/:loanId" element={
        <DashboardLayout>
          <LoanDetails />
        </DashboardLayout>
      } />
      <Route path="/loans/:id/edit" element={
        <DashboardLayout>
          <LoanForm />
        </DashboardLayout>
      } />
      <Route path="/loans/:id/review" element={
        <DashboardLayout>
          <LoanReviewForm />
        </DashboardLayout>
      } />
      <Route path="/loans/:id/disburse" element={
        <DashboardLayout>
          <LoanDisbursementForm />
        </DashboardLayout>
      } />
      <Route path="/loans/:id/repay" element={
        <DashboardLayout>
          <LoanRepaymentForm />
        </DashboardLayout>
      } />
      

      {/* Group Routes */}
      <Route path="/groups" element={
        <DashboardLayout>
          <GroupList />
        </DashboardLayout>
      } />
      <Route path="/groups/create" element={
        <DashboardLayout>
          <GroupForm />
        </DashboardLayout>
      } />
      <Route path="/groups/join" element={
        <DashboardLayout>
          <JoinGroups />
        </DashboardLayout>
      } />
      <Route path="/groups/:id" element={
        <DashboardLayout>
          <GroupDetails />
        </DashboardLayout>
      } />
      <Route path="/groups/:id/edit" element={
        <DashboardLayout>
          <GroupForm />
        </DashboardLayout>
      } />
      <Route path="/groups/:id/members" element={
        <DashboardLayout>
          <GroupMembers />
        </DashboardLayout>
      } />
      <Route path="/groups/:id/accounts" element={
        <DashboardLayout>
          <GroupAccounts />
        </DashboardLayout>
      } />
      <Route path="/groups/:id/transfer-ownership" element={
        <DashboardLayout>
          <GroupTransferOwnership />
        </DashboardLayout>
      } />

      {/* Wallet Routes */}
      <Route path="/wallet" element={
        <DashboardLayout>
          <WalletDetails />
        </DashboardLayout>
      } />
      <Route path="/wallet/statements" element={
        <DashboardLayout>
          <Statements />
        </DashboardLayout>
      } />
      <Route path="/wallet/:userId" element={
        <DashboardLayout>
          <WalletDetails />
        </DashboardLayout>
      } />
      <Route path="/wallet/:userId/deposit" element={
        <DashboardLayout>
          <DepositForm />
        </DashboardLayout>
      } />
      <Route path="/wallet/:userId/withdraw" element={
        <DashboardLayout>
          <WithdrawForm />
        </DashboardLayout>
      } />
      <Route path="/wallet/:userId/transactions" element={
        <DashboardLayout>
          <TransactionHistory />
        </DashboardLayout>
      } />

      {/* Payment Routes */}
      <Route path="/payment/history" element={
        <DashboardLayout>
          <PaymentHistory />
        </DashboardLayout>
      } />
      <Route path="/payment/mpesa/:id" element={
        <DashboardLayout>
          <MpesaPayment />
        </DashboardLayout>
      } />
      <Route path="/payment/status/:paymentId" element={
        <DashboardLayout>
          <PaymentStatus />
        </DashboardLayout>
      } />
      <Route path="/payment/mpesawithdraw" element={
        <DashboardLayout>
          <MpesaWithdrawal />
        </DashboardLayout>
      } />
      <Route path="/payment/:id" element={
        <DashboardLayout>
          <PaymentStatus />
        </DashboardLayout>
      } />
      <Route path="/payment/stripe/:id" element={
        <DashboardLayout>
          <StripePayment />
        </DashboardLayout>
      } />
      <Route path="/payment/stripe/payout" element={
        <DashboardLayout>
          <StripePayout />
        </DashboardLayout>
      } />

      {/* Transaction UI Routes */}
      <Route path="/transactions" element={
        <DashboardLayout>
          <TransactionHistory />
        </DashboardLayout>
      } />

      {/* Admin Routes */}
      <Route path="/admin/analytics" element={
        <DashboardLayout>
          <AdminAnalytics />
        </DashboardLayout>
      } />
      <Route path="/admin/users" element={
        <DashboardLayout>
          <UserList />
        </DashboardLayout>
      } />
      <Route path="/admin/users/map" element={
        <DashboardLayout>
          <UserDistributionMap />
        </DashboardLayout>
      } />
      <Route path="/admin/groups" element={
        <DashboardLayout>
          <AllGroupList />
        </DashboardLayout>
      } />
      <Route path="/admin/loans" element={
        <DashboardLayout>
          <LoanList />
        </DashboardLayout>
      } />
      <Route path="/admin/loans/:loanId" element={
        <DashboardLayout>
          <LoanDetails />
        </DashboardLayout>
      } />
      <Route path="/admin/settings" element={
        <DashboardLayout>
          <AdminSettings />
        </DashboardLayout>
      } />
      <Route path="/admin/support" element={
        <DashboardLayout>
          <SupportManagementPage />
        </DashboardLayout>
      } />
      <Route path="/admin/logs" element={
        <DashboardLayout>
          <LogsPage />
        </DashboardLayout>
      } />
      <Route path="/admin/sessions" element={
        <DashboardLayout>
          <SessionManager />
        </DashboardLayout>
      } />
      <Route path="/admin/users" element={
        <DashboardLayout>
          <UserList />
        </DashboardLayout>
      } />
      <Route path="/admin/users/:id" element={
        <DashboardLayout>
          <UserDetails />
        </DashboardLayout>
      } />

      {/* Group Admin Routes */}
      <Route path="/group-admin/manage" element={
        <DashboardLayout>
          <div>Group Management Page</div>
        </DashboardLayout>
      } />
      <Route path="/group-admin/reports" element={
        <DashboardLayout>
          <div>Group Reports Page</div>
        </DashboardLayout>
      } />
      <Route path="/group-admin/analytics" element={
        <DashboardLayout>
          <div>Group Analytics Page</div>
        </DashboardLayout>
      } />

      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    {/* Floating Chat Button - Only show on dashboard pages */}
    {!hideFloatingChat && <FloatingChatButton />}
    <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default App;