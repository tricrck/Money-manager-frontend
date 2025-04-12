import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { repayLoan } from '../../actions/loanActions';
import { getLoanDetails } from '../../actions/loanActions';
import { useParams } from 'react-router-dom';

const LoanRepaymentForm = ({ history }) => {
  const loanId = useParams();

  const [paidAmount, setPaidAmount] = useState(0);
  const [paidDate, setPaidDate] = useState('');

  const dispatch = useDispatch();

  const loanDetails = useSelector((state) => state.loanDetails);
  const { loading: loadingDetails, error: errorDetails, loan } = loanDetails;

  const loanRepay = useSelector((state) => state.loanRepay);
  const { loading: loadingRepay, error: errorRepay, success: successRepay } = loanRepay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!loan || loan._id !== loanId.id) {
        dispatch(getLoanDetails(loanId.id));
      }
    }
  }, [dispatch, history, loanId.id, loan, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    const repaymentData = {
      paidAmount: Number(paidAmount),
      paidDate: paidDate || new Date().toISOString(),
    };
    dispatch(repayLoan(loanId, repaymentData));
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Loan Repayment</h2>
      {errorDetails && <Alert variant="danger">{errorDetails}</Alert>}
      {errorRepay && <Alert variant="danger">{errorRepay}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="paidAmount" className="mb-3">
          <Form.Label>Amount Paid</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount paid"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="paidDate" className="mb-3">
          <Form.Label>Payment Date</Form.Label>
          <Form.Control
            type="date"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={loadingRepay}
          className="mt-4"
        >
          {loadingRepay ? 'Processing...' : 'Record Payment'}
        </Button>
      </Form>
    </Container>
  );
};

export default LoanRepaymentForm;