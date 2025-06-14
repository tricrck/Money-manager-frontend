import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listPublicGroups, requestToJoin } from '../../actions/groupActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search, SendHorizonal } from 'lucide-react';

const DiscoverPublicGroups = () => {
  const dispatch = useDispatch();
  const { groups: groupData = {}, loading, error } = useSelector((state) => state.groupPublicList || {});
  const groups = Array.isArray(groupData.groups) ? groupData.groups : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [requestSent, setRequestSent] = useState({});


  useEffect(() => {
    dispatch(listPublicGroups());
  }, [dispatch]);

  const handleRequestToJoin = (groupId) => {
    dispatch(requestToJoin(groupId, 'I’d love to join this group.'));
    setRequestSent((prev) => ({ ...prev, [groupId]: true }));
  };

  const filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search public groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {loading && <p>Loading public groups...</p>}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {filteredGroups.length === 0 && !loading && (
        <p className="text-muted-foreground">No groups match your search.</p>
      )}

      {filteredGroups.map((group) => (
        <Card key={group._id} className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {group.memberCount} members • {group.privacy}
            </div>
            <Button
              variant={requestSent[group._id] ? 'secondary' : 'default'}
              onClick={() => handleRequestToJoin(group._id)}
              disabled={requestSent[group._id]}
            >
              {requestSent[group._id] ? (
                <>
                  <SendHorizonal className="h-4 w-4 mr-1" /> Requested
                </>
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4 mr-1" /> Request to Join
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DiscoverPublicGroups;