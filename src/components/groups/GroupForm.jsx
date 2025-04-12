import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ProgressBar, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, updateGroup, getGroupDetails } from '../../actions/groupActions';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaMoneyBillWave, FaHandHoldingUsd, FaCalendarAlt,
  FaArrowLeft, FaArrowRight, FaCheck, FaSave, FaTimesCircle,
  FaCog, FaInfoCircle, FaClipboardList, FaPercentage
} from 'react-icons/fa';

const GroupForm = () => {
  const { id } = useParams();
  const groupId = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [groupType, setGroupType] = useState('chama');
  const [description, setDescription] = useState('');
  const [settings, setSettings] = useState({
    contributionSchedule: {
      frequency: 'monthly',
      amount: 0,
      dueDay: 1,
    },
    loanSettings: {
      maxLoanMultiplier: 3,
      interestRate: 10,
      maxRepaymentPeriod: 12,
      latePaymentFee: 5,
      processingFee: 1,
      requiresGuarantors: true,
      guarantorsRequired: 2,
    },
    meetingSchedule: {
      frequency: 'monthly',
      dayOfMonth: 15,
      time: '18:00',
    },
  });

  // Form validation state
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  // Redux state
  const groupDetails = useSelector((state) => state.groupDetails);
  const { loading: loadingDetails, error: errorDetails, group } = groupDetails;

  const groupCreate = useSelector((state) => state.groupCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = groupCreate;

  const groupUpdate = useSelector((state) => state.groupUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = groupUpdate;

  // Load existing group data if editing
  useEffect(() => {
    if (successCreate || successUpdate) {
      navigate('/groups');
    }

    if (groupId) {
      if (!group || group._id !== groupId) {
        dispatch(getGroupDetails(groupId));
      } else {
        setName(group.name);
        setGroupType(group.groupType);
        setDescription(group.description);
        setSettings(group.settings || settings);
      }
    }
  }, [dispatch, groupId, group, successCreate, successUpdate, navigate]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const groupData = {
      name,
      groupType,
      description,
      settings,
    };

    if (groupId) {
      dispatch(updateGroup({ _id: groupId, ...groupData }));
    } else {
      dispatch(createGroup(groupData));
    }
  };

  // Input change handlers
  const handleContributionChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      contributionSchedule: {
        ...settings.contributionSchedule,
        [name]: name === 'amount' || name === 'dueDay' ? Number(value) : value,
      },
    });
  };

  const handleLoanSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      loanSettings: {
        ...settings.loanSettings,
        [name]: type === 'checkbox' ? checked : Number(value),
      },
    });
  };

  const handleMeetingScheduleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      meetingSchedule: {
        ...settings.meetingSchedule,
        [name]: name === 'dayOfMonth' ? Number(value) : value,
      },
    });
  };

  // Progress navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Step validation
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    if (step === 1) {
      if (!name.trim()) {
        newErrors.name = 'Group name is required';
        isValid = false;
      }
    } 
    else if (step === 2) {
      if (settings.contributionSchedule.amount <= 0) {
        newErrors.amount = 'Contribution amount must be greater than 0';
        isValid = false;
      }
    }
    else if (step === 3) {
      if (settings.loanSettings.interestRate < 0) {
        newErrors.interestRate = 'Interest rate cannot be negative';
        isValid = false;
      }
      if (settings.loanSettings.maxLoanMultiplier <= 0) {
        newErrors.maxLoanMultiplier = 'Loan multiplier must be greater than 0';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Progress calculation
  const calculateProgress = () => {
    return ((currentStep - 1) / 4) * 100;
  };

  // Render step titles
  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return (
          <h4 className="mb-4 d-flex align-items-center">
            <FaUsers className="me-2 text-primary" /> Basic Group Information
          </h4>
        );
      case 2:
        return (
          <h4 className="mb-4 d-flex align-items-center">
            <FaMoneyBillWave className="me-2 text-primary" /> Contribution Schedule
          </h4>
        );
      case 3:
        return (
          <h4 className="mb-4 d-flex align-items-center">
            <FaHandHoldingUsd className="me-2 text-primary" /> Loan Settings
          </h4>
        );
      case 4:
        return (
          <h4 className="mb-4 d-flex align-items-center">
            <FaCalendarAlt className="me-2 text-primary" /> Meeting Schedule
          </h4>
        );
      case 5:
        return (
          <h4 className="mb-4 d-flex align-items-center">
            <FaClipboardList className="me-2 text-primary" /> Review & Submit
          </h4>
        );
      default:
        return null;
    }
  };

  // Step 1: Basic Information
  const renderBasicInfoStep = () => {
    return (
      <>
        <Form.Group controlId="name" className="mb-4">
          <Form.Label className="fw-bold">Group Name <span className="text-danger">*</span></Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUsers />
            </span>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group controlId="groupType" className="mb-4">
          <Form.Label className="fw-bold">Group Type <span className="text-danger">*</span></Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCog />
            </span>
            <Form.Select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              required
            >
              <option value="chama">Chama</option>
              <option value="sacco">Sacco</option>
              <option value="table_banking">Table Banking</option>
              <option value="investment_club">Investment Club</option>
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group controlId="description" className="mb-4">
          <Form.Label className="fw-bold">Description</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaInfoCircle />
            </span>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter a description of your group's purpose and goals"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Form.Group>
      </>
    );
  };

  // Step 2: Contribution Schedule
  const renderContributionStep = () => {
    return (
      <>
        <Card className="mb-4 border-light shadow-sm">
          <Card.Body>
            <Card.Title className="d-flex align-items-center mb-3">
              <FaMoneyBillWave className="me-2 text-success" /> Contribution Details
            </Card.Title>
            
            <Form.Group controlId="frequency" className="mb-3">
              <Form.Label className="fw-bold">Frequency <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="frequency"
                value={settings.contributionSchedule.frequency}
                onChange={handleContributionChange}
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="amount" className="mb-3">
              <Form.Label className="fw-bold">Amount <span className="text-danger">*</span></Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter contribution amount"
                  value={settings.contributionSchedule.amount}
                  onChange={handleContributionChange}
                  required
                  isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group controlId="dueDay">
              <Form.Label className="fw-bold">Due Day <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="dueDay"
                placeholder="Enter due day (1-31)"
                min="1"
                max="31"
                value={settings.contributionSchedule.dueDay}
                onChange={handleContributionChange}
                required
              />
              <Form.Text className="text-muted">
                For monthly contributions, specify which day of the month payments are due.
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
      </>
    );
  };

  // Step 3: Loan Settings
  const renderLoanSettingsStep = () => {
    return (
      <>
        <Card className="mb-4 border-light shadow-sm">
          <Card.Body>
            <Card.Title className="d-flex align-items-center mb-3">
              <FaHandHoldingUsd className="me-2 text-warning" /> Loan Parameters
            </Card.Title>
            
            <Row>
              <Col md={6}>
                <Form.Group controlId="maxLoanMultiplier" className="mb-3">
                  <Form.Label className="fw-bold">Max Loan Multiplier <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      name="maxLoanMultiplier"
                      placeholder="Enter max loan multiplier"
                      value={settings.loanSettings.maxLoanMultiplier}
                      onChange={handleLoanSettingsChange}
                      required
                      isInvalid={!!errors.maxLoanMultiplier}
                    />
                    <span className="input-group-text">x savings</span>
                    <Form.Control.Feedback type="invalid">
                      {errors.maxLoanMultiplier}
                    </Form.Control.Feedback>
                  </div>
                  <Form.Text className="text-muted">
                    How many times a member's savings they can borrow
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="interestRate" className="mb-3">
                  <Form.Label className="fw-bold">Interest Rate <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      name="interestRate"
                      placeholder="Enter interest rate"
                      value={settings.loanSettings.interestRate}
                      onChange={handleLoanSettingsChange}
                      required
                      isInvalid={!!errors.interestRate}
                    />
                    <span className="input-group-text"><FaPercentage /></span>
                    <Form.Control.Feedback type="invalid">
                      {errors.interestRate}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group controlId="maxRepaymentPeriod" className="mb-3">
                  <Form.Label className="fw-bold">Max Repayment Period <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      name="maxRepaymentPeriod"
                      placeholder="Enter max repayment period"
                      value={settings.loanSettings.maxRepaymentPeriod}
                      onChange={handleLoanSettingsChange}
                      required
                    />
                    <span className="input-group-text">months</span>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="latePaymentFee" className="mb-3">
                  <Form.Label className="fw-bold">Late Payment Fee <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      name="latePaymentFee"
                      placeholder="Enter late payment fee"
                      value={settings.loanSettings.latePaymentFee}
                      onChange={handleLoanSettingsChange}
                      required
                    />
                    <span className="input-group-text"><FaPercentage /></span>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group controlId="processingFee" className="mb-3">
                  <Form.Label className="fw-bold">Processing Fee <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      name="processingFee"
                      placeholder="Enter processing fee"
                      value={settings.loanSettings.processingFee}
                      onChange={handleLoanSettingsChange}
                      required
                    />
                    <span className="input-group-text"><FaPercentage /></span>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group controlId="requiresGuarantors" className="mb-3">
              <Form.Check
                type="switch"
                label="Requires Guarantors"
                name="requiresGuarantors"
                checked={settings.loanSettings.requiresGuarantors}
                onChange={handleLoanSettingsChange}
                className="fw-bold"
              />
            </Form.Group>
            
            {settings.loanSettings.requiresGuarantors && (
              <Form.Group controlId="guarantorsRequired" className="mb-3">
                <Form.Label className="fw-bold">Number of Guarantors Required</Form.Label>
                <Form.Control
                  type="number"
                  name="guarantorsRequired"
                  placeholder="Enter number of guarantors"
                  value={settings.loanSettings.guarantorsRequired}
                  onChange={handleLoanSettingsChange}
                  required
                />
              </Form.Group>
            )}
          </Card.Body>
        </Card>
      </>
    );
  };

  // Step 4: Meeting Schedule
  const renderMeetingScheduleStep = () => {
    return (
      <>
        <Card className="mb-4 border-light shadow-sm">
          <Card.Body>
            <Card.Title className="d-flex align-items-center mb-3">
              <FaCalendarAlt className="me-2 text-info" /> Meeting Schedule
            </Card.Title>
            
            <Form.Group controlId="meetingFrequency" className="mb-3">
              <Form.Label className="fw-bold">Meeting Frequency</Form.Label>
              <Form.Select
                name="frequency"
                value={settings.meetingSchedule.frequency}
                onChange={handleMeetingScheduleChange}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="dayOfMonth" className="mb-3">
                  <Form.Label className="fw-bold">Day of Month</Form.Label>
                  <Form.Control
                    type="number"
                    name="dayOfMonth"
                    placeholder="Enter day of month (1-31)"
                    min="1"
                    max="31"
                    value={settings.meetingSchedule.dayOfMonth}
                    onChange={handleMeetingScheduleChange}
                  />
                  <Form.Text className="text-muted">
                    For monthly meetings, which day of the month?
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="time" className="mb-3">
                  <Form.Label className="fw-bold">Meeting Time</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaCalendarAlt />
                    </span>
                    <Form.Control
                      type="time"
                      name="time"
                      value={settings.meetingSchedule.time}
                      onChange={handleMeetingScheduleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  };

  // Step 5: Review & Submit
  const renderReviewStep = () => {
    return (
      <>
        <Alert variant="info" className="d-flex align-items-center mb-4">
          <FaInfoCircle className="me-2" /> Please review all information before submitting
        </Alert>
        
        <Card className="mb-4 border-light shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0 d-flex align-items-center">
              <FaUsers className="me-2 text-primary" /> Basic Information
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="fw-bold">Group Name:</Col>
              <Col md={8}>{name}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={4} className="fw-bold">Group Type:</Col>
              <Col md={8}>{groupType.replace('_', ' ').charAt(0).toUpperCase() + groupType.replace('_', ' ').slice(1)}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={4} className="fw-bold">Description:</Col>
              <Col md={8}>{description || 'N/A'}</Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4 border-light shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0 d-flex align-items-center">
              <FaMoneyBillWave className="me-2 text-success" /> Contribution Schedule
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="fw-bold">Frequency:</Col>
              <Col md={8}>{settings.contributionSchedule.frequency.charAt(0).toUpperCase() + settings.contributionSchedule.frequency.slice(1)}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={4} className="fw-bold">Amount:</Col>
              <Col md={8}>${settings.contributionSchedule.amount}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={4} className="fw-bold">Due Day:</Col>
              <Col md={8}>{settings.contributionSchedule.dueDay}</Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4 border-light shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0 d-flex align-items-center">
              <FaHandHoldingUsd className="me-2 text-warning" /> Loan Settings
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Max Loan Multiplier:</strong> {settings.loanSettings.maxLoanMultiplier}x</p>
                <p><strong>Interest Rate:</strong> {settings.loanSettings.interestRate}%</p>
                <p><strong>Max Repayment Period:</strong> {settings.loanSettings.maxRepaymentPeriod} months</p>
              </Col>
              <Col md={6}>
                <p><strong>Late Payment Fee:</strong> {settings.loanSettings.latePaymentFee}%</p>
                <p><strong>Processing Fee:</strong> {settings.loanSettings.processingFee}%</p>
                <p><strong>Requires Guarantors:</strong> {settings.loanSettings.requiresGuarantors ? 'Yes' : 'No'}</p>
                {settings.loanSettings.requiresGuarantors && (
                  <p><strong>Guarantors Required:</strong> {settings.loanSettings.guarantorsRequired}</p>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4 border-light shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0 d-flex align-items-center">
              <FaCalendarAlt className="me-2 text-info" /> Meeting Schedule
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="fw-bold">Frequency:</Col>
              <Col md={8}>{settings.meetingSchedule.frequency.charAt(0).toUpperCase() + settings.meetingSchedule.frequency.slice(1)}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={4} className="fw-bold">Day of Month:</Col>
              <Col md={8}>{settings.meetingSchedule.dayOfMonth}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={4} className="fw-bold">Time:</Col>
              <Col md={8}>{settings.meetingSchedule.time}</Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  };

  // Form navigation buttons
  const renderNavButtons = () => {
    return (
      <div className="d-flex justify-content-between mt-4">
        {currentStep > 1 && (
          <Button 
            variant="outline-secondary" 
            onClick={prevStep}
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Previous
          </Button>
        )}
        
        {currentStep < 5 ? (
          <Button 
            variant="primary" 
            onClick={nextStep}
            className="ms-auto d-flex align-items-center"
          >
            Next <FaArrowRight className="ms-2" />
          </Button>
        ) : (
          <Button 
            variant="success" 
            onClick={handleSubmit}
            disabled={loadingCreate || loadingUpdate}
            className="ms-auto d-flex align-items-center"
          >
            {groupId ? (
              loadingUpdate ? (
                <>Updating...</>
              ) : (
                <>Update Group <FaSave className="ms-2" /></>
              )
            ) : (
              loadingCreate ? (
                <>Creating...</>
              ) : (
                <>Create Group <FaCheck className="ms-2" /></>
              )
            )}
          </Button>
        )}
      </div>
    );
  };

  // Step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-4">
        <ProgressBar now={calculateProgress()} className="mb-3" variant="success" />
        <div className="d-flex justify-content-between">
          <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-icon">
              <FaUsers />
            </span>
            <span className="d-none d-md-inline">Basic Info</span>
          </div>
          <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-icon">
              <FaMoneyBillWave />
            </span>
            <span className="d-none d-md-inline">Contributions</span>
          </div>
          <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-icon">
              <FaHandHoldingUsd />
            </span>
            <span className="d-none d-md-inline">Loans</span>
          </div>
          <div className={`step-indicator ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-icon">
              <FaCalendarAlt />
            </span>
            <span className="d-none d-md-inline">Meetings</span>
          </div>
          <div className={`step-indicator ${currentStep >= 5 ? 'active' : ''}`}>
            <span className="step-icon">
              <FaCheck />
            </span>
            <span className="d-none d-md-inline">Review</span>
          </div>
        </div>
      </div>
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderContributionStep();
      case 3:
        return renderLoanSettingsStep();
      case 4:
        return renderMeetingScheduleStep();
      case 5:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-primary text-white py-3">
          <h2 className="mb-0">
            {groupId ? 'Edit Group' : 'Create New Group'}
          </h2>
        </Card.Header>
        <Card.Body className="p-md-5 p-3">
          {(errorCreate || errorUpdate || errorDetails) && (
            <Alert variant="danger" className="d-flex align-items-center">
              <FaTimesCircle className="me-2" /> 
              {errorCreate || errorUpdate || errorDetails}
            </Alert>
          )}
          
          {renderStepIndicator()}
          {renderStepTitle()}
          
          <Form noValidate validated={validated}>
            {renderCurrentStep()}
            {renderNavButtons()}
          </Form>
        </Card.Body>
      </Card>

      <style jsx>{`
        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.9rem;
          color: #adb5bd;
          position: relative;
          flex: 1;
          text-align: center;
        }
        
        .step-indicator.active {
          color: #198754;
          font-weight: 600;
        }
        
        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f8f9fa;
          border: 2px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        
        .step-indicator.active .step-icon {
          background-color: #e7f5ef;
          border: 2px solid #198754;
        }
      `}</style>
    </Container>
  );
};

export default GroupForm;