import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { reviewLoan } from '../../actions/loanActions';
import { getLoanDetails } from '../../actions/loanActions';
import { useParams } from 'react-router-dom';

const LoanReviewForm = ({ history }) => {
  const loanId = useParams();

  const [status, setStatus] = useState('approved');
  const [notes, setNotes] = useState('');

  const dispatch = useDispatch();

  const loanDetails = useSelector((state) => state.loanDetails);
  const { loading: loadingDetails, error: errorDetails, loan } = loanDetails;

  const loanReview = useSelector((state) => state.loanReview);
  const { loading: loadingReview, error: errorReview, success: successReview } = loanReview;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!loan || loan._id !== loanId) {
        dispatch(getLoanDetails(loanId.id));
      }
    }
  }, [dispatch, history, loanId, loan, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    const reviewData = {
      status,
      approvedBy: userInfo._id,
      approvalDate: new Date().toISOString(),
      notes: [
        {
          text: notes,
          author: userInfo._id,
        },
      ],
    };
    dispatch(reviewLoan(loanId, reviewData));
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Review Loan</h2>
      {errorDetails && <Alert variant="danger">{errorDetails}</Alert>}
      {errorReview && <Alert variant="danger">{errorReview}</Alert>}
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="status" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
                <option value="pending">Pending</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="notes" className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter review notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={loadingReview}
          className="mt-4"
        >
          {loadingReview ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </Container>
  );
};

export default LoanReviewForm;