import { EyeIcon, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../api/axios";
import { DeleteModal } from "../../../components/modals/DeleteModal";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useAuth } from "../../../context/AuthContext";


export const UserTable = () => {
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
    
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [userToDelete, setUserToDelete] =
    useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteConfirm = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(`admin/user/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User permanently deleted");
      
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error(
        "Failed to load users. Are you an admin?",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  
  const handleDetailUpdate = async (
    userId: string,
    newRole?: string,
    isActive?: boolean,
  ) => {
    
    const previousUsers = [...users];

    
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId
          ? {
              ...u,
              role: newRole ?? u.role,
              isActive:
                isActive !== undefined
                  ? isActive
                  : u.isActive,
            }
          : u,
      ),
    );

    try {
      
      await api.patch(
        `/admin/update/${userId}`,
        { role: newRole, isActive },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      
      if (newRole)
        toast.success(`User updated to ${newRole}`);
      else
        toast.success(
          `User is now ${isActive ? "active" : "inactive"}`,
        );
    } catch (err) {
      setUsers(previousUsers);
      toast.error("Failed to update user on the server");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        Verifying Admin Privileges...
      </div>
    );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle> 
            
            User Directory</CardTitle>
          <CardDescription>
            Total registered users: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <EyeIcon
                          onClick={() =>
                            navigate(
                              `/admin/user/${user.id}`,
                            )
                          }
                          className="w-4 h-4 text-muted-foreground hover:cursor-pointer"
                        />
                      </div>
                      <span className="font-medium">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        user.role === "ADMIN"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Select
                        defaultValue={user.role}
                        disabled={
                          user.role === "ADMIN" ||
                          user.id === currentUser?.id
                        }
                        onValueChange={(newRole) =>
                          handleDetailUpdate(
                            user.id,
                            newRole,
                          )
                        }>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">
                            Admin
                          </SelectItem>
                          <SelectItem value="ANALYST">
                            Analyst
                          </SelectItem>
                          <SelectItem value="VIEWER">
                            Viewer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch
                        size="sm"
                        className="self-center"
                        checked={user.isActive}
                        disabled={
                          user.role === "ADMIN" ||
                          user.id === currentUser?.id
                        }
                        onCheckedChange={(checked) =>
                          handleDetailUpdate(
                            user.id,
                            undefined,
                            checked,
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 self-center"
                        disabled={
                          user.role === "ADMIN" ||
                          user.id === currentUser?.id
                        }
                        onClick={() =>
                          openDeleteConfirm(user)
                        }>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        variant="destructive"
        title="Delete User Account"
        description={`Are you sure you want to delete ${userToDelete?.email}? This will remove all their access to Zorvyn. This action cannot be undone.`}
      />
    </>
  );
};
