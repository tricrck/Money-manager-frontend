import React, { useEffect, useState } from 'react';
import { Card, Container, Alert, Row, Col, Table, Badge, ProgressBar, Spinner, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getLoanStatistics } from '../../actions/loanActions';
import { 
  FaChartPie, FaMoneyBillWave, FaPercentage, FaCalendarAlt, 
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaBusinessTime,
  FaUserTie, FaQuestion, FaChartLine, FaChartBar, FaInfoCircle,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const LoanStatistics = () => {
  const dispatch = useDispatch();
  const loanStatistics = useSelector((state) => state.loanStatistics);
  const { loading, error, statistics } = loanStatistics;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userInfo) {
      dispatch(getLoanStatistics());
    }
  }, [dispatch, userInfo]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  // Determine badge color based on value
  const getBadgeVariant = (value, threshold) => {
    return value >= threshold ? 'success' : 'danger';
  };

  // Convert data for pie chart
  const preparePieChartData = () => {
    if (!statistics?.overall) return [];
    
    return [
      { name: 'Pending', value: statistics.overall.pendingCount || 0, color: '#ffc107' },
      { name: 'Approved', value: statistics.overall.approvedCount || 0, color: '#17a2b8' },
      { name: 'Disbursed', value: statistics.overall.disbursedCount || 0, color: '#28a745' },
      { name: 'Active', value: statistics.overall.activeCount || 0, color: '#007bff' },
      { name: 'Completed', value: statistics.overall.completedCount || 0, color: '#20c997' },
      { name: 'Defaulted', value: statistics.overall.defaultedCount || 0, color: '#dc3545' }
    ];
  };

  // Convert loan types data for bar chart
  const prepareLoanTypeData = () => {
    if (!statistics?.byType) return [];
    
    return statistics.byType.map(type => ({
      name: type.loanType || 'Unspecified',
      amount: type.totalAmount || 0,
      count: type.count || 0,
      rate: type.avgInterestRate || 0
    }));
  };

  // Summary cards data
  const getSummaryCards = () => {
    if (!statistics?.overall) return [];
    
    return [
      {
        title: 'Total Loans',
        value: statistics.overall.totalLoans || 0,
        icon: <FaChartPie className="text-primary" size={24} />,
        footer: 'All loan applications',
        color: 'primary'
      },
      {
        title: 'Total Amount',
        value: formatCurrency(statistics.overall.totalAmount || 0),
        icon: <FaMoneyBillWave className="text-success" size={24} />,
        footer: 'Total requested amount',
        color: 'success'
      },
      {
        title: 'Disbursed',
        value: formatCurrency(statistics.overall.totalDisbursed || 0),
        icon: <FaMoneyBillWave className="text-info" size={24} />,
        footer: `${statistics.overall.disbursedCount || 0} loans disbursed`,
        color: 'info'
      },
      {
        title: 'Total Repaid',
        value: formatCurrency(statistics.overall.totalRepaid || 0),
        icon: <FaCheckCircle className="text-success" size={24} />,
        footer: 'Amount repaid to date',
        color: 'success'
      }
    ];
  };

  // Key metrics cards data
  const getKeyMetricsCards = () => {
    if (!statistics?.overall) return [];
    
    return [
      {
        title: 'Avg Interest Rate',
        value: formatPercentage(statistics.overall.avgInterestRate || 0),
        icon: <FaPercentage className="text-warning" size={24} />,
        footer: 'Across all loans',
        color: 'warning'
      },
      {
        title: 'Avg Repayment Period',
        value: `${statistics.overall.avgRepaymentPeriod || 0} months`,
        icon: <FaCalendarAlt className="text-info" size={24} />,
        footer: 'Average loan term',
        color: 'info'
      },
      {
        title: 'Default Rate',
        value: formatPercentage(statistics.overall.defaultRate || 0),
        icon: <FaTimesCircle className="text-danger" size={24} />,
        footer: `${statistics.overall.defaultedCount || 0} defaulted loans`,
        color: 'danger',
        variant: getBadgeVariant(100 - (statistics.overall.defaultRate || 0), 75)
      },
      {
        title: 'Completion Rate',
        value: formatPercentage(statistics.overall.completionRate || 0),
        icon: <FaCheckCircle className="text-success" size={24} />,
        footer: `${statistics.overall.completedCount || 0} completed loans`,
        color: 'success',
        variant: getBadgeVariant(statistics.overall.completionRate || 0, 75)
      }
    ];
  };

  // Status breakdown cards data
  const getStatusBreakdownCards = () => {
    if (!statistics?.overall) return [];
    
    return [
      {
        title: 'Pending',
        value: statistics.overall.pendingCount || 0,
        icon: <FaHourglassHalf className="text-warning" size={24} />,
        color: 'warning'
      },
      {
        title: 'Approved',
        value: statistics.overall.approvedCount || 0,
        icon: <FaCheckCircle className="text-info" size={24} />,
        color: 'info'
      },
      {
        title: 'Active',
        value: statistics.overall.activeCount || 0,
        icon: <FaChartLine className="text-primary" size={24} />,
        color: 'primary'
      },
      {
        title: 'Disbursed',
        value: statistics.overall.disbursedCount || 0,
        icon: <FaMoneyBillWave className="text-success" size={24} />,
        color: 'success'
      }
    ];
  };

  // Render summary cards
  const renderSummaryCards = (cards) => {
    return cards.map((card, index) => (
      <Col key={index} md={6} lg={3} className="mb-4">
        <Card className={`border-${card.color} h-100 shadow-sm`}>
          <Card.Body className="d-flex flex-column">
            <div className="d-flex justify-content-between mb-3">
              <Card.Title className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{card.title}</Card.Title>
              {card.icon}
            </div>
            <Card.Text className="font-weight-bold mb-0" style={{ fontSize: '1.75rem' }}>
              {card.value}
            </Card.Text>
            {card.footer && (
              <div className="mt-auto pt-2 text-muted" style={{ fontSize: '0.8rem' }}>
                {card.footer}
                {card.variant && (
                  <Badge variant={card.variant} className="ml-2">
                    {card.variant === 'success' ? <FaArrowUp /> : <FaArrowDown />}
                  </Badge>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading loan statistics...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <FaInfoCircle className="mr-2" />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!statistics || !statistics.overall) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <FaInfoCircle className="mr-2" />
          No loan statistics available. Start by creating loans.
        </Alert>
      </Container>
    );
  }

  const pieChartData = preparePieChartData();
  const loanTypeData = prepareLoanTypeData();
  const summaryCards = getSummaryCards();
  const keyMetricsCards = getKeyMetricsCards();
  const statusBreakdownCards = getStatusBreakdownCards();

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">
            <FaChartBar className="mr-2 text-primary" />
            Loan Statistics Dashboard
          </h2>
          <p className="text-muted">Comprehensive overview of loan portfolio performance</p>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="loan-statistics-tabs"
        className="mb-4"
      >
        <Tab eventKey="overview" title="Overview">
          <Row className="mb-4">
            {renderSummaryCards(summaryCards)}
          </Row>

          <Row className="mb-4">
            <Col lg={8}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Loan Type Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={loanTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [name === 'amount' ? formatCurrency(value) : value, name === 'amount' ? 'Total Amount' : (name === 'count' ? 'Count' : 'Avg Rate')]} />
                      <Legend />
                      <Bar dataKey="amount" name="Total Amount" fill="#007bff" />
                      <Bar dataKey="count" name="Number of Loans" fill="#28a745" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Loan Status Distribution</h5>
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {renderSummaryCards(keyMetricsCards)}
          </Row>
        </Tab>

        <Tab eventKey="details" title="Detailed Analysis">
          <Row className="mb-4">
            {renderSummaryCards(statusBreakdownCards)}
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Loan Type Breakdown</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Loan Type</th>
                        <th>Count</th>
                        <th>Total Amount</th>
                        <th>Avg Interest Rate</th>
                        <th>Distribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.byType.map((type, index) => (
                        <tr key={index}>
                          <td>
                            {type.loanType ? (
                              <>
                                {type.loanType === 'business' ? (
                                  <FaBusinessTime className="mr-2 text-primary" />
                                ) : type.loanType === 'personal' ? (
                                  <FaUserTie className="mr-2 text-success" />
                                ) : (
                                  <FaQuestion className="mr-2 text-warning" />
                                )}
                                {type.loanType.charAt(0).toUpperCase() + type.loanType.slice(1)}
                              </>
                            ) : (
                              <>
                                <FaQuestion className="mr-2 text-secondary" />
                                Unspecified
                              </>
                            )}
                          </td>
                          <td>{type.count || 0}</td>
                          <td>{formatCurrency(type.totalAmount || 0)}</td>
                          <td>{formatPercentage(type.avgInterestRate || 0)}</td>
                          <td style={{ width: '20%' }}>
                            <ProgressBar 
                              now={type.count} 
                              max={statistics.overall.totalLoans} 
                              variant={type.loanType === 'business' ? 'primary' : (type.loanType === 'personal' ? 'success' : 'secondary')} 
                              label={`${((type.count / statistics.overall.totalLoans) * 100).toFixed(0)}%`} 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Loan Performance</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Default Rate</span>
                      <span className={`text-${getBadgeVariant(100 - (statistics.overall.defaultRate || 0), 75)}`}>
                        {formatPercentage(statistics.overall.defaultRate || 0)}
                      </span>
                    </div>
                    <ProgressBar variant={getBadgeVariant(100 - (statistics.overall.defaultRate || 0), 75)} now={statistics.overall.defaultRate || 0} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Completion Rate</span>
                      <span className={`text-${getBadgeVariant(statistics.overall.completionRate || 0, 75)}`}>
                        {formatPercentage(statistics.overall.completionRate || 0)}
                      </span>
                    </div>
                    <ProgressBar variant={getBadgeVariant(statistics.overall.completionRate || 0, 75)} now={statistics.overall.completionRate || 0} />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Disbursement Rate</span>
                      <span className="text-info">
                        {formatPercentage((statistics.overall.disbursedCount / statistics.overall.totalLoans) * 100 || 0)}
                      </span>
                    </div>
                    <ProgressBar variant="info" now={(statistics.overall.disbursedCount / statistics.overall.totalLoans) * 100 || 0} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Interest Rate Analysis</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={loanTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Interest Rate']} />
                      <Bar dataKey="rate" name="Interest Rate" fill="#17a2b8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3">
                    <Table size="sm" borderless>
                      <tbody>
                        <tr>
                          <td>Overall Average Rate:</td>
                          <td className="text-right font-weight-bold">
                            {formatPercentage(statistics.overall.avgInterestRate || 0)}
                          </td>
                        </tr>
                        <tr>
                          <td>Highest Rate:</td>
                          <td className="text-right font-weight-bold">
                            {formatPercentage(Math.max(...loanTypeData.map(type => type.rate)))}
                          </td>
                        </tr>
                        <tr>
                          <td>Lowest Rate:</td>
                          <td className="text-right font-weight-bold">
                            {formatPercentage(Math.min(...loanTypeData.map(type => type.rate)))}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LoanStatistics;