import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Container, Alert, Badge, Card, Row, Col, 
  Form, Pagination, Spinner, Modal, OverlayTrigger, Tooltip 
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  FaEdit, FaTrash, FaEye, FaCheck, FaMoneyBillWave, 
  FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp,
  FaExclamationTriangle, FaUserCheck, FaBan, FaCalendarAlt,
  FaInfoCircle, FaFileInvoiceDollar, FaCreditCard
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { listLoans } from '../../actions/loanActions';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const LoanList = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const loanList = useSelector((state) => state.loanList);
  const { loading, error, loans } = loanList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(listLoans());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  // Filter loans based on search term and status filter
  const filteredLoans = loans?.loans?.filter(loan => {
    const matchesSearch = searchTerm === '' || 
      (loan.user?.name && loan.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (loan._id && loan._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (loan.loanType && loan.loanType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (loan.purpose && loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === '' || loan.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }) || [];

  // Sort loans
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'principalAmount') {
      comparison = (a.principalAmount || a.amount || 0) - (b.principalAmount || b.amount || 0);
    } else if (sortField === 'repaymentPeriod') {
      comparison = (a.repaymentPeriod || 0) - (b.repaymentPeriod || 0);
    } else if (sortField === 'interestRate') {
      comparison = (a.interestRate || 0) - (b.interestRate || 0);
    } else if (sortField === 'applicationDate') {
      comparison = new Date(a.applicationDate || a.createdAt) - new Date(b.applicationDate || b.createdAt);
    } else if (sortField === 'status') {
      comparison = (a.status || '').localeCompare(b.status || '');
    } else if (sortField === 'user') {
      comparison = (a.user?.name || '').localeCompare(b.user?.name || '');
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoans = sortedLoans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLoans.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteHandler = (id) => {
    setSelectedLoanId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle the delete action here
    console.log(`Deleting loan with ID: ${selectedLoanId}`);
    setShowDeleteModal(false);
  };

  const disburseHandler = (id) => {
    // Handle the disburse action here
    console.log(`Disbursing loan with ID: ${id}`);
  };

  function EditHandler(loanId) {
    const navigationUrl = `/loans/${loanId}/edit`;
    navigate(navigationUrl);
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const viewLoanDetails = (loan) => {
    setSelectedLoan(loan);
    setShowInfoModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" className="d-flex align-items-center gap-1"><FaExclamationTriangle /> Pending</Badge>;
      case 'approved':
        return <Badge bg="success" className="d-flex align-items-center gap-1"><FaUserCheck /> Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger" className="d-flex align-items-center gap-1"><FaBan /> Rejected</Badge>;
      case 'disbursed':
        return <Badge bg="info" className="d-flex align-items-center gap-1"><FaMoneyBillWave /> Disbursed</Badge>;
      case 'repaid':
        return <Badge bg="primary" className="d-flex align-items-center gap-1"><FaCheck /> Repaid</Badge>;
      case 'defaulted':
        return <Badge bg="danger" className="d-flex align-items-center gap-1"><FaExclamationTriangle /> Defaulted</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getLoanAmount = (loan) => {
    return loan.principalAmount || loan.amount || 0;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('MMM DD, YYYY');
  };

  return (
    <Container fluid className="py-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0 d-flex align-items-center">
            <FaFileInvoiceDollar className="me-2" /> Loan Management
          </h3>
        </Card.Header>
        <Card.Body>
          {/* Search and Filter Controls */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="mb-0">
                <div className="input-group">
                  <span className="input-group-text"><FaSearch /></span>
                  <Form.Control
                    type="text"
                    placeholder="Search by ID, name, or loan type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-0">
                <div className="input-group">
                  <span className="input-group-text"><FaFilter /></span>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="disbursed">Disbursed</option>
                    <option value="repaid">Repaid</option>
                    <option value="defaulted">Defaulted</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
            <Col md={5} className="text-end">
              <LinkContainer to="/loans/create">
                <Button variant="success">
                  <FaCreditCard className="me-1" /> New Loan Application
                </Button>
              </LinkContainer>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading loan data...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              {filteredLoans.length === 0 ? (
                <Alert variant="info">No loans match your search criteria.</Alert>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover bordered className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th onClick={() => toggleSort('user')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              APPLICANT
                              {sortField === 'user' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th onClick={() => toggleSort('loanType')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              TYPE
                              {sortField === 'loanType' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th onClick={() => toggleSort('principalAmount')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              AMOUNT
                              {sortField === 'principalAmount' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th onClick={() => toggleSort('repaymentPeriod')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              PERIOD
                              {sortField === 'repaymentPeriod' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th onClick={() => toggleSort('interestRate')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              INTEREST
                              {sortField === 'interestRate' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th onClick={() => toggleSort('applicationDate')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              APPLICATION DATE
                              {sortField === 'applicationDate' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th onClick={() => toggleSort('status')} className="cursor-pointer">
                            <div className="d-flex justify-content-between align-items-center">
                              STATUS
                              {sortField === 'status' && (
                                sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />
                              )}
                            </div>
                          </th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLoans.map((loan) => (
                          <tr key={loan._id}>
                            <td>
                              {loan.user ? (
                                <div className="d-flex flex-column">
                                  <span className="fw-bold">{loan.user.name}</span>
                                  <small className="text-muted">{loan.user.email}</small>
                                </div>
                              ) : (
                                <span className="text-muted">Not assigned</span>
                              )}
                            </td>
                            <td>
                              <Badge bg={loan.loanType === 'business' ? 'primary' : 'secondary'} className="text-capitalize">
                                {loan.loanType || 'N/A'}
                              </Badge>
                              {loan.purpose && (
                                <small className="d-block text-muted mt-1">{loan.purpose}</small>
                              )}
                            </td>
                            <td className="text-end fw-bold">
                              ${getLoanAmount(loan).toLocaleString()}
                              {loan.interestType && (
                                <small className="d-block text-muted">
                                  {loan.interestType === 'reducing_balance' ? 'Reducing Balance' : 'Simple Interest'}
                                </small>
                              )}
                            </td>
                            <td className="text-center">
                              {loan.repaymentPeriod} {loan.repaymentPeriod === 1 ? 'month' : 'months'}
                            </td>
                            <td className="text-center">
                              {loan.interestRate}%
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="text-muted me-1" size={14} />
                                {formatDate(loan.applicationDate)}
                              </div>
                            </td>
                            <td>{getStatusBadge(loan.status)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
                                  <Button 
                                    variant="info" 
                                    size="sm" 
                                    onClick={() => viewLoanDetails(loan)}
                                  >
                                    <FaEye />
                                  </Button>
                                </OverlayTrigger>
                                
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit Loan</Tooltip>}>
                                    <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => EditHandler(loan._id)}>
                                      <FaEdit />
                                    </Button>
                                  </OverlayTrigger>
                                
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete Loan</Tooltip>}>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteHandler(loan._id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </OverlayTrigger>
                                
                                {loan.status === 'approved' && (
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Disburse Loan</Tooltip>}>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => disburseHandler(loan._id)}
                                    >
                                      <FaMoneyBillWave />
                                    </Button>
                                  </OverlayTrigger>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedLoans.length)} of {sortedLoans.length} loans
                      </div>
                      <Pagination>
                        <Pagination.First
                          onClick={() => paginate(1)}
                          disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                        
                        {[...Array(totalPages).keys()].map(number => (
                          <Pagination.Item
                            key={number + 1}
                            active={number + 1 === currentPage}
                            onClick={() => paginate(number + 1)}
                          >
                            {number + 1}
                          </Pagination.Item>
                        ))}
                        
                        <Pagination.Next
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                          onClick={() => paginate(totalPages)}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this loan? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loan Details Modal */}
      <Modal 
        show={showInfoModal} 
        onHide={() => setShowInfoModal(false)} 
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaInfoCircle className="me-2" />
            Loan Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <Row>
              <Col md={6}>
                <h5>Basic Information</h5>
                <Table bordered hover size="sm" className="mb-4">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Loan ID</td>
                      <td>{selectedLoan._id}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Applicant</td>
                      <td>{selectedLoan.user ? selectedLoan.user.name : 'Not assigned'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Group</td>
                      <td>{selectedLoan.group ? selectedLoan.group.name : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Loan Type</td>
                      <td className="text-capitalize">{selectedLoan.loanType || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Purpose</td>
                      <td>{selectedLoan.purpose || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Status</td>
                      <td>{getStatusBadge(selectedLoan.status)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Application Date</td>
                      <td>{formatDate(selectedLoan.applicationDate)}</td>
                    </tr>
                    {selectedLoan.disbursementDate && (
                      <tr>
                        <td className="fw-bold">Disbursement Date</td>
                        <td>{formatDate(selectedLoan.disbursementDate)}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                  
                <h5>Financial Details</h5>
                <Table bordered hover size="sm">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Principal Amount</td>
                      <td>${getLoanAmount(selectedLoan).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Interest Rate</td>
                      <td>{selectedLoan.interestRate}%</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Interest Type</td>
                      <td>
                        {selectedLoan.interestType === 'reducing_balance' 
                          ? 'Reducing Balance' 
                          : selectedLoan.interestType === 'simple' 
                            ? 'Simple Interest' 
                            : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Repayment Period</td>
                      <td>{selectedLoan.repaymentPeriod} months</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Total Repayable</td>
                      <td>${(selectedLoan.totalRepayableAmount || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Amount Repaid</td>
                      <td>${(selectedLoan.amountRepaid || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Processing Fee</td>
                      <td>${(selectedLoan.processingFee || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h5>Collateral Information</h5>
                {selectedLoan.collateral && selectedLoan.collateral.value ? (
                  <Table bordered hover size="sm" className="mb-4">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Description</td>
                        <td>{selectedLoan.collateral.description || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Value</td>
                        <td>${(selectedLoan.collateral.value || 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Documents</td>
                        <td>
                          {selectedLoan.collateral.documents && selectedLoan.collateral.documents.length > 0 ? (
                            <ul className="mb-0 ps-3">
                              {selectedLoan.collateral.documents.map((doc, idx) => (
                                <li key={idx}><a href={doc} target="_blank" rel="noreferrer">Document {idx + 1}</a></li>
                              ))}
                            </ul>
                          ) : 'No documents attached'}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info" className="mb-4">No collateral information available</Alert>
                )}

                <h5>Repayment Schedule</h5>
                {selectedLoan.repaymentSchedule && selectedLoan.repaymentSchedule.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Table bordered hover size="sm">
                      <thead className="bg-light">
                        <tr>
                          <th>#</th>
                          <th>Due Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLoan.repaymentSchedule.map((installment) => (
                          <tr key={installment._id}>
                            <td>{installment.installmentNumber}</td>
                            <td>{formatDate(installment.dueDate)}</td>
                            <td>${installment.totalAmount.toLocaleString()}</td>
                            <td>
                              {installment.paid ? (
                                <Badge bg="success">Paid</Badge>
                              ) : new Date(installment.dueDate) < new Date() ? (
                                <Badge bg="danger">Overdue</Badge>
                              ) : (
                                <Badge bg="warning">Pending</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert variant="info">No repayment schedule available</Alert>
                )}

                {selectedLoan.notes && selectedLoan.notes.length > 0 && (
                  <>
                    <h5 className="mt-3">Notes & History</h5>
                    <div className="p-2 border rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {selectedLoan.notes.map((note, idx) => (
                        <div key={idx} className="mb-2 pb-2 border-bottom">
                          <div className="text-muted small">{formatDate(note.date)}</div>
                          <div>{note.text}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
            Close
          </Button>
          <LinkContainer to={`/loans/${selectedLoan?._id}/edit`}>
            <Button variant="primary">
              <FaEdit className="me-1" /> Edit Loan
            </Button>
          </LinkContainer>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoanList;