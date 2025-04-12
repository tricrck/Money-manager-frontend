import React, { useEffect } from 'react';
import { Card, Container, Button, Alert, Badge, ListGroup, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaMoneyBillWave } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getLoanDetails } from '../../actions/loanActions';

const LoanDetails = ({ match, history }) => {
  const { loanId } = useParams();
  console.log(loanId);

  const dispatch = useDispatch();

  const loanDetails = useSelector((state) => state.loanDetails);
  const { loading, error, loan } = loanDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
        console.log(loanId);
      dispatch(getLoanDetails(loanId));
    } else {
      history.push('/login');
    }
  }, [dispatch, history, loanId, userInfo]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'disbursed':
        return <Badge bg="primary">Disbursed</Badge>;
      case 'repaid':
        return <Badge bg="info">Repaid</Badge>;
      case 'defaulted':
        return <Badge bg="dark">Defaulted</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="py-5">
      <Link to="/loans" className="btn btn-light my-3">
        <FaArrowLeft /> Go Back
      </Link>
      <h2 className="mb-4">Loan Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Card>
            <Card.Body>
              <Card.Title>
                <strong>Loan ID:</strong> {loan._id}
              </Card.Title>
              <Card.Text>
                <strong>Type:</strong> {loan.loanType}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> {getStatusBadge(loan.status)}
              </Card.Text>
            </Card.Body>
          </Card>

          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Header>Loan Terms</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Principal Amount:</strong> ${loan.principalAmount?.toLocaleString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Repayment Period:</strong> {loan.repaymentPeriod} months
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Interest Rate:</strong> {loan.interestRate}%
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Interest Type:</strong> {loan.interestType}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Processing Fee:</strong> ${loan.processingFee?.toLocaleString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Purpose:</strong> {loan.purpose}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>Collateral Information</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Description:</strong> {loan.collateral?.description || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Value:</strong> ${loan.collateral?.value?.toLocaleString() || '0'}
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <Card className="mt-4">
                <Card.Header>Related Parties</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>User:</strong> {loan.user?.name}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Group:</strong> {loan.group?.name || 'N/A'}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <div className="mt-4 d-flex justify-content-between">
            <Link to={`/loans/${loan._id}/edit`} className="btn btn-primary">
              <FaEdit /> Edit Loan
            </Link>
            {loan.status === 'approved' && (
              <Button variant="success" onClick={() => disburseHandler(loan._id)}>
                <FaMoneyBillWave /> Disburse Loan
              </Button>
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default LoanDetails;