import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { reviewLoan } from '../../actions/loanActions';

const LoanReviewForm = ({ 
  show, 
  onHide, 
  loanId, 
  loanDetails = null,
  onReviewSuccess 
}) => {
  const [status, setStatus] = useState('approved');
  const [notes, setNotes] = useState('');

  const dispatch = useDispatch();

  const loanReview = useSelector((state) => state.loanReview);
  const { loading: loadingReview, error: errorReview, success: successReview } = loanReview;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Reset form and state when modal opens or loanId changes
  useEffect(() => {
    if (show) {
      setStatus('approved');
      setNotes('');
    }
  }, [show, loanId, dispatch]);

  // Handle successful review submission
  useEffect(() => {
    if (successReview) {
      if (onReviewSuccess) onReviewSuccess();
      onHide();
    }
  }, [successReview, onHide, onReviewSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!userInfo) return;

    const reviewData = {
      status,
      approvedBy: userInfo._id,
      approvalDate: new Date().toISOString(),
      notes: [{
        text: notes,
        author: userInfo._id,
      }],
    };
    
    dispatch(reviewLoan(loanId, reviewData));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title>Review Loan</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        {loanDetails && (
          <div className="mb-3">
            <h6>Loan Details</h6>
            <Row>
              <Col xs={6} md={4}>
                <small className="text-muted">Amount:</small>
                <p>${loanDetails.principalAmount?.toLocaleString()}</p>
              </Col>
              <Col xs={6} md={4}>
                <small className="text-muted">Borrower:</small>
                <p>{loanDetails.user?.name}</p>
              </Col>
              <Col xs={12} md={4}>
                <small className="text-muted">Status:</small>
                <p className={`badge bg-${loanDetails.status === 'approved' ? 'success' : loanDetails.status === 'rejected' ? 'danger' : 'warning'}`}>
                  {loanDetails.status}
                </p>
              </Col>
            </Row>
          </div>
        )}
        
        {errorReview && <Alert variant="danger" className="py-2">{errorReview}</Alert>}

        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="status" className="mb-3">
                <Form.Label>Decision</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="lg"
                >
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="notes" className="mb-3">
            <Form.Label>Review Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add comments for your decision"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-secondary"
            />
          </Form.Group>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              className="me-md-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loadingReview}
            >
              {loadingReview ? 'Processing...' : 'Submit Review'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoanReviewForm;