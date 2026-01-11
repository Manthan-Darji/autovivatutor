import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  GraduationCap,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentData {
  user_id: string;
  display_name: string | null;
  total_sessions: number;
  total_messages: number;
  last_active: string | null;
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentSessions, setStudentSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      // Get all profiles (teachers can see all due to RLS)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name");

      // Get all user roles to filter students
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      // Get all chat sessions
      const { data: sessions } = await supabase
        .from("chat_sessions")
        .select("user_id, id, message_count, last_message_at");

      // Filter for students only
      const studentUserIds = roles
        ?.filter((r) => r.role === "student")
        .map((r) => r.user_id) || [];

      // Aggregate data per student
      const studentDataMap = new Map<string, StudentData>();

      studentUserIds.forEach((userId) => {
        const profile = profiles?.find((p) => p.user_id === userId);
        const userSessions = sessions?.filter((s) => s.user_id === userId) || [];
        
        const totalMessages = userSessions.reduce((sum, s) => sum + (s.message_count || 0), 0);
        const lastActive = userSessions
          .filter((s) => s.last_message_at)
          .sort((a, b) => new Date(b.last_message_at!).getTime() - new Date(a.last_message_at!).getTime())[0]?.last_message_at;

        studentDataMap.set(userId, {
          user_id: userId,
          display_name: profile?.display_name || "Anonymous Student",
          total_sessions: userSessions.length,
          total_messages: totalMessages,
          last_active: lastActive || null,
        });
      });

      setStudents(Array.from(studentDataMap.values()));
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentSessions = async (userId: string) => {
    setSelectedStudent(userId);
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("last_message_at", { ascending: false });
    
    setStudentSessions(data || []);
  };

  const totalStudents = students.length;
  const totalSessions = students.reduce((sum, s) => sum + s.total_sessions, 0);
  const totalMessages = students.reduce((sum, s) => sum + s.total_messages, 0);
  const activeToday = students.filter(
    (s) => s.last_active && new Date(s.last_active).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/teacher" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
              TEACHER DASHBOARD
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Student Performance
            </h1>
            <p className="mt-1 text-muted-foreground">
              Monitor and analyze your students' learning progress
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMessages}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeToday}</div>
              </CardContent>
            </Card>
          </div>

          {/* Student Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Students Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No students enrolled yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.user_id}>
                        <TableCell className="font-medium">
                          {student.display_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.total_sessions}</Badge>
                        </TableCell>
                        <TableCell>{student.total_messages}</TableCell>
                        <TableCell>
                          {student.last_active ? (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDistanceToNow(new Date(student.last_active), { addSuffix: true })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchStudentSessions(student.user_id)}
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Selected Student Sessions */}
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    Chat Sessions - {students.find((s) => s.user_id === selectedStudent)?.display_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {studentSessions.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      No chat sessions found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {studentSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{session.emoji}</span>
                            <div>
                              <p className="font-medium">{session.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.message_count} messages
                              </p>
                            </div>
                          </div>
                          {session.last_message_at && (
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(session.last_message_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
