import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  UserPlus,
  Search,
  Mail,
  Phone,
  Calendar,
  Shield,
  Crown,
  Settings,
  Trash2,
  UserMinus,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Check,
  Users,
  UserCheck,
  UserX,
  Edit3,
  Send,
  Copy,
  Link,
  MessageSquare,
  Loader2,
  Plus,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  getGroupDetails,
  addGroupMembers,
  updateGroupMember,
  removeGroupMember,
  leaveGroup,
  inviteUser
} from '../../actions/groupActions';
import { listUsers } from '../../actions/userActions';

const GroupMembers = forwardRef(({
  group,
  isOpen,
  onClose,
  onMemberAdded,
  currentUser,
  isAdmin,
  isOwner
}, ref) => {
  const dispatch = useDispatch();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Form states
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberRole, setMemberRole] = useState('member');
  const [memberStatus, setMemberStatus] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [usernameSearch, setUsernameSearch] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [activeTab, setActiveTab] = useState('invite');
  const [loadingUserId, setLoadingUserId] = useState(null);

  // Redux selectors
  const userList = useSelector((state) => state.userList);
  const { users = [], loading: usersLoading } = userList || {};

  const groupAddMembers = useSelector((state) => state.groupAddMembers);
  const { loading: loadingAdd, error: errorAdd, success: successAdd } = groupAddMembers || {};

  const groupUpdateMember = useSelector((state) => state.groupUpdateMember);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = groupUpdateMember || {};

  const groupRemoveMember = useSelector((state) => state.groupRemoveMember);
  const { loading: loadingRemove, error: errorRemove, success: successRemove } = groupRemoveMember || {};

  const groupInviteUser = useSelector((state) => state.groupInviteUser);
  const { loading: loadingInvite, error: errorInvite, success: successInvite } = groupInviteUser || {};

  useEffect(() => {
    if (showAddModal || showInviteModal) {
      dispatch(listUsers());
    }
  }, [dispatch, showAddModal, showInviteModal]);

  // Reset form states when modals close
  useEffect(() => {
    if (!showAddModal && !showEditModal && !showRemoveDialog && !showLeaveDialog && !showInviteModal) {
      setSelectedUsers([]);
      setSelectedMember(null);
      setMemberRole('member');
      setMemberStatus('active');
      setSearchTerm('');
      setEmailSearch('');
      setUsernameSearch('');
      setInviteMessage('');
    }
  }, [showAddModal, showEditModal, showRemoveDialog, showLeaveDialog, showInviteModal]);

  // Handle successful actions
  useEffect(() => {
    if (successAdd) {
      setShowAddModal(false);
      setSelectedUsers([]);
      setEmailSearch('');
      setSearchTerm('');
      setLoadingUserId(null)
      if (onMemberAdded) onMemberAdded();
    }
  }, [successAdd, onMemberAdded]);

  useEffect(() => {
    if (successUpdate) {
      setShowEditModal(false);
      setSelectedMember(null);
      setMemberRole('member');
      setMemberStatus('active');
      if (onMemberAdded) onMemberAdded();
    }
  }, [successUpdate, onMemberAdded]);

  useEffect(() => {
    if (successRemove) {
      setShowRemoveDialog(false);
      setSelectedMember(null);
      if (onMemberAdded) onMemberAdded();
    }
  }, [successRemove, onMemberAdded]);

  useEffect(() => {
    if (successInvite) {
      setShowInviteModal(false);
      setUsernameSearch('');
      setInviteMessage('');
      setMemberRole('member');
      if (onMemberAdded) onMemberAdded();
    }
  }, [successInvite, onMemberAdded]);

  // Get available users (not already in group)
  const getAvailableUsers = () => {
    if (!users || !group) return [];
    
    const existingMemberIds = group.members?.map(member => member.user?._id || member.user).filter(Boolean) || [];
    return users.filter(user => user && user._id && !existingMemberIds.includes(user._id));
  };

  // Filter users based on search
  const getFilteredUsers = () => {
    const availableUsers = getAvailableUsers();
    if (!searchTerm && !emailSearch) return availableUsers;
    
    return availableUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(emailSearch.toLowerCase()))
    );
  };

  // Handle adding members directly
  const handleAddMember = (userId) => {
    setLoadingUserId(userId);
    const membersData = [{
      userId,
      role: 'member'
    }];
    
    dispatch(addGroupMembers(group._id, membersData));
  };

  // Handle bulk add members
  const handleBulkAddMembers = () => {
    if (selectedUsers.length === 0) return;
    
    const membersData = selectedUsers.map(userId => ({
      userId,
      role: memberRole
    }));
    
    dispatch(addGroupMembers(group._id, membersData));
  };

  // Handle invite user
  const handleInviteUser = () => {
    if (!usernameSearch.trim() && !emailSearch.trim()) return;

    const inviteData = {
      role: memberRole,
      message: inviteMessage.trim(),
    };

    if (usernameSearch.trim()) {
      inviteData.username = usernameSearch.trim();
    } else if (emailSearch.trim()) {
      inviteData.email = emailSearch.trim();
    }

    dispatch(inviteUser(group._id, inviteData));
  };

  // Handle updating member
  const handleUpdateMember = () => {
    if (!selectedMember) return;
    
    const userId = selectedMember.user?._id || selectedMember.user;
    if (!userId) return;
    
    dispatch(updateGroupMember(group._id, userId, {
      role: memberRole,
      status: memberStatus
    }));
  };

  // Handle removing member
  const handleRemoveMember = () => {
    if (!selectedMember) return;
    
    const userId = selectedMember.user?._id || selectedMember.user;
    if (!userId) return;
    
    dispatch(removeGroupMember(group._id, userId));
  };

  // Handle leave group
  const handleLeaveGroup = () => {
    dispatch(leaveGroup(group._id));
    setShowLeaveDialog(false);
    if (onClose) onClose();
  };

  // Get role configuration
  const getRoleConfig = (role) => {
    const roleConfig = {
      owner: { color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', icon: Crown, label: 'Owner' },
      admin: { color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', icon: Shield, label: 'Admin' },
      treasurer: { color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white', icon: Settings, label: 'Treasurer' },
      member: { color: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white', icon: Users, label: 'Member' }
    };
    return roleConfig[role] || roleConfig.member;
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
      inactive: { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: UserX },
      suspended: { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    return user.name || user.email || 'Unknown User';
  };

  const getUserInitials = (user) => {
    if (!user || !user.name) return 'UN';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useImperativeHandle(ref, () => ({
    openAddModal: () => setShowAddModal(true),
    openInviteModal: () => setShowInviteModal(true),
    openEditModal: (member) => {
      setSelectedMember(member);
      setMemberRole(member.role || 'member');
      setMemberStatus(member.status || 'active');
      setShowEditModal(true);
    },
    openRemoveDialog: (member) => {
      setSelectedMember(member);
      setShowRemoveDialog(true);
    },
    openLeaveDialog: () => setShowLeaveDialog(true)
  }), []);

  if (!group) return null;

  return (
    <>
      {/* Enhanced Add/Invite Members Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Add Members to {group.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add existing users or invite new members to join your group.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invite" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Invite New
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Existing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invite" className="space-y-4">
              {errorInvite && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errorInvite}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <div className="space-y-2">
                  <Label>Invite by Username or Email</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* OR Email Input */}
                    <Input
                      type="email"
                      placeholder="Enter email..."
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                    />
                  </div>

                <Select
                  value={usernameSearch}
                  onValueChange={(value) => setUsernameSearch(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableUsers().filter((user) => !!user?.username).map((user) => (
                      <SelectItem key={user._id} value={user.username || user.email}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{getUserDisplayName(user)}</div>
                            <div className="text-xs text-muted-foreground">{user.username || user.email}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    You can invite existing users by username or external users by email.
                  </p>
                </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={memberRole} onValueChange={setMemberRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      {(isOwner || isAdmin) && (
                        <>
                          <SelectItem value="treasurer">Treasurer</SelectItem>
                          {isOwner && <SelectItem value="admin">Admin</SelectItem>}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-message">Invitation Message (Optional)</Label>
                  <Textarea
                    id="invite-message"
                    placeholder="Add a personal message to your invitation..."
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleInviteUser} 
                  disabled={
                      loadingInvite || 
                      (!usernameSearch.trim() && !emailSearch.trim())
                    }
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {loadingInvite ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Invitation
                </Button>
            </TabsContent>
            <TabsContent value="add" className="space-y-4">
              {errorAdd && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errorAdd}</AlertDescription>
                </Alert>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Users List */}
              <ScrollArea className="h-64 w-full rounded-md border">
                <div className="p-2 space-y-1">
                  {getFilteredUsers().map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getUserDisplayName(user)}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddMember(user._id)}
                        disabled={loadingUserId === user._id}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {loadingUserId === user._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                  {getFilteredUsers().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Bulk Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Bulk Selection ({selectedUsers.length} selected)</Label>
                  <Select value={memberRole} onValueChange={setMemberRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      {(isOwner || isAdmin) && (
                        <>
                          <SelectItem value="treasurer">Treasurer</SelectItem>
                          {isOwner && <SelectItem value="admin">Admin</SelectItem>}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedUsers.length > 0 && (
                  <Button 
                    onClick={handleBulkAddMembers} 
                    disabled={loadingAdd}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {loadingAdd ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Edit Member Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Edit3 className="h-4 w-4 text-white" />
              </div>
              Edit Member
            </DialogTitle>
            <DialogDescription>
              Update member role and status for enhanced group management.
            </DialogDescription>
          </DialogHeader>

          {errorUpdate && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{errorUpdate}</AlertDescription>
            </Alert>
          )}

          {selectedMember && (
            <div className="space-y-4">
              {/* Enhanced Member Info Card */}
              <Card className="border-2 border-dashed border-muted">
                <CardContent className="flex items-center gap-3 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {getUserInitials(selectedMember.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{getUserDisplayName(selectedMember.user)}</div>
                    <div className="text-sm text-muted-foreground">{selectedMember.user?.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const roleConfig = getRoleConfig(selectedMember.role);
                        const statusConfig = getStatusConfig(selectedMember.status);
                        return (
                          <>
                            <Badge className={`${roleConfig.color} border-0 text-xs`}>
                              <roleConfig.icon className="w-3 h-3 mr-1" />
                              {roleConfig.label}
                            </Badge>
                            <Badge className={`${statusConfig.color} text-xs`}>
                              <statusConfig.icon className="w-3 h-3 mr-1" />
                              {selectedMember.status?.charAt(0).toUpperCase() + selectedMember.status?.slice(1)}
                            </Badge>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={memberRole} onValueChange={setMemberRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      {(isOwner || isAdmin) && (
                        <>
                          <SelectItem value="treasurer">Treasurer</SelectItem>
                          {isOwner && <SelectItem value="admin">Admin</SelectItem>}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={memberStatus} onValueChange={setMemberStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateMember} 
              disabled={loadingUpdate}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {loadingUpdate ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Update Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Remove Member Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <UserMinus className="h-4 w-4 text-white" />
              </div>
              Remove Member
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to remove <strong>{getUserDisplayName(selectedMember?.user)}</strong> from this group?
              <br />
              <br />
              This action will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Remove their access to group activities</li>
                <li>Remove them from all group conversations</li>
                <li>Cannot be undone</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              disabled={loadingRemove}
            >
              {loadingRemove ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhanced Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <UserMinus className="h-4 w-4 text-white" />
              </div>
              Leave Group
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to leave <strong>{group.name}</strong>?
              <br />
              <br />
              This means you will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Lose access to all group activities</li>
                <li>Need to be re-invited to rejoin</li>
                <li>Miss future group updates</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

GroupMembers.displayName = 'GroupMembers';

export default GroupMembers;