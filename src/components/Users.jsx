import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/inpute";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, X, Edit, Trash, RefreshCw, ChevronDown, Github, Slack, Search } from "lucide-react";
import { toast } from "sonner";
import useApiStore from "../stores/apiStore";
import axios from "axios";

// ---------------- Drawer Component for Create/Edit User ----------------
function UserDrawer({ open, onClose, onSave, editData }) {
  const [name, setName] = useState(editData?.name || "");
  const [email, setEmail] = useState(editData?.email || "");
  const [linkedAccounts, setLinkedAccounts] = useState({
    linearId: editData?.linearId || "",
    githubUsername: editData?.githubUsername || "",
    slackUserId: editData?.slackUserId || "",
  });

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setEmail(editData.email || "");
      setLinkedAccounts({
        linearId: editData.linearId || "",
        githubUsername: editData.githubUsername || "",
        slackUserId: editData.slackUserId || "",
      });
    }
  }, [editData]);

  const handleSave = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      if (editData) {
        // Update existing user
        const response = await axios.put(`/users/${editData.id}`, {
          name,
          email,
          ...linkedAccounts,
        });
        toast.success("User updated successfully!");
        onSave(response.data);
      } else {
        // Create new user
        const response = await axios.post("/users/link", {
          name,
          email,
          ...linkedAccounts,
        });
        toast.success("User created successfully!");
        onSave(response.data);
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save user");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sliding Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">{editData ? "Edit User" : "New User"}</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          {/* Linked Accounts Section */}
          <div className="mb-4 border-t pt-4">
            <h3 className="text-sm font-medium mb-3">Linked Accounts (Optional)</h3>

            {/* Linear ID */}
            <div className="mb-3">
              <label className="text-sm text-muted-foreground block mb-1">Linear ID</label>
              <Input
                value={linkedAccounts.linearId}
                onChange={(e) => setLinkedAccounts({...linkedAccounts, linearId: e.target.value})}
                placeholder="Linear user ID"
              />
            </div>

            {/* GitHub Username */}
            <div className="mb-3">
              <label className="text-sm text-muted-foreground block mb-1">GitHub Username</label>
              <Input
                value={linkedAccounts.githubUsername}
                onChange={(e) => setLinkedAccounts({...linkedAccounts, githubUsername: e.target.value})}
                placeholder="github-username"
              />
            </div>

            {/* Slack User ID */}
            <div className="mb-3">
              <label className="text-sm text-muted-foreground block mb-1">Slack User ID</label>
              <Input
                value={linkedAccounts.slackUserId}
                onChange={(e) => setLinkedAccounts({...linkedAccounts, slackUserId: e.target.value})}
                placeholder="U123456789"
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleSave}>
            {editData ? "Update User" : "Create User"}
          </Button>
        </div>
      </div>
    </>
  );
}

// ---------------- Sync Dropdown Component ----------------
function SyncDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async (platform) => {
    setSyncing(true);
    setIsOpen(false);

    try {
      const endpoint = platform === 'all'
        ? '/users/sync/all'
        : `/users/sync/${platform}`;

      const response = await axios.post(endpoint);

      toast.success(`Successfully synced users from ${platform}`, {
        description: `${response.data.synced || 0} users synced`,
      });

      // Reload the page to show updated users
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to sync from ${platform}`, {
        description: error.response?.data?.error || "An error occurred",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={syncing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
        Sync Users
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
            <div className="py-1">
              <button
                onClick={() => handleSync('linear')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.5 2.5L21.5 21.5M2.5 21.5L21.5 2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Sync from Linear
              </button>

              <button
                onClick={() => handleSync('github')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                Sync from GitHub
              </button>

              <button
                onClick={() => handleSync('slack')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Slack className="w-4 h-4" />
                Sync from Slack
              </button>

              <div className="border-t my-1" />

              <button
                onClick={() => handleSync('all')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Sync All Platforms
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- Main Users Component ----------------
export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await axios.get(`/users?page=${page}&limit=10${searchParam}`);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSaveUser = (user) => {
    fetchUsers(pagination.page, searchQuery);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers(pagination.page, searchQuery);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, searchQuery);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts and platform integrations
          </p>
        </div>
        <div className="flex gap-2">
          <SyncDropdown />
          <Button
            onClick={() => {
              setEditUser(null);
              setDrawerOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> New User
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-sm text-muted-foreground">User</th>
                    <th className="p-4 font-medium text-sm text-muted-foreground">Email</th>
                    <th className="p-4 font-medium text-sm text-muted-foreground">Platforms</th>
                    <th className="p-4 font-medium text-sm text-muted-foreground">Created</th>
                    <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {user.metadata?.avatar ? (
                              <img
                                src={user.metadata.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-semibold text-sm">
                                {user.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {user.linearId && (
                            <Badge variant="outline" className="bg-purple-50 text-xs">
                              Linear
                            </Badge>
                          )}
                          {user.githubUsername && (
                            <Badge variant="outline" className="bg-gray-50 text-xs">
                              <Github className="w-3 h-3 mr-1" />
                              GitHub
                            </Badge>
                          )}
                          {user.slackUserId && (
                            <Badge variant="outline" className="bg-green-50 text-xs">
                              <Slack className="w-3 h-3 mr-1" />
                              Slack
                            </Badge>
                          )}
                          {!user.linearId && !user.githubUsername && !user.slackUserId && (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditUser(user);
                              setDrawerOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} of {pagination.total} users
              {searchQuery && ` (filtered by "${searchQuery}")`}
            </p>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveUser}
        editData={editUser}
      />
    </div>
  );
}
