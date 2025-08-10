import React from 'react';
import { 
  ClipboardList,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Bell,
  CheckCircle,
  XCircle,
  Download,
  Filter
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SecretaryPage = ({ group }) => {
  // Mock data for meetings and minutes
  const meetings = [
    {
      id: 1,
      date: '2023-06-15',
      title: 'Monthly General Meeting',
      attendees: 12,
      minutesTaken: true
    },
    {
      id: 2,
      date: '2023-05-18',
      title: 'Loan Committee Meeting',
      attendees: 5,
      minutesTaken: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <Button size="sm">
            Schedule Meeting
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {group?.settings?.meetingSchedule && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Next Regular Meeting</h3>
                    <p className="text-sm text-muted-foreground">
                      {group?.settings?.meetingSchedule?.frequency} on day {group?.settings?.meetingSchedule?.dayOfMonth} at {group?.settings?.meetingSchedule?.time}
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Contribution Deadline</h3>
                  <p className="text-sm text-muted-foreground">
                    {group?.settings?.contributionSchedule?.frequency} on day {group?.settings?.contributionSchedule?.dueDay}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Remind Members
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Minutes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Meeting Minutes
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings?.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{meeting.date}</TableCell>
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell>{meeting.attendees} members</TableCell>
                  <TableCell>
                    {meeting.minutesTaken ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {meeting.minutesTaken ? (
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    ) : (
                      <Button size="sm">
                        Record
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Member Communications
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Bell className="h-6 w-6 mb-2" />
            Send Announcement
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Users className="h-6 w-6 mb-2" />
            Meeting Reminders
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <FileText className="h-6 w-6 mb-2" />
            Contribution Statements
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryPage;