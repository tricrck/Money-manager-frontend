import React, { useEffect, useState } from 'react';
import { 
  Table, Container, Alert, Badge, Card, Row, Col, 
  Spinner, Form, InputGroup, Pagination, Button
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletDetails } from '../../actions/walletActions';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaSearch, FaFilter, FaDownload, 
  FaCalendarAlt, FaSort, FaSortAmountUp, FaSortAmountDown,
  FaMoneyBillWave, FaCreditCard, FaExchangeAlt, FaInfoCircle
} from 'react-icons/fa';

const TransactionHistory = () => {
  const params = useParams();
  const userId = params.userId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const walletDetails = useSelector((state) => state.walletDetails);
  const { loading, error, wallet } = walletDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(getWalletDetails(userId));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userId, userInfo]);

  // Filtered and sorted transactions
  const getFilteredTransactions = () => {
    if (!wallet || !wallet.transactions) return [];
    
    let filtered = [...wallet.transactions];
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(term) ||
        t.paymentMethod?.toLowerCase().includes(term) ||
        t.paymentReference?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let compareA, compareB;
      
      switch (sortField) {
        case 'amount':
          compareA = a.amount;
          compareB = b.amount;
          break;
        case 'type':
          compareA = a.type;
          compareB = b.type;
          break;
        case 'date':
        default:
          compareA = new Date(a.date);
          compareB = new Date(b.date);
      }
      
      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getTransactionTypeBadge = (type) => {
    switch (type) {
      case 'deposit':
        return <Badge bg="success" className="py-2 px-3"><FaMoneyBillWave className="me-1" /> Deposit</Badge>;
      case 'withdrawal':
        return <Badge bg="danger" className="py-2 px-3"><FaCreditCard className="me-1" /> Withdrawal</Badge>;
      default:
        return <Badge bg="info" className="py-2 px-3"><FaExchangeAlt className="me-1" /> {type}</Badge>;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ms-1 text-muted" />;
    return sortDirection === 'asc' ? <FaSortAmountUp className="ms-1 text-primary" /> : <FaSortAmountDown className="ms-1 text-primary" />;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let items = [];
    const maxPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    items.push(
      <Pagination.First 
        key="first" 
        onClick={() => setCurrentPage(1)} 
        disabled={currentPage === 1} 
      />
    );
    
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => setCurrentPage(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
    );
    
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => setCurrentPage(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
    );
    
    items.push(
      <Pagination.Last 
        key="last" 
        onClick={() => setCurrentPage(totalPages)} 
        disabled={currentPage === totalPages} 
      />
    );
    
    return <Pagination className="mt-3 justify-content-center">{items}</Pagination>;
  };

  const getTotalAmount = (type) => {
    if (!wallet || !wallet.transactions) return 0;
    return wallet.transactions
      .filter(t => type === 'all' || t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Link to={`/wallet/${userId}`} className="btn btn-outline-primary mb-3">
            <FaArrowLeft className="me-2" /> Back to Wallet
          </Link>
          
          <h2 className="mb-4 d-flex align-items-center">
            <FaExchangeAlt className="me-3 text-primary" /> 
            Transaction History
          </h2>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading transaction data...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              <FaInfoCircle className="me-2" /> {error}
            </Alert>
          ) : (
            <>
              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={4}>
                  <Card className="bg-light mb-3">
                    <Card.Body className="text-center">
                      <h6 className="text-muted mb-2">Total Transactions</h6>
                      <h3>{wallet.transactions?.length || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-success text-white mb-3">
                    <Card.Body className="text-center">
                      <h6 className="mb-2">Total Deposits</h6>
                      <h3>KES {getTotalAmount('deposit').toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-danger text-white mb-3">
                    <Card.Body className="text-center">
                      <h6 className="mb-2">Total Withdrawals</h6>
                      <h3>KES {getTotalAmount('withdrawal').toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {/* Filters Row */}
              <Row className="mb-4 align-items-center">
                <Col md={6} lg={4}>
                  <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6} lg={3} className="mt-3 mt-md-0">
                  <InputGroup>
                    <InputGroup.Text><FaFilter /></InputGroup.Text>
                    <Form.Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Transactions</option>
                      <option value="deposit">Deposits Only</option>
                      <option value="withdrawal">Withdrawals Only</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={12} lg={5} className="mt-3 mt-lg-0 text-md-end">
                  <Button variant="outline-secondary" className="me-2">
                    <FaCalendarAlt className="me-1" /> Date Range
                  </Button>
                  <Button variant="outline-success">
                    <FaDownload className="me-1" /> Export
                  </Button>
                </Col>
              </Row>
              
              {/* Transaction Table */}
              {filteredTransactions.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <FaInfoCircle size={28} className="mb-3" />
                  <h5>No transactions found</h5>
                  <p className="mb-0">Try changing your search or filter options</p>
                </Alert>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="table-borderless">
                      <thead className="bg-light">
                        <tr>
                          <th className="cursor-pointer" onClick={() => handleSort('date')}>
                            <span className="d-flex align-items-center">
                              DATE {renderSortIcon('date')}
                            </span>
                          </th>
                          <th className="cursor-pointer" onClick={() => handleSort('type')}>
                            <span className="d-flex align-items-center">
                              TYPE {renderSortIcon('type')}
                            </span>
                          </th>
                          <th className="cursor-pointer" onClick={() => handleSort('amount')}>
                            <span className="d-flex align-items-center">
                              AMOUNT {renderSortIcon('amount')}
                            </span>
                          </th>
                          <th>METHOD</th>
                          <th>REFERENCE</th>
                          <th>DESCRIPTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id} className="border-bottom">
                            <td className="py-3">
                              <div className="fw-bold">{new Date(transaction.date).toLocaleDateString()}</div>
                              <small className="text-muted">{new Date(transaction.date).toLocaleTimeString()}</small>
                            </td>
                            <td className="py-3">{getTransactionTypeBadge(transaction.type)}</td>
                            <td className={`py-3 fw-bold ${transaction.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                              {transaction.type === 'withdrawal' ? '- ' : '+ '}
                              KES {transaction.amount.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <Badge bg="light" text="dark" pill className="px-3 py-2">
                                {transaction.paymentMethod}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <span className="text-muted">{transaction.paymentReference}</span>
                            </td>
                            <td className="py-3">{transaction.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {renderPagination()}
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted">
                      Showing {Math.min(filteredTransactions.length, indexOfFirstItem + 1)} to {Math.min(filteredTransactions.length, indexOfLastItem)} of {filteredTransactions.length} entries
                    </span>
                    <Form.Select 
                      style={{ width: 'auto' }}
                      value={itemsPerPage}
                      disabled
                      className="ms-2"
                    >
                      <option value="10">10 per page</option>
                    </Form.Select>
                  </div>
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TransactionHistory;