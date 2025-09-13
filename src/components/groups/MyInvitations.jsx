import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyInvitations, respondToInvitation } from "../../actions/groupActions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MyInvitations = () => {
  const dispatch = useDispatch();

  const {
    invitations = [],
    loading: loadingInvites,
    error: errorInvites,
  } = useSelector((state) => state.myGroupInvitations || {});

  useEffect(() => {
    dispatch(listMyInvitations());
  }, [dispatch]);

  const handleResponse = (groupId, invitationId, response) => {
    dispatch(respondToInvitation(groupId, invitationId, { response }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Invitations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingInvites && <p>Loading invitations...</p>}
        {errorInvites && (
          <Alert>
            <AlertDescription>{errorInvites}</AlertDescription>
          </Alert>
        )}

        {invitations.length === 0 && !loadingInvites ? (
          <p className="text-muted-foreground">You have no pending invitations.</p>
        ) : (
          invitations.map((inv) => (
            <div
              key={inv._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              <div>
                <div className="font-semibold">{inv.group.name}</div>
                <div className="text-sm text-muted-foreground">
                  {inv.group.description || "No description"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Invited by {inv.invitedBy?.name || "Unknown"} • {inv.group.privacy} group
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => handleResponse(inv.group._id, inv._id, "accept")}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResponse(inv.group._id, inv._id, "decline")}
                >
                  Decline
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MyInvitations;