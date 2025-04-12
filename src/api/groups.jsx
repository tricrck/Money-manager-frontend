import api from './axios';

export const createGroup = (groupData) => api.post('/group', groupData);
export const getGroups = () => api.get('/group');
export const getMyGroups = () => api.get('/group/my-groups');
export const getGroup = (groupId) => api.get(`/group/${groupId}`);
export const updateGroup = (groupId, groupData) => api.put(`/group/${groupId}`, groupData);
export const updateGroupAccounts = (groupId, accountsData) => api.put(`/group/${groupId}/accounts`, accountsData);
export const transferOwnership = (groupId, newOwnerData) => api.put(`/group/${groupId}/transfer-ownership`, newOwnerData);
export const addGroupMembers = (groupId, membersData) => api.post(`/group/${groupId}/members`, membersData);
export const updateGroupMember = (groupId, memberId, memberData) => api.put(`/group/${groupId}/members/${memberId}`, memberData);
export const removeGroupMember = (groupId, memberId) => api.delete(`/group/${groupId}/members/${memberId}`);
export const leaveGroup = (groupId) => api.post(`/group/${groupId}/leave`);