'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers } from '@/services/userService';
import type { UserProfile } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function getRoleBadgeVariant(role: string): BadgeProps['variant'] {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'vendor':
      return 'default';
    default:
      return 'secondary';
  }
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const token = await user.getIdToken();
          const fetchedUsers = await getAllUsers(token);
          setUsers(fetchedUsers);
        } catch (error) {
          console.error("Failed to fetch users:", error);
          // In a real app, you might want to show a toast notification here
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsers();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">User Management</h1>
        <p className="text-muted-foreground">View all users on the platform.</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No users found.</p>
      ) : (
        <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map((u) => (
                    <Card key={u.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{u.name}</CardTitle>
                                <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm text-muted-foreground">
                            <p>{u.email}</p>
                            <p className="font-mono text-xs pt-2">ID: {u.uid}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Card>
                <CardContent className="p-0">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>User ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                            <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{u.uid}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </div>
        </>
      )}
    </div>
  );
}
