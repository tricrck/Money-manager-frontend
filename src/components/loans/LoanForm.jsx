import React, { useState, useEffect } from 'react';
import { 
  Form, Button, Container, Alert, Row, Col, Spinner, Card, 
  Badge, Modal, ProgressBar, Tabs, Tab, ListGroup, InputGroup, Table
} from 'react-bootstrap';
import { 
  FaMoneyBillAlt, FaCalendarAlt, FaPercentage, FaInfoCircle, 
  FaUserFriends, FaUsers, FaFileAlt, FaShieldAlt, FaCoins,
  FaSave, FaArrowLeft, FaCalculator, FaExclamationTriangle,
  FaCheck, FaTimes, FaTrash, FaPaperclip, FaEdit, FaPlus,
  FaCloudUploadAlt, FaArrowRight, FaClipboardCheck, FaUser,
  FaUsersCog, FaHandshake, FaSearchDollar
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { createLoan, updateLoan, getLoanDetails } from '../../actions/loanActions';
import { listUsers } from '../../actions/userActions';
import { listGroups } from '../../actions/groupActions';
import { useParams, useNavigate } from 'react-router-dom';

const LoanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    loanType: 'personal',
    principalAmount: 1000,
    repaymentPeriod: 6,
    interestRate: 10,
    interestType: 'simple',
    processingFee: 0,
    purpose: '',
    collateral: {
      description: '',
      value: 0,
      documents: [],
    },
    user: '',
    group: '',
    guarantors: [],
    noteText: '',
    disbursementDate: new Date().toISOString().split('T')[0]
  });

  // UI state
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  const [currentStep, setCurrentStep] = useState(1);

  // Redux state selectors
  const { loading: loadingDetails, error: errorDetails, loan } = useSelector((state) => state.loanDetails);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = useSelector((state) => state.loanCreate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector((state) => state.loanUpdate);
  const { loading: loadingUsers, users } = useSelector((state) => state.userList);
  const { loading: loadingGroups, groups } = useSelector((state) => state.groupList);
  const { userInfo } = useSelector((state) => state.userLogin);

  const isEditMode = Boolean(id);
  const formTitle = isEditMode ? 'Edit Loan Application' : 'New Loan Application';

  // Wizard steps
  const steps = [
    { title: 'Loan Details', icon: <FaFileAlt /> },
    { title: 'Collateral', icon: <FaShieldAlt /> },
    { title: 'Parties', icon: <FaUserFriends /> },
    { title: 'Review', icon: <FaClipboardCheck /> }
  ];

  // Load initial data
  useEffect(() => {
    dispatch(listUsers());
    dispatch(listGroups());

    if (isEditMode) {
      dispatch(getLoanDetails(id));
    }
  }, [dispatch, id, isEditMode]);

  // Set form values when loan details are loaded
  useEffect(() => {
    if (isEditMode && loan) {
      setFormData({
        loanType: loan.loanType || 'personal',
        principalAmount: loan.principalAmount || 1000,
        repaymentPeriod: loan.repaymentPeriod || 6,
        interestRate: loan.interestRate || 10,
        interestType: loan.interestType || 'simple',
        processingFee: loan.processingFee || 0,
        purpose: loan.purpose || '',
        collateral: loan.collateral || {
          description: '',
          value: 0,
          documents: [],
        },
        user: loan.user?._id || '',
        group: loan.group?._id || '',
        guarantors: loan.guarantors || [],
        noteText: '',
        disbursementDate: loan.disbursementDate ? loan.disbursementDate.split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setIsDirty(false);
    }
  }, [isEditMode, loan]);

  // Handle success actions
  useEffect(() => {
    if (successCreate) {
      navigate('/loans');
    }
    if (successUpdate) {
      setFormData(prev => ({ ...prev, noteText: '' }));
    }
  }, [successCreate, successUpdate, navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleNestedChange = (parent, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
    setIsDirty(true);
  };

  // Handle file uploads
  const handleFileUpload = (files) => {
    const newDocuments = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file
    }));
    
    setFormData(prev => ({
      ...prev,
      collateral: {
        ...prev.collateral,
        documents: [...prev.collateral.documents, ...newDocuments]
      }
    }));
    setIsDirty(true);
  };

  const removeDocument = (index) => {
    setFormData(prev => {
      const newDocuments = [...prev.collateral.documents];
      newDocuments.splice(index, 1);
      return {
        ...prev,
        collateral: {
          ...prev.collateral,
          documents: newDocuments
        }
      };
    });
    setIsDirty(true);
  };

  // Handle guarantors
  const addGuarantor = () => {
    setFormData(prev => ({
      ...prev,
      guarantors: [...prev.guarantors, { user: '', approved: false }]
    }));
    setIsDirty(true);
  };

  const updateGuarantor = (index, field, value) => {
    setFormData(prev => {
      const updatedGuarantors = [...prev.guarantors];
      updatedGuarantors[index] = { ...updatedGuarantors[index], [field]: value };
      return {
        ...prev,
        guarantors: updatedGuarantors
      };
    });
    setIsDirty(true);
  };

  const removeGuarantor = (index) => {
    setFormData(prev => {
      const updatedGuarantors = [...prev.guarantors];
      updatedGuarantors.splice(index, 1);
      return {
        ...prev,
        guarantors: updatedGuarantors
      };
    });
    setIsDirty(true);
  };

  // Step validation
  const validateStep = (step) => {
    const errors = {};
    
    switch(step) {
      case 1:
        if (!formData.principalAmount || formData.principalAmount < 100) {
          errors.principalAmount = 'Principal amount must be at least 100';
        }
        if (!formData.repaymentPeriod || formData.repaymentPeriod < 1) {
          errors.repaymentPeriod = 'Repayment period must be at least 1 month';
        }
        if (formData.interestRate < 0 || formData.interestRate > 100) {
          errors.interestRate = 'Interest rate must be between 0% and 100%';
        }
        break;
      case 2:
        if (!formData.collateral.description.trim()) {
          errors.collateralDescription = 'Collateral description is required';
        }
        if (formData.collateral.value < 0) {
          errors.collateralValue = 'Collateral value cannot be negative';
        }
        break;
      case 3:
        if (!formData.user) {
          errors.user = 'Please select a borrower';
        }
        if (formData.loanType === 'group' && !formData.group) {
          errors.group = 'Group is required for group loans';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Calculate loan repayment preview
  const calculateLoanPreview = () => {
    if (!validateStep(currentStep)) return;

    const principal = parseFloat(formData.principalAmount);
    const rate = parseFloat(formData.interestRate);
    const term = parseInt(formData.repaymentPeriod);
    const fee = parseFloat(formData.processingFee) || 0;
    
    let totalInterest = 0;
    let monthlyPayment = 0;
    let totalRepayable = 0;
    let schedule = [];
    
    if (formData.interestType === 'simple') {
      totalInterest = principal * (rate / 100) * (term / 12);
      totalRepayable = principal + totalInterest + fee;
      monthlyPayment = totalRepayable / term;
      
      for (let i = 1; i <= term; i++) {
        const dueDate = new Date(formData.disbursementDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        
        schedule.push({
          installmentNumber: i,
          dueDate,
          totalAmount: monthlyPayment,
          principalAmount: principal / term,
          interestAmount: totalInterest / term
        });
      }
    } else if (formData.interestType === 'reducing_balance') {
      const ratePerMonth = rate / 100 / 12;
      
      if (ratePerMonth > 0) {
        monthlyPayment = principal * (ratePerMonth * Math.pow(1 + ratePerMonth, term)) / 
                       (Math.pow(1 + ratePerMonth, term) - 1);
        
        let remainingPrincipal = principal;
        
        for (let i = 1; i <= term; i++) {
          const interestForMonth = remainingPrincipal * ratePerMonth;
          const principalForMonth = monthlyPayment - interestForMonth;
          remainingPrincipal -= principalForMonth;
          
          const dueDate = new Date(formData.disbursementDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          
          schedule.push({
            installmentNumber: i,
            dueDate,
            totalAmount: monthlyPayment,
            principalAmount: principalForMonth,
            interestAmount: interestForMonth
          });
          
          totalRepayable += monthlyPayment;
        }
        
        totalRepayable += fee;
        totalInterest = totalRepayable - principal - fee;
      } else {
        monthlyPayment = principal / term;
        totalRepayable = principal + fee;
        
        for (let i = 1; i <= term; i++) {
          const dueDate = new Date(formData.disbursementDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          
          schedule.push({
            installmentNumber: i,
            dueDate,
            totalAmount: monthlyPayment,
            principalAmount: monthlyPayment,
            interestAmount: 0
          });
        }
      }
    }
    
    setCalculationResults({
      principal,
      totalInterest,
      processingFee: fee,
      totalRepayable: totalRepayable,
      monthlyPayment,
      schedule
    });
    setShowCalculation(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const loanData = {
      ...formData,
      principalAmount: Number(formData.principalAmount),
      repaymentPeriod: Number(formData.repaymentPeriod),
      interestRate: Number(formData.interestRate),
      processingFee: Number(formData.processingFee),
      disbursementDate: formData.disbursementDate
    };

    const formDataToSend = new FormData();
    Object.keys(loanData).forEach(key => {
      if (key === 'collateral') {
        formDataToSend.append('collateral[description]', loanData.collateral.description);
        formDataToSend.append('collateral[value]', loanData.collateral.value);
        loanData.collateral.documents.forEach((doc, index) => {
          if (doc.file) {
            formDataToSend.append(`collateral[documents][${index}]`, doc.file);
          }
        });
      } else if (key === 'guarantors') {
        loanData.guarantors.forEach((guarantor, index) => {
          formDataToSend.append(`guarantors[${index}][user]`, guarantor.user);
          formDataToSend.append(`guarantors[${index}][approved]`, guarantor.approved);
        });
      } else if (key !== 'noteText') {
        formDataToSend.append(key, loanData[key]);
      }
    });

    if (formData.noteText) {
      formDataToSend.append('noteText', formData.noteText);
    }

    if (isEditMode) {
      dispatch(updateLoan({ id, formData: formDataToSend }));
    } else {
      dispatch(createLoan(formDataToSend));
    }
  };

  // Handle back button
  const handleBack = () => {
    if (isDirty) {
      setShowConfirmExit(true);
    } else {
      navigate('/loans');
    }
  };

  // Step components
  const Step1 = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0">
          <FaFileAlt className="me-2" />
          Loan Details
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="loanType" className="mb-3">
              <Form.Label>
                <FaMoneyBillAlt className="me-2" />
                Loan Type
              </Form.Label>
              <Form.Select
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                className="form-select-lg"
              >
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
                <option value="emergency">Emergency Loan</option>
                <option value="group">Group Loan</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="principalAmount" className="mb-3">
              <Form.Label>
                <FaCoins className="me-2" />
                Principal Amount
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>KES</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="principalAmount"
                  value={formData.principalAmount}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.principalAmount}
                  className="form-control-lg"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.principalAmount}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="purpose" className="mb-3">
              <Form.Label>
                <FaInfoCircle className="me-2" />
                Purpose
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="purpose"
                placeholder="Enter loan purpose"
                value={formData.purpose}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="interestRate" className="mb-3">
              <Form.Label>
                <FaPercentage className="me-2" />
                Interest Rate (%)
              </Form.Label>
              <Form.Control
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                isInvalid={!!validationErrors.interestRate}
                className="form-control-lg"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.interestRate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="repaymentPeriod" className="mb-3">
              <Form.Label>
                <FaCalendarAlt className="me-2" />
                Repayment Period (months)
              </Form.Label>
              <Form.Control
                type="number"
                name="repaymentPeriod"
                value={formData.repaymentPeriod}
                onChange={handleChange}
                isInvalid={!!validationErrors.repaymentPeriod}
                className="form-control-lg"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.repaymentPeriod}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="interestType" className="mb-3">
              <Form.Label>
                <FaInfoCircle className="me-2" />
                Interest Type
              </Form.Label>
              <Form.Select
                name="interestType"
                value={formData.interestType}
                onChange={handleChange}
                className="form-select-lg"
              >
                <option value="simple">Simple Interest</option>
                <option value="reducing_balance">Reducing Balance</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="disbursementDate" className="mb-3">
              <Form.Label>
                <FaCalendarAlt className="me-2" />
                Disbursement Date
              </Form.Label>
              <Form.Control
                type="date"
                name="disbursementDate"
                value={formData.disbursementDate}
                onChange={handleChange}
                className="form-control-lg"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const Step2 = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0">
          <FaShieldAlt className="me-2" />
          Collateral Information
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="collateralDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter collateral description"
                value={formData.collateral.description}
                onChange={(e) => handleNestedChange('collateral', e)}
                isInvalid={!!validationErrors.collateralDescription}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.collateralDescription}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="collateralValue" className="mb-3">
              <Form.Label>Value</Form.Label>
              <InputGroup>
                <InputGroup.Text>KES</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="value"
                  placeholder="Enter collateral value"
                  value={formData.collateral.value}
                  onChange={(e) => handleNestedChange('collateral', e)}
                  isInvalid={!!validationErrors.collateralValue}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.collateralValue}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaPaperclip className="me-2" />
            Collateral Documents
          </Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <Form.Text className="text-muted">
            Upload supporting documents for the collateral
          </Form.Text>
        </Form.Group>

        {formData.collateral.documents.length > 0 && (
          <ListGroup className="mb-3">
            {formData.collateral.documents.map((doc, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <div>
                  <FaFileAlt className="me-2" />
                  {doc.name || `Document ${index + 1}`}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );

  const Step3 = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0">
          <FaUserFriends className="me-2" />
          Related Parties
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="user" className="mb-3">
              <Form.Label>
                <FaUser className="me-2" />
                Borrower
              </Form.Label>
              <Form.Select
                name="user"
                value={formData.user}
                onChange={handleChange}
                isInvalid={!!validationErrors.user}
                className="form-select-lg"
              >
                <option value="">Select Borrower</option>
                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.user}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="group" className="mb-3">
              <Form.Label>
                <FaUsersCog className="me-2" />
                Group (for group loans)
              </Form.Label>
              <Form.Select
                name="group"
                value={formData.group}
                onChange={handleChange}
                isInvalid={!!validationErrors.group}
                disabled={formData.loanType !== 'group'}
                className="form-select-lg"
              >
                <option value="">Select Group</option>
                {groups?.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.group}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>
              <FaHandshake className="me-2" />
              Guarantors
            </h5>
            <Button variant="outline-primary" size="sm" onClick={addGuarantor}>
              <FaPlus className="me-1" /> Add Guarantor
            </Button>
          </div>

          {formData.guarantors.length === 0 ? (
            <Alert variant="info">No guarantors added</Alert>
          ) : (
            formData.guarantors.map((guarantor, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">Guarantor #{index + 1}</h6>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeGuarantor(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Label>User</Form.Label>
                    <Form.Select
                      value={guarantor.user}
                      onChange={(e) => updateGuarantor(index, 'user', e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="">Select User</option>
                      {users?.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Approved"
                    checked={guarantor.approved}
                    onChange={(e) => updateGuarantor(index, 'approved', e.target.checked)}
                  />
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );

  const ReviewStep = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0">
          <FaClipboardCheck className="me-2" />
          Review Application
        </h5>
      </Card.Header>
      <Card.Body>
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">
              <FaFileAlt className="me-2" />
              Loan Details
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Loan Type:</strong> {formData.loanType}</p>
                <p><strong>Principal Amount:</strong> {formatCurrency(formData.principalAmount)}</p>
                <p><strong>Repayment Period:</strong> {formData.repaymentPeriod} months</p>
              </Col>
              <Col md={6}>
                <p><strong>Interest Rate:</strong> {formData.interestRate}%</p>
                <p><strong>Interest Type:</strong> {formData.interestType === 'simple' ? 'Simple Interest' : 'Reducing Balance'}</p>
                <p><strong>Disbursement Date:</strong> {formatDate(formData.disbursementDate)}</p>
              </Col>
            </Row>
            {formData.purpose && (
              <div className="mt-3">
                <p><strong>Purpose:</strong></p>
                <p>{formData.purpose}</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">
              <FaShieldAlt className="me-2" />
              Collateral
            </h6>
          </Card.Header>
          <Card.Body>
            {formData.collateral.description ? (
              <>
                <p><strong>Description:</strong> {formData.collateral.description}</p>
                <p><strong>Value:</strong> {formatCurrency(formData.collateral.value)}</p>
                {formData.collateral.documents.length > 0 && (
                  <div className="mt-3">
                    <p><strong>Documents:</strong></p>
                    <ListGroup>
                      {formData.collateral.documents.map((doc, index) => (
                        <ListGroup.Item key={index}>
                          <FaFileAlt className="me-2" />
                          {doc.name || `Document ${index + 1}`}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </>
            ) : (
              <p>No collateral information provided</p>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">
              <FaUserFriends className="me-2" />
              Related Parties
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Borrower:</strong> {users.find(u => u._id === formData.user)?.name || 'Not selected'}</p>
              </Col>
              {formData.loanType === 'group' && (
                <Col md={6}>
                  <p><strong>Group:</strong> {groups.find(g => g._id === formData.group)?.name || 'Not selected'}</p>
                </Col>
              )}
            </Row>

            {formData.guarantors.length > 0 && (
              <div className="mt-3">
                <p><strong>Guarantors:</strong></p>
                <ListGroup>
                  {formData.guarantors.map((guarantor, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between">
                        <span>
                          {users.find(u => u._id === guarantor.user)?.name || 'Not selected'}
                          {guarantor.approved && (
                            <Badge bg="success" className="ms-2">
                              <FaCheck className="me-1" /> Approved
                            </Badge>
                          )}
                        </span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </Card.Body>
        </Card>

        {isEditMode && (
          <Form.Group controlId="noteText" className="mb-3">
            <Form.Label>Update Note (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="noteText"
              placeholder="Add a note about this update"
              value={formData.noteText}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              This note will be added to the loan history
            </Form.Text>
          </Form.Group>
        )}

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-primary" onClick={calculateLoanPreview}>
            <FaCalculator className="me-1" /> Calculate Preview
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  if (loadingDetails && isEditMode) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button variant="outline-secondary" onClick={handleBack} className="me-3">
                <FaArrowLeft className="me-1" /> Back
              </Button>
              <h2 className="d-inline-block mb-0">
                {formTitle}
                {isEditMode && loan?.status && (
                  <Badge 
                    bg={
                      loan.status === 'active' ? 'success' : 
                      loan.status === 'pending' ? 'warning' : 
                      loan.status === 'completed' ? 'primary' : 
                      loan.status === 'defaulted' ? 'danger' : 'secondary'
                    } 
                    className="ms-2"
                  >
                    {loan.status}
                  </Badge>
                )}
              </h2>
            </div>
          </div>
        </Col>
      </Row>

      {(errorCreate || errorUpdate || errorDetails) && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errorCreate || errorUpdate || errorDetails}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="details" title={<><FaFileAlt className="me-1" /> Application</>}>
          <div className="wizard-progress mb-5">
            <div className="d-flex justify-content-between position-relative">
              <ProgressBar 
                now={(currentStep / steps.length) * 100} 
                style={{ 
                  height: '3px', 
                  position: 'absolute', 
                  top: '15px', 
                  left: 0, 
                  right: 0,
                  zIndex: 0 
                }} 
              />
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`step-indicator text-center ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
                  style={{ zIndex: 1 }}
                >
                  <div className="step-icon mx-auto mb-2">
                    {currentStep > index + 1 ? <FaCheck /> : step.icon}
                  </div>
                  <div className="step-label">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <ReviewStep />}

          <div className="d-flex justify-content-between mt-4">
            {currentStep > 1 ? (
              <Button variant="outline-secondary" onClick={handlePrevStep}>
                <FaArrowLeft className="me-1" /> Back
              </Button>
            ) : (
              <div></div>
            )}
            {currentStep < steps.length ? (
              <Button variant="primary" onClick={handleNextStep}>
                Next <FaArrowRight className="ms-1" />
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={submitHandler}
                disabled={loadingCreate || loadingUpdate}
              >
                {loadingCreate || loadingUpdate ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <>
                    <FaSave className="me-1" /> {isEditMode ? 'Update Loan' : 'Submit Application'}
                  </>
                )}
              </Button>
            )}
          </div>
        </Tab>

        {isEditMode && loan && (
          <Tab eventKey="schedule" title={<><FaCalendarAlt className="me-1" /> Schedule</>}>
            <Card className="mb-4">
              <Card.Body>
                {loan.repaymentSchedule?.length > 0 ? (
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Due Date</th>
                          <th>Principal</th>
                          <th>Interest</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loan.repaymentSchedule.map((installment, index) => (
                          <tr key={index}>
                            <td>{installment.installmentNumber}</td>
                            <td>{formatDate(installment.dueDate)}</td>
                            <td>{formatCurrency(installment.principalAmount)}</td>
                            <td>{formatCurrency(installment.interestAmount)}</td>
                            <td>{formatCurrency(installment.totalAmount)}</td>
                            <td>
                              {installment.paid ? (
                                <Badge bg="success" className="d-flex align-items-center">
                                  <FaCheck className="me-1" /> Paid
                                </Badge>
                              ) : (
                                <Badge bg="secondary" className="d-flex align-items-center">
                                  <FaTimes className="me-1" /> Pending
                                </Badge>
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
              </Card.Body>
            </Card>
          </Tab>
        )}
      </Tabs>

      {/* Calculation Preview Modal */}
      <Modal show={showCalculation} onHide={() => setShowCalculation(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalculator className="me-2" />
            Loan Calculation Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {calculationResults ? (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Principal Amount:</strong> {formatCurrency(calculationResults.principal)}</p>
                      <p><strong>Total Interest:</strong> {formatCurrency(calculationResults.totalInterest)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Processing Fee:</strong> {formatCurrency(calculationResults.processingFee)}</p>
                      <p><strong>Total Repayable:</strong> {formatCurrency(calculationResults.totalRepayable)}</p>
                    </Col>
                  </Row>
                  <p className="mb-0"><strong>Monthly Payment:</strong> {formatCurrency(calculationResults.monthlyPayment)}</p>
                </Card.Body>
              </Card>

              <h5 className="mb-3">Repayment Schedule</h5>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Due Date</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResults.schedule.map((installment, index) => (
                      <tr key={index}>
                        <td>{installment.installmentNumber}</td>
                        <td>{formatDate(installment.dueDate)}</td>
                        <td>{formatCurrency(installment.principalAmount)}</td>
                        <td>{formatCurrency(installment.interestAmount)}</td>
                        <td>{formatCurrency(installment.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          ) : (
            <Alert variant="info">No calculation results available</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCalculation(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Exit Modal */}
      <Modal show={showConfirmExit} onHide={() => setShowConfirmExit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. Are you sure you want to leave?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmExit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate('/loans')}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .wizard-progress {
          position: relative;
          margin: 2rem 0 3rem;
        }
        
        .step-indicator {
          text-align: center;
          position: relative;
          z-index: 1;
          flex: 1;
          max-width: 25%;
        }
        
        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          transition: all 0.3s ease;
          color: #6c757d;
          font-size: 1rem;
        }
        
        .step-indicator.active .step-icon {
          background: #0d6efd;
          color: white;
          transform: scale(1.1);
        }
        
        .step-indicator.completed .step-icon {
          background: #198754;
          color: white;
        }
        
        .step-label {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .step-indicator.active .step-label {
          color: #0d6efd;
          font-weight: 600;
        }
      `}</style>
    </Container>
  );
};

export default LoanForm;