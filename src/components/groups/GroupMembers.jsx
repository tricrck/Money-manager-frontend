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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  ChevronsUpDown,
  Users,
  UserCheck,
  UserX,
  Edit3
} from 'lucide-react';

import {
  getGroupDetails,
  addGroupMembers,
  updateGroupMember,
  removeGroupMember,
  leaveGroup
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
  
  // Form states
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberRole, setMemberRole] = useState('member');
  const [memberStatus, setMemberStatus] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [open, setOpen] = useState(false);

  // Redux selectors
  const userList = useSelector((state) => state.userList);
  const { users = [], loading: usersLoading } = userList || {};

  const groupAddMembers = useSelector((state) => state.groupAddMembers);
  const { loading: loadingAdd, error: errorAdd, success: successAdd } = groupAddMembers || {};

  const groupUpdateMember = useSelector((state) => state.groupUpdateMember);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = groupUpdateMember || {};

  const groupRemoveMember = useSelector((state) => state.groupRemoveMember);
  const { loading: loadingRemove, error: errorRemove, success: successRemove } = groupRemoveMember || {};

  useEffect(() => {
    if (showAddModal) {
      dispatch(listUsers());
    }
  }, [dispatch, showAddModal]);

  // Handle open actions
  useEffect(() => {
    if(!showAddModal && !showEditModal && !showRemoveDialog && !showLeaveDialog) {
      setSelectedUsers([]);
      setSelectedMember(null);
      setMemberRole('member');
      setMemberStatus('active');
      setSearchTerm('');
      setEmailSearch('');
      setOpen(false);
    }
  }, [showAddModal, showEditModal, showRemoveDialog, showLeaveDialog]);

  // Handle successful actions
  useEffect(() => {
    if (successAdd) {
      setShowAddModal(false);
      setSelectedUsers([]);
      setEmailSearch('');
      setSearchTerm('');
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

  // Handle adding members
  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;
    
    const membersData = selectedUsers.map(userId => ({
      userId,
      role: memberRole
    }));
    
    dispatch(addGroupMembers(group._id, membersData));
    if (onClose) onClose();
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
    if (onClose) onClose();
  };

  // Handle removing member
  const handleRemoveMember = () => {
    if (!selectedMember) return;
    
    const userId = selectedMember.user?._id || selectedMember.user;
    if (!userId) return;
    
    dispatch(removeGroupMember(group._id, userId));
    if (onClose) onClose();
  };

  // Handle leave group
  const handleLeaveGroup = () => {
    dispatch(leaveGroup(group._id));
    setShowLeaveDialog(false);
    if (onClose) onClose();
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      owner: { color: 'bg-purple-100 text-purple-800', icon: Crown },
      admin: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      treasurer: { color: 'bg-green-100 text-green-800', icon: Settings },
      member: { color: 'bg-gray-100 text-gray-800', icon: Users }
    };
    
    const config = roleConfig[role] || roleConfig.member;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: UserX },
      suspended: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
      }).format(amount || 0);
    } catch (error) {
      return 'KES 0';
    }
  };

  // Get user display name safely
  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    return user.name || user.email || 'Unknown User';
  };

  // Get user initials safely
  const getUserInitials = (user) => {
    if (!user || !user.name) return 'UN';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useImperativeHandle(ref, () => ({
    openAddModal: () => setShowAddModal(true),
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
      {/* Add Members Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Members to {group.name}
            </DialogTitle>
            <DialogDescription>
              Search and select users to add to this group.
            </DialogDescription>
          </DialogHeader>

          {errorAdd && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorAdd}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Email Search */}
            <div className="space-y-2">
              <Label htmlFor="email-search">Search by Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-search"
                  placeholder="Enter email address..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <Label>Available Users</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} user(s) selected`
                      : "Select users..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {getFilteredUsers().map((user) => (
                          <CommandItem
                            key={user._id}
                            onSelect={() => {
                              setSelectedUsers(prev =>
                                prev.includes(user._id)
                                  ? prev.filter(id => id !== user._id)
                                  : [...prev, user._id]
                              );
                            }}
                          >
                            <div className="flex items-center space-x-2 flex-1">
                              <Checkbox
                                checked={selectedUsers.includes(user._id)}
                                readOnly
                              />
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getUserInitials(user)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{getUserDisplayName(user)}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="member-role">Role</Label>
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

            {/* Selected Users Preview */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Users ({selectedUsers.length})</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u._id === userId);
                    if (!user) return null;
                    
                    return (
                      <div key={userId} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{getUserDisplayName(user)}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedUsers(prev => prev.filter(id => id !== userId))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMembers} 
              disabled={loadingAdd || selectedUsers.length === 0}
            >
              {loadingAdd ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit Member
            </DialogTitle>
            <DialogDescription>
              Update member role and status.
            </DialogDescription>
          </DialogHeader>

          {errorUpdate && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorUpdate}</AlertDescription>
            </Alert>
          )}

          {selectedMember && (
            <div className="space-y-4">
              {/* Member Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <Avatar>
                  <AvatarFallback>
                    {getUserInitials(selectedMember.user)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{getUserDisplayName(selectedMember.user)}</div>
                  <div className="text-sm text-muted-foreground">{selectedMember.user?.email}</div>
                </div>
              </div>

              {/* Role Selection */}
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

              {/* Status Selection */}
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
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} disabled={loadingUpdate}>
              {loadingUpdate ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Update Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-destructive" />
              Remove Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {getUserDisplayName(selectedMember?.user)} from this group?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loadingRemove}
            >
              {loadingRemove ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-destructive" />
              Leave Group
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave {group.name}? You will lose access to all group 
              activities and will need to be re-invited to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
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