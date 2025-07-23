"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Search, Filter, Database, GitBranch, BarChart3, Clock, Activity } from "lucide-react"
import { format } from "date-fns"

// Mock projects data
const mockProjects = [
  {
    id: "proj-001",
    name: "E-Commerce Platform",
    description: "Main e-commerce application database",
    schemas: ["CUSTOMERS", "ORDERS", "PRODUCTS", "INVENTORY"],
    lastUpdated: "2024-01-20 15:30:00",
    status: "active",
  },
  {
    id: "proj-002",
    name: "Analytics Warehouse",
    description: "Data warehouse for business analytics",
    schemas: ["SALES", "MARKETING", "FINANCE", "REPORTING"],
    lastUpdated: "2024-01-19 12:45:00",
    status: "active",
  },
  {
    id: "proj-003",
    name: "HR Management System",
    description: "Human resources management database",
    schemas: ["EMPLOYEES", "PAYROLL", "BENEFITS", "PERFORMANCE"],
    lastUpdated: "2024-01-18 09:15:00",
    status: "maintenance",
  },
]

// Mock data for recent changes based on selected project
const mockChangesByProject = {
  "proj-001": [
    {
      id: 1,
      changeRefNumber: "CHG-2024-001",
      timestamp: "2024-01-20 14:30:00",
      user: "john.doe",
      changeType: "CREATE",
      table: "customer_data",
      column: "customer_id",
      description: "Created new table with primary key",
    },
    {
      id: 2,
      changeRefNumber: "CHG-2024-002",
      timestamp: "2024-01-20 13:45:00",
      user: "jane.smith",
      changeType: "UPDATE",
      table: "order_items",
      column: "product_id",
      description: "Updated column data type from NUMBER(10) to NUMBER(12)",
    },
    {
      id: 3,
      changeRefNumber: "CHG-2024-003",
      timestamp: "2024-01-20 12:15:00",
      user: "mike.wilson",
      changeType: "ALTER",
      table: "products",
      column: "price",
      description: "Changed column precision for price calculations",
    },
  ],
  "proj-002": [
    {
      id: 4,
      changeRefNumber: "CHG-2024-004",
      timestamp: "2024-01-19 16:20:00",
      user: "sarah.johnson",
      changeType: "CREATE",
      table: "sales_summary",
      column: "total_revenue",
      description: "Added new aggregation table for sales reporting",
    },
    {
      id: 5,
      changeRefNumber: "CHG-2024-005",
      timestamp: "2024-01-19 14:10:00",
      user: "david.brown",
      changeType: "UPDATE",
      table: "marketing_campaigns",
      column: "budget",
      description: "Updated budget column to support larger values",
    },
  ],
  "proj-003": [
    {
      id: 6,
      changeRefNumber: "CHG-2024-006",
      timestamp: "2024-01-18 11:30:00",
      user: "lisa.garcia",
      changeType: "ALTER",
      table: "employees",
      column: "salary",
      description: "Modified salary column constraints",
    },
  ],
}

// Mock statistics by project
const mockStatsByProject = {
  "proj-001": {
    totalTables: 45,
    totalColumns: 312,
    lineageMappings: 89,
    recentChanges: 12,
  },
  "proj-002": {
    totalTables: 28,
    totalColumns: 198,
    lineageMappings: 56,
    recentChanges: 8,
  },
  "proj-003": {
    totalTables: 18,
    totalColumns: 124,
    lineageMappings: 34,
    recentChanges: 3,
  },
}

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTable, setFilterTable] = useState("")
  const [filterColumn, setFilterColumn] = useState("")
  const [filterChangeType, setFilterChangeType] = useState("")
  const [filterChangeRef, setFilterChangeRef] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Get current project data
  const currentProject = mockProjects.find((p) => p.id === selectedProject)
  const currentChanges = selectedProject
    ? mockChangesByProject[selectedProject as keyof typeof mockChangesByProject] || []
    : []
  const currentStats = selectedProject ? mockStatsByProject[selectedProject as keyof typeof mockStatsByProject] : null

  // Set default project on load
  useEffect(() => {
    if (mockProjects.length > 0 && !selectedProject) {
      setSelectedProject(mockProjects[0].id)
    }
  }, [selectedProject])

  const filteredChanges = currentChanges.filter((change) => {
    const matchesSearch =
      change.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.column.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.user.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTable = !filterTable || change.table.toLowerCase().includes(filterTable.toLowerCase())
    const matchesColumn = !filterColumn || change.column.toLowerCase().includes(filterColumn.toLowerCase())
    const matchesChangeType = !filterChangeType || change.changeType === filterChangeType
    const matchesChangeRef =
      !filterChangeRef || change.changeRefNumber.toLowerCase().includes(filterChangeRef.toLowerCase())

    return matchesSearch && matchesTable && matchesColumn && matchesChangeType && matchesChangeRef
  })

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case "CREATE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "UPDATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "ALTER":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)
    // Reset filters when project changes
    setSearchTerm("")
    setFilterTable("")
    setFilterColumn("")
    setFilterChangeType("")
    setFilterChangeRef("")
  }

  return (
    <div className="space-y-6">
      {/* Header with Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Monitor your metadata and track changes across projects</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="min-w-[250px]">
            <Select value={selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.schemas.length} schemas</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Project Info Card */}
      {currentProject && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentProject.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{currentProject.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Last updated: {currentProject.lastUpdated}</span>
                    <Badge className={getProjectStatusColor(currentProject.status)}>{currentProject.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Schemas</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentProject.schemas.map((schema) => (
                    <Badge key={schema} variant="outline" className="text-xs">
                      {schema}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="changes">Recent Changes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Statistics Cards */}
          {currentStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Database className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tables</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.totalTables}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Columns</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.totalColumns}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <GitBranch className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Lineage Mappings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.lineageMappings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Recent Changes</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.recentChanges}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for the selected project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  variant="outline"
                >
                  <Database className="h-6 w-6" />
                  <span>Manage Objects</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  variant="outline"
                >
                  <GitBranch className="h-6 w-6" />
                  <span>Data Lineage</span>
                </Button>
                <Button
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  variant="outline"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Generate Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Summary</CardTitle>
              <CardDescription>Latest changes in the selected project</CardDescription>
            </CardHeader>
            <CardContent>
              {currentChanges.length > 0 ? (
                <div className="space-y-4">
                  {currentChanges.slice(0, 5).map((change) => (
                    <div key={change.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getChangeTypeColor(change.changeType)}>{change.changeType}</Badge>
                        <div>
                          <div className="font-medium">
                            {change.table}.{change.column}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{change.description}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div>{change.user}</div>
                        <div>{change.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("changes")}>
                    View All Changes
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No recent changes in this project</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Changes Tab */}
        <TabsContent value="changes">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Table</label>
                  <Input
                    placeholder="Filter by table name"
                    value={filterTable}
                    onChange={(e) => setFilterTable(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Column</label>
                  <Input
                    placeholder="Filter by column name"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Change Type</label>
                  <select
                    value={filterChangeType}
                    onChange={(e) => setFilterChangeType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="CREATE">Create</option>
                    <option value="UPDATE">Update</option>
                    <option value="ALTER">Alter</option>
                    <option value="DELETE">Delete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Change Reference Number</label>
                  <Input
                    placeholder="Filter by change ref number"
                    value={filterChangeRef}
                    onChange={(e) => setFilterChangeRef(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Change</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search changes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Change History</CardTitle>
              <CardDescription>
                {currentProject ? `Changes for ${currentProject.name}` : "Select a project to view changes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Change Ref #</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Change Type</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Column</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChanges.map((change) => (
                      <TableRow key={change.id}>
                        <TableCell className="font-medium">{change.changeRefNumber}</TableCell>
                        <TableCell>{change.timestamp}</TableCell>
                        <TableCell>{change.user}</TableCell>
                        <TableCell>
                          <Badge className={getChangeTypeColor(change.changeType)}>{change.changeType}</Badge>
                        </TableCell>
                        <TableCell>{change.table}</TableCell>
                        <TableCell>{change.column}</TableCell>
                        <TableCell className="max-w-xs truncate">{change.description}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {filteredChanges.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {currentProject
                      ? "No changes found for the selected criteria."
                      : "Please select a project to view changes."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
