import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listMyInvitations,
  getMyJoinRequests,
  respondToInvitation,
} from '../../actions/groupActions';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, UserPlus, ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import DiscoverPublicGroups from './DiscoverPublicGroups';
import MyInvitations from "./MyInvitations";

const JoinGroups = () => {
  const dispatch = useDispatch();

  const { invitations = [], loading: loadingInvites, error: errorInvites } = useSelector(
    (state) => state.myGroupInvitations || {}
  );

  const { MyjoinRequests = [], loading: loadingRequests, error: errorRequests } = useSelector(
    (state) => state.groupGetMyJoinRequests || {}
  );

  useEffect(() => {
    dispatch(listMyInvitations());
    dispatch(getMyJoinRequests());
  }, [dispatch]);

  const handleResponse = (groupId, invitationId, response) => {
    console.log(`Responding to invitation ${invitationId} for group ${groupId} with response: ${response}`);
    dispatch(respondToInvitation(groupId, invitationId, { response }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 items-start justify-between sm:flex-row sm:items-center">
        <h1 className="text-3xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Join Groups
        </h1>
        <p className="text-muted-foreground">Manage your invitations and join requests</p>
      </div>

      <Tabs defaultValue="discover">
        <TabsList className="mb-4">
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="requests">Join Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="invitations">
          <MyInvitations />
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Join Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingRequests && <p>Loading join requests...</p>}
              {errorRequests && (
                <Alert>
                  <AlertDescription>{errorRequests}</AlertDescription>
                </Alert>
              )}
              {MyjoinRequests.data && MyjoinRequests.data.length === 0 && !loadingRequests ? ( // Check if MyjoinRequests.data exists and is empty
                <p className="text-muted-foreground">You haven’t sent any join requests yet.</p>
                ) : (
                MyjoinRequests.data && MyjoinRequests.data.map((req) => ( // Access MyjoinRequests.data for mapping
                    <div
                    key={req.joinRequest._id} // Use req.joinRequest._id for the key
                    className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                    >
                    <div>
                        <div className="font-semibold">{req.groupName}</div> {/* Use req.groupName */}
                        <div className="text-sm text-muted-foreground">
                        Status: {req.joinRequest.status} {/* Access status from req.joinRequest */}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                        Message: {req.joinRequest.message || 'N/A'} {/* Access message from req.joinRequest */}
                        </div>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {new Date(req.joinRequest.requestedAt).toLocaleDateString()} {/* Access requestedAt from req.joinRequest */}
                    </div>
                    </div>
                ))
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="discover">
            <DiscoverPublicGroups />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JoinGroups;