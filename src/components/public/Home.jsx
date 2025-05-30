import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Badge, ListGroup, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { FaUsers, FaWallet, FaMoneyBill, FaHistory, FaUserCircle } from 'react-icons/fa';
import { getUserDetails } from '../../actions/userActions';
import { listMyGroups } from '../../actions/groupActions';
import { getWalletDetails } from '../../actions/walletActions';
import { getUserLoans, applyForLoan  } from '../../actions/loanActions';

const Home = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    loanType: 'personal',
    principalAmount: '',
    repaymentPeriod: '',
    interestRate: 10,
    interestType: 'simple',
    purpose: ''
  });
  const loanApply = useSelector(state => state.loanApply);
  const { loading: loanApplyloading, success, error:loanApplyerror } = loanApply || {};

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: loadingMy, error: errorMy, myGroups: activeGroups = [] } = myGroups;

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading, error, wallet } = walletDetails;

  const userLoansList = useSelector((state) => state.userLoansList);
  const { loans } = userLoansList;
  
  useEffect(() => {
    if (userInfo?.user?._id) {
      dispatch(getUserDetails(userInfo.user._id));
      dispatch(listMyGroups());
      dispatch(getWalletDetails(userInfo.user._id));
      dispatch(getUserLoans(userInfo.user._id));
    }
  }, [dispatch, userInfo]);

  const handleClose = () => {
    setShow(false);
    // Reset form always, not just on success
    setFormData({
      loanType: 'personal',
      principalAmount: '',
      repaymentPeriod: '',
      interestRate: 10,
      interestType: 'simple',
      purpose: ''
    });
  };
  
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'principalAmount' || name === 'repaymentPeriod' || name === 'interestRate' 
        ? Number(value) 
        : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass null as groupId for personal loans
    dispatch(applyForLoan(null, formData));
  };

  // Guest user view
  if (!userInfo) {
    return (
      <Container className="my-5 py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Body className="p-5">
                <h1 className="text-center text-primary mb-4">Welcome to EasyLoan</h1>
                <p className="text-center text-muted mb-4">
                  The smart way to manage your finances, join savings groups, and access loans when you need them.
                </p>
                <div className="d-grid gap-3 mb-4">
                  <Button as={Link} to="/register" variant="primary" size="lg">Create an Account</Button>
                  <Button as={Link} to="/login" variant="outline-primary" size="lg">Sign In</Button>
                </div>
                
                <div className="mt-5">
                  <Row className="text-center">
                    <Col md={4}>
                      <FaUsers className="text-primary mb-2" size={36} />
                      <h5>Join Groups</h5>
                      <p className="small text-muted">Save together with friends and family</p>
                    </Col>
                    <Col md={4}>
                      <FaWallet className="text-primary mb-2" size={36} />
                      <h5>Secure Wallet</h5>
                      <p className="small text-muted">Manage your money safely</p>
                    </Col>
                    <Col md={4}>
                      <FaMoneyBill className="text-primary mb-2" size={36} />
                      <h5>Quick Loans</h5>
                      <p className="small text-muted">Access funds when you need them</p>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  // Show loading state while data is being fetched
  if (loading || loadingMy || !wallet || loans === undefined) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }
  // Logged in user view
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Welcome back, {userInfo?.name}</h2>
          <p className="text-muted">Here's your financial overview</p>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3 p-md-4">
              <FaWallet className="text-primary mb-2" size={28} />
              <h3 className="mb-1 fs-4">Ksh {wallet?.balance || 0}</h3>
              <p className="text-muted mb-0 small">Wallet Balance</p>
            </Card.Body>
            <Card.Footer className="bg-white border-0 text-center p-2">
              <Button variant="link" as={Link} to="/wallet" className="text-decoration-none p-1">
                View Details
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3 p-md-4">
              <FaUsers className="text-primary mb-2" size={28} />
              <h3 className="mb-1 fs-4">{activeGroups.length}</h3>
              <p className="text-muted mb-0 small">Active Groups</p>
            </Card.Body>
            <Card.Footer className="bg-white border-0 text-center p-2">
              <Button variant="link" as={Link} to="/groups" className="text-decoration-none p-1">
                View All Groups
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3 p-md-4">
              <FaMoneyBill className="text-primary mb-2" size={28} />
              <h3 className="mb-1 fs-4">{loans?.filter(loan => loan.status === 'active').length || 0}</h3>
              <p className="text-muted mb-0 small">Active Loans</p>
            </Card.Body>
            <Card.Footer className="bg-white border-0 text-center p-2">
              <Button variant="link" as={Link} to="/loans" className="text-decoration-none p-1">
                Manage Loans
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3 p-md-4">
              <FaUserCircle className="text-primary mb-2" size={28} />
              <h3 className="mb-1 fs-4">Profile</h3>
              <p className="text-muted mb-0 small">Account Settings</p>
            </Card.Body>
            <Card.Footer className="bg-white border-0 text-center p-2">
              <Button variant="link" as={Link} to="/profile" className="text-decoration-none p-1">
                View Profile
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs defaultActiveKey="groups" id="home-tabs" className="mb-4">
        <Tab eventKey="groups" title="My Groups">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Your Savings Groups</h4>
                <Link to="/groups/create">
                  <Button variant="outline-primary" size="sm">
                    + Create New Group
                  </Button>
                </Link>
              </div>
              
              {activeGroups.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted">You haven't joined any groups yet.</p>
                  <Button variant="primary">Find Groups to Join</Button>
                </div>
              ) : (
                <Row>
                  {activeGroups.map(group => (
                    <Col md={6} lg={4} key={group._id} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <h5>{group.name}</h5>
                            <Badge bg="success" pill>Active</Badge>
                          </div>
                          <div className="d-flex justify-content-between my-3">
                            <div>
                              <small className="text-muted d-block">Members</small>
                              <span>{group.members.length}</span> {/* Display number of members */}
                            </div>
                            <div>
                              <small className="text-muted d-block">Group Balance</small>
                              <span className="text-success">
                                {group.savingsAccount.balance} {group.savingsAccount.currency} {/* Display savings balance & currency */}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline-primary" size="sm" className="w-100" as={Link} to={`/groups/${group._id}`}> {/* Use group._id */}
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="wallet" title="My Wallet">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Wallet Overview</h4>
                <div>
                {userInfo?.user?._id && (
                    <Link to={`/wallet/${userInfo.user._id}/withdraw`}>
                      Withdraw
                    </Link>
                  )}

                {userInfo?.user?._id && (
                  <Link to={`/wallet/${userInfo.user._id}/deposit`}>
                    <Button variant="primary" size="sm">Deposit</Button>
                  </Link>
                )}

                  
                </div>
              </div>
              
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h5 className="text-muted mb-1">Available Balance</h5>
                      <h2 className="mb-0">${wallet.balance}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <h5 className="mb-3">Recent Transactions</h5>
              {!wallet || !wallet.transactions || wallet.transactions.length === 0 ?  (
                <p className="text-muted">No recent transactions to display.</p>
              ) : (
                <ListGroup variant="flush">
                  {wallet.transactions.map(transaction => (
                    <ListGroup.Item key={transaction._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{transaction.description}</h6>
                        <small className="text-muted">{new Date(transaction.date).toLocaleDateString()}</small>
                      </div>
                      <div className={transaction.type === 'deposit' ? 'text-success' : 'text-danger'}>
                        {transaction.type === 'deposit' ? '+' : '-'} ${transaction.amount}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              <div className="text-center mt-3">
                <Button variant="link" as={Link} to="/transactions">
                  View All Transactions
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="loans" title="My Loans">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Your Loans</h4>
                <Button variant="primary" size="sm" onClick={handleShow}>
                  Apply for New Loan
                </Button>
              </div>
              
              {loans.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted">You don't have any loans yet.</p>
                  <Button variant="primary">Apply for a Loan</Button>
                </div>
              ) : (
                <Row>
                  {loans.map(loan => (
                    <Col md={6} key={loan._id} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <h5>${loan.principalAmount.toLocaleString()}</h5>
                            <Badge bg={loan.status === 'active' ? 'success' : 'warning'} pill>
                              {loan.status === 'pending' ? 'Pending' : loan.status}
                            </Badge>
                          </div>
                          <div className="mt-3">
                            {loan.status === 'active' && (
                              <>
                                <div className="d-flex justify-content-between mb-2">
                                  <small className="text-muted">Due Date</small>
                                  <span>{new Date(loan.repaymentSchedule[0].dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <small className="text-muted">Interest Rate</small>
                                  <span>{loan.interestRate}%</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                  <small className="text-muted">Repaid</small>
                                  <span>${loan.amountRepaid.toLocaleString()} of ${loan.totalRepayableAmount.toLocaleString()}</span>
                                </div>
                                <div className="progress mb-3" style={{ height: '10px' }}>
                                  <div 
                                    className="progress-bar bg-success" 
                                    role="progressbar" 
                                    style={{ width: `${(loan.amountRepaid / loan.totalRepayableAmount) * 100}%` }}
                                    aria-valuenow={(loan.amountRepaid / loan.totalRepayableAmount) * 100}
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </>
                            )}
                            {loan.status === 'pending' && (
                              <>
                                <div className="d-flex justify-content-between mb-2">
                                  <small className="text-muted">Interest Rate</small>
                                  <span>{loan.interestRate}%</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <small className="text-muted">Loan Type</small>
                                  <span className="text-capitalize">{loan.loanType}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <small className="text-muted">Purpose</small>
                                  <span>{loan.purpose}</span>
                                </div>
                                <p className="text-muted small mt-2">Your loan application is being reviewed. We'll notify you once it's approved.</p>
                              </>
                            )}
                          </div>
                          <Button variant="outline-primary" size="sm" className="w-100 mt-2" as={Link} to={`/loans/${loan._id}`}>
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Apply for New Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && (
            <div className="alert alert-success">
              Loan application submitted successfully!
            </div>
          )}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          {!success && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Loan Type</Form.Label>
                <Form.Select 
                  name="loanType" 
                  value={formData.loanType}
                  onChange={handleChange}
                  required
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="home">Home</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Principal Amount</Form.Label>
                <Form.Control 
                  type="number" 
                  name="principalAmount"
                  value={formData.principalAmount}
                  onChange={handleChange}
                  required
                  min="1000"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Repayment Period (months)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="repaymentPeriod"
                  value={formData.repaymentPeriod}
                  onChange={handleChange}
                  required
                  min="1"
                  max="60"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate (%)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Interest Type</Form.Label>
                <Form.Select 
                  name="interestType" 
                  value={formData.interestType}
                  onChange={handleChange}
                  required
                >
                  <option value="simple">Simple</option>
                  <option value="compound">Compound</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Purpose</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    
  );
};

export default Home;