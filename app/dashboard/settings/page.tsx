"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Database, Users, Settings, TestTube } from "lucide-react"

// Mock data for database connections
const mockConnections = [
  {
    id: 1,
    name: "Production Oracle",
    type: "Oracle",
    host: "prod-oracle.company.com",
    port: 1521,
    database: "PROD",
    status: "connected",
    lastTested: "2024-01-20 10:30:00",
  },
  {
    id: 2,
    name: "Analytics PostgreSQL",
    type: "PostgreSQL",
    host: "analytics-pg.company.com",
    port: 5432,
    database: "analytics",
    status: "connected",
    lastTested: "2024-01-20 09:15:00",
  },
  {
    id: 3,
    name: "Staging MySQL",
    type: "MySQL",
    host: "staging-mysql.company.com",
    port: 3306,
    database: "staging",
    status: "disconnected",
    lastTested: "2024-01-19 16:45:00",
  },
]

// Mock data for users and roles
const mockUsers = [
  {
    id: 1,
    username: "john.doe",
    email: "john.doe@company.com",
    role: "Administrator",
    status: "active",
    lastLogin: "2024-01-20 11:30:00",
  },
  {
    id: 2,
    username: "jane.smith",
    email: "jane.smith@company.com",
    role: "Data Analyst",
    status: "active",
    lastLogin: "2024-01-20 09:45:00",
  },
  {
    id: 3,
    username: "mike.wilson",
    email: "mike.wilson@company.com",
    role: "Data Engineer",
    status: "active",
    lastLogin: "2024-01-19 17:20:00",
  },
  {
    id: 4,
    username: "sarah.johnson",
    email: "sarah.johnson@company.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: "2024-01-15 14:10:00",
  },
]

export default function AppManagementPage() {
  const [connections, setConnections] = useState(mockConnections)
  const [users, setUsers] = useState(mockUsers)
  const [activeTab, setActiveTab] = useState("connections")
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "Oracle",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  })
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "Viewer",
    password: "",
  })

  const handleCreateConnection = () => {
    const connection = {
      id: connections.length + 1,
      ...newConnection,
      port: Number.parseInt(newConnection.port),
      status: "disconnected",
      lastTested: "Never",
    }
    setConnections([...connections, connection])
    setNewConnection({
      name: "",
      type: "Oracle",
      host: "",
      port: "",
      database: "",
      username: "",
      password: "",
    })
    setShowConnectionDialog(false)
  }

  const handleCreateUser = () => {
    const user = {
      id: users.length + 1,
      ...newUser,
      status: "active",
      lastLogin: "Never",
    }
    setUsers([...users, user])
    setNewUser({
      username: "",
      email: "",
      role: "Viewer",
      password: "",
    })
    setShowUserDialog(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-800"
      case "Data Engineer":
        return "bg-blue-100 text-blue-800"
      case "Data Analyst":
        return "bg-orange-100 text-orange-800"
      case "Viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">App Management</h2>
        <p className="text-gray-600">Manage database connections, user roles, and system settings</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Database Connections</p>
                <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connected DBs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {connections.filter((c) => c.status === "connected").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === "connections" ? "default" : "ghost"}
          onClick={() => setActiveTab("connections")}
          className="flex-1"
        >
          Database Connections
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          onClick={() => setActiveTab("users")}
          className="flex-1"
        >
          User Management
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          onClick={() => setActiveTab("settings")}
          className="flex-1"
        >
          Display Settings
        </Button>
      </div>

      {/* Database Connections Tab */}
      {activeTab === "connections" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Database Connections</CardTitle>
                <CardDescription>Manage database connections and test connectivity</CardDescription>
              </div>
              <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Connection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Database Connection</DialogTitle>
                    <DialogDescription>Configure a new database connection for metadata management</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="connectionName">Connection Name</Label>
                        <Input
                          id="connectionName"
                          value={newConnection.name}
                          onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                          placeholder="Enter connection name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dbType">Database Type</Label>
                        <select
                          id="dbType"
                          value={newConnection.type}
                          onChange={(e) => setNewConnection({ ...newConnection, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="Oracle">Oracle</option>
                          <option value="PostgreSQL">PostgreSQL</option>
                          <option value="MySQL">MySQL</option>
                          <option value="SQL Server">SQL Server</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="host">Host</Label>
                        <Input
                          id="host"
                          value={newConnection.host}
                          onChange={(e) => setNewConnection({ ...newConnection, host: e.target.value })}
                          placeholder="database.company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="port">Port</Label>
                        <Input
                          id="port"
                          value={newConnection.port}
                          onChange={(e) => setNewConnection({ ...newConnection, port: e.target.value })}
                          placeholder="1521"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="database">Database/Service Name</Label>
                      <Input
                        id="database"
                        value={newConnection.database}
                        onChange={(e) => setNewConnection({ ...newConnection, database: e.target.value })}
                        placeholder="Enter database name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={newConnection.username}
                          onChange={(e) => setNewConnection({ ...newConnection, username: e.target.value })}
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newConnection.password}
                          onChange={(e) => setNewConnection({ ...newConnection, password: e.target.value })}
                          placeholder="Enter password"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="outline">
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button onClick={handleCreateConnection}>Add Connection</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Connection Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Database</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Tested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">{connection.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{connection.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {connection.host}:{connection.port}
                    </TableCell>
                    <TableCell>{connection.database}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(connection.status)}>{connection.status}</Badge>
                    </TableCell>
                    <TableCell>{connection.lastTested}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* User Management Tab */}
      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and role assignments</CardDescription>
              </div>
              <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with appropriate role permissions</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newUsername">Username</Label>
                      <Input
                        id="newUsername"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newEmail">Email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="user@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newRole">Role</Label>
                      <select
                        id="newRole"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Data Engineer">Data Engineer</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>Add User</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Display Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Configure application display preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-gray-600 mb-3">Choose your preferred color theme</p>
                <div className="flex space-x-4">
                  <Button variant="outline">Light</Button>
                  <Button variant="outline">Dark</Button>
                  <Button variant="outline">Auto</Button>
                </div>
              </div>
              <div>
                <Label className="text-base font-medium">Items per Page</Label>
                <p className="text-sm text-gray-600 mb-3">Number of items to display in tables</p>
                <select className="w-32 px-3 py-2 border border-gray-300 rounded-md">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div>
                <Label className="text-base font-medium">Date Format</Label>
                <p className="text-sm text-gray-600 mb-3">Choose your preferred date format</p>
                <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </div>
              <div>
                <Label className="text-base font-medium">Notifications</Label>
                <p className="text-sm text-gray-600 mb-3">Configure notification preferences</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emailNotifications" defaultChecked />
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="browserNotifications" />
                    <Label htmlFor="browserNotifications">Browser notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="changeAlerts" defaultChecked />
                    <Label htmlFor="changeAlerts">Schema change alerts</Label>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
