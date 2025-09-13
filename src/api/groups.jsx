import api from './axios';

// Group CRUD
export const createGroup = (groupData) => api.post('/group', groupData);
export const getGroups = () => api.get('/group');
export const getMyGroups = () => api.get('/group/my-groups');
export const getUserGroups = (userId) => api.get(`/group/my-groups?userId=${userId}`);
export const getPublicGroups = () => api.get('/group/public');
export const getMyInvitations = () => api.get('/group/my-invitations');
export const getMyJoinRequests = () => api.get('/group/my-join-requests');
export const getGroup = (groupId) => api.get(`/group/${groupId}`);
export const updateGroup = (groupId, groupData) => api.put(`/group/${groupId}`, groupData);
export const deleteGroup = (groupId) => api.delete(`/group/${groupId}`);

// Group Ownership & Accounts
export const transferOwnership = (groupId, newOwnerData) =>
  api.put(`/group/${groupId}/transfer-ownership`, newOwnerData);
export const updateGroupAccounts = (groupId, accountsData) =>
  api.put(`/group/${groupId}/accounts`, accountsData);

// Members
export const addGroupMembers = (groupId, membersData) =>
  api.post(`/group/${groupId}/members`, membersData);
export const updateGroupMember = (groupId, memberId, memberData) =>
  api.put(`/group/${groupId}/members/${memberId}`, memberData);
export const removeGroupMember = (groupId, memberId) =>
  api.delete(`/group/${groupId}/members/${memberId}`);
export const leaveGroup = (groupId) => api.post(`/group/${groupId}/leave`);

// Invitations
export const inviteUser = (groupId, inviteData) =>
  api.post(`/group/${groupId}/invite`, inviteData);
export const respondToInvitation = (groupId, invitationId, responseData) =>
  api.post(`/group/${groupId}/invitations/${invitationId}/respond`, responseData);

// Join Requests
export const requestToJoin = (groupId, requestData) =>
  api.post(`/group/${groupId}/join-request`, requestData);
export const reviewJoinRequest = (groupId, userId, decisionData) =>
  api.post(`/group/${groupId}/join-requests/${userId}/review`, decisionData);
export const getJoinRequests = (groupId) =>
  api.get(`/group/${groupId}/join-requests`);

// Contributions
export const contributeFromWallet = (groupId, contributionData) =>
  api.post(`/group/${groupId}/contributions/wallet`, contributionData);
export const recordCashContribution = (groupId, cashData) =>
  api.post(`/group/${groupId}/contributions/cash`, cashData);
export const recordMobileMoneyContribution = (groupId, mobileData) =>
  api.post(`/group/${groupId}/contributions/mobile`, mobileData);
export const getMemberContributions = (groupId, memberId) =>
  api.get(`/group/${groupId}/contributions/member/${memberId}`);
export const getGroupContributions = (groupId) =>
  api.get(`/group/${groupId}/contributions`);

// Wallet & Payments
export const fundWallet = (groupId, fundData) =>
  api.post(`/group/${groupId}/fund-wallet`, fundData);
export const payMember = (groupId, paymentData) =>
  api.post(`/group/${groupId}/pay-member`, paymentData);

export const acceptExternalInvitation = (token, userData) =>
  api.post(`/group/accept-external-invitation/${token}`, userData);

export const getInvitationDetails = (token) =>
  api.get(`/group/invitation-details/${token}`);

export const resendInvitation = (groupId, invitationId) =>
  api.post(`/group/${groupId}/invitations/${invitationId}/resend`);

export const cancelInvitation = (groupId, invitationId) =>
  api.delete(`/group/${groupId}/invitations/${invitationId}`);

