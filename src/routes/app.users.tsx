import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUsers } from "@/hooks/use-app-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/users")({
  component: UsersPage,
});

const statusMap = {
  active: "bg-success/10 text-success",
  "on-patrol": "bg-info/10 text-info",
  away: "bg-warning/15 text-warning",
  "off-duty": "bg-muted text-muted-foreground",
} as const;

function UsersPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage officer accounts, roles, and permissions."
        actions={<Button size="sm"><UserPlus className="mr-2 h-4 w-4" /> Invite user</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or email…" />
          </div>
          <Badge variant="outline">All roles</Badge>
          <Badge variant="outline">All districts</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </AvatarFallback></Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.district}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", statusMap[u.status as keyof typeof statusMap])}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
