import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { disburseLoan } from '../../actions/loanActions';
import { getLoanDetails } from '../../actions/loanActions';
import { useParams } from 'react-router-dom';

const LoanDisbursementForm = ({  history }) => {
  const loanId = useParams();

  const [disbursedAmount, setDisbursedAmount] = useState(0);
  const [disbursementDate, setDisbursementDate] = useState('');

  const dispatch = useDispatch();

  const loanDetails = useSelector((state) => state.loanDetails);
  const { loading: loadingDetails, error: errorDetails, loan } = loanDetails;

  const loanDisburse = useSelector((state) => state.loanDisburse);
  const { loading: loadingDisburse, error: errorDisburse, success: successDisburse } = loanDisburse;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!loan || loan._id !== loanId.id) {
        dispatch(getLoanDetails(loanId.id));
      } else {
        setDisbursedAmount(loan.principalAmount);
      }
    }
  }, [dispatch, history, loanId.id, loan, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    const disbursementData = {
      disbursedAmount: Number(disbursedAmount),
      disbursementDate: disbursementDate || new Date().toISOString(),
      status: 'disbursed',
    };
    dispatch(disburseLoan(loanId, disbursementData));
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Loan Disbursement</h2>
      {errorDetails && <Alert variant="danger">{errorDetails}</Alert>}
      {errorDisburse && <Alert variant="danger">{errorDisburse}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="disbursedAmount" className="mb-3">
          <Form.Label>Disbursed Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter disbursed amount"
            value={disbursedAmount}
            onChange={(e) => setDisbursedAmount(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="disbursementDate" className="mb-3">
          <Form.Label>Disbursement Date</Form.Label>
          <Form.Control
            type="date"
            value={disbursementDate}
            onChange={(e) => setDisbursementDate(e.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={loadingDisburse}
          className="mt-4"
        >
          {loadingDisburse ? 'Processing...' : 'Disburse Loan'}
        </Button>
      </Form>
    </Container>
  );
};

export default LoanDisbursementForm;