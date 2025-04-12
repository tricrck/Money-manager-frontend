import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupAccounts, getGroupDetails } from '../../actions/groupActions';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GroupAccounts = ({ match, history }) => {
  const { id } = useParams();
  const groupId = id;

  const [loanAccount, setLoanAccount] = useState(0);
  const [savingsAccount, setSavingsAccount] = useState(0);
  const [interestEarnedAccount, setInterestEarnedAccount] = useState(0);
  const [finesAccount, setFinesAccount] = useState(0);

  const dispatch = useDispatch();

  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading: loadingDetails, error: errorDetails, group } = groupDetails;

  const groupAccountsUpdate = useSelector((state) => state.groupAccountsUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = groupAccountsUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(getGroupDetails(groupId));
    } else {
      history.push('/login');
    }
  }, [dispatch, history, groupId, userInfo]);

  useEffect(() => {
    if (group) {
      setLoanAccount(group.accounts?.loanAccount?.balance || 0);
      setSavingsAccount(group.accounts?.savingsAccount?.balance || 0);
      setInterestEarnedAccount(group.accounts?.interestEarnedAccount?.balance || 0);
      setFinesAccount(group.accounts?.finesAccount?.balance || 0);
    }
  }, [group]);

  const submitHandler = (e) => {
    e.preventDefault();
    const accountsData = {
      loanAccount: { balance: Number(loanAccount) },
      savingsAccount: { balance: Number(savingsAccount) },
      interestEarnedAccount: { balance: Number(interestEarnedAccount) },
      finesAccount: { balance: Number(finesAccount) },
    };
    dispatch(updateGroupAccounts(groupId, accountsData));
  };

  return (
    <Container className="py-5">
      <Link to={`/groups/${groupId}`} className="btn btn-light my-3">
        <FaArrowLeft /> Back to Group
      </Link>
      <h2 className="mb-4">Update Group Accounts</h2>
      {errorDetails && <Alert variant="danger">{errorDetails}</Alert>}
      {errorUpdate && <Alert variant="danger">{errorUpdate}</Alert>}
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="loanAccount" className="mb-3">
              <Form.Label>Loan Account Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter loan account balance"
                value={loanAccount}
                onChange={(e) => setLoanAccount(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="savingsAccount" className="mb-3">
              <Form.Label>Savings Account Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter savings account balance"
                value={savingsAccount}
                onChange={(e) => setSavingsAccount(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="interestEarnedAccount" className="mb-3">
              <Form.Label>Interest Earned Account Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter interest earned account balance"
                value={interestEarnedAccount}
                onChange={(e) => setInterestEarnedAccount(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="finesAccount" className="mb-3">
              <Form.Label>Fines Account Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter fines account balance"
                value={finesAccount}
                onChange={(e) => setFinesAccount(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          type="submit"
          variant="primary"
          disabled={loadingUpdate}
          className="mt-4"
        >
          {loadingUpdate ? 'Updating...' : 'Update Accounts'}
        </Button>
      </Form>
    </Container>
  );
};

export default GroupAccounts;