import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import LoanList from './components/loans/LoanList';
import LoanForm from './components/loans/LoanForm';
import LoanDetails from './components/loans/LoanDetails';
import LoanReviewForm from './components/loans/LoanReviewForm';
import LoanDisbursementForm from './components/loans/LoanDisbursementForm';
import LoanRepaymentForm from './components/loans/LoanRepaymentForm';
import LoanStatistics from './components/loans/LoanStatistics';

import GroupList from './components/groups/GroupList';
import GroupForm from './components/groups/GroupForm';
import GroupDetails from './components/groups/GroupDetails';
import GroupMembers from './components/groups/GroupMembers';
import GroupAccounts from './components/groups/GroupAccounts';
import GroupTransferOwnership from './components/groups/GroupTransferOwnership'

import WalletDetails from './components/wallet/WalletDetails';
import DepositForm from './components/wallet/DepositForm';
import WithdrawForm from './components/wallet/WithdrawForm';
import TransactionHistory from './components/wallet/TransactionHistory';

import PaymentHistory from './components/payments/PaymentHistory';
import MpesaPayment from './components/payments/MpesaPayment';
import MpesaWithdrawal from './components/payments/MpesaWithdrawal';
import PaymentStatus from './components/payments/PaymentStatus';
import StripePayment from './components/payments/StripePayment';
import StripePayout from './components/payments/StripePayout';

import LoginForm from './components/users/LoginForm';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import UserDetails from './components/users/UserDetails';
import Home from './components/public/Home';
import './App.css';

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/profile" element={<UserDetails />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
            <Route path="/register" element={<UserForm />} />
            {/* Add the admin routes */}
            <Route path="/admin/user/:id/edit" element={<UserForm />} />

            {/* Loan Routes */}
            <Route path="/loans" element={<LoanList />} exact />
            <Route path="/loans/create" element={<LoanForm />} />
            <Route path="/loans/:loanId" element={<LoanDetails />} />
            <Route path="/loans/:id/edit" element={<LoanForm />} />
            <Route path="/loans/:id/review" element={<LoanReviewForm />} />
            <Route path="/loans/:id/disburse" element={<LoanDisbursementForm />} />
            <Route path="/loans/:id/repay" element={<LoanRepaymentForm />} />
            <Route path="/loans/statistics" element={<LoanStatistics />} />

            {/* Group Routes */}
            <Route path="/groups" element={<GroupList />} exact />
            <Route path="/groups/create" element={<GroupForm />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
            <Route path="/groups/:id/edit" element={<GroupForm />} />
            <Route path="/groups/:id/members" element={<GroupMembers />} />
            <Route path="/groups/:id/accounts" element={<GroupAccounts />} />
            <Route path="/groups/:id/transfer-ownership" element={<GroupTransferOwnership />} />

            {/* Wallet Routes */}
            <Route path="/wallet" element={<WalletDetails />} exact />
            <Route path="/wallet/:userId" element={<WalletDetails />} exact />
            <Route path="/wallet/:userId/deposit" element={<DepositForm />} />
            <Route path="/wallet/:userId/withdraw" element={<WithdrawForm />} />
            <Route path="/wallet/:userId/transactions" element={<TransactionHistory />} />

            {/* Payment Routes */}
            <Route path="/payment/history" element={<PaymentHistory />} exact />
            <Route path="/payment/mpesa/:id" element={<MpesaPayment />} exact />
            <Route path="/payment/status/:paymentId" element={<PaymentStatus />} />
            <Route path="/payment/mpesawithdaw" element={<MpesaWithdrawal />} exact />
            <Route path="/payment/:id" element={<PaymentStatus />} exact />
            <Route path="/payment/stripe/:id" element={<StripePayment />} exact />
            <Route path="/payment/stripe/payout" element={<StripePayout />} exact />

          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;