import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { disburseLoan } from '../../actions/loanActions';

const LoanDisbursementForm = ({
  show,
  onHide,
  loanId,
  loanDetails = null,
  onDisburseSuccess
}) => {
  const [disbursedAmount, setDisbursedAmount] = useState(0);

  const dispatch = useDispatch();

  const loanDisburse = useSelector((state) => state.loanDisburse);
  const { loading: loadingDisburse, error: errorDisburse, success: successDisburse } = loanDisburse;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;



  useEffect(() => {
    if (show) {
      setDisbursedAmount(loanDetails?.principalAmount || 0);
    }
  }, [show, loanId, dispatch]);

  useEffect(() => {
    if (successDisburse) {
      if (onDisburseSuccess) onDisburseSuccess();
      onHide();
    }
  }, [successDisburse, onDisburseSuccess, onHide]);

  const submitHandler = (e) => {
    e.preventDefault();

    const disbursementData = {
      disbursedAmount: Number(disbursedAmount),
      disbursementDate: new Date().toISOString(),
      status: 'disbursed',
    };

    dispatch(disburseLoan(loanId, disbursementData));
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
        <Modal.Title>Disburse Loan</Modal.Title>
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
                <p className={`badge bg-${loanDetails.status === 'disbursed' ? 'success' : 'warning'}`}>
                  {loanDetails.status}
                </p>
              </Col>
            </Row>
          </div>
        )}
        {loadingDisburse && <Alert variant="info">Processing...</Alert>}
        {successDisburse && <Alert variant="success">Loan disbursed successfully!</Alert>}
        {errorDisburse && <Alert variant="danger">{errorDisburse}</Alert>}

        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
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
            </Col>
          </Row>

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
              disabled={loadingDisburse}
            >
              {loadingDisburse ? 'Processing...' : 'Disburse Loan'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoanDisbursementForm;