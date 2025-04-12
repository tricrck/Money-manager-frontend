import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Container, Alert, Badge, Card, Row, Col, 
  Spinner, Tabs, Tab, Form, InputGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  FaPlus, FaUsers, FaEye, FaEdit, FaSearch, FaFilter, 
  FaSortAmountDown, FaSortAmountUp, FaUserPlus, FaChartPie, 
  FaExclamationTriangle, FaInfoCircle, FaCircle, FaMoneyBillWave
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { listGroups, listMyGroups } from '../../actions/groupActions';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const GroupList = ({ history }) => {
  const dispatch = useDispatch();

  const groupList = useSelector((state) => state.groupList);
  const { loading: loadingAll, error: errorAll, groups = [] } = groupList;

  const myGroups = useSelector((state) => state.myGroups);
  const { loading: loadingMy, error: errorMy, myGroups: myGroupsList = [] } = myGroups;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeTab, setActiveTab] = useState('myGroups');

  useEffect(() => {
    if (userInfo) {
      dispatch(listGroups());
      dispatch(listMyGroups());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  // Filter function
  const filterGroups = (groupsList) => {
    return groupsList
      .filter(group => 
        // Search filter
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        // Type filter
        (filterType === 'all' || group.groupType === filterType)
      )
      .sort((a, b) => {
        // Sorting
        if (sortField === 'name') {
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortField === 'members') {
          return sortDirection === 'asc' 
            ? (a.members?.length || 0) - (b.members?.length || 0)
            : (b.members?.length || 0) - (a.members?.length || 0);
        }
        return 0;
      });
  };

  const filteredMyGroups = myGroupsList ? filterGroups(myGroupsList) : [];
  const filteredAllGroups = groups ? filterGroups(groups) : [];

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get group type badge with icon
  const getGroupTypeBadge = (type) => {
    switch (type) {
      case 'chama':
        return <Badge bg="primary"><FaUsers className="me-1" /> Chama</Badge>;
      case 'investment':
        return <Badge bg="success"><FaMoneyBillWave className="me-1" /> Investment</Badge>;
      case 'savings':
        return <Badge bg="info"><FaMoneyBillWave className="me-1" /> Savings</Badge>;
      default:
        return <Badge bg="secondary"><FaCircle className="me-1" /> {type || 'Other'}</Badge>;
    }
  };

  // Prepare chart data
  const prepareGroupTypeData = (groupsList) => {
    const typeCount = {};
    
    groupsList.forEach(group => {
      const type = group.groupType || 'other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    const chartData = Object.keys(typeCount).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: typeCount[type],
      color: type === 'chama' ? '#007bff' : 
             type === 'investment' ? '#28a745' : 
             type === 'savings' ? '#17a2b8' : '#6c757d'
    }));
    
    return chartData;
  };

  // Render stats cards
  const renderStatsCards = (groupsList) => {
    // Calculate statistics
    const totalGroups = groupsList.length;
    const totalMembers = groupsList.reduce((sum, group) => sum + (group.members?.length || 0), 0);
    const avgMembersPerGroup = totalGroups ? (totalMembers / totalGroups).toFixed(1) : 0;
    
    const groupTypes = {};
    groupsList.forEach(group => {
      const type = group.groupType || 'other';
      groupTypes[type] = (groupTypes[type] || 0) + 1;
    });
    
    const largestGroupType = Object.keys(groupTypes).reduce(
      (max, type) => groupTypes[type] > groupTypes[max] ? type : max,
      Object.keys(groupTypes)[0] || ''
    );

    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-2">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                  <FaUsers className="text-primary" size={30} />
                </div>
              </div>
              <h2>{totalGroups}</h2>
              <Card.Text className="text-muted">Total Groups</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-2">
                <div className="rounded-circle bg-success bg-opacity-10 p-3">
                  <FaUserPlus className="text-success" size={30} />
                </div>
              </div>
              <h2>{totalMembers}</h2>
              <Card.Text className="text-muted">Total Members</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-2">
                <div className="rounded-circle bg-info bg-opacity-10 p-3">
                  <FaChartPie className="text-info" size={30} />
                </div>
              </div>
              <h2>{avgMembersPerGroup}</h2>
              <Card.Text className="text-muted">Avg Members/Group</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-center mb-2">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                  <FaUsers className="text-warning" size={30} />
                </div>
              </div>
              <h2>{largestGroupType ? (largestGroupType.charAt(0).toUpperCase() + largestGroupType.slice(1)) : 'N/A'}</h2>
              <Card.Text className="text-muted">Top Group Type</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Render group type distribution chart
  const renderGroupTypeChart = (groupsList) => {
    const chartData = prepareGroupTypeData(groupsList);
    
    if (chartData.length === 0) return null;

    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Group Type Distribution</h5>
        </Card.Header>
        <Card.Body>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = (message) => (
    <Card className="text-center shadow-sm py-5 mb-4">
      <Card.Body>
        <FaExclamationTriangle size={40} className="text-muted mb-3" />
        <h5>{message}</h5>
        <p className="text-muted">Groups help you collaborate and manage shared resources.</p>
        <Button variant="primary" onClick={() => history.push('/groups/create')}>
          <FaPlus className="me-2" /> Create Your First Group
        </Button>
      </Card.Body>
    </Card>
  );

  // Render data table
  const renderGroupTable = (groupsList, showEditButton = false) => (
    <div className="table-responsive">
      <Table striped hover className="border shadow-sm">
        <thead className="bg-light">
          <tr>
            <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
              NAME {sortField === 'name' && (
                sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />
              )}
            </th>
            <th>TYPE</th>
            <th onClick={() => toggleSort('members')} style={{ cursor: 'pointer' }}>
              MEMBERS {sortField === 'members' && (
                sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />
              )}
            </th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {groupsList.map((group) => (
            <tr key={group._id}>
              <td className="align-middle fw-bold">{group.name}</td>
              <td className="align-middle">{getGroupTypeBadge(group.groupType)}</td>
              <td className="align-middle">
                <Badge bg="secondary" pill>
                  <FaUsers className="me-1" /> {group.members?.length || 0}
                </Badge>
              </td>
              <td>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>View Group Details</Tooltip>}
                >
                  <LinkContainer to={`/groups/${group._id}`}>
                    <Button variant="outline-primary" className="btn-sm me-2">
                      <FaEye />
                    </Button>
                  </LinkContainer>
                </OverlayTrigger>
                
                {showEditButton && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Edit Group</Tooltip>}
                  >
                    <LinkContainer to={`/groups/${group._id}/edit`}>
                      <Button variant="outline-success" className="btn-sm">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                  </OverlayTrigger>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">
            <FaUsers className="me-2 text-primary" /> Group Management
          </h2>
          <p className="text-muted">Manage your groups and memberships</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => history.push('/groups/create')}>
            <FaPlus className="me-2" /> Create Group
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="chama">Chama</option>
                  <option value="investment">Investment</option>
                  <option value="savings">Savings</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="group-tabs"
        className="mb-4"
      >
        <Tab eventKey="myGroups" title="My Groups">
          {loadingMy ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your groups...</p>
            </div>
          ) : errorMy ? (
            <Alert variant="danger">
              <FaExclamationTriangle className="me-2" />
              {errorMy}
            </Alert>
          ) : filteredMyGroups.length > 0 ? (
            <>
              {renderStatsCards(filteredMyGroups)}
              <Row>
                <Col md={8}>
                  {renderGroupTable(filteredMyGroups, true)}
                </Col>
                <Col md={4}>
                  {renderGroupTypeChart(filteredMyGroups)}
                </Col>
              </Row>
            </>
          ) : (
            renderEmptyState("You don't have any groups yet")
          )}
        </Tab>
        
        <Tab eventKey="allGroups" title="All Groups">
          {loadingAll ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading all groups...</p>
            </div>
          ) : errorAll ? (
            <Alert variant="danger">
              <FaExclamationTriangle className="me-2" />
              {errorAll}
            </Alert>
          ) : filteredAllGroups.length > 0 ? (
            <>
              {renderGroupTable(filteredAllGroups)}
              <Alert variant="info" className="mt-3">
                <FaInfoCircle className="me-2" />
                Join a group by viewing its details and requesting membership.
              </Alert>
            </>
          ) : (
            renderEmptyState("No groups available")
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default GroupList;