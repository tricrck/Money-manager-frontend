import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSessions, revokeSession as revokeSessionAction } from '../../actions/userActions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Loader2, LogOut, Monitor, Smartphone } from 'lucide-react';

export default function SessionManager() {
  const dispatch = useDispatch();
  const { loading, sessions, error } = useSelector((state) => state.userSessions || { loading: false, sessions: [] });
  const { loading: revokeLoading, success: revokeSuccess, error: revokeError } = useSelector((state) => state.revokeSession || {});

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getUserSessions());
  }, [dispatch]);

  useEffect(() => {
    if (revokeSuccess) {
      toast({ title: 'Session revoked', description: 'The session was revoked successfully.' });
      setOpenConfirm(false);
      setSelectedSession(null);
      setSelectedUser(null);
      // Refresh sessions list
      dispatch(getUserSessions());
    }

    if (revokeError) {
      toast({ title: 'Failed to revoke', description: revokeError });
    }
  }, [revokeSuccess, revokeError, dispatch]);

  const onRevokeClick = (session, user) => {
    setSelectedSession(session);
    setSelectedUser(user);
    setOpenConfirm(true);
  };

  const confirmRevoke = () => {
    if (!selectedSession) return;
    dispatch(revokeSessionAction(selectedSession.deviceId)); // Using deviceId as session identifier
  };

  const getDeviceIcon = (deviceInfo) => {
    if (deviceInfo && deviceInfo.toLowerCase().includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceName = (deviceInfo) => {
    if (!deviceInfo) return 'Unknown Device';
    
    // Extract browser and OS info
    const isChrome = deviceInfo.includes('Chrome');
    const isWindows = deviceInfo.includes('Windows NT');
    const isAndroid = deviceInfo.includes('Android');
    const isMobile = deviceInfo.includes('Mobile');
    
    let deviceName = '';
    if (isWindows) deviceName += 'Windows ';
    if (isAndroid) deviceName += 'Android ';
    if (isChrome) deviceName += 'Chrome';
    if (isMobile) deviceName += ' Mobile';
    
    return deviceName.trim() || 'Unknown Device';
  };

  console.log('Sessions:', sessions);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions by User</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Loading sessions...</span>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-muted-foreground">No active sessions found.</div>
          ) : (
            <div className="space-y-6">
              {sessions.map((user) => (
                <div key={user.email} className="space-y-3">
                  <div className="border-b pb-2">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Role: <span className="capitalize">{user.role}</span> • 
                      Total Sessions: {user.totalSessions} • 
                      Active: {user.activeSessions}
                    </p>
                  </div>
                  
                  <div className="space-y-2 ml-4">
                    {user.sessions && user.sessions.length > 0 ? (
                      user.sessions.map((session, index) => (
                        <div key={`${session.deviceId}-${index}`} className="flex items-center justify-between gap-4 p-3 rounded-md border bg-muted/30">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getDeviceIcon(session.deviceInfo)}
                            </div>
                            <div className="flex flex-col">
                              <div className="font-medium">{getDeviceName(session.deviceInfo)}</div>
                              <div className="text-sm text-muted-foreground">IP: {session.ip || '—'}</div>
                              <div className="text-sm text-muted-foreground">
                                Location: {session.location || 'Unknown'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Started: {session.createdAt ? new Date(session.createdAt).toLocaleString() : '—'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Last active: {session.lastActive ? new Date(session.lastActive).toLocaleString() : '—'}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Device ID: {session.deviceId.substring(0, 16)}...
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${
                                session.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}
                            >
                              {session.isActive ? 'Active' : 'Inactive'}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRevokeClick(session, user)}
                              disabled={!session.isActive}
                              className="w-full sm:w-auto"
                            >
                              <LogOut className="mr-2 h-4 w-4" /> Revoke
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground ml-4">No sessions found</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Revoke Session</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p>Are you sure you want to revoke this session?</p>
            {selectedUser && (
              <div className="mt-3 p-3 rounded-md bg-muted">
                <div className="text-sm">
                  <div><strong>User:</strong> {selectedUser.name} ({selectedUser.email})</div>
                  <div className="mt-2"><strong>Device:</strong> {selectedSession ? getDeviceName(selectedSession.deviceInfo) : 'Unknown'}</div>
                  <div><strong>IP:</strong> {selectedSession?.ip || '—'}</div>
                  <div><strong>Location:</strong> {selectedSession?.location || 'Unknown'}</div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpenConfirm(false)}>Cancel</Button>
              <Button onClick={confirmRevoke} disabled={revokeLoading}>
                {revokeLoading ? 'Revoking...' : 'Revoke Session'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}